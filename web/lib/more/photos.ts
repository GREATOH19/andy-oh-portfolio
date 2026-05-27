import type {PhotoAlbum, SanityMediaField} from "@/lib/types/project";
import {normalizeMediaItem, normalizeMediaList} from "@/lib/sanity/media";
import {parseYearNumber} from "@/lib/more/year";

export function flattenAlbumImages(albums?: PhotoAlbum[] | null): SanityMediaField[] {
  if (!albums?.length) return [];
  const out: SanityMediaField[] = [];
  for (const album of albums) {
    out.push(...normalizeMediaList(album.images));
  }
  return out;
}

export type PhotographyYearGroup = {
  yearLabel: string;
  yearSort: number;
  title?: string | null;
  images: SanityMediaField[];
};

/** Albums with a year → grouped sections; albums without year → one unlabeled group (page header is the title). */
export function groupPhotographyAlbums(albums?: PhotoAlbum[] | null): PhotographyYearGroup[] {
  if (!albums?.length) return [];

  const withYear: PhotographyYearGroup[] = [];
  const noYearImages: SanityMediaField[] = [];

  for (const album of albums) {
    const images = normalizeMediaList(album.images);
    if (images.length === 0) continue;

    const yearLabel = album.year?.trim();
    if (yearLabel) {
      withYear.push({
        yearLabel,
        yearSort: parseYearNumber(yearLabel) ?? -1,
        title: album.title,
        images,
      });
    } else {
      noYearImages.push(...images);
    }
  }

  withYear.sort((a, b) => {
    if (a.yearSort !== b.yearSort) return b.yearSort - a.yearSort;
    return a.yearLabel.localeCompare(b.yearLabel);
  });

  if (noYearImages.length > 0) {
    withYear.push({
      yearLabel: "",
      yearSort: -2,
      title: null,
      images: noYearImages,
    });
  }

  return withYear;
}

export function filterValidMedia(images?: PhotoAlbum["images"]): SanityMediaField[] {
  return normalizeMediaList(images);
}

/** @deprecated Use filterValidMedia */
export const filterValidImages = filterValidMedia;
