"use client";

import {ClickablePhotoGrid} from "@/components/ClickablePhotoGrid";
import {MediaCarousel} from "@/components/MediaCarousel";
import {useTypoClass} from "@/components/TypographyProvider";
import {imageSectionMedia} from "@/lib/sanity/imageSectionMedia";
import {storyImageSizing} from "@/lib/sanity/imageRequestWidth";
import type {CmsMediaInput, CmsMediaItemRaw, ProjectStoryMediaWidth, SanityImageField} from "@/lib/types/project";
import type {GridAspectRatio, GridCropFocus} from "@/lib/gridAspectRatio";

export function ImageSection({
  image,
  item,
  media,
  caption,
  storyMobileCarousel = false,
  mediaWidth,
  gridAspectRatio = "auto",
  cropFocus = "auto",
}: {
  image?: SanityImageField;
  item?: CmsMediaItemRaw;
  media?: CmsMediaInput[] | null;
  caption?: string | null;
  /** Story: swipe carousel below md when multiple images */
  storyMobileCarousel?: boolean;
  /** Story Width setting — bleed uses full viewport resolution */
  mediaWidth?: ProjectStoryMediaWidth | null;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
}) {
  const metaClass = useTypoClass("meta");
  const items = imageSectionMedia({image, item, media});
  const sizing = storyImageSizing(mediaWidth);

  if (items.length === 0) return null;

  const useMobileCarousel = storyMobileCarousel && items.length > 1;

  const storyGrid = storyMobileCarousel || mediaWidth != null;
  const grid = (
    <ClickablePhotoGrid
      images={items}
      gridClass={
        storyGrid
          ? "project-story-media-grid grid grid-cols-1 items-start"
          : "grid grid-cols-1 gap-3"
      }
      thumbMaxWidth={sizing.displayPx}
      sizes={sizing.sizes}
      quality={sizing.quality}
      gridAspectRatio={gridAspectRatio}
      cropFocus={cropFocus}
    />
  );

  if (useMobileCarousel) {
    return (
      <figure className="w-full">
        <div className="md:hidden">
          <MediaCarousel
            images={items}
            caption={caption}
            thumbMaxWidth={sizing.displayPx}
            sizes={sizing.sizes}
            quality={sizing.quality}
            gridAspectRatio={gridAspectRatio}
            cropFocus={cropFocus}
          />
        </div>
        <div className="hidden md:block">
          {grid}
          {caption ? (
            <figcaption className={`mt-3 text-sm text-zinc-500 ${metaClass}`}>{caption}</figcaption>
          ) : null}
        </div>
      </figure>
    );
  }

  return (
    <figure className="w-full">
      {grid}
      {caption ? (
        <figcaption className={`mt-3 text-sm text-zinc-500 ${metaClass}`}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
