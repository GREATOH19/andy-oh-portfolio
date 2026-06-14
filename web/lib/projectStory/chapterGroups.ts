import {zigzagRowMedia} from "@/lib/sanity/zigzagRowMedia";
import {portableTextHasVisibleContent} from "@/lib/portableText/filterEmptyBlocks";
import type {
  ProjectChapterMobileBlockOrder,
  ProjectStoryBlock,
  ProjectZigzagMobileStackOrder,
} from "@/lib/types/project";

/** Story is sliced into chapter heads, filler blocks between chapter markers, and pre-chapter solos. */
export type StorySegment =
  | {kind: "solo"; index: number}
  | {
      kind: "chapterHead";
      index: number;
      mobileBlockOrder: ProjectChapterMobileBlockOrder;
    }
  | {
      kind: "betweenChapters";
      start: number;
      end: number;
      mobileBlockOrder: ProjectChapterMobileBlockOrder;
    };

/** One CMS chapter = head block + following blocks until the next projectChapter. */
export type ChapterUnit = {
  head: Extract<StorySegment, {kind: "chapterHead"}>;
  between: Extract<StorySegment, {kind: "betweenChapters"}> | null;
};

export type StoryRenderUnit =
  | {kind: "solo"; index: number}
  | {kind: "chapterUnit"; unit: ChapterUnit};

function isStoryMediaBlock(block: ProjectStoryBlock): boolean {
  if (
    block._type === "projectMedia" ||
    block._type === "projectGallery" ||
    block._type === "projectCollage" ||
    block._type === "projectProcess" ||
    block._type === "projectYoutube"
  ) {
    return true;
  }
  if (block._type === "projectZigzagRow") return zigzagRowMedia(block).length > 0;
  return false;
}

function isStoryTextBlock(block: ProjectStoryBlock): boolean {
  if (block._type === "projectQuote" || block._type === "projectColumns") return true;
  if (block._type === "projectGallery") {
    return portableTextHasVisibleContent(block.body);
  }
  if (block._type === "projectChapter" || block._type === "projectTextBox") {
    return portableTextHasVisibleContent(block.body);
  }
  if (block._type === "projectZigzagRow") {
    return Boolean(block.body?.length) || Boolean(block.bodyImages?.length);
  }
  return false;
}

function chapterMobileBlockOrder(
  blocks: ProjectStoryBlock[],
  start: number,
): ProjectChapterMobileBlockOrder {
  const chapter = blocks[start];
  if (chapter._type !== "projectChapter") return "default";
  const order = chapter.mobileBlockOrder;
  if (order === "mediaFirst" || order === "textFirst") return order;
  return "default";
}

export function buildStorySegments(blocks: ProjectStoryBlock[]): StorySegment[] {
  const segments: StorySegment[] = [];
  let i = 0;

  while (i < blocks.length) {
    if (blocks[i]._type === "projectChapter") {
      const mobileBlockOrder = chapterMobileBlockOrder(blocks, i);
      segments.push({kind: "chapterHead", index: i, mobileBlockOrder});

      let end = i + 1;
      while (end < blocks.length && blocks[end]._type !== "projectChapter") {
        end += 1;
      }
      if (end > i + 1) {
        segments.push({kind: "betweenChapters", start: i + 1, end, mobileBlockOrder});
      }
      i = end;
    } else {
      segments.push({kind: "solo", index: i});
      i += 1;
    }
  }

  return segments;
}

export function buildStoryRenderUnits(segments: StorySegment[]): StoryRenderUnit[] {
  const units: StoryRenderUnit[] = [];
  let i = 0;

  while (i < segments.length) {
    const segment = segments[i];
    if (segment.kind === "solo") {
      units.push({kind: "solo", index: segment.index});
      i += 1;
      continue;
    }

    if (segment.kind === "chapterHead") {
      const unit: ChapterUnit = {head: segment, between: null};
      const next = segments[i + 1];
      if (next?.kind === "betweenChapters") {
        unit.between = next;
        i += 2;
      } else {
        i += 1;
      }
      units.push({kind: "chapterUnit", unit});
      continue;
    }

    i += 1;
  }

  return units;
}

export function mobileBlockOrderClass(
  block: ProjectStoryBlock,
  order: Exclude<ProjectChapterMobileBlockOrder, "default">,
): string {
  if (order === "mediaFirst") {
    if (isStoryMediaBlock(block)) return "max-md:order-2";
    if (isStoryTextBlock(block)) return "max-md:order-3";
    return "max-md:order-3";
  }

  if (isStoryTextBlock(block)) return "max-md:order-2";
  if (isStoryMediaBlock(block)) return "max-md:order-3";
  return "max-md:order-2";
}

export function zigzagMobileOrderClasses(
  mobileStackOrder: ProjectZigzagMobileStackOrder | null | undefined,
  isTextLeft: boolean,
): {text: string; media: string} {
  if (mobileStackOrder === "mediaFirst") {
    return {
      text: isTextLeft ? "order-2 md:order-1" : "order-2 md:order-2",
      media: isTextLeft ? "order-1 md:order-2" : "order-1 md:order-1",
    };
  }

  return {
    text: isTextLeft ? "md:order-1" : "md:order-2",
    media: isTextLeft ? "md:order-2" : "md:order-1",
  };
}

/** Desktop column placement when body images use the end-aligned grid (order alone is unreliable). */
export function zigzagBodyImagesEndGridClasses(isTextLeft: boolean): {
  text: string;
  media: string;
  caption: string;
} {
  const textCol = isTextLeft ? "md:col-start-1" : "md:col-start-2";
  const mediaCol = isTextLeft ? "md:col-start-2" : "md:col-start-1";
  return {
    text: `${textCol} md:row-start-1`,
    media: `${mediaCol} md:row-start-1`,
    caption: `${mediaCol} md:row-start-2`,
  };
}
