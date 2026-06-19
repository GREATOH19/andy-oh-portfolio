export type ImageTrimBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
};

const trimCache = new Map<string, ImageTrimBounds | null>();

export function computeAlphaTrimBounds(
  imageData: ImageData,
  alphaThreshold = 12,
): Omit<ImageTrimBounds, "naturalWidth" | "naturalHeight"> | null {
  const {width: w, height: h, data} = imageData;
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const alpha = data[(y * w + x) * 4 + 3];
      if (alpha > alphaThreshold) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) return null;

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  if (width >= w * 0.985 && height >= h * 0.985) return null;

  return {left: minX, top: minY, width, height};
}

function scaleTrimToNatural(
  sample: Omit<ImageTrimBounds, "naturalWidth" | "naturalHeight">,
  naturalWidth: number,
  naturalHeight: number,
  sampleWidth: number,
  sampleHeight: number,
): ImageTrimBounds {
  const scaleX = naturalWidth / sampleWidth;
  const scaleY = naturalHeight / sampleHeight;
  return {
    left: Math.max(0, Math.floor(sample.left * scaleX)),
    top: Math.max(0, Math.floor(sample.top * scaleY)),
    width: Math.min(naturalWidth, Math.ceil(sample.width * scaleX)),
    height: Math.min(naturalHeight, Math.ceil(sample.height * scaleY)),
    naturalWidth,
    naturalHeight,
  };
}

export function analyzeTransparentImageTrim(
  src: string,
  maxSampleWidth = 480,
): Promise<ImageTrimBounds | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  if (trimCache.has(src)) {
    return Promise.resolve(trimCache.get(src) ?? null);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    img.onload = () => {
      try {
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        if (naturalWidth < 1 || naturalHeight < 1) {
          trimCache.set(src, null);
          resolve(null);
          return;
        }

        const scale = Math.min(1, maxSampleWidth / naturalWidth);
        const sampleWidth = Math.max(1, Math.round(naturalWidth * scale));
        const sampleHeight = Math.max(1, Math.round(naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = sampleWidth;
        canvas.height = sampleHeight;
        const ctx = canvas.getContext("2d", {willReadFrequently: true});
        if (!ctx) {
          trimCache.set(src, null);
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
        const sample = computeAlphaTrimBounds(ctx.getImageData(0, 0, sampleWidth, sampleHeight));
        if (!sample) {
          trimCache.set(src, null);
          resolve(null);
          return;
        }

        const bounds = scaleTrimToNatural(
          sample,
          naturalWidth,
          naturalHeight,
          sampleWidth,
          sampleHeight,
        );
        trimCache.set(src, bounds);
        resolve(bounds);
      } catch {
        trimCache.set(src, null);
        resolve(null);
      }
    };

    img.onerror = () => {
      trimCache.set(src, null);
      resolve(null);
    };

    img.src = src;
  });
}

export function trimBoxStyle(bounds: ImageTrimBounds): {aspectRatio: string; width: string} {
  return {
    aspectRatio: `${bounds.width} / ${bounds.height}`,
    width: "100%",
  };
}

export function trimImageStyle(bounds: ImageTrimBounds): {
  width: string;
  height: string;
  left: string;
  top: string;
} {
  const {left, top, width, height, naturalWidth, naturalHeight} = bounds;
  return {
    width: `${(naturalWidth / width) * 100}%`,
    height: `${(naturalHeight / height) * 100}%`,
    left: `${(-left / width) * 100}%`,
    top: `${(-top / height) * 100}%`,
  };
}
