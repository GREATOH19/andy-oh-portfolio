import {clampGridTileAspect} from "@/lib/gridAspectRatio";
import {sanityCroppedDimensions} from "@/lib/imageAspect";
import {isSanityImage, isSanityVideo, isSanityYoutube} from "@/lib/sanity/media";
import {resolveYoutubeVideoAspect} from "@/lib/youtube/parseYoutubeUrl";
import type {SanityMediaField} from "@/lib/types/project";

export type MediaAspect = {width: number; height: number};

/** Height ÷ width — larger means a taller tile at equal column width. */
export function mediaHeightRatio(width: number, height: number): number {
  if (width <= 0 || height <= 0) return 1;
  return height / width;
}

/** Best-effort natural aspect before video metadata is available in the browser. */
export function mediaNaturalAspect(media: SanityMediaField): MediaAspect {
  if (isSanityImage(media)) {
    const dims = sanityCroppedDimensions(media) ?? {width: 16, height: 9};
    return clampGridTileAspect(dims.width, dims.height);
  }

  if (isSanityVideo(media)) {
    return {width: 3, height: 4};
  }

  if (isSanityYoutube(media)) {
    const aspect = resolveYoutubeVideoAspect(media.url, media.videoAspect);
    return aspect === "portrait" ? {width: 3, height: 4} : {width: 16, height: 9};
  }

  return {width: 1, height: 1};
}

/** Unified tile aspect for every item in a multi-column grid row. */
export function tallestRowAspect(
  items: SanityMediaField[],
  overrides?: Readonly<Record<string, MediaAspect>>,
  itemKey?: (item: SanityMediaField, index: number) => string,
): MediaAspect {
  let best: MediaAspect = {width: 1, height: 1};
  let maxRatio = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const key = itemKey?.(item, i) ?? String(i);
    const raw = overrides?.[key] ?? mediaNaturalAspect(item);
    const {width, height} = clampGridTileAspect(raw.width, raw.height);
    const ratio = mediaHeightRatio(width, height);
    if (ratio > maxRatio) {
      maxRatio = ratio;
      best = {width, height};
    }
  }

  return clampGridTileAspect(best.width, best.height);
}

export function rowAspectsForItems(
  items: SanityMediaField[],
  columns: number,
  overrides?: Readonly<Record<string, MediaAspect>>,
  itemKey?: (item: SanityMediaField, index: number) => string,
): (MediaAspect | undefined)[] {
  const cols = Math.max(1, Math.round(columns));
  if (cols < 2) return items.map(() => undefined);

  const aspects: (MediaAspect | undefined)[] = new Array(items.length);
  for (let start = 0; start < items.length; start += cols) {
    const row = items.slice(start, start + cols);
    const rowAspect = tallestRowAspect(
      row,
      overrides,
      (item, j) => itemKey?.(item, start + j) ?? String(start + j),
    );
    for (let j = 0; j < row.length; j++) {
      aspects[start + j] = rowAspect;
    }
  }
  return aspects;
}
