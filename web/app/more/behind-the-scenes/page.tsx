import {MoreDetailLayout} from "@/components/more/MoreDetailLayout";
import {MorePageHeader} from "@/components/more/MorePageHeader";
import {PhotoThumbnailGrid} from "@/components/more/PhotoThumbnailGrid";
import {getBehindTheScenesBlock} from "@/lib/more/blocks";
import {filterValidImages} from "@/lib/more/photos";
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
  const images = filterValidImages(block?.images);

  return (
    <MoreDetailLayout>
      <MorePageHeader title={title} />
      {images.length > 0 ? (
        <PhotoThumbnailGrid images={images} columns={3} />
      ) : (
        <p className="text-slate-500">No photos yet.</p>
      )}
    </MoreDetailLayout>
  );
}
