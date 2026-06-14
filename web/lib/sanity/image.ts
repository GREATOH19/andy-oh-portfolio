import {createImageUrlBuilder} from "@sanity/image-url";
import {sanityImageRequestWidth} from "@/lib/sanity/imageRequestWidth";
import type {SanityImageField} from "@/lib/types/project";
import {client} from "./client";

const builder = createImageUrlBuilder(client);

export function urlForImage(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

/** Shallow image fields use `asset._ref`; GROQ `asset->` documents usually only have `_id`. */
export function sanityImageAssetId(
  source: {asset?: {_ref?: string | null; _id?: string | null} | null} | null | undefined,
): string | null {
  const id = source?.asset?._ref ?? source?.asset?._id;
  return typeof id === "string" && id.length > 0 ? id : null;
}

/**
 * Sized Sanity CDN URL — use with `next/image` `unoptimized` (Sanity already resizes/formats).
 * Avoids `/_next/image` re-processing large sources, which fails intermittently in production.
 */
export function buildSanityImageSrc(
  image: SanityImageField | null | undefined,
  options: {displayWidth: number; quality?: number},
): string | null {
  if (!image || !sanityImageAssetId(image)) return null;
  const width = sanityImageRequestWidth(image, options.displayWidth);
  return urlForImage(image).width(width).quality(options.quality ?? 92).auto("format").url();
}
