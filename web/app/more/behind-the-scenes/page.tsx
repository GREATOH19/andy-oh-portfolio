import {MoreDetailLayout} from "@/components/more/MoreDetailLayout";
import {MorePageHeader} from "@/components/more/MorePageHeader";
import {PhotographyByYear} from "@/components/more/PhotographyByYear";
import {getBehindTheScenesAlbums, getBehindTheScenesBlock} from "@/lib/more/blocks";
import {fetchMorePage} from "@/lib/more/fetchMorePage";
import type {Metadata} from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchMorePage();
  const block = getBehindTheScenesBlock(page);
  return {
    title: block?.heading?.trim() || "Behind the scene",
  };
}

export default async function MoreBehindTheScenesPage() {
  const page = await fetchMorePage();
  const block = getBehindTheScenesBlock(page);
  const title = block?.heading?.trim() || "Behind the scene";
  const albums = getBehindTheScenesAlbums(page);

  return (
    <MoreDetailLayout>
      <MorePageHeader title={title} />
      {albums.length > 0 ? (
        <PhotographyByYear albums={albums} />
      ) : (
        <p className="text-slate-500">
          No albums yet. Create media albums under More → Media albums, then link them in the Behind the scene block.
        </p>
      )}
    </MoreDetailLayout>
  );
}
