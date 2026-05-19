"use client";

import {ClickablePhotoGrid, projectGalleryGridClass} from "@/components/ClickablePhotoGrid";
import {useTypoClass} from "@/components/TypographyProvider";
import {sanityImageAssetId} from "@/lib/sanity/image";
import type {SanityImageField} from "@/lib/types/project";

export function GallerySection({
  images,
  caption,
  columns,
}: {
  images?: SanityImageField[] | null;
  caption?: string | null;
  columns?: number | null;
}) {
  const metaClass = useTypoClass("meta");
  const imgs = images?.filter((i) => sanityImageAssetId(i)) ?? [];
  if (imgs.length === 0) return null;

  const cols = columns && columns >= 1 && columns <= 4 ? columns : 2;

  return (
    <section className="mx-auto w-full max-w-5xl">
      <ClickablePhotoGrid
        images={imgs}
        gridClass={projectGalleryGridClass(cols)}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        quality={90}
      />
      {caption ? <p className={`mt-3 text-sm text-zinc-500 ${metaClass}`}>{caption}</p> : null}
    </section>
  );
}
