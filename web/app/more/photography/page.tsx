import {MoreDetailLayout} from "@/components/more/MoreDetailLayout";
import {MorePageHeader} from "@/components/more/MorePageHeader";
import {PhotographyByYear} from "@/components/more/PhotographyByYear";
import {getPhotographyBlock} from "@/lib/more/blocks";
import {fetchMorePage} from "@/lib/more/fetchMorePage";
import type {Metadata} from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchMorePage();
  const block = getPhotographyBlock(page);
  return {
    title: block?.heading?.trim() || "Photography",
  };
}

export default async function MorePhotographyPage() {
  const page = await fetchMorePage();
  const block = getPhotographyBlock(page);
  const title = block?.heading?.trim() || "Photography";

  return (
    <MoreDetailLayout>
      <MorePageHeader title={title} />
      {block?.albums?.length ? (
        <PhotographyByYear albums={block.albums} />
      ) : (
        <p className="text-slate-500">No photography yet.</p>
      )}
    </MoreDetailLayout>
  );
}
