/** ~2 rows on the widest masonry breakpoint (md: 4 columns). */
export const MORE_PREVIEW_ROWS = 2;
export const MORE_PREVIEW_COLS = 4;
export const MORE_PREVIEW_LIMIT = MORE_PREVIEW_ROWS * MORE_PREVIEW_COLS;

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

/** Stable pseudo-random order for SSR and hydration (seed e.g. block `_key`). */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  let state = hashSeed(seed) || 1;

  for (let i = out.length - 1; i > 0; i--) {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}

export function pickMorePreview<T>(
  items: readonly T[],
  seed: string,
  limit: number = MORE_PREVIEW_LIMIT,
): T[] {
  return seededShuffle(items, seed).slice(0, limit);
}
