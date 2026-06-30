import {
  getRoomsFresh,
  getDishesFresh,
  getExperiencesFresh,
  getTestimonialsFresh,
} from "@/lib/content-data";
import { ContentManager } from "@/components/admin/content-manager";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [rooms, dishes, experiences, testimonials] = await Promise.all([
    getRoomsFresh(),
    getDishesFresh(),
    getExperiencesFresh(),
    getTestimonialsFresh(),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brand-900">Content</h1>
      <p className="mt-1 text-muted">
        Edit the rooms, dishes, experiences and guest reviews shown across your site.
        Changes appear on the live site within a minute.
      </p>
      <div className="mt-8">
        <ContentManager
          rooms={rooms}
          dishes={dishes}
          experiences={experiences}
          testimonials={testimonials}
        />
      </div>
    </div>
  );
}
