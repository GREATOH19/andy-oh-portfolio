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
  const projectList = await resolveHomeFeaturedProjects(client, home?.featuredProjects);

  return (
    <HomePageShell heroLottieUrl={heroLottieUrl}>
      <div className="container-wide pt-10 pb-20 md:pt-16 md:pb-32">
        <HomeWelcomeIntro content={home?.welcomeIntro ?? null} />
        {!hasSelectedWorkSection ? (
          <SelectedWorkSection key="selected-work-fallback" projects={projectList} />
        ) : null}
        {sections.map((s, idx) => {
          const key = `${s._type}-${idx}`;
          switch (s._type) {
            case "heroSection":
              return null;
            case "selectedWorkSection":
              return <SelectedWorkSection key={key} projects={projectList} />;
            case "contactCtaSection":
              return (
                <ContactCtaSection
                  key={key}
                  heading={s.heading}
                  email={s.email}
                  links={s.links}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </HomePageShell>
  );
}
