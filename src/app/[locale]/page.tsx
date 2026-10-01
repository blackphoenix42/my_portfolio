import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE } from "@/content/profile";
import { Hero } from "@/components/hero/hero";
import { MetricsStrip } from "@/components/metrics/metrics-strip";
import { FeaturedWork } from "@/components/projects/featured-work";
import { CareerTimeline } from "@/components/experience/career-timeline";
import { CPCommandCenter } from "@/components/competitive-programming/cp-command-center";
import { AboutSection } from "@/components/about-section";
import { ContactCTA } from "@/components/contact/contact-cta";
import { RecruiterAware } from "@/components/layout/recruiter-aware";
import { EngineerAware } from "@/components/layout/engineer-aware";
import { EngineerHomeIntro } from "@/components/layout/engineer-home-intro";
import { PerformanceDiagram } from "@/components/diagrams/performance-diagram";
import { SystemDesignDiagram } from "@/components/diagrams/system-design-diagram";
import { TechMarquee } from "@/components/logos/tech-marquee";
import { DesignGallery } from "@/components/system-design/design-gallery";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  return { title: { absolute: t("metaTitle", { name: SITE.name }) } };
}

const lazy = "lazy-section";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const viewFullExperience = t("viewFullExperience");
  return (
    <>
      <Hero />
      <div className={lazy}>
        <AboutSection />
      </div>
      <MetricsStrip />
      <TechMarquee />
      <div className={lazy}>
        <DesignGallery limit={2} home />
      </div>
      <EngineerAware
        engineer={
          <>
            <EngineerHomeIntro />
            <div className={lazy}>
              <PerformanceDiagram />
            </div>
            <div className={lazy}>
              <SystemDesignDiagram />
            </div>
            <div className={lazy}>
              <FeaturedWork limit={4} />
            </div>
            <div className={lazy}>
              <CPCommandCenter />
            </div>
            <div className={lazy}>
              <CareerTimeline cta={{ href: "/experience", label: viewFullExperience }} />
            </div>
            <div className={lazy}>
              <ContactCTA />
            </div>
          </>
        }
        full={
          <RecruiterAware
            recruiter={
              <>
                <div className={lazy}>
                  <CareerTimeline cta={{ href: "/experience", label: viewFullExperience }} />
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
                  <CareerTimeline cta={{ href: "/experience", label: viewFullExperience }} />
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
        }
      />
    </>
  );
}
