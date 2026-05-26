import {urlForImage} from "@/lib/sanity/image";
import {isSanityImage, isSanityVideo, normalizeMediaItem} from "@/lib/sanity/media";
import type {ProjectListItem} from "@/lib/types/project";

/** Best still image for Work grid / gate thumbnails (cover → hero image). */
export function getProjectCardImage(project: ProjectListItem) {
  const coverMedia = normalizeMediaItem(project.coverImage);
  const heroMedia = normalizeMediaItem(project.heroImage);
  const heroImage = isSanityImage(heroMedia) ? heroMedia : null;
  const thumbnail =
    isSanityImage(coverMedia) ? coverMedia : isSanityImage(heroMedia) ? heroMedia : null;

  return thumbnail ?? heroImage;
}

export function getProjectCardImageUrl(
  project: ProjectListItem,
  {width = 1200, height = 900}: {width?: number; height?: number} = {},
) {
  const image = getProjectCardImage(project);
  if (!image?.asset?._ref) return null;
  return urlForImage(image).width(width).height(height).quality(88).url();
}

export function projectCardHasVideoHero(project: ProjectListItem) {
  const heroMedia = normalizeMediaItem(project.heroImage);
  return isSanityVideo(heroMedia);
}
