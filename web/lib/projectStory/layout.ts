export type ProjectStoryMediaWidth = "narrow" | "medium" | "full" | "bleed";
export type ProjectStoryMediaAlign = "left" | "center" | "right";

export type ProjectStoryMobileCarousel = "carousel" | "stack";

export type ProjectStoryLayoutOptions = {
  mediaWidth?: ProjectStoryMediaWidth | null;
  mediaAlign?: ProjectStoryMediaAlign | null;
  mobileCarousel?: ProjectStoryMobileCarousel | null;
};

/** Story blocks: carousel on mobile when 2+ items unless editor chose stack. */
export function storyUsesMobileCarousel(
  mode: ProjectStoryMobileCarousel | null | undefined,
): boolean {
  return mode !== "stack";
}

const WIDTH_CLASS: Record<ProjectStoryMediaWidth, string> = {
  narrow: "max-w-[65ch]",
  medium: "max-w-3xl",
  full: "max-w-none w-full",
  bleed: "max-w-none w-full",
};

const ALIGN_CLASS: Record<ProjectStoryMediaAlign, string> = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

export function projectStoryLayoutClasses({
  mediaWidth,
  mediaAlign,
}: ProjectStoryLayoutOptions): {wrapper: string; bleed: boolean} {
  const width = mediaWidth ?? "full";
  const align = mediaAlign ?? "left";
  const bleed = width === "bleed";

  if (bleed) {
    return {wrapper: "project-story-layout-bleed w-full", bleed: true};
  }

  const parts = ["w-full", WIDTH_CLASS[width], ALIGN_CLASS[align]].filter(Boolean);
  return {wrapper: parts.join(" "), bleed: false};
}
