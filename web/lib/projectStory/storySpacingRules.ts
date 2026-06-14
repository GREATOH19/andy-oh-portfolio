import {
  STORY_BETWEEN_CHAPTERS_GAP_REM,
  STORY_CHAPTER_BODY_MEDIA_GAP_REM,
  STORY_CHAPTER_GAP_BREAKPOINT,
  STORY_CHAPTER_GAP_REM,
  STORY_MEDIA_ITEMS_GAP_REM,
  STORY_PROSE_GAP_REM,
  STORY_WITHIN_CHAPTER_GAP_REM,
  STORY_ZIGZAG_BLOCK_GAP_REM,
  STORY_ZIGZAG_BODY_IMAGES_CLASS,
  STORY_ZIGZAG_BODY_IMAGES_CAPTION_ROW_CLASS,
  STORY_ZIGZAG_BODY_IMAGES_END_CLASS,
  STORY_ZIGZAG_CENTER_TEXT_CLASS,
  STORY_ZIGZAG_GAP_REM,
  STORY_ZIGZAG_MEDIA_CAPTION_CLASS,
  STORY_ZIGZAG_MEDIA_MAIN_CLASS,
  STORY_ZIGZAG_TEXT_BODY_CLASS,
  STORY_ZIGZAG_TEXT_COL_CLASS,
} from "./storySpacingGrammar";

const BP = STORY_CHAPTER_GAP_BREAKPOINT;
const M = STORY_BETWEEN_CHAPTERS_GAP_REM.mobile;
const D = STORY_BETWEEN_CHAPTERS_GAP_REM.desktop;

/**
 * Injected on ProjectStory — single source for story spacing variables and zigzag rhythm.
 * Chapter-unit margin rules stay in project-story-grammar.css.
 */
