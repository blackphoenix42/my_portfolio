import { Hero } from "@/components/hero/hero";
import { MetricsStrip } from "@/components/metrics/metrics-strip";
import { FeaturedWork } from "@/components/projects/featured-work";
import { EngineeringSpectrum } from "@/components/skills/engineering-spectrum";
import { CareerTimeline } from "@/components/experience/career-timeline";
import { CPCommandCenter } from "@/components/competitive-programming/cp-command-center";
import { GithubWorkbench } from "@/components/github/github-workbench";
import { AboutSection } from "@/components/about-section";
import { ContactCTA } from "@/components/contact/contact-cta";
import { ConceptLabs } from "@/components/concept-labs";
import { RecruiterAware } from "@/components/layout/recruiter-aware";
import { TechMarquee } from "@/components/logos/tech-marquee";
import { fetchFeaturedRepos } from "@/lib/github";

export const revalidate = 3600;

const lazy = "lazy-section";

export default async function HomePage() {
  const repos = await fetchFeaturedRepos();

  return (
    <>
      <Hero />
      <MetricsStrip />
      <TechMarquee />
      <RecruiterAware
        recruiter={
          <>
            <div className={lazy}>
              <CareerTimeline />
            </div>
            <div className={lazy}>
              <FeaturedWork />
            </div>
            <div className={lazy}>
              <EngineeringSpectrum />
            </div>
            <div className={lazy}>
              <ContactCTA />
            </div>
          </>
        }
        full={
          <>
            <div className={lazy}>
              <FeaturedWork />
            </div>
            <div className={lazy}>
              <EngineeringSpectrum />
            </div>
            <div className={lazy}>
              <CareerTimeline />
            </div>
            <div className={lazy}>
              <CPCommandCenter />
            </div>
            <div className={lazy}>
              <GithubWorkbench repos={repos} />
            </div>
            <div className={lazy}>
              <ConceptLabs />
            </div>
            <div className={lazy}>
              <AboutSection />
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
