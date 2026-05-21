import {normalizeMediaItem, normalizeMediaList} from "@/lib/sanity/media";
import type {CmsMediaInput, ImageSection, SanityMediaField} from "@/lib/types/project";

export function imageSectionMedia(section: {
  image?: ImageSection["image"];
  item?: ImageSection["item"];
  media?: CmsMediaInput[] | null;
}): SanityMediaField[] {
  const fromItem = normalizeMediaItem(section.item);
  if (fromItem) return [fromItem];
  const fromLegacyMedia = normalizeMediaList(section.media);
  if (fromLegacyMedia.length > 0) return fromLegacyMedia;
  const fromLegacyImage = normalizeMediaItem(section.image);
  if (fromLegacyImage) return [fromLegacyImage];
  return [];
}
