import type {GridCropFocus} from "@/lib/gridAspectRatio";
import type {BannerFocus} from "@/lib/types/project";

export type {BannerFocus};

type SanityHotspot = {
  x?: number | null;
  y?: number | null;
};

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

/** Focal point for uniform grid crops — per-image hotspot wins when focus is auto. */
export function gridCropObjectPosition(
  image?: ImageWithHotspot,
  focus: GridCropFocus = "auto",
): string {
  if (focus === "auto") {
    return sanityImageObjectPosition(image, "auto");
  }

  switch (focus) {
    case "center":
      return "center center";
    case "top":
      return "center top";
    case "bottom":
      return "center bottom";
    case "left":
      return "left center";
    case "right":
      return "right center";
    default:
      return "center center";
  }
}
