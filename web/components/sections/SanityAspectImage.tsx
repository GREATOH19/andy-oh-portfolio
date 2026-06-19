"use client";

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
import {imageThumbFrameClass, sanityImageHasTransparency} from "@/lib/sanity/imageThumb";
import {gridCropObjectPosition} from "@/lib/sanity/imagePosition";
import {trimBoxStyle, trimImageStyle} from "@/lib/sanity/transparentImageTrim";
import {useTransparentImageTrim} from "@/lib/sanity/useTransparentImageTrim";
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
  maxWidth: number;
  quality?: number;
  sizes: string;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
  gridRowAspect?: MediaAspect | null;
  fillFrame?: boolean;
}) {
  const src =
    image != null && sanityImageAssetId(image)
      ? buildSanityImageSrc(image, {displayWidth: maxWidth, quality})
      : null;

  const aspect = normalizeGridAspectRatio(gridAspectRatio);
  const uniformCrop = gridUsesUniformCrop(aspect);
  const canAutoTrim =
    image != null &&
    sanityImageHasTransparency(image) &&
    !fillFrame &&
    !uniformCrop &&
    !gridRowAspect &&
    aspect === "auto";
  const trimSrc =
    canAutoTrim && image != null
      ? buildSanityImageSrc(image, {displayWidth: Math.min(640, maxWidth), quality: 80})
      : null;
  const trim = useTransparentImageTrim(trimSrc, canAutoTrim && trimSrc != null);

  if (image == null || !src) return null;

  const fixedBox = gridAspectRatioBoxStyle(aspect);
  const rowBox =
    !uniformCrop && gridRowAspect
      ? gridNaturalTileBoxStyle(gridRowAspect.width, gridRowAspect.height)
      : null;
  const naturalBox = fixedBox ?? rowBox ?? aspectBoxStyle(image);
  const useCover = fillFrame || uniformCrop || gridRowAspect != null;
  const objectFit = useCover ? "object-cover" : "object-contain";
  const objectPosition = useCover
    ? gridCropObjectPosition(image, cropFocus ?? "auto")
    : undefined;
  const frameClass = imageThumbFrameClass(image, fillFrame);

  const boxStyle = fillFrame
    ? {width: "100%", height: "100%"}
    : trim
      ? trimBoxStyle(trim)
      : naturalBox;

  const thumbClass = `media-thumb relative w-full overflow-hidden transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.006] active:translate-y-0 active:scale-[0.997] ${frameClass}`;

  if (trim) {
    return (
      <div className={thumbClass} style={boxStyle}>
        <Image
          src={src}
          alt={alt}
          width={trim.naturalWidth}
          height={trim.naturalHeight}
          className="absolute max-w-none"
          style={trimImageStyle(trim)}
          sizes={sizes}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className={thumbClass} style={boxStyle}>
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
