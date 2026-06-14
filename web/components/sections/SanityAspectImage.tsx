import Image from "next/image";
import {aspectBoxStyle, gridNaturalTileBoxStyle} from "@/lib/imageAspect";
import {
  type GridAspectRatio,
  type GridCropFocus,
  gridAspectRatioBoxStyle,
  gridUsesUniformCrop,
  normalizeGridAspectRatio,
} from "@/lib/gridAspectRatio";
import type {MediaAspect} from "@/lib/gridRowAspect";
import {buildSanityImageSrc, sanityImageAssetId} from "@/lib/sanity/image";
import {gridCropObjectPosition} from "@/lib/sanity/imagePosition";
import type {SanityImageField} from "@/lib/types/project";

export function SanityAspectImage({
  image,
  alt,
  maxWidth,
  quality = 92,
  sizes,
  gridAspectRatio = "auto",
  cropFocus = "auto",
  gridRowAspect,
  fillFrame = false,
}: {
  image: SanityImageField;
  alt: string;
  /** Estimated max display width in CSS pixels (CDN width is scaled for 2× DPR, capped at asset size). */
  maxWidth: number;
  quality?: number;
  sizes: string;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
  /** Shared row tile aspect for multi-column grids. */
  gridRowAspect?: MediaAspect | null;
  fillFrame?: boolean;
}) {
  if (image == null || !sanityImageAssetId(image)) return null;
  const src = buildSanityImageSrc(image, {displayWidth: maxWidth, quality});
  if (!src) return null;

  const aspect = normalizeGridAspectRatio(gridAspectRatio);
  const uniformCrop = gridUsesUniformCrop(aspect);
  const fixedBox = gridAspectRatioBoxStyle(aspect);
  const rowBox = gridRowAspect
    ? gridNaturalTileBoxStyle(gridRowAspect.width, gridRowAspect.height)
    : null;
  const boxStyle = fillFrame
    ? {width: "100%", height: "100%"}
    : fixedBox ?? rowBox ?? aspectBoxStyle(image);
  const useCover = fillFrame || uniformCrop || gridRowAspect != null;
  const objectFit = useCover ? "object-cover" : "object-contain";
  const objectPosition = useCover
    ? gridCropObjectPosition(image, cropFocus ?? "auto")
    : undefined;

  return (
    <div
      className={`media-thumb relative w-full overflow-hidden bg-zinc-200 shadow-sm ring-1 ring-slate-200/60 transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.006] group-hover:shadow-lg active:translate-y-0 active:scale-[0.997] ${fillFrame ? "h-full rounded-none shadow-none ring-0" : "rounded-2xl"}`}
      style={boxStyle}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={objectFit}
        style={objectPosition ? {objectPosition} : undefined}
        sizes={sizes}
        unoptimized
      />
    </div>
  );
}