export const PROJECT_STORY_SPACING_CSS = `
.project-story {
  --story-between-chapters-gap: ${M};
  --story-within-chapter-gap: ${STORY_WITHIN_CHAPTER_GAP_REM.mobile};
  --story-prose-gap: ${STORY_PROSE_GAP_REM.mobile};
  --story-chapter-gap: ${STORY_CHAPTER_GAP_REM.mobile};
  --story-media-items-gap: ${STORY_MEDIA_ITEMS_GAP_REM.mobile};
  --story-zigzag-gap: ${STORY_ZIGZAG_GAP_REM.mobile};
  --story-zigzag-block-gap: ${STORY_ZIGZAG_BLOCK_GAP_REM.mobile};
  --story-chapter-body-media-gap: ${STORY_CHAPTER_BODY_MEDIA_GAP_REM.mobile};
}

@media (min-width: ${BP}) {
  .project-story {
    --story-chapter-gap: ${STORY_CHAPTER_GAP_REM.desktop};
    --story-between-chapters-gap: ${D};
    --story-prose-gap: ${STORY_PROSE_GAP_REM.desktop};
    --story-zigzag-gap: ${STORY_ZIGZAG_GAP_REM.desktop};
    --story-zigzag-block-gap: ${STORY_ZIGZAG_BLOCK_GAP_REM.desktop};
    --story-chapter-body-media-gap: ${STORY_CHAPTER_BODY_MEDIA_GAP_REM.desktop};
  }

  .story-spacing-zigzag.${STORY_ZIGZAG_CENTER_TEXT_CLASS}:not(.${STORY_ZIGZAG_BODY_IMAGES_END_CLASS}) {
    align-items: center;
  }

  .story-spacing-zigzag.${STORY_ZIGZAG_BODY_IMAGES_END_CLASS} {
    align-items: stretch;
  }

  .story-spacing-zigzag.${STORY_ZIGZAG_BODY_IMAGES_END_CLASS}.${STORY_ZIGZAG_BODY_IMAGES_CAPTION_ROW_CLASS} {
    grid-template-rows: auto auto;
  }

  .story-spacing-zigzag.${STORY_ZIGZAG_BODY_IMAGES_END_CLASS}.${STORY_ZIGZAG_BODY_IMAGES_CAPTION_ROW_CLASS}
    > .${STORY_ZIGZAG_MEDIA_CAPTION_CLASS} {
    margin-top: var(--story-prose-gap);
  }

  .story-spacing-zigzag.${STORY_ZIGZAG_BODY_IMAGES_END_CLASS} > .${STORY_ZIGZAG_TEXT_COL_CLASS} {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .story-spacing-zigzag.${STORY_ZIGZAG_BODY_IMAGES_END_CLASS} .${STORY_ZIGZAG_BODY_IMAGES_CLASS} {
    margin-top: auto;
  }

  .story-spacing-zigzag.${STORY_ZIGZAG_BODY_IMAGES_END_CLASS}.${STORY_ZIGZAG_CENTER_TEXT_CLASS}
    .${STORY_ZIGZAG_TEXT_BODY_CLASS} {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 0;
  }
}

.project-story-between-chapters {
  display: flex;
  flex-direction: column;
  gap: var(--story-between-chapters-gap);
}

.project-story-chapter-head + .project-story-between-chapters {
  margin-top: 0;
  padding-top: var(--story-between-chapters-gap);
}

.project-story-between-chapters > * {
  margin-top: 0 !important;
}

.story-spacing-between-chapters {
  margin-top: var(--story-between-chapters-gap);
}

.story-spacing-zigzag {
  column-gap: var(--story-zigzag-gap);
  row-gap: var(--story-zigzag-gap);
}

.${STORY_ZIGZAG_BODY_IMAGES_CLASS} {
  margin-top: var(--story-prose-gap);
}

/* Zigzag ↔ zigzag: flex gap + compensating margin = --story-zigzag-block-gap */
.project-story-between-chapters > .story-spacing-zigzag + .story-spacing-zigzag,
.project-story > .story-spacing-zigzag + .story-spacing-zigzag {
  margin-top: calc(
    var(--story-zigzag-block-gap) - var(--story-between-chapters-gap)
  ) !important;
}

@media (max-width: calc(${BP} - 0.001rem)) {
  .project-story-chapter-head:has(.project-story-prose) + .project-story-between-chapters {
    padding-top: var(--story-chapter-body-media-gap) !important;
  }

  .project-story-between-chapters
    > *:has(.project-story-prose):not(.story-spacing-zigzag)
    + * {
    margin-top: calc(
      var(--story-chapter-body-media-gap) - var(--story-between-chapters-gap)
    ) !important;
  }

  .project-story-between-chapters--media-first > *,
  .project-story-between-chapters--text-first > * {
    margin-top: 0 !important;
  }

  .project-story-between-chapters--media-first
    > *:has(.project-story-prose):not(.story-spacing-zigzag)
    + *,
  .project-story-between-chapters--text-first
    > *:has(.project-story-prose):not(.story-spacing-zigzag)
    + * {
    margin-top: calc(
      var(--story-chapter-body-media-gap) - var(--story-between-chapters-gap)
    ) !important;
  }

  .project-story-between-chapters--media-first > .story-spacing-zigzag + .story-spacing-zigzag,
  .project-story-between-chapters--text-first > .story-spacing-zigzag + .story-spacing-zigzag {
    margin-top: calc(
      var(--story-zigzag-block-gap) - var(--story-between-chapters-gap)
    ) !important;
  }

  html body .project-story .project-story-chapter-unit--mobile-block-reorder {
    display: flex !important;
    flex-direction: column !important;
    row-gap: var(--story-chapter-body-media-gap) !important;
  }

  .project-story-chapter-unit--mobile-block-reorder
    .project-story-chapter-head
    + .project-story-between-chapters {
    padding-top: 0 !important;
  }
}

html body .project-story .project-story-between-chapters {
  gap: var(--story-between-chapters-gap) !important;
  margin-top: 0 !important;
}

html body .project-story .story-spacing-zigzag {
  column-gap: var(--story-zigzag-gap) !important;
  row-gap: var(--story-zigzag-gap) !important;
}
`.trim();
