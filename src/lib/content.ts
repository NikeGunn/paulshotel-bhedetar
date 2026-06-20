/**
 * Static site content (rooms, dining, experiences, testimonials).
 * Tourist-focused copy. In v1 rooms are static; blog + gallery come from Supabase.
 */

export const rooms = [
  {
    slug: "deluxe-double",
    name: "Deluxe Double",
    blurb:
      "Our cosiest room, with a plush double bed, warm accent lighting and a window that opens onto the hills.",
    image: "/images/rooms/deluxe-double-accent.webp",
    priceFrom: "Rs. 1,500",
    capacity: "2 guests",
    amenities: ["Mountain view", "Private bathroom", "Cosy bedding", "Free Wi-Fi"],
  },
  {
    slug: "twin-room",
    name: "Twin Room",
    blurb:
      "Two comfortable beds and plenty of space, perfect for friends and families exploring Bhedetar together.",
    image: "/images/rooms/twin-room.webp",
    priceFrom: "Rs. 1,800",
    capacity: "2 to 3 guests",
    amenities: ["Valley view", "Two beds", "Private bathroom", "Free Wi-Fi"],
  },
  {
    slug: "family-stay",
    name: "Family Lodge Room",
    blurb:
      "A roomy stay for the whole group, steps from the terrace and the restaurant. Wake up, walk out, watch the sunrise.",
    image: "/images/hotel/exterior-blue-dusk.webp",
    priceFrom: "Rs. 2,500",
    capacity: "Up to 4 guests",
    amenities: ["Terrace access", "Extra space", "Hot water", "Free Wi-Fi"],
  },
] as const;

export const dishes = [
  { src: "/images/food/chicken-sekuwa.webp", name: "Chicken Sekuwa" },
  { src: "/images/food/chowmein.webp", name: "Chowmein" },
  { src: "/images/food/chicken-biryani.webp", name: "Chicken Biryani" },
  { src: "/images/food/thukpa-soup.webp", name: "Thukpa" },
  { src: "/images/food/chilli-paneer-sticks.webp", name: "Chilli Paneer" },
  { src: "/images/food/veg-fried-rice.webp", name: "Veg Fried Rice" },
  { src: "/images/food/chicken-wings-sekuwa.webp", name: "Spicy Wings" },
  { src: "/images/food/fried-cheese-sticks.webp", name: "Cheese Sticks" },
  { src: "/images/food/aloo-paratha.webp", name: "Aloo Paratha" },
] as const;

export const experiences = [
  {
    title: "Sunrise over the valley",
    text: "Set an early alarm and watch the first light spill across the hills. On clear mornings the view stretches all the way to the plains.",
    image: "/images/views/night-valley-citylights.webp",
  },
  {
    title: "The Bhedetar Sky Walk",
    text: "Walk out over the edge of the ridge on the glass and steel Sky Walk, a short hop from the hotel and a favourite with visitors.",
    image: "/images/hotel/lounge-sky-walk.webp",
  },
  {
    title: "Charles Point lookout",
    text: "The classic Bhedetar viewpoint right beside us, wrapped in cloud one minute and bright with sun the next.",
    image: "/images/hotel/exterior-foggy-day.webp",
  },
  {
    title: "Cool evenings by the lights",
    text: "When the sun drops the terrace lights up. Grab a drink, pull up a chair and watch the valley twinkle below.",
    image: "/images/hotel/terrace-string-lights.webp",
  },
] as const;

export const galleryImages = [
  { src: "/images/hotel/exterior-blue-dusk.webp", alt: "Paul's Hotel exterior at dusk", category: "Hotel" },
  { src: "/images/hotel/exterior-terrace-evening.webp", alt: "Terrace in the evening", category: "Hotel" },
  { src: "/images/hotel/terrace-string-lights.webp", alt: "Terrace string lights", category: "Hotel" },
  { src: "/images/hotel/signage-pauls-hotel-lodge.webp", alt: "Paul's Hotel and Lodge signboard", category: "Hotel" },
  { src: "/images/hotel/exterior-foggy-day.webp", alt: "Hotel wrapped in fog", category: "Hotel" },
  { src: "/images/hotel/exterior-awning-day.webp", alt: "Hotel front with awning", category: "Hotel" },
  { src: "/images/hotel/lounge-sky-walk.webp", alt: "Sky Walk lounge area", category: "Hotel" },
  { src: "/images/rooms/deluxe-double-accent.webp", alt: "Deluxe double room", category: "Rooms" },
  { src: "/images/rooms/twin-room.webp", alt: "Twin room with two beds", category: "Rooms" },
  { src: "/images/bar/bar-blue-led.webp", alt: "Bar with blue LED lighting", category: "Bar" },
  { src: "/images/bar/bar-green-led-lounge.webp", alt: "Lounge bar with green lighting", category: "Bar" },
  { src: "/images/views/night-valley-citylights.webp", alt: "City lights across the valley at night", category: "Views" },
  { src: "/images/views/night-sky-stars.webp", alt: "Starry night sky over Bhedetar", category: "Views" },
  { src: "/images/food/chicken-sekuwa.webp", alt: "Chicken sekuwa platter", category: "Food" },
  { src: "/images/food/chicken-biryani.webp", alt: "Chicken biryani", category: "Food" },
  { src: "/images/food/chowmein.webp", alt: "Chowmein noodles", category: "Food" },
  { src: "/images/food/thukpa-soup.webp", alt: "Bowl of thukpa", category: "Food" },
  { src: "/images/food/chilli-paneer-sticks.webp", alt: "Chilli paneer sticks", category: "Food" },
  { src: "/images/food/veg-fried-rice.webp", alt: "Vegetable fried rice", category: "Food" },
  { src: "/images/food/chicken-wings-sekuwa.webp", alt: "Spicy chicken wings", category: "Food" },
  { src: "/images/food/fried-cheese-sticks.webp", alt: "Fried cheese sticks", category: "Food" },
  { src: "/images/food/aloo-paratha.webp", alt: "Aloo paratha", category: "Food" },
] as const;

export const testimonials = [
  {
    name: "Sujan Rai",
    location: "Dharan",
    text: "Drove up for the weekend and did not want to leave. The view from the terrace at sunrise is unreal and the sekuwa is the best I have had in Bhedetar.",
    rating: 5,
  },
  {
    name: "Anita Limbu",
    location: "Itahari",
    text: "Clean rooms, warm staff and the cool weather was such a relief from the heat below. Perfect little getaway with family.",
    rating: 5,
  },
  {
    name: "Bikash Thapa",
    location: "Kathmandu",
    text: "Stayed one night on a road trip east. The lounge bar with the city lights below is a vibe. Highly recommend for couples.",
    rating: 5,
  },
  {
    name: "Priya Gurung",
    location: "Biratnagar",
    text: "Woke up to clouds rolling past the window. Food was hot and tasty and the price is very reasonable. Will come again.",
    rating: 4,
  },
  {
    name: "Rohan Shrestha",
    location: "Lalitpur",
    text: "Cool weather, friendly owner and a quiet spot to switch off for a couple of days. The momo and thukpa hit different up here.",
    rating: 5,
  },
  {
    name: "Sabina Magar",
    location: "Dhankuta",
    text: "Came up for my birthday and the terrace at night with the lights was magical. Staff went out of their way to make it special.",
    rating: 5,
  },
] as const;
