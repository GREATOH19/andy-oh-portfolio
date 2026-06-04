/**
 * Story layout grammar — must match `--story-*-gap` on `.project-story` in globals.css.
 *
 * - chapter gap: between chapter units (projectChapter + its following blocks)
 * - between-chapters gap: media/quote/zigzag/etc. after a chapter until the next projectChapter
 * - within-chapter gap: title/body portable text inside a chapter head
 */
export const STORY_CHAPTER_GAP_REM = {
  mobile: "1.6rem",
  desktop: "2.3rem",
} as const;

/** Blocks between chapter markers (not inside the chapter title/body). */
/** Between-chapter components + chapter body → blocks below. */
export const STORY_BETWEEN_CHAPTERS_GAP_REM = {
  mobile: "0.4rem",
  desktop: "1.75rem",
} as const;

/** Multi-image grid inside story media/gallery. */
export const STORY_MEDIA_ITEMS_GAP_REM = {
  mobile: "0.4rem",
  desktop: "0.4rem",
} as const;

/** Zigzag internal text ↔ media (grid gap). */
export const STORY_ZIGZAG_GAP_REM = {
  mobile: "0.4rem",
  desktop: "0.75rem",
} as const;

/** Zigzag block ↔ zigzag block (mobile). */
export const STORY_ZIGZAG_BLOCK_GAP_REM = {
  mobile: "1rem",
  desktop: "0.4rem",
} as const;

/** Chapter body ↔ media on mobile (reorder + head→between padding). */
export const STORY_CHAPTER_BODY_MEDIA_GAP_REM = {
  mobile: "1rem",
  desktop: "0.4rem",
} as const;

export const STORY_CHAPTER_UNIT_MOBILE_REORDER_CLASS =
  "project-story-chapter-unit--mobile-block-reorder";

/** Chapter title → body and chapter-head flex gap. */
export const STORY_WITHIN_CHAPTER_GAP_REM = {
  mobile: "1.75rem",
  desktop: "1.75rem",
} as const;

/** Portable text blocks (p, h2, lists, etc.) inside .project-story-prose-stack. */
export const STORY_PROSE_GAP_REM = {
  mobile: "1rem",
  desktop: "1.75rem",
} as const;

export const STORY_CHAPTER_GAP_BREAKPOINT = "48rem";

export const STORY_CHAPTER_GAP_ATTR = "data-story-chapter-gap";

/** Applied with chapter gap (CSS + optional inline marginTop). */
export const STORY_CHAPTER_GAP_CLASS = "project-story-chapter-gap-active";

export const STORY_CHAPTER_UNIT_CLASS = "project-story-chapter-unit";
