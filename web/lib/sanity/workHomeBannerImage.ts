import {urlForImage} from "@/lib/sanity/image";
import type {SanityImageField} from "@/lib/types/project";

/** Max width requested from Sanity CDN for the Work homepage banner (2× retina on wide screens). */
const BANNER_MAX_WIDTH = 4096;
const BANNER_MIN_WIDTH = 2800;
const BANNER_QUALITY = 95;

/** Pixel size after Sanity Studio crop (crop fractions on each edge). */
export function workHomeBannerCroppedDimensions(image: NonNullable<SanityImageField>) {
  const dims = image.asset?.metadata?.dimensions;
  const fullW = dims?.width ?? BANNER_MIN_WIDTH;
  const fullH = dims?.height ?? 500;
  const crop = image.crop;

  if (!crop) {
    return {width: fullW, height: fullH};
  }

  const left = crop.left ?? 0;
  const right = crop.right ?? 0;
  const top = crop.top ?? 0;
  const bottom = crop.bottom ?? 0;

  return {
    width: Math.max(1, Math.round(fullW * (1 - left - right))),
    height: Math.max(1, Math.round(fullH * (1 - top - bottom))),
  };
}

/** CDN request size from the main (frame) banner — keeps all layers the same pixel grid. */
export function workHomeBannerRequestSize(frame: NonNullable<SanityImageField>) {
  const {width: croppedW, height: croppedH} = workHomeBannerCroppedDimensions(frame);
  const requestW = Math.min(BANNER_MAX_WIDTH, Math.max(BANNER_MIN_WIDTH, Math.round(croppedW * 2)));
  const requestH = Math.max(1, Math.round(requestW * (croppedH / croppedW)));
  return {requestW, requestH};
}

/** Applies Studio crop + hotspot via Sanity CDN (`fit: crop`). */
export function workHomeBannerImageUrl(image: NonNullable<SanityImageField>) {
  const {requestW, requestH} = workHomeBannerRequestSize(image);

  return urlForImage(image)
    .width(requestW)
    .height(requestH)
    .fit("crop")
    .quality(BANNER_QUALITY)
    .auto("format")
    .url();
}

/**
 * Shadow / mask layer aligned to the main banner frame.
 * Uses the main image's crop + hotspot and request size so overlay pixels line up.
 */
export function workHomeBannerAlignedLayerUrl(
  layer: NonNullable<SanityImageField>,
  frame: NonNullable<SanityImageField>,
) {
  const {requestW, requestH} = workHomeBannerRequestSize(frame);
  const aligned: SanityImageField = {
    ...layer,
    crop: frame.crop ?? layer.crop,
    hotspot: frame.hotspot ?? layer.hotspot,
  };

  return urlForImage(aligned)
    .width(requestW)
    .height(requestH)
    .fit("crop")
    .quality(BANNER_QUALITY)
    .auto("format")
    .url();
}
