import "server-only";
import { rooms as fbRooms, dishes as fbDishes, experiences as fbExperiences, testimonials as fbTestimonials } from "./content";

/**
 * Content data layer — DB-backed, with a guaranteed fallback to the compiled
 * `src/lib/content.ts`. The public site renders rooms / dishes / experiences /
 * testimonials from here; if a table is empty or Supabase is unreachable, the
 * compiled defaults are used. **These functions never throw** → the live site
 * can never crash on a content read. Mirrors the settings.ts pattern (DRY).
 *
 * Each public read is a small, ordered table scan through Next's data cache
 * with `revalidate = 60`, so under traffic the DB is hit ~once/min/type, not
 * per request. Admin pages use the `*Fresh` variants (uncached) to show live
 * rows immediately after an edit.
 */

const TTL = 60;

// ---- public-facing shapes (match what the components already consume) ----
export type Room = {
  id?: string;
  slug: string;
  name: string;
  blurb: string;
  image: string;
  priceFrom: string;
  capacity: string;
  amenities: readonly string[];
};
export type Dish = { id?: string; name: string; src: string };
export type Experience = { id?: string; title: string; text: string; image: string };
export type Testimonial = {
  id?: string;
  name: string;
  location: string;
  text: string;
  rating: number;
};

// ---- raw DB rows ----
type RoomRow = {
  id: string; slug: string; name: string; blurb: string | null; image: string | null;
  price_from: string | null; capacity: string | null; amenities: string[] | null;
};
type DishRow = { id: string; name: string; src: string | null };
type ExperienceRow = { id: string; title: string; body: string | null; image: string | null };
type TestimonialRow = { id: string; name: string; location: string | null; body: string; rating: number | null };

/**
 * Low-level ordered read of a content table via the Supabase REST endpoint
 * (anon key; RLS permits public SELECT). Returns null on ANY failure so the
 * caller falls back to the compiled content.
 */
async function fetchTable<T>(table: string, opts: { cache: boolean }): Promise<T[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  try {
    const res = await fetch(
      `${url}/rest/v1/${table}?select=*&order=sort_order.asc,created_at.asc`,
      {
        headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        ...(opts.cache ? { next: { revalidate: TTL } } : { cache: "no-store" }),
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as T[];
  } catch {
    return null;
  }
}

// ---- mappers: DB row -> public shape, dropping rows with no usable image ----
const mapRoom = (r: RoomRow): Room => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  blurb: r.blurb ?? "",
  image: r.image ?? "/images/hotel/exterior-blue-dusk.webp",
  priceFrom: r.price_from ?? "",
  capacity: r.capacity ?? "",
  amenities: r.amenities ?? [],
});
const mapDish = (r: DishRow): Dish => ({ id: r.id, name: r.name, src: r.src ?? "" });
const mapExperience = (r: ExperienceRow): Experience => ({
  id: r.id, title: r.title, text: r.body ?? "", image: r.image ?? "/images/hotel/exterior-blue-dusk.webp",
});
const mapTestimonial = (r: TestimonialRow): Testimonial => ({
  id: r.id, name: r.name, location: r.location ?? "", text: r.body, rating: r.rating ?? 5,
});

/**
 * Generic resolver: read the table, map rows; if the read failed OR returned no
 * rows, use the compiled fallback. One place for the "DB else fallback" rule.
 */
async function resolve<Row, Out>(
  table: string,
  map: (r: Row) => Out,
  fallback: readonly Out[],
  cache: boolean,
): Promise<Out[]> {
  const rows = await fetchTable<Row>(table, { cache });
  if (!rows || rows.length === 0) return [...fallback];
  return rows.map(map);
}

// Normalise the compiled content.ts shapes to the public types for fallback.
const fbRoomsOut: Room[] = fbRooms.map((r) => ({ ...r, amenities: r.amenities }));
const fbDishesOut: Dish[] = fbDishes.map((d) => ({ name: d.name, src: d.src }));
const fbExperiencesOut: Experience[] = fbExperiences.map((e) => ({ title: e.title, text: e.text, image: e.image }));
const fbTestimonialsOut: Testimonial[] = fbTestimonials.map((t) => ({
  name: t.name, location: t.location, text: t.text, rating: t.rating,
}));

// ---- public (cached) getters ----
export const getRooms = () => resolve<RoomRow, Room>("rooms", mapRoom, fbRoomsOut, true);
export const getDishes = () => resolve<DishRow, Dish>("dishes", mapDish, fbDishesOut, true);
export const getExperiences = () => resolve<ExperienceRow, Experience>("experiences", mapExperience, fbExperiencesOut, true);
export const getTestimonials = () => resolve<TestimonialRow, Testimonial>("testimonials", mapTestimonial, fbTestimonialsOut, true);

// ---- admin (fresh, uncached) getters ----
export const getRoomsFresh = () => resolve<RoomRow, Room>("rooms", mapRoom, fbRoomsOut, false);
export const getDishesFresh = () => resolve<DishRow, Dish>("dishes", mapDish, fbDishesOut, false);
export const getExperiencesFresh = () => resolve<ExperienceRow, Experience>("experiences", mapExperience, fbExperiencesOut, false);
export const getTestimonialsFresh = () => resolve<TestimonialRow, Testimonial>("testimonials", mapTestimonial, fbTestimonialsOut, false);
