"use client";

import {useState} from "react";
import {PhotoLightbox} from "@/components/PhotoLightbox";
import {SanityAspectImage} from "@/components/sections/SanityAspectImage";
import {sanityImageAssetId} from "@/lib/sanity/image";
import type {SanityImageField} from "@/lib/types/project";

export function ClickablePhotoGrid({
  images,
  gridClass,
  thumbMaxWidth = 560,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",
  quality,
  className,
}: {
  images: SanityImageField[];
  gridClass: string;
  thumbMaxWidth?: number;
  sizes?: string;
  quality?: number;
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const validImages = images.filter((img) => img && sanityImageAssetId(img));

  if (validImages.length === 0) return null;

  return (
    <>
      <div className={className ? `${gridClass} ${className}` : gridClass}>
        {validImages.map((img, i) => {
          const alt = img?.alt ?? "";
          return (
            <button
              key={`${sanityImageAssetId(img)!}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              className="cursor-zoom-in text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
              aria-label={alt ? `View ${alt}` : `View photo ${i + 1}`}
            >
              <SanityAspectImage
                image={img!}
                alt={alt}
                maxWidth={thumbMaxWidth}
                quality={quality}
                sizes={sizes}
              />
            </button>
          );
        })}
      </div>

      {activeIndex !== null ? (
        <PhotoLightbox
          images={validImages}
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
