/**
 * Story layout grammar — values flow into PROJECT_STORY_SPACING_CSS (ProjectStory).
 *
 * - chapter gap: between chapter units (projectChapter + its following blocks)
 * - between-chapters gap: media/quote/zigzag/etc. after a chapter until the next projectChapter
 * - within-chapter gap: title/body portable text inside a chapter head
 * - zigzag gap: text ↔ media inside a row (stacked on mobile, columns on desktop)
 * - zigzag block gap: one zigzag row ↔ the next
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

/** Zigzag text ↔ media (grid row/column gap; mobile stacks like chapter body → media). */
export const STORY_ZIGZAG_GAP_REM = {
  mobile: "1rem",
  desktop: "0.75rem",
} as const;

/** Zigzag row ↔ zigzag row (between-chapters flex gap + margin compensation). */
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

/** Zigzag row — vertically center short text against media (≥48rem, tablet & desktop). */
export const STORY_ZIGZAG_CENTER_TEXT_CLASS = "story-spacing-zigzag--center-text";

/** Zigzag text-column body image grid — bottom-aligned with the main media column (≥48rem). */
export const STORY_ZIGZAG_BODY_IMAGES_END_CLASS = "story-spacing-zigzag--body-images-end";
/** Second grid row for media caption (only when caption + body-images-end). */
export const STORY_ZIGZAG_BODY_IMAGES_CAPTION_ROW_CLASS =
  "story-spacing-zigzag--body-images-caption-row";
export const STORY_ZIGZAG_TEXT_COL_CLASS = "story-spacing-zigzag-text-col";
export const STORY_ZIGZAG_BODY_IMAGES_CLASS = "story-spacing-zigzag-body-images";
export const STORY_ZIGZAG_TEXT_BODY_CLASS = "story-spacing-zigzag-text-body";
export const STORY_ZIGZAG_MEDIA_MAIN_CLASS = "story-spacing-zigzag-media-main";
export const STORY_ZIGZAG_MEDIA_CAPTION_CLASS = "story-spacing-zigzag-media-caption";
