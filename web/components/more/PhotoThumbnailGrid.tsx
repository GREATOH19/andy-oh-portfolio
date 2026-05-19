"use client";

import {ClickablePhotoGrid} from "@/components/ClickablePhotoGrid";
import type {SanityImageField} from "@/lib/types/project";

function gridClass(columns: 1 | 2 | 3, fixedColumns: boolean) {
  if (columns === 1) return "grid grid-cols-1 gap-3";
  if (columns === 2) {
    return fixedColumns
      ? "grid grid-cols-2 gap-2 sm:gap-3"
      : "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3";
  }
  if (fixedColumns) {
    return "grid w-full grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3";
  }
  return "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5";
}

export function PhotoThumbnailGrid({
  images,
  columns = 3,
  fixedColumns = false,
}: {
  images: SanityImageField[];
  columns?: 1 | 2 | 3;
  fixedColumns?: boolean;
}) {
  const sizes = fixedColumns
    ? "(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
    : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw";

  return (
    <ClickablePhotoGrid
      images={images}
      gridClass={gridClass(columns, fixedColumns)}
      sizes={sizes}
    />
  );
}
