"use client";

import {useEffect, useState} from "react";
import {analyzeTransparentImageTrim, type ImageTrimBounds} from "@/lib/sanity/transparentImageTrim";

export function useTransparentImageTrim(
  src: string | null,
  enabled: boolean,
): ImageTrimBounds | null | undefined {
  const [trim, setTrim] = useState<ImageTrimBounds | null | undefined>(undefined);

  useEffect(() => {
    if (!enabled || !src) {
      setTrim(null);
      return;
    }

    let alive = true;
    setTrim(undefined);
    void analyzeTransparentImageTrim(src).then((result) => {
      if (alive) setTrim(result);
    });

    return () => {
      alive = false;
    };
  }, [src, enabled]);

  return trim;
}
