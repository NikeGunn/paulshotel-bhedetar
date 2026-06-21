import { Hero } from "@/components/home/hero";
import { Highlights } from "@/components/home/highlights";
import { RoomsPreview } from "@/components/home/rooms-preview";
import { FoodMarquee } from "@/components/home/food-marquee";
import { ExperiencesStrip } from "@/components/home/experiences-strip";
import { FanShowcase } from "@/components/home/fan-showcase";
import { Testimonials } from "@/components/home/testimonials";
import { LocationCTA } from "@/components/home/location-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Highlights />
      <RoomsPreview />
      <FoodMarquee />
      <ExperiencesStrip />
      <FanShowcase />
      <Testimonials />
      <LocationCTA />
    </>
  );
}
