import type {CSSProperties} from "react";

/** Desktop / tablet column cap for image grids (story + legacy sections). */
export const GALLERY_MAX_COLUMNS = 8;

export const GALLERY_COLS_VAR = "--gallery-cols";
/** Applied on mobile only — overrides Tailwind column classes below md. */
export const GALLERY_MOBILE_COLS_CLASS = "gallery-grid--mobile-cols";
/** When CMS columns > 4 — Tailwind caps at md:grid-cols-4 on desktop. */
export const GALLERY_DESKTOP_OVERFLOW_CLASS = "gallery-grid--desktop-overflow-cols";

export function normalizeGalleryColumns(columns?: number | null, fallback = 2): number {
  if (columns == null || !Number.isFinite(columns)) return fallback;
  return Math.min(Math.max(Math.round(columns), 1), GALLERY_MAX_COLUMNS);
}

/** Inline style for mobile CMS column override (ignored on desktop). */
export function galleryGridMobileStyle(columns: number): CSSProperties {
  const cols = normalizeGalleryColumns(columns);
  return {[GALLERY_COLS_VAR]: cols} as CSSProperties;
}

/** `sizes` hint for Next/Image in a CMS column grid. */
export function galleryGridThumbSizes(columns: number): string {
  const cols = normalizeGalleryColumns(columns);
  const mobilePct = Math.round(100 / cols);
  return `(max-width: 640px) ${mobilePct}vw, (max-width: 1024px) 33vw, 25vw`;
}

/**
 * Story image grid — desktop/tablet uses Tailwind breakpoints (unchanged web layout).
 * Mobile column count comes from CMS via gallery-grid--mobile-cols + --gallery-cols.
 */
export function projectStoryGalleryGridClass(columns: number): string {
  const cols = normalizeGalleryColumns(columns);
  if (cols === 1) return "grid grid-cols-1 items-start";
  if (cols === 2) return `grid grid-cols-2 items-stretch ${GALLERY_MOBILE_COLS_CLASS}`;
  if (cols === 3) return `grid grid-cols-2 sm:grid-cols-3 items-stretch ${GALLERY_MOBILE_COLS_CLASS}`;
  if (cols === 4) {
    return `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 items-stretch ${GALLERY_MOBILE_COLS_CLASS}`;
  }
  return `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 items-stretch ${GALLERY_MOBILE_COLS_CLASS} ${GALLERY_DESKTOP_OVERFLOW_CLASS}`;
}

export function projectGalleryGridClass(columns: number): string {
  const cols = normalizeGalleryColumns(columns);
  if (cols === 1) return "grid grid-cols-1 gap-3 items-start";
  if (cols === 2) return `grid grid-cols-2 gap-2 sm:gap-3 items-stretch ${GALLERY_MOBILE_COLS_CLASS}`;
  if (cols === 3) {
    return `grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 items-stretch ${GALLERY_MOBILE_COLS_CLASS}`;
  }
  if (cols === 4) {
    return `grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 items-stretch ${GALLERY_MOBILE_COLS_CLASS}`;
  }
  return `grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 items-stretch ${GALLERY_MOBILE_COLS_CLASS} ${GALLERY_DESKTOP_OVERFLOW_CLASS}`;
}

/** Desktop fallback when CMS columns > 4 (Tailwind caps at 4). */
export function galleryGridDesktopOverflowStyle(columns: number): CSSProperties | undefined {
  const cols = normalizeGalleryColumns(columns);
  if (cols <= 4) return undefined;
  return {[GALLERY_COLS_VAR]: cols} as CSSProperties;
}

/**
 * Visible column count at a viewport width — mirrors `projectStoryGalleryGridClass` breakpoints.
 */
export function resolveGalleryBreakpointColumns(columns: number, width: number): number {
  const cols = normalizeGalleryColumns(columns);
  if (cols === 1) return 1;
  if (width < 640) return 2;
  if (cols === 2) return 2;
  if (width < 768) return Math.min(cols, 3);
  return cols;
}
