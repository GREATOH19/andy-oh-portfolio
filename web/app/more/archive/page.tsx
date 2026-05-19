import {MoreDetailLayout} from "@/components/more/MoreDetailLayout";
import {MorePageHeader} from "@/components/more/MorePageHeader";
import {ProjectsByYear} from "@/components/more/ProjectsByYear";
import {getAllArchiveProjectsAcrossBlocks, getArchiveBlock} from "@/lib/more/blocks";
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
  const title = block?.heading?.trim() || "Archive";

  return (
    <MoreDetailLayout>
      <MorePageHeader title={title} />
      {projects.length > 0 ? (
        <ProjectsByYear projects={projects} />
      ) : (
        <p className="text-slate-500">No archive projects yet. Add projects via “Add to More archive” in Studio.</p>
      )}
    </MoreDetailLayout>
  );
}
