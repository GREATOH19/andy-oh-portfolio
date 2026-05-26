"use client";

import {useState} from "react";
import {MediaLightbox} from "@/components/MediaLightbox";
import {SanityAspectMedia} from "@/components/sections/SanityAspectMedia";
import {isSanityImage, isSanityMedia, isSanityVideo, sanityMediaKey} from "@/lib/sanity/media";
import type {SanityMediaField} from "@/lib/types/project";

export function ClickablePhotoGrid({
  images,
  gridClass,
  thumbMaxWidth = 560,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",
  quality,
  className,
}: {
  images: SanityMediaField[];
  gridClass: string;
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

  return (
    <>
      <div className={className ? `${gridClass} ${className}` : gridClass}>
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

          if (isClickable) {
            return (
              <button
                key={sanityMediaKey(item, i)}
                type="button"
                onClick={() => openLightbox(i)}
                className={`text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 ${
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
            );
          }

          return (
            <div key={sanityMediaKey(item, i)} className="text-left">
              <SanityAspectMedia
                media={item}
                alt={alt}
                maxWidth={thumbMaxWidth}
                quality={quality}
                sizes={sizes}
              />
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
