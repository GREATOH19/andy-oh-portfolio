import Image from "next/image";
import {aspectBoxStyle} from "@/lib/imageAspect";
import {sanityImageAssetId, urlForImage} from "@/lib/sanity/image";
import {sanityImageRequestWidth} from "@/lib/sanity/imageRequestWidth";
import type {SanityImageField} from "@/lib/types/project";

export function SanityAspectImage({
  image,
  alt,
  maxWidth,
  quality = 92,
  sizes,
  unoptimized = false,
}: {
  image: SanityImageField;
  alt: string;
  /** Estimated max display width in CSS pixels (CDN width is scaled for 2× DPR, capped at asset size). */
  maxWidth: number;
  quality?: number;
  sizes: string;
  /** Skip Next image optimizer — use when Sanity src is already sized for display (bleed). */
  unoptimized?: boolean;
}) {
  if (image == null || !sanityImageAssetId(image)) return null;
  const requestWidth = sanityImageRequestWidth(image, maxWidth);
  const src = urlForImage(image).width(requestWidth).quality(quality).url();

  return (
    <div
      className="media-thumb relative w-full overflow-hidden rounded-2xl bg-zinc-200 shadow-sm ring-1 ring-slate-200/60 transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.006] group-hover:shadow-lg active:translate-y-0 active:scale-[0.997]"
      style={aspectBoxStyle(image)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes={sizes}
        quality={quality}
        unoptimized={unoptimized}
      />
    </div>
  );
}
