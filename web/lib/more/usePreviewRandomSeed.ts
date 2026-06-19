"use client";

import {useEffect, useState} from "react";

/** Fresh random seed per mount (new shuffle when /more is opened again). Not heavy — no refetch. */
export function usePreviewRandomSeed(scopeKey: string): string | null {
  const [seed, setSeed] = useState<string | null>(null);

  useEffect(() => {
    setSeed(`${scopeKey}-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`);
  }, [scopeKey]);

  return seed;
}
