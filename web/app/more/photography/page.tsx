import {MoreDetailLayout} from "@/components/more/MoreDetailLayout";
import {MorePageHeader} from "@/components/more/MorePageHeader";
import {PhotographyByYear} from "@/components/more/PhotographyByYear";
import {getPhotographyAlbums, getPhotographyBlock} from "@/lib/more/blocks";
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
  const albums = getPhotographyAlbums(page);

  return (
    <MoreDetailLayout>
      <MorePageHeader title={title} />
      {albums.length > 0 ? (
        <PhotographyByYear albums={albums} />
      ) : (
        <p className="text-slate-500">
          No albums yet. Create media albums under More → Media albums, then link them in the Photography block.
        </p>
      )}
    </MoreDetailLayout>
  );
}
