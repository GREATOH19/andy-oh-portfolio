import {ContactCtaSection} from "@/components/home/ContactCtaSection";
import {HomePageShell} from "@/components/home/HomePageShell";
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
  const workHomeLogo = siteSettings?.workHomeLogo ?? null;
  const headerBrand = siteSettings?.brand ?? null;

  const sections: HomeSection[] = home?.sections ?? [];
  const hasSelectedWorkSection = sections.some((s) => s._type === "selectedWorkSection");
  const contactSections = sections.filter((s) => s._type === "contactCtaSection");
  const projectList = await resolveHomeFeaturedProjects(client, home?.featuredProjects);

  return (
    <HomePageShell heroLottieUrl={siteSettings?.heroLottieUrl}>
      <div className="home-main-stack">
        {!hasSelectedWorkSection ? (
          <SelectedWorkSection
            key="selected-work-fallback"
            projects={projectList}
            workHomeLogo={workHomeLogo}
            headerBrand={headerBrand}
            welcomeIntro={home?.welcomeIntro}
            compactBottomPadding={contactSections.length > 0}
          />
        ) : null}
        {sections.map((s, idx) => {
          if (s._type !== "selectedWorkSection") return null;
          return (
            <SelectedWorkSection
              key={`selected-work-${idx}`}
              projects={projectList}
              workHomeLogo={workHomeLogo}
              headerBrand={headerBrand}
              welcomeIntro={home?.welcomeIntro}
              compactBottomPadding={contactSections.length > 0}
            />
          );
        })}
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
