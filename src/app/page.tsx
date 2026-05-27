import { Hero } from "@/components/hero/hero";
import { MetricsStrip } from "@/components/metrics/metrics-strip";
import { FeaturedWork } from "@/components/projects/featured-work";
import { CareerTimeline } from "@/components/experience/career-timeline";
import { CPCommandCenter } from "@/components/competitive-programming/cp-command-center";
import { AboutSection } from "@/components/about-section";
import { ContactCTA } from "@/components/contact/contact-cta";
import { RecruiterAware } from "@/components/layout/recruiter-aware";
import { TechMarquee } from "@/components/logos/tech-marquee";

export const revalidate = 3600;

const lazy = "lazy-section";

export default async function HomePage() {
  return (
    <>
      <Hero />
      <div className={lazy}>
        <AboutSection />
      </div>
      <MetricsStrip />
      <TechMarquee />
      <RecruiterAware
        recruiter={
          <>
            <div className={lazy}>
              <CareerTimeline cta={{ href: "/experience", label: "View full experience" }} />
            </div>
            <div className={lazy}>
              <FeaturedWork limit={4} />
            </div>
            <div className={lazy}>
              <ContactCTA />
            </div>
          </>
        }
        full={
          <>
            <div className={lazy}>
              <FeaturedWork limit={2} />
            </div>
            <div className={lazy}>
              <CareerTimeline cta={{ href: "/experience", label: "View full experience" }} />
            </div>
            <div className={lazy}>
              <CPCommandCenter />
            </div>
            <div className={lazy}>
              <ContactCTA />
            </div>
          </>
        }
      />
    </>
  );
}
