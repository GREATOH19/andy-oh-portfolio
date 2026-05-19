import type {PhotoAlbum, SanityImageField} from "@/lib/types/project";
import {sanityImageAssetId} from "@/lib/sanity/image";
import {parseYearNumber} from "@/lib/more/year";

export const MORE_PREVIEW_LIMIT = 3;

export function flattenAlbumImages(albums?: PhotoAlbum[] | null): SanityImageField[] {
  if (!albums?.length) return [];
  const out: SanityImageField[] = [];
  for (const album of albums) {
    for (const img of album.images ?? []) {
      if (img && sanityImageAssetId(img)) out.push(img);
    }
  }
  return out;
}

export type PhotographyYearGroup = {
  yearLabel: string;
  yearSort: number;
  title?: string | null;
  images: SanityImageField[];
};

/** Albums with a year → grouped sections; albums without year → one unlabeled group (page header is the title). */
export function groupPhotographyAlbums(albums?: PhotoAlbum[] | null): PhotographyYearGroup[] {
  if (!albums?.length) return [];

  const withYear: PhotographyYearGroup[] = [];
  const noYearImages: SanityImageField[] = [];

  for (const album of albums) {
    const images = (album.images ?? []).filter((i) => i && sanityImageAssetId(i));
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

export function filterValidImages(images?: SanityImageField[] | null): SanityImageField[] {
  return (images ?? []).filter((i): i is NonNullable<SanityImageField> => Boolean(i && sanityImageAssetId(i)));
}
