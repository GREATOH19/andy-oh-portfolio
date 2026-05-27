"use client";

import {useState} from "react";
import {MediaLightbox} from "@/components/MediaLightbox";
import {SanityAspectMedia} from "@/components/sections/SanityAspectMedia";
import {isSanityImage, isSanityMedia, isSanityVideo, sanityMediaKey} from "@/lib/sanity/media";
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
}: {
  images: SanityMediaField[];
  gridClass?: string;
  layout?: "grid" | "masonry";
  thumbMaxWidth?: number;
  sizes?: string;
  quality?: number;
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const validMedia = images.filter(isSanityMedia) as NonNullable<SanityMediaField>[];

  if (validMedia.length === 0) return null;

  const openLightbox = (index: number) => {
    setActiveIndex(index);
  };

  const resolvedGridClass =
    layout === "masonry" ? masonryPreviewClass : (gridClass ?? masonryPreviewClass);
  const containerClass = className
    ? `clickable-photo-grid ${resolvedGridClass} ${className}`
    : `clickable-photo-grid ${resolvedGridClass}`;

  return (
    <>
      <div className={containerClass}>
        {validMedia.map((item, i) => {
          const alt = item?.alt ?? "";
          const isClickable = isSanityImage(item) || isSanityVideo(item);
          const label = isSanityVideo(item)
            ? alt
              ? `Play ${alt}`
              : `Play video ${i + 1}`
            : alt
              ? `View ${alt}`
              : `View photo ${i + 1}`;

          const tile = isClickable ? (
            <button
              type="button"
              onClick={() => openLightbox(i)}
              className={`group w-full text-left transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.006] active:translate-y-0 active:scale-[0.997] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 ${
                isSanityImage(item) ? "cursor-zoom-in" : "cursor-pointer"
              } [&_video]:pointer-events-none`}
              aria-label={label}
            >
              <SanityAspectMedia
                media={item}
                alt={alt}
                maxWidth={thumbMaxWidth}
                quality={quality}
                sizes={sizes}
              />
            </button>
          ) : (
            <div className="w-full text-left">
              <SanityAspectMedia
                media={item}
                alt={alt}
                maxWidth={thumbMaxWidth}
                quality={quality}
                sizes={sizes}
              />
            </div>
          );

          if (layout === "masonry") {
            return (
              <div key={sanityMediaKey(item, i)} className={masonryPreviewItemClass}>
                {tile}
              </div>
            );
          }

          return (
            <div key={sanityMediaKey(item, i)}>
              {tile}
            </div>
          );
        })}
      </div>

      {activeIndex !== null ? (
        <MediaLightbox
          items={validMedia}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onIndexChange={setActiveIndex}
        />
      ) : null}
    </>
  );
}

export function projectGalleryGridClass(columns: number): string {
  if (columns === 1) return "grid grid-cols-1 gap-3";
  if (columns === 2) return "grid grid-cols-2 gap-2 sm:gap-3";
  if (columns === 3) return "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3";
  return "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4";
}
