import { PortableBody } from "@/components/PortableBody";
import { ProjectHeader } from "@/components/ProjectHeader";
import { ProjectHero } from "@/components/ProjectHero";
import { ProjectSections } from "@/components/ProjectSections";
import { PhotoThumbnailGrid } from "@/components/more/PhotoThumbnailGrid";
import { client } from "@/lib/sanity/client";
import { isSanityImage, normalizeMediaItem, normalizeMediaList } from "@/lib/sanity/media";
import { projectBySlugQuery, projectSlugsQuery } from "@/lib/sanity/queries";
import type { ProjectDetail } from "@/lib/types/project";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(projectSlugsQuery);
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await client.fetch<ProjectDetail | null>(projectBySlugQuery, {
    slug,
  });
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.excerpt ?? undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await client.fetch<ProjectDetail | null>(projectBySlugQuery, {
    slug,
  });
  if (!project || !project.slug) notFound();

  const normalizedHero = normalizeMediaItem(project.heroImage);
  const normalizedCover = normalizeMediaItem(project.coverImage);
  const heroMedia =
    normalizedHero ?? (isSanityImage(normalizedCover) ? normalizedCover : null);
  const heroAlt = heroMedia?.alt ?? project.title;
  const sections = project.sections?.filter(Boolean) ?? [];
  const gallery = normalizeMediaList(project.gallery);
  const hasLegacyBody = (project.body?.length ?? 0) > 0 || gallery.length > 0;

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

      <article className="container-wide flex-1 pb-20 md:pb-24">
        <ProjectHeader project={project} titleInHero={Boolean(heroMedia)} />

        {sections.length > 0 && (
          <div className="mt-20">
            <ProjectSections sections={sections} />
          </div>
        )}

        {sections.length === 0 && hasLegacyBody && (
          <div className="mt-20">
            {gallery.length > 0 && (
              <div className="mb-14">
                <PhotoThumbnailGrid images={gallery} columns={2} />
              </div>
            )}

            {(project.body?.length ?? 0) > 0 && (
              <div className="mx-auto max-w-3xl border-t border-zinc-300/60 pt-10">
                <PortableBody value={project.body ?? undefined} />
              </div>
            )}
          </div>
        )}
      </article>
    </>
  );
}