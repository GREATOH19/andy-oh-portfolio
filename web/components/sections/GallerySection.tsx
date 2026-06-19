"use client";

import {ClickablePhotoGrid} from "@/components/ClickablePhotoGrid";
import {
  galleryGridDesktopOverflowStyle,
  galleryGridMobileStyle,
  galleryGridThumbSizes,
  normalizeGalleryColumns,
  projectGalleryGridClass,
  projectStoryGalleryGridClass,
} from "@/lib/projectStory/galleryGrid";
import {MediaCarousel} from "@/components/MediaCarousel";
import {useTypoClass} from "@/components/TypographyProvider";
import {storyImageSizing} from "@/lib/sanity/imageRequestWidth";
import {normalizeMediaList} from "@/lib/sanity/media";
import type {GridAspectRatio, GridCropFocus} from "@/lib/gridAspectRatio";
import type {CmsMediaInput, ProjectStoryMediaWidth} from "@/lib/types/project";

export function GallerySection({
  images,
  caption,
  columns,
  storyMobileCarousel = false,
  mediaWidth,
  gridAspectRatio = "auto",
  cropFocus = "auto",
}: {
  images?: CmsMediaInput[] | null;
  caption?: string | null;
  columns?: number | null;
  /** Story: swipe carousel below md instead of multi-column grid */
  storyMobileCarousel?: boolean;
  mediaWidth?: ProjectStoryMediaWidth | null;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
}) {
  const metaClass = useTypoClass("meta");
  const items = normalizeMediaList(images);
  if (items.length === 0) return null;

  const cols = normalizeGalleryColumns(columns);
  const gridStyle = {
    ...galleryGridMobileStyle(cols),
    ...galleryGridDesktopOverflowStyle(cols),
  };
  /** Multi-column grids stay grid on mobile; carousel only for single-column stacks. */
  const useMobileCarousel = storyMobileCarousel && items.length > 1 && cols < 2;
  const sizing = storyImageSizing(mediaWidth);
  const gridSizes =
    mediaWidth === "bleed" ? sizing.sizes : galleryGridThumbSizes(cols);

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
      gridStyle={gridStyle}
      thumbMaxWidth={sizing.displayPx}
      sizes={gridSizes}
      quality={sizing.quality}
      gridAspectRatio={gridAspectRatio}
      cropFocus={cropFocus}
      columns={cols}
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
            gridAspectRatio={gridAspectRatio}
            cropFocus={cropFocus}
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
