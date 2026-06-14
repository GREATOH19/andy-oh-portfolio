import type {ProjectStoryMediaAlign, ProjectStoryMediaWidth} from "@/lib/types/project";

export function gallerySupportsSideText(
  mediaWidth?: ProjectStoryMediaWidth | null,
): boolean {
  const width = mediaWidth ?? "full";
  return width === "narrow" || width === "medium";
}

/** Text column is left when true (gallery on the right). */
export function galleryTextIsLeft(
  layout: "auto" | "textLeft" | "textRight" | null | undefined,
  mediaAlign?: ProjectStoryMediaAlign | null,
): boolean {
  if (layout === "textLeft") return true;
  if (layout === "textRight") return false;
  const align = mediaAlign ?? "left";
  if (align === "right") return true;
  return false;
}

/** Side-by-side gallery column — avoid w-full in auto grid tracks (collapses to 0). */
export function galleryColumnWidthClass(
  mediaWidth?: ProjectStoryMediaWidth | null,
): string {
  if (mediaWidth === "narrow") return "w-full md:w-[65ch] md:max-w-[65ch] md:shrink-0";
  if (mediaWidth === "medium") return "w-full md:w-[48rem] md:max-w-3xl md:shrink-0";
  return "w-full";
}

/** Keep mobile stack order; desktop placement uses flex-row / flex-row-reverse. */
export function mobileOnlyStackOrderClass(className: string): string {
  return className
    .split(/\s+/)
    .filter((part) => part.length > 0 && !part.startsWith("md:"))
    .join(" ");
}
