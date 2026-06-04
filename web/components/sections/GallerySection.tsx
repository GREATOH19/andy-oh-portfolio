"use client";

import {
  ClickablePhotoGrid,
  projectGalleryGridClass,
  projectStoryGalleryGridClass,
} from "@/components/ClickablePhotoGrid";
import {MediaCarousel} from "@/components/MediaCarousel";
import {useTypoClass} from "@/components/TypographyProvider";
import {storyImageSizing} from "@/lib/sanity/imageRequestWidth";
import {normalizeMediaList} from "@/lib/sanity/media";
import type {CmsMediaInput, ProjectStoryMediaWidth} from "@/lib/types/project";

export function GallerySection({
  images,
  caption,
  columns,
  storyMobileCarousel = false,
  mediaWidth,
}: {
  images?: CmsMediaInput[] | null;
  caption?: string | null;
  columns?: number | null;
  /** Story: swipe carousel below md instead of multi-column grid */
  storyMobileCarousel?: boolean;
  mediaWidth?: ProjectStoryMediaWidth | null;
}) {
  const metaClass = useTypoClass("meta");
  const items = normalizeMediaList(images);
  if (items.length === 0) return null;

  const cols = columns && columns >= 1 && columns <= 4 ? columns : 2;
  const useMobileCarousel = storyMobileCarousel && items.length > 1;
  const sizing = storyImageSizing(mediaWidth);
  const gridSizes =
    mediaWidth === "bleed"
      ? sizing.sizes
      : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";

  const storyGrid =
    storyMobileCarousel !== undefined || mediaWidth != null;
  const grid = (
    <ClickablePhotoGrid
      images={items}
      gridClass={
        storyGrid
          ? `project-story-media-grid ${projectStoryGalleryGridClass(cols)}`
          : projectGalleryGridClass(cols)
      }
      thumbMaxWidth={sizing.displayPx}
      sizes={gridSizes}
      quality={sizing.quality}
      unoptimized={sizing.unoptimized}
    />
  );

  if (useMobileCarousel) {
    return (
      <section className="w-full">
        <div className="md:hidden">
          <MediaCarousel
            images={items}
            caption={caption}
            thumbMaxWidth={sizing.displayPx}
            sizes={sizing.sizes}
            quality={sizing.quality}
            unoptimized={sizing.unoptimized}
          />
        </div>
        <div className="hidden md:block">
          {grid}
          {caption ? <p className={`mt-3 text-sm text-zinc-500 ${metaClass}`}>{caption}</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      {grid}
      {caption ? <p className={`mt-3 text-sm text-zinc-500 ${metaClass}`}>{caption}</p> : null}
    </section>
  );
}
