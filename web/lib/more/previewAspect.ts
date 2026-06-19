import {mediaNaturalAspect} from "@/lib/gridRowAspect";
import {isPortraitDimensions, sanityCroppedDimensions} from "@/lib/imageAspect";
import {getProjectCardImage} from "@/lib/projectCardMedia";
import type {ArchivePreviewItem} from "@/lib/more/blocks";
import type {ProjectListItem, SanityMediaField} from "@/lib/types/project";

export function isPortraitPreviewMedia(media: SanityMediaField): boolean {
  const {width, height} = mediaNaturalAspect(media);
  return isPortraitDimensions(width, height);
}

export function isPortraitPreviewProject(project: ProjectListItem): boolean {
  const image = getProjectCardImage(project);
  const dims = image ? sanityCroppedDimensions(image) : null;
  if (!dims) return false;
  return isPortraitDimensions(dims.width, dims.height);
}

export function isPortraitArchivePreviewItem(entry: ArchivePreviewItem): boolean {
  if (entry.kind === "project") return isPortraitPreviewProject(entry.item);
  return isPortraitPreviewMedia(entry.item);
}
