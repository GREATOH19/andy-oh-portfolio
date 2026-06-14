"use client";

import {useEffect, useState} from "react";
import {normalizeGalleryColumns, resolveGalleryBreakpointColumns} from "@/lib/projectStory/galleryGrid";

export function useGalleryBreakpointColumns(columns: number): number {
  const cols = normalizeGalleryColumns(columns);

  const [visible, setVisible] = useState(() =>
    typeof window !== "undefined"
      ? resolveGalleryBreakpointColumns(cols, window.innerWidth)
      : cols,
  );

  useEffect(() => {
    const update = () => setVisible(resolveGalleryBreakpointColumns(cols, window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [cols]);

  return visible;
}
