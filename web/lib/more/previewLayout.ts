import {MORE_PREVIEW_ROWS, seededShuffle} from "@/lib/more/preview";

export const PREVIEW_LAYOUT_ATTEMPTS = 24;

export const PORTRAIT_PREVIEW_SLOTS = MORE_PREVIEW_ROWS;
export const LANDSCAPE_PREVIEW_SLOTS = 1;

export function previewItemSlots<T>(item: T, isPortrait: (item: T) => boolean): number {
  return isPortrait(item) ? PORTRAIT_PREVIEW_SLOTS : LANDSCAPE_PREVIEW_SLOTS;
}

function columnSlotHeights<T>(column: readonly T[], isPortrait: (item: T) => boolean): number {
  return column.reduce((sum, item) => sum + previewItemSlots(item, isPortrait), 0);
}

/** Shortest-column masonry pack within a 2-row slot budget per column. */
export function packPreviewShortestColumn<T>(
  items: readonly T[],
  maxColumns: number,
  isPortrait: (item: T) => boolean,
  columnCap = MORE_PREVIEW_ROWS,
): {columns: T[][]; placed: T[]} {
  if (items.length === 0 || maxColumns < 1) {
    return {columns: [], placed: []};
  }

  const columns: T[][] = Array.from({length: maxColumns}, () => []);
  const heights = Array(maxColumns).fill(0);
  const placed: T[] = [];

  for (const item of items) {
    const slots = previewItemSlots(item, isPortrait);
    if (slots > columnCap) continue;

    let bestCol = -1;
    let bestHeight = Infinity;

    for (let c = 0; c < maxColumns; c++) {
      if (heights[c] + slots > columnCap) continue;
      if (heights[c] < bestHeight) {
        bestHeight = heights[c];
        bestCol = c;
      }
    }

    if (bestCol === -1) continue;

    columns[bestCol].push(item);
    heights[bestCol] += slots;
    placed.push(item);
  }

  return {columns: columns.filter((column) => column.length > 0), placed};
}

function scorePreviewPack<T>(
  columns: readonly (readonly T[])[],
  maxColumns: number,
  isPortrait: (item: T) => boolean,
  columnCap = MORE_PREVIEW_ROWS,
): number {
  if (columns.length === 0) return -Infinity;

  const heights = columns.map((column) => columnSlotHeights(column, isPortrait));
  const maxH = Math.max(...heights);
  const minH = Math.min(...heights);
  const itemCount = columns.reduce((n, column) => n + column.length, 0);
  const usedColumns = columns.length;
  const fullness = heights.reduce((sum, h) => sum + h, 0);
  const imbalance = maxH - minH;
  const unusedColumns = maxColumns - usedColumns;
  const wastedSlots = heights.reduce((sum, h) => sum + (columnCap - h), 0);

  return (
    itemCount * 10_000 +
    fullness * 100 -
    imbalance * 50 -
    unusedColumns * 20 -
    wastedSlots * 8
  );
}

/** Try many shuffles; keep the pack with the most items and the tightest column balance. */
export function buildBestPreviewLayout<T>(
  items: readonly T[],
  seed: string,
  maxColumns: number,
  isPortrait: (item: T) => boolean,
  attempts = PREVIEW_LAYOUT_ATTEMPTS,
): {columns: T[][]; picked: T[]} {
  if (items.length === 0 || maxColumns < 1) {
    return {columns: [], picked: []};
  }

  let best: {columns: T[][]; picked: T[]; score: number} | null = null;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const shuffled = seededShuffle(items, `${seed}:${attempt}`);
    const packed = packPreviewShortestColumn(shuffled, maxColumns, isPortrait);
    if (packed.placed.length === 0) continue;

    const score = scorePreviewPack(packed.columns, maxColumns, isPortrait);
    if (!best || score > best.score) {
      best = {columns: packed.columns, picked: packed.placed, score};
    }
  }

  return best ?? {columns: [], picked: []};
}
