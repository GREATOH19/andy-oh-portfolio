import type {ProjectStoryMediaWidth, SanityImageField} from "@/lib/types/project";

const MAX_SANITY_WIDTH = 4096;

/**
 * Pick a Sanity CDN width that matches layout size at 2× DPR without exceeding the asset.
 */
export function sanityImageRequestWidth(
  image: SanityImageField | null | undefined,
  displayWidth: number,
  devicePixelRatio = 2,
): number {
  const native = image?.asset?.metadata?.dimensions?.width;
  const requested = Math.ceil(displayWidth * devicePixelRatio);
  let width = Math.min(Math.max(requested, 1), MAX_SANITY_WIDTH);
  if (native && native > 0) {
    width = Math.min(width, native);
  }
  return width;
}

/** Story column (non-bleed) — capped to layout width, not viewport */
export const FULL_WIDTH_MEDIA_DISPLAY_PX = 1920;

export const FULL_WIDTH_MEDIA_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1920px) min(100vw - 9rem, 1680px), 1680px";

/** Edge-to-edge bleed — must match rendered width (was capped at 1320px via sizes) */
export const BLEED_MEDIA_DISPLAY_PX = 2560;

export const BLEED_MEDIA_SIZES = "100vw";

export type StoryImageSizing = {
  displayPx: number;
  sizes: string;
  quality: number;
};

export function storyImageSizing(
  mediaWidth?: ProjectStoryMediaWidth | null,
): StoryImageSizing {
  if (mediaWidth === "bleed") {
    return {
      displayPx: BLEED_MEDIA_DISPLAY_PX,
      sizes: BLEED_MEDIA_SIZES,
      quality: 96,
    };
  }

  if (mediaWidth === "narrow") {
    return {
      displayPx: 720,
      sizes: "(max-width: 768px) 100vw, 65ch",
      quality: 90,
    };
  }

  if (mediaWidth === "medium") {
    return {
      displayPx: 960,
      sizes: "(max-width: 768px) 100vw, min(48rem, 90vw)",
      quality: 92,
    };
  }

  return {
    displayPx: FULL_WIDTH_MEDIA_DISPLAY_PX,
    sizes: FULL_WIDTH_MEDIA_SIZES,
    quality: 95,
  };
}
