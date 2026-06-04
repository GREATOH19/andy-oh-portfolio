import type {CSSProperties} from "react";
import {cmsFontClass} from "@/lib/cmsFontClass";

export type ProjectBodyTypography = {
  bodyFont?: string | null;
  bodyFontSize?: number | null;
};

/** Story body on mobile — keep in sync with globals.css */
export const STORY_BODY_SIZE_MOBILE = "1.02rem";
/** Story body on web (≥48rem) — keep in sync with globals.css */
export const STORY_BODY_SIZE_DESKTOP = "17px";

/** Plain CSS class (globals.css) — block-level --story-body-font-size on .project-story-prose */
export const STORY_BODY_TEXT_CLASS = "story-body-text";

export function projectBodyProseFontClass(typo?: ProjectBodyTypography | null): string {
  return cmsFontClass(typo?.bodyFont);
}

export function projectBodyProseStyle(
  typo?: ProjectBodyTypography | null,
): CSSProperties | undefined {
  const px = typo?.bodyFontSize;
  if (px == null || !Number.isFinite(px) || px <= 0) return undefined;
  return {"--story-body-font-size": `${px}px`} as CSSProperties;
}

export function projectBodyProseHasCustomSize(typo?: ProjectBodyTypography | null): boolean {
  const px = typo?.bodyFontSize;
  return px != null && Number.isFinite(px) && px > 0;
}
