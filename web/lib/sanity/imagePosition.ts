type SanityHotspot = {
  x?: number | null;
  y?: number | null;
};

import type {BannerFocus} from "@/lib/types/project";

export type {BannerFocus};

type ImageWithHotspot = {
  hotspot?: SanityHotspot | null;
} | null;

/** Maps Sanity image hotspot (set in Studio when publishing) to CSS object-position. */
export function sanityImageObjectPosition(
  image?: ImageWithHotspot,
  focus: BannerFocus = "auto",
): string {
  const hotspot = image?.hotspot;
  if (focus === "auto" && hotspot && typeof hotspot.x === "number" && typeof hotspot.y === "number") {
    return `${(hotspot.x * 100).toFixed(2)}% ${(hotspot.y * 100).toFixed(2)}%`;
  }

  switch (focus) {
    case "top":
      return "center top";
    case "center":
      return "center center";
    case "lower":
      return "center 62%";
    case "auto":
    default:
      /* Slightly below center — keeps top of wide banner marks visible in cover crop */
      return "center 42%";
  }
}
