"use client";

import {ClickablePhotoGrid} from "@/components/ClickablePhotoGrid";
import {useTypoClass} from "@/components/TypographyProvider";
import {imageSectionMedia} from "@/lib/sanity/imageSectionMedia";
import type {CmsMediaItemRaw, SanityImageField} from "@/lib/types/project";

export function ImageSection({
  image,
  item,
  caption,
}: {
  image?: SanityImageField;
  item?: CmsMediaItemRaw;
  caption?: string | null;
}) {
  const metaClass = useTypoClass("meta");
  const items = imageSectionMedia({image, item});

  if (items.length === 0) return null;

  return (
    <figure className="w-full">
      <ClickablePhotoGrid
        images={items}
        gridClass="grid grid-cols-1 gap-3"
        thumbMaxWidth={1600}
        sizes="(max-width: 768px) 100vw, 1200px"
        quality={90}
      />
      {caption ? (
        <figcaption className={`mt-3 text-sm text-zinc-500 ${metaClass}`}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
