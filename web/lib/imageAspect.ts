import type {CSSProperties} from "react";
import {clampGridTileAspect} from "@/lib/gridAspectRatio";
import type {SanityImageField} from "@/lib/types/project";

/** Pixel size after Sanity Studio crop (fractions on each edge). */
export function sanityCroppedDimensions(
  image: SanityImageField | null | undefined,
): {width: number; height: number} | null {
  const d = image?.asset?.metadata?.dimensions;
  if (!d?.width || !d?.height || d.width <= 0 || d.height <= 0) return null;

  const crop = image?.crop;
  if (!crop) {
    return {width: d.width, height: d.height};
  }

  const left = crop.left ?? 0;
  const right = crop.right ?? 0;
  const top = crop.top ?? 0;
  const bottom = crop.bottom ?? 0;

  return {
    width: Math.max(1, Math.round(d.width * (1 - left - right))),
    height: Math.max(1, Math.round(d.height * (1 - top - bottom))),
  };
}

/** Layout box for `next/image` fill + `object-contain` (matches CDN crop output). */
export function aspectBoxStyle(image: SanityImageField | null | undefined): CSSProperties {
  const cropped = sanityCroppedDimensions(image);
  if (cropped) {
    return {aspectRatio: `${cropped.width} / ${cropped.height}`};
  }
  return {aspectRatio: "16 / 9"};
}

export function isPortraitDimensions(width: number, height: number): boolean {
  return height > width;
}

export function aspectRatioStyle(width: number, height: number): CSSProperties {
  if (width > 0 && height > 0) {
    return {aspectRatio: `${width} / ${height}`};
  }
  return {aspectRatio: "16 / 9"};
}

/**
 * Portrait media box — fills the column up to max height (no narrow 24rem cap).
 * Width is derived from max height so tall videos do not overflow the viewport.
 */
export function portraitMediaBoxStyle(width: number, height: number): CSSProperties {
  if (width <= 0 || height <= 0) {
    return {
      aspectRatio: "9 / 16",
      width: "min(100%, calc(min(80dvh, 52rem) * 9 / 16))",
      maxWidth: "100%",
    };
  }
  if (!isPortraitDimensions(width, height)) {
    return {width: "100%", ...aspectRatioStyle(width, height)};
  }
  return {
    aspectRatio: `${width} / ${height}`,
    width: `min(100%, calc(min(80dvh, 52rem) * ${width} / ${height}))`,
    maxWidth: "100%",
  };
}

/** 9:16 embeds (YouTube portrait / Shorts) before metadata is known. */
export function portraitEmbedBoxStyle(): CSSProperties {
  return portraitMediaBoxStyle(9, 16);
}

/** Natural-aspect grid tile — portrait capped at 3:4 (no 9:16 rows). */
export function gridNaturalTileBoxStyle(width: number, height: number): CSSProperties {
  if (width <= 0 || height <= 0) {
    return {aspectRatio: "16 / 9", width: "100%"};
  }
  const clamped = clampGridTileAspect(width, height);
  return {aspectRatio: `${clamped.width} / ${clamped.height}`, width: "100%"};
}

/**
 * Portrait media in grids — full cell width, crop with object-cover (no side letterboxing).
 */
export function portraitMediaCoverBoxStyle(width: number, height: number): CSSProperties {
  if (width <= 0 || height <= 0) {
    return {aspectRatio: "9 / 16", width: "100%"};
  }
  return {
    aspectRatio: `${width} / ${height}`,
    width: "100%",
  };
}
