import {urlForImage} from "@/lib/sanity/image";
import type {SanityImageField} from "@/lib/types/project";

/** Max width requested from Sanity CDN for the Work homepage banner (2× retina on wide screens). */
const BANNER_MAX_WIDTH = 4096;
const BANNER_MIN_WIDTH = 2800;
const BANNER_QUALITY = 95;

export function workHomeBannerImageUrl(image: NonNullable<SanityImageField>) {
  const intrinsicW = image.asset?.metadata?.dimensions?.width ?? BANNER_MIN_WIDTH;
  const requestW = Math.min(BANNER_MAX_WIDTH, Math.max(BANNER_MIN_WIDTH, Math.round(intrinsicW * 2)));

  return urlForImage(image).width(requestW).quality(BANNER_QUALITY).fit("max").auto("format").url();
}
