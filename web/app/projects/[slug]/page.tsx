import {ProjectAttachments} from "@/components/project/ProjectAttachments";
import {ProjectHeader} from "@/components/ProjectHeader";
import {ProjectHero} from "@/components/ProjectHero";
import {ProjectToc} from "@/components/project/ProjectToc";
import {ProjectStory} from "@/components/project/ProjectStory";
import {client} from "@/lib/sanity/client";
import {fetchProjectBySlug} from "@/lib/sanity/fetchProject";
import {isSanityImage, normalizeMediaItem} from "@/lib/sanity/media";
import {projectSlugsQuery, siteSettingsQuery} from "@/lib/sanity/queries";
import {leadExcerptText} from "@/lib/portableText/leadContent";
import {isChapterStartBlock} from "@/lib/projectStory/chapterGroups";
import type {ProjectDetail, SiteSettingsDocument} from "@/lib/types/project";
import type {Metadata} from "next";
import {notFound} from "next/navigation";

export const revalidate = 60;

type Props = {params: Promise<{slug: string}>};

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(projectSlugsQuery);
  return slugs.filter(Boolean).map((slug) => ({slug}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project) return {title: "Project"};
  return {
    title: project.title,
    description: leadExcerptText(project.lead) ?? project.subtitle ?? undefined,
  };
}

export default async function ProjectPage({params}: Props) {
  const {slug} = await params;
  const [project, settings] = await Promise.all([
    fetchProjectBySlug(slug),
    client.fetch<SiteSettingsDocument | null>(siteSettingsQuery),
  ]);
  if (!project || !project.slug) notFound();

  const brand = settings?.brand ?? null;

  const normalizedHero = normalizeMediaItem(project.heroImage);
  const normalizedCover = normalizeMediaItem(project.coverImage);
  const heroMedia =
    normalizedHero ?? (isSanityImage(normalizedCover) ? normalizedCover : null);
  const heroAlt = heroMedia?.alt ?? project.title;
  const heroTitleInImage = Boolean(heroMedia && project.heroTitleInImage);
  const story = project.story?.filter(Boolean) ?? [];
  const chapterCount = story.filter(isChapterStartBlock).length;

  return (
    <>
      <ProjectHero
        media={heroMedia}
        alt={heroAlt}
        title={project.title}
        subtitle={project.subtitle}
        titleInImage={heroTitleInImage}
        intrinsicWidth={project.projectHeroDimensions?.width}
        intrinsicHeight={project.projectHeroDimensions?.height}
      />

      <article className="container-project flex-1 pb-20 md:pb-24">
        {chapterCount > 1 ? <ProjectToc blocks={story} brand={brand} /> : null}

        <ProjectHeader
          project={project}
          titleInHero={Boolean(heroMedia)}
          titleInImage={heroTitleInImage}
          layout={story.length > 0 ? "full" : "default"}
          belowChapterToc={chapterCount > 1}
        />

        <ProjectAttachments
          attachments={project.attachments}
          layout={story.length > 0 ? "full" : "default"}
        />

        {story.length > 0 ? (
          <div className="project-story-mobile-bleed project-story-band-gap min-w-0">
            <ProjectStory blocks={story} />
          </div>
        ) : null}
      </article>
    </>
  );
}
