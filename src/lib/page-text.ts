/**
 * Editable page copy registry. Every owner-editable marketing string lives here
 * with its compiled default. The public site reads values through
 * `getPageText()` (DB over these defaults); the admin "Page text" screen lists
 * exactly these keys grouped by page. Adding a new editable string = add one
 * entry here (single source of keys + defaults — DRY).
 *
 * Keys are dotted: "<page>.<slot>". `group`/`field` drive the admin UI; `multiline`
 * renders a textarea.
 */

export type PageTextEntry = {
  key: string;
  group: string; // page/section heading in the admin UI
  field: string; // human label for the input
  default: string;
  multiline?: boolean;
};

export const PAGE_TEXT: readonly PageTextEntry[] = [
  // ---- Rooms ----
  { key: "rooms.hero.kicker", group: "Rooms page", field: "Hero kicker", default: "Rest easy" },
  { key: "rooms.hero.title", group: "Rooms page", field: "Hero title", default: "Rooms with a view" },
  {
    key: "rooms.hero.intro",
    group: "Rooms page",
    field: "Hero intro",
    multiline: true,
    default:
      "Open the curtains to cool mountain air and a valley that stretches for miles. Simple comfort, spotless rooms and a warm welcome.",
  },

  // ---- Dining ----
  { key: "dining.hero.kicker", group: "Dining page", field: "Hero kicker", default: "Eat, drink, unwind" },
  { key: "dining.hero.title", group: "Dining page", field: "Hero title", default: "Food worth the drive up" },
  {
    key: "dining.hero.intro",
    group: "Dining page",
    field: "Hero intro",
    multiline: true,
    default:
      "The kitchen runs all day. Warm up with thukpa, dig into sekuwa fresh off the grill, then settle into the lounge as the lights come on.",
  },
  { key: "dining.bar.kicker", group: "Dining page", field: "Bar section kicker", default: "The bar and lounge" },
  { key: "dining.bar.title", group: "Dining page", field: "Bar section title", default: "A drink with a view" },
  {
    key: "dining.bar.intro",
    group: "Dining page",
    field: "Bar section intro",
    multiline: true,
    default:
      "When the temperature drops, the lounge is the place to be. Cold beers, a relaxed vibe and the city lights twinkling far below. The perfect end to a day in the hills.",
  },
  { key: "dining.menu.kicker", group: "Dining page", field: "Menu section kicker", default: "From our kitchen" },
  { key: "dining.menu.title", group: "Dining page", field: "Menu section title", default: "Taste of the hills" },
  {
    key: "dining.menu.intro",
    group: "Dining page",
    field: "Menu section intro",
    multiline: true,
    default:
      "A few favourites from the menu. Tell us what you are craving and we will sort you out.",
  },

  // ---- Experiences ----
  { key: "experiences.hero.kicker", group: "Experiences page", field: "Hero kicker", default: "Things to do" },
  { key: "experiences.hero.title", group: "Experiences page", field: "Hero title", default: "More than a place to sleep" },
  {
    key: "experiences.hero.intro",
    group: "Experiences page",
    field: "Hero intro",
    multiline: true,
    default:
      "Bhedetar is a hill station made for slow mornings, big views and cool mountain air. Here is what waits just outside the door.",
  },

  // ---- Gallery ----
  { key: "gallery.hero.kicker", group: "Gallery page", field: "Hero kicker", default: "In pictures" },
  { key: "gallery.hero.title", group: "Gallery page", field: "Hero title", default: "A look around" },
  {
    key: "gallery.hero.intro",
    group: "Gallery page",
    field: "Hero intro",
    multiline: true,
    default:
      "Rooms, food, the terrace and the views that keep guests coming back. Tap any photo to take a closer look.",
  },

  // ---- Blog ----
  { key: "blog.hero.kicker", group: "Blog page", field: "Hero kicker", default: "Travel notes" },
  { key: "blog.hero.title", group: "Blog page", field: "Hero title", default: "Stories from the hill" },
  {
    key: "blog.hero.intro",
    group: "Blog page",
    field: "Hero intro",
    multiline: true,
    default: "Tips, guides and little stories from up here in Bhedetar.",
  },

  // ---- Contact ----
  { key: "contact.hero.kicker", group: "Contact page", field: "Hero kicker", default: "Plan your stay" },
  { key: "contact.hero.title", group: "Contact page", field: "Hero title", default: "Let's get you booked in" },
  {
    key: "contact.hero.intro",
    group: "Contact page",
    field: "Hero intro",
    multiline: true,
    default:
      "Tell us your dates and we will reply with availability and the best rate. Prefer to talk? Call or WhatsApp us any time.",
  },
] as const;

/** All valid keys (for validation in the save action). */
export const PAGE_TEXT_KEYS: ReadonlySet<string> = new Set(PAGE_TEXT.map((e) => e.key));

/** Compiled defaults as a map — the fallback layer. */
export const PAGE_TEXT_DEFAULTS: Readonly<Record<string, string>> = Object.fromEntries(
  PAGE_TEXT.map((e) => [e.key, e.default]),
);
