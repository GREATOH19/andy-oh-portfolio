"use client";

import {useState} from "react";
import {PhotoLightbox} from "@/components/PhotoLightbox";
import {SanityAspectMedia} from "@/components/sections/SanityAspectMedia";
import {isSanityImage, isSanityMedia, sanityMediaKey} from "@/lib/sanity/media";
import type {SanityImageField, SanityMediaField} from "@/lib/types/project";

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
  const validMedia = images.filter(isSanityMedia);
  const lightboxImages = validMedia.filter(isSanityImage) as NonNullable<SanityImageField>[];

  if (validMedia.length === 0) return null;

  const openLightbox = (index: number) => {
    const item = validMedia[index];
    if (!isSanityImage(item)) return;
    const lightboxIndex = lightboxImages.indexOf(item);
    if (lightboxIndex >= 0) setActiveIndex(lightboxIndex);
  };

  return (
    <>
      <div className={className ? `${gridClass} ${className}` : gridClass}>
        {validMedia.map((item, i) => {
          const alt = item?.alt ?? "";
          const isImage = isSanityImage(item);

          if (isImage) {
            return (
              <button
                key={sanityMediaKey(item, i)}
                type="button"
                onClick={() => openLightbox(i)}
                className="cursor-zoom-in text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
                aria-label={alt ? `View ${alt}` : `View photo ${i + 1}`}
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
        <PhotoLightbox
          images={lightboxImages}
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
