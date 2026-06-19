"use client";

import type {CSSProperties} from "react";
import {useCallback, useMemo, useState} from "react";
import {MediaLightbox} from "@/components/MediaLightbox";
import {SanityAspectMedia} from "@/components/sections/SanityAspectMedia";
import {
  isSanityImage,
  isSanityLightboxMedia,
  isSanityMedia,
  isSanityVideo,
  sanityMediaKey,
} from "@/lib/sanity/media";
import {
  clampGridTileAspect,
  gridClassForUniformCrop,
  gridUsesUniformCrop,
  normalizeGridAspectRatio,
  type GridAspectRatio,
  type GridCropFocus,
} from "@/lib/gridAspectRatio";
import {rowAspectsForItems, type MediaAspect} from "@/lib/gridRowAspect";
import {useGalleryBreakpointColumns} from "@/lib/projectStory/useGalleryBreakpointColumns";
import type {SanityMediaField} from "@/lib/types/project";

export const masonryPreviewClass =
  "columns-2 gap-x-2 sm:columns-3 sm:gap-x-3 md:columns-4 md:gap-x-3";

export const masonryPreviewItemClass = "mb-2 break-inside-avoid sm:mb-3";

export function ClickablePhotoGrid({
  images,
  gridClass,
  layout = "grid",
  thumbMaxWidth = 560,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",
  quality,
  className,
  gridStyle,
  gridAspectRatio = "auto",
  cropFocus = "auto",
  columns,
}: {
  images: SanityMediaField[];
  gridClass?: string;
  layout?: "grid" | "masonry";
  thumbMaxWidth?: number;
  sizes?: string;
  quality?: number;
  className?: string;
  gridStyle?: CSSProperties;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
  columns?: number | null;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [videoAspects, setVideoAspects] = useState<Record<string, MediaAspect>>({});
  const validMedia = images.filter(isSanityMedia) as NonNullable<SanityMediaField>[];
  const lightboxItems = validMedia.filter(isSanityLightboxMedia);
  const visibleColumns = useGalleryBreakpointColumns(columns ?? 1);
  const uniformCrop = gridUsesUniformCrop(normalizeGridAspectRatio(gridAspectRatio));
  const rowAspects = useMemo(
    () =>
      layout === "grid" && !uniformCrop
        ? rowAspectsForItems(validMedia, visibleColumns, videoAspects, sanityMediaKey)
        : validMedia.map(() => undefined),
    [layout, uniformCrop, validMedia, visibleColumns, videoAspects],
  );

  const onVideoLayout = useCallback((key: string, aspect: MediaAspect) => {
    const clamped = clampGridTileAspect(aspect.width, aspect.height);
    setVideoAspects((prev) => {
      const current = prev[key];
      if (current?.width === clamped.width && current?.height === clamped.height) return prev;
      return {...prev, [key]: clamped};
    });
  }, []);

  if (validMedia.length === 0) return null;

  const openLightbox = (index: number) => {
    const item = validMedia[index];
    if (!isSanityLightboxMedia(item)) return;
    const lbIndex = lightboxItems.indexOf(item);
    if (lbIndex >= 0) setActiveIndex(lbIndex);
  };

  const resolvedGridClass = gridClass ?? masonryPreviewClass;
  const alignedGridClass =
    layout === "grid" ? gridClassForUniformCrop(resolvedGridClass, uniformCrop) : resolvedGridClass;
  const containerClass = className
    ? `clickable-photo-grid ${alignedGridClass} ${className}`
    : `clickable-photo-grid ${alignedGridClass}`;

  return (
    <>
      <div className={containerClass} style={gridStyle}>
        {validMedia.map((item, i) => {
          const alt = item?.alt ?? "";
          const isClickable = isSanityLightboxMedia(item);
          const label = isSanityVideo(item)
            ? alt
              ? `Play ${alt}`
              : `Play video ${i + 1}`
            : alt
              ? `View ${alt}`
              : `View photo ${i + 1}`;

          const tileClass = `group w-full text-left transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.006] active:translate-y-0 active:scale-[0.997] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 ${
            isSanityImage(item) ? "cursor-zoom-in" : "cursor-pointer"
          } [&_video]:pointer-events-none`;
          const itemKey = sanityMediaKey(item, i);
          const media = (
            <SanityAspectMedia
              media={item}
              alt={alt}
              maxWidth={thumbMaxWidth}
              quality={quality}
              sizes={sizes}
              gridAspectRatio={layout === "masonry" ? "auto" : gridAspectRatio}
              cropFocus={layout === "masonry" ? "auto" : cropFocus}
              inGrid={layout === "grid"}
              gridRowAspect={rowAspects[i]}
              onVideoLayout={
                isSanityVideo(item)
                  ? (aspect) => onVideoLayout(itemKey, aspect)
                  : undefined
              }
            />
          );

          const tile = isClickable ? (
            isSanityVideo(item) ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => openLightbox(i)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openLightbox(i);
                  }
                }}
                className={tileClass}
                aria-label={label}
              >
                {media}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openLightbox(i)}
                className={tileClass}
                aria-label={label}
              >
                {media}
              </button>
            )
          ) : (
            <div className="w-full text-left [&_iframe]:pointer-events-auto">{media}</div>
          );

          if (layout === "masonry") {
            return (
              <div key={sanityMediaKey(item, i)} className={masonryPreviewItemClass}>
                {tile}
              </div>
            );
          }

          return (
            <div
              key={itemKey}
              className={uniformCrop ? "min-w-0 w-full self-start" : "min-w-0 self-stretch"}
            >
              {tile}
            </div>
          );
        })}
      </div>

      {activeIndex !== null && lightboxItems.length > 0 ? (
        <MediaLightbox
          items={lightboxItems}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onIndexChange={setActiveIndex}
        />
      ) : null}
    </>
  );
}

export {
  galleryGridMobileStyle,
  normalizeGalleryColumns,
  projectGalleryGridClass,
  projectStoryGalleryGridClass,
} from "@/lib/projectStory/galleryGrid";
