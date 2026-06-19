import type {CSSProperties} from "react";

/** Keep in sync with `schemaTypes/project/gridMediaFields.js` */
export type GridAspectRatio =
  | "auto"
  | "square"
  | "landscape"
  | "portrait"
  | "portrait56"
  | "portraitFeed"
  | "wide"
  | "tall"
  | "photo"
  | "photoPortrait"
  | "print"
  | "widePhoto"
  | "widescreen"
  | "panorama"
  | "cinematic";

export type GridCropFocus = "auto" | "center" | "top" | "bottom" | "left" | "right";

const GRID_ASPECT_NUMBERS: Record<Exclude<GridAspectRatio, "auto">, [number, number]> = {
  square: [1, 1],
  landscape: [4, 3],
  portrait: [3, 4],
  portrait56: [5, 6],
  portraitFeed: [4, 5],
  wide: [16, 9],
  tall: [9, 16],
  photo: [3, 2],
  photoPortrait: [2, 3],
  print: [5, 4],
  widePhoto: [5, 3],
  widescreen: [16, 10],
  panorama: [2, 1],
  cinematic: [21, 9],
};

export function isGridAspectRatio(value: string | null | undefined): value is GridAspectRatio {
  return (
    value === "auto" ||
    value === "square" ||
    value === "landscape" ||
    value === "portrait" ||
    value === "portrait56" ||
    value === "portraitFeed" ||
    value === "wide" ||
    value === "tall" ||
    value === "photo" ||
    value === "photoPortrait" ||
    value === "print" ||
    value === "widePhoto" ||
    value === "widescreen" ||
    value === "panorama" ||
    value === "cinematic"
  );
}

/** Tallest portrait tile allowed in grids (3:4). Taller sources are cropped to this. */
export const GRID_MAX_PORTRAIT_HEIGHT_RATIO = 4 / 3;

export function normalizeGridAspectRatio(
  value?: string | null,
  fallback: GridAspectRatio = "auto",
): GridAspectRatio {
  if (!isGridAspectRatio(value)) return fallback;
  return value;
}

/** Cap portrait grid tiles at 3:4 so 9:16 and taller never dominate a row. */
export function clampGridTileAspect(width: number, height: number): {width: number; height: number} {
  if (width <= 0 || height <= 0) return {width: 3, height: 4};
  if (height / width <= GRID_MAX_PORTRAIT_HEIGHT_RATIO) return {width, height};
  return {width: 3, height: 4};
}

export function gridUsesUniformCrop(aspect: GridAspectRatio): boolean {
  return aspect !== "auto";
}

/** Grid/flex alignment — stretch fights fixed CMS aspect-ratio crops. */
export function gridUniformCropAlignClass(uniformCrop: boolean): "items-start" | "items-stretch" {
  return uniformCrop ? "items-start" : "items-stretch";
}

export function gridClassForUniformCrop(gridClass: string, uniformCrop: boolean): string {
  if (!uniformCrop) return gridClass;
  if (gridClass.includes("items-start")) return gridClass;
  if (gridClass.includes("items-stretch")) {
    return gridClass.replace(/\bitems-stretch\b/g, "items-start");
  }
  return `${gridClass} items-start`;
}

/** Fixed tile box for uniform grid crops; `null` when using natural media aspect. */
export function gridAspectRatioBoxStyle(
  aspect: GridAspectRatio | null | undefined,
): CSSProperties | null {
  const preset = normalizeGridAspectRatio(aspect);
  if (preset === "auto") return null;
  const [w, h] = GRID_ASPECT_NUMBERS[preset];
  return {aspectRatio: `${w} / ${h}`, width: "100%"};
}
