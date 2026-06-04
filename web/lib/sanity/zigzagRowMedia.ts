import {normalizeMediaItem, normalizeMediaList} from "@/lib/sanity/media";
import type {CmsMediaInput, ProjectZigzagRowBlock, SanityMediaField} from "@/lib/types/project";

export function zigzagRowMedia(block: Pick<ProjectZigzagRowBlock, "images" | "media">): SanityMediaField[] {
  const fromImages = normalizeMediaList(block.images);
  if (fromImages.length > 0) return fromImages;
  const legacy = normalizeMediaItem(block.media as CmsMediaInput | null | undefined);
  return legacy ? [legacy] : [];
}
