/** 12-column bento grid — shared by Sanity Studio preview and the site. */

export const BENTO_COLUMNS = 12

/** @type {Record<string, {colSpan: number, rowSpan: number, label: string}>} */
export const BENTO_TILE_PRESETS = {
  small: {colSpan: 3, rowSpan: 2, label: 'Small (3×2)'},
  square: {colSpan: 4, rowSpan: 3, label: 'Square (4×3)'},
  wide: {colSpan: 6, rowSpan: 3, label: 'Wide (6×3)'},
  tall: {colSpan: 3, rowSpan: 4, label: 'Tall (3×4)'},
  hero: {colSpan: 8, rowSpan: 4, label: 'Hero (8×4)'},
  full: {colSpan: 12, rowSpan: 2, label: 'Full width (12×2)'},
}

export const BENTO_TILE_OPTIONS = Object.entries(BENTO_TILE_PRESETS).map(([value, preset]) => ({
  title: preset.label,
  value,
}))

const DEFAULT_PRESET = 'square'

/** @param {{tileSize?: string | null, colSpan?: number | null, rowSpan?: number | null}} item */
export function resolveBentoSpan(item) {
  if (item?.tileSize && BENTO_TILE_PRESETS[item.tileSize]) {
    const preset = BENTO_TILE_PRESETS[item.tileSize]
    return {colSpan: preset.colSpan, rowSpan: preset.rowSpan}
  }
  if (item?.colSpan && item?.rowSpan) {
    return {
      colSpan: clampSpan(item.colSpan, BENTO_COLUMNS),
      rowSpan: clampSpan(item.rowSpan, 8),
    }
  }
  const fallback = BENTO_TILE_PRESETS[DEFAULT_PRESET]
  return {colSpan: fallback.colSpan, rowSpan: fallback.rowSpan}
}

function clampSpan(value, max) {
  const n = Math.round(Number(value))
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.min(n, max)
}

function ensureRows(grid, rows) {
  while (grid.length < rows) grid.push(new Array(BENTO_COLUMNS).fill(false))
}

function canPlace(grid, col, row, colSpan, rowSpan) {
  if (col < 0 || col + colSpan > BENTO_COLUMNS) return false
  ensureRows(grid, row + rowSpan)
  for (let r = row; r < row + rowSpan; r++) {
    for (let c = col; c < col + colSpan; c++) {
      if (grid[r][c]) return false
    }
  }
  return true
}

function markPlace(grid, col, row, colSpan, rowSpan) {
  ensureRows(grid, row + rowSpan)
  for (let r = row; r < row + rowSpan; r++) {
    for (let c = col; c < col + colSpan; c++) {
      grid[r][c] = true
    }
  }
}

function findPlacement(grid, colSpan, rowSpan) {
  for (let row = 0; row < 64; row++) {
    for (let col = 0; col <= BENTO_COLUMNS - colSpan; col++) {
      if (canPlace(grid, col, row, colSpan, rowSpan)) {
        return {colStart: col + 1, rowStart: row + 1}
      }
    }
  }
  return {colStart: 1, rowStart: grid.length + 1}
}

/**
 * Pack collage items top-to-left on a 12-column grid (reading order).
 * @param {Array<{_key?: string, tileSize?: string, colSpan?: number, rowSpan?: number}>} items
 */
export function packBentoItems(items) {
  /** @type {boolean[][]} */
  const grid = []
  /** @type {Array<{key: string, colStart: number, rowStart: number, colSpan: number, rowSpan: number, tileSize?: string}>} */
  const placed = []

  items.forEach((item, index) => {
    const {colSpan, rowSpan} = resolveBentoSpan(item)
    const {colStart, rowStart} = findPlacement(grid, colSpan, rowSpan)
    markPlace(grid, colStart - 1, rowStart - 1, colSpan, rowSpan)
    placed.push({
      key: item._key ?? String(index),
      colStart,
      rowStart,
      colSpan,
      rowSpan,
      tileSize: item.tileSize,
    })
  })

  return {
    placed,
    rowCount: Math.max(1, grid.length),
  }
}
