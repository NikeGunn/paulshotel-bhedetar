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
      {/* Hero is the LCP — render eagerly. Everything below the fold gets
          content-visibility:auto so off-screen sections don't compete for the
          main thread while the user scrolls. */}
      <Hero />
      <div className="cv-auto">
        <Highlights />
      </div>
      <div className="cv-auto">
        <RoomsPreview />
      </div>
      <div className="cv-auto">
        <FoodMarquee />
      </div>
      <div className="cv-auto">
        <ExperiencesStrip />
      </div>
      <div className="cv-auto">
        <FanShowcase />
      </div>
      <div className="cv-auto">
        <Testimonials />
      </div>
      <div className="cv-auto">
        <LocationCTA />
      </div>
    </>
  );
}
