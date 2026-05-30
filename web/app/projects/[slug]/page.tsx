import {ProjectHeader} from "@/components/ProjectHeader";
import {ProjectHero} from "@/components/ProjectHero";
import {ProjectToc} from "@/components/project/ProjectToc";
import {ProjectStory} from "@/components/project/ProjectStory";
import {client} from "@/lib/sanity/client";
import {isSanityImage, normalizeMediaItem} from "@/lib/sanity/media";
import {projectBySlugQuery, projectSlugsQuery} from "@/lib/sanity/queries";
import type {ProjectDetail} from "@/lib/types/project";
import type {Metadata} from "next";
import {notFound} from "next/navigation";

export const revalidate = 60;

type Props = {params: Promise<{slug: string}>};

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(projectSlugsQuery);
  return slugs.filter(Boolean).map((slug) => ({slug}));
}

function leadExcerpt(lead?: string | null): string | undefined {
  if (!lead?.trim()) return undefined;
  const first = lead.split(/\n\s*\n+/)[0]?.trim();
  return first || undefined;
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params;
  const project = await client.fetch<ProjectDetail | null>(projectBySlugQuery, {slug});
  if (!project) return {title: "Project"};
  return {
    title: project.title,
    description: leadExcerpt(project.lead) ?? project.subtitle ?? undefined,
  };
}

export default async function ProjectPage({params}: Props) {
  const {slug} = await params;
  const project = await client.fetch<ProjectDetail | null>(projectBySlugQuery, {slug});
  if (!project || !project.slug) notFound();

  const normalizedHero = normalizeMediaItem(project.heroImage);
  const normalizedCover = normalizeMediaItem(project.coverImage);
  const heroMedia =
    normalizedHero ?? (isSanityImage(normalizedCover) ? normalizedCover : null);
  const heroAlt = heroMedia?.alt ?? project.title;
  const story = project.story?.filter(Boolean) ?? [];

  return (
    <>
      <ProjectHero
        media={heroMedia}
        alt={heroAlt}
        title={project.title}
        subtitle={project.subtitle}
        intrinsicWidth={project.projectHeroDimensions?.width}
        intrinsicHeight={project.projectHeroDimensions?.height}
      />

      <article className="container-project flex-1 pb-20 md:pb-24">
        <ProjectHeader project={project} titleInHero={Boolean(heroMedia)} />

        {story.length > 0 ? (
          <div className="project-story-mobile-bleed">
            <div className="md:hidden mt-10">
              <ProjectToc blocks={story} variant="mobile" />
            </div>

            <div className="mt-[6.75rem] grid gap-12 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-3 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-3">
              <div className="min-w-0">
                <ProjectStory blocks={story} />
              </div>
              <aside className="hidden md:block justify-self-end">
                <ProjectToc blocks={story} variant="desktop" />
              </aside>
            </div>
          </div>
        ) : null}
      </article>
    </>
  );
}
