"use client";

import {ClickablePhotoGrid} from "@/components/ClickablePhotoGrid";
import {useTypoClass} from "@/components/TypographyProvider";
import {sanityImageAssetId} from "@/lib/sanity/image";
import type {SanityImageField} from "@/lib/types/project";

export function ImageSection({
  image,
  caption,
}: {
  image?: SanityImageField;
  caption?: string | null;
}) {
  const metaClass = useTypoClass("meta");

  if (image == null || !sanityImageAssetId(image)) return null;

  return (
    <figure className="mx-auto w-full max-w-3xl">
      <ClickablePhotoGrid
        images={[image]}
        gridClass="grid grid-cols-1 gap-3"
        thumbMaxWidth={720}
        sizes="(max-width: 768px) 100vw, 720px"
        quality={90}
      />
      {caption ? (
        <figcaption className={`mt-3 text-sm text-zinc-500 ${metaClass}`}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
