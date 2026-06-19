import {MoreDetailLayout} from "@/components/more/MoreDetailLayout";
import {MorePageHeader} from "@/components/more/MorePageHeader";
import {PhotographyByYear} from "@/components/more/PhotographyByYear";
import {ProjectsByYear} from "@/components/more/ProjectsByYear";
import {getAllArchiveAlbumsAcrossBlocks, getAllArchiveProjectsAcrossBlocks, getArchiveBlock} from "@/lib/more/blocks";
import {fetchMorePage} from "@/lib/more/fetchMorePage";
import type {Metadata} from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchMorePage();
  const block = getArchiveBlock(page);
  return {
    title: block?.heading?.trim() || "Archive",
  };
}

export default async function MoreArchivePage() {
  const page = await fetchMorePage();
  const block = getArchiveBlock(page);
  const projects = getAllArchiveProjectsAcrossBlocks(page?.blocks);
  const albums = getAllArchiveAlbumsAcrossBlocks(page?.blocks);
  const title = block?.heading?.trim() || "Archive";
  const hasContent = projects.length > 0 || albums.length > 0;

  return (
    <MoreDetailLayout>
      <MorePageHeader title={title} />
      {hasContent ? (
        <div className="space-y-16 md:space-y-20">
          {projects.length > 0 ? <ProjectsByYear projects={projects} /> : null}
          {albums.length > 0 ? <PhotographyByYear albums={albums} /> : null}
        </div>
      ) : (
        <p className="text-slate-500">
          No archive items yet. Add projects via “Add to More archive” in Studio, or create media albums under More →
          Media albums and link them in the Archive block.
        </p>
      )}
    </MoreDetailLayout>
  );
}