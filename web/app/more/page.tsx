import {MoreBlocks} from "@/components/more/MoreBlocks";
import {ProjectSections} from "@/components/ProjectSections";
import {fetchMorePage} from "@/lib/more/fetchMorePage";
import type {Metadata} from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchMorePage();
  return {
    title: page.title ?? "More",
  };
}

export default async function MorePage() {
  const page = await fetchMorePage();
  const sections = page.sections ?? [];

  return (
    <div className="container-more pt-20 pb-20 md:pt-24 md:pb-32">
      <MoreBlocks page={page} />

      {sections.length > 0 ? (
        <div className="mt-14 md:mt-16">
          <ProjectSections sections={sections} />
        </div>
      ) : null}
    </div>
  );
}
