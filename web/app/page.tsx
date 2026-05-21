import {ContactCtaSection} from "@/components/home/ContactCtaSection";
import {HomePageShell} from "@/components/home/HomePageShell";
import {HomeWelcomeIntro} from "@/components/home/HomeWelcomeIntro";
import {SelectedWorkSection} from "@/components/home/SelectedWorkSection";
import {client} from "@/lib/sanity/client";
import {resolveHomeFeaturedProjects} from "@/lib/sanity/homeProjects";
import {homeQuery, siteSettingsQuery} from "@/lib/sanity/queries";
import type {HomeDocument, HomeSection, SiteSettingsDocument} from "@/lib/types/project";

export const revalidate = 60;

export default async function HomePage() {
  const [home, siteSettings] = await Promise.all([
    client.fetch<HomeDocument | null>(homeQuery),
    client.fetch<SiteSettingsDocument | null>(siteSettingsQuery),
  ]);

  const sections: HomeSection[] = home?.sections ?? [];
  const heroLottieUrl = siteSettings?.heroLottieUrl ?? null;
  const hasSelectedWorkSection = sections.some((s) => s._type === "selectedWorkSection");
  const contactSections = sections.filter((s) => s._type === "contactCtaSection");
  const projectList = await resolveHomeFeaturedProjects(client, home?.featuredProjects);

  return (
    <HomePageShell heroLottieUrl={heroLottieUrl}>
      <div className="home-main-stack">
        <HomeWelcomeIntro content={home?.welcomeIntro ?? null} />

        <div
          className={
            contactSections.length > 0 ? "container-work pb-12 md:pb-16" : "container-work pb-20 md:pb-32"
          }
        >
          {!hasSelectedWorkSection ? (
            <SelectedWorkSection key="selected-work-fallback" projects={projectList} />
          ) : null}
          {sections.map((s, idx) => {
            if (s._type !== "selectedWorkSection") return null;
            return <SelectedWorkSection key={`selected-work-${idx}`} projects={projectList} />;
          })}
        </div>
      </div>

      {contactSections.length > 0 ? (
        <div className="container-wide pb-20 md:pb-32">
          {contactSections.map((s, idx) => (
            <ContactCtaSection
              key={`contact-cta-${idx}`}
              heading={s.heading}
              email={s.email}
              links={s.links}
            />
          ))}
        </div>
      ) : null}
    </HomePageShell>
  );
}
