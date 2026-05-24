/** Tiled fractal noise — breaks gradient banding with minimal visible grain */
export const GRAIN_TILE =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">' +
      '<filter id="n" x="-20%" y="-20%" width="140%" height="140%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>' +
      "</filter>" +
      '<rect width="256" height="256" filter="url(#n)"/>' +
      "</svg>"
  );

export const grainTileStyle = {
  backgroundImage: `url("${GRAIN_TILE}")`,
  backgroundRepeat: "repeat",
  backgroundSize: "256px 256px",
} as const;
