"use client";

import {useEffect, useRef, type RefObject} from "react";

const CELL_PX = 11;
const PULSE_MS = 3200;
/** Each pulse eases in over this many sim steps (sine envelope) instead of one hard hit. */
const RAMP_STEPS = 40;
const FADE_MS = 600;
/** Crossing the small gaps between letters should not switch the bloom off. */
const LEAVE_GRACE_MS = 150;
/** How close (CSS px) the pointer must be to an opaque logo pixel to count as touching the text. */
const HIT_RADIUS_PX = 4;
const HIT_ALPHA = 110;
const MASK_WIDTH = 600;
const BAYER_4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((n) => (n + 0.5) / 16);

type Mask = {img: HTMLImageElement; w: number; h: number; alpha: Uint8ClampedArray};
type Rect = {left: number; top: number; width: number; height: number};

/** Where an object-fit: contain image actually draws inside its box. */
function containedRect(img: HTMLImageElement, aspect: number): Rect {
  const box = img.getBoundingClientRect();
  const width = box.width / box.height > aspect ? box.height * aspect : box.width;
  const height = width / aspect;
  const [px, py] = getComputedStyle(img).objectPosition.split(" ");
  const offset = (value: string | undefined, free: number) =>
    value?.endsWith("%") ? (free * parseFloat(value)) / 100 : value ? parseFloat(value) : free / 2;
  return {
    left: box.left + offset(px, box.width - width),
    top: box.top + offset(py, box.height - height),
    width,
    height,
  };
}

/**
 * Work banner hover: touching the logo letters (alpha hit-test, not the whole box) makes them glow and
 * sends pixelated white waves from the logo outline across the whole screen while the background
 * gradient warms. Leaving fades everything out and resets.
 */
export function WorkHomeBannerBloom({
  src,
  targetRef,
  onActiveChange,
}: {
  src: string;
  /** Element whose pointer events are watched; the logo <img> inside it is hit-tested. */
  targetRef: RefObject<HTMLElement | null>;
  onActiveChange: (active: boolean) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wash = useRef<HTMLDivElement>(null);
  const onActive = useRef(onActiveChange);

  useEffect(() => {
    onActive.current = onActiveChange;
  }, [onActiveChange]);

  useEffect(() => {
    const target = targetRef.current;
    const cvs = canvas.current;
    const washEl = wash.current;
    if (!target || !cvs || !washEl) return;

    let mask: Mask | null = null;
    let active = false;
    let cols = 0;
    let rows = 0;
    let a = new Float32Array(0);
    let b = new Float32Array(0);
    let image: ImageData | null = null;
    let edge = new Int32Array(0);
    let source = {k: 0, n: 0};
    let glow = {warm: 0, phase: 0, energy: 0};
    let frame = 0;
    let raf: number | null = null;
    let pulseTimer: number | null = null;
    let leaveTimer: number | null = null;
    let fadeTimer: number | null = null;

    const logoImg = () =>
      target.querySelector<HTMLImageElement>(".work-home-logo__image--base") ?? target.querySelector("img");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = MASK_WIDTH;
      off.height = Math.max(1, Math.round((MASK_WIDTH * img.naturalHeight) / img.naturalWidth));
      const ctx = off.getContext("2d", {willReadFrequently: true});
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, off.width, off.height);
      mask = {img, w: off.width, h: off.height, alpha: ctx.getImageData(0, 0, off.width, off.height).data};
    };
    img.src = src;

    const logoRect = () => {
      const el = logoImg();
      return el && mask ? containedRect(el, mask.w / mask.h) : null;
    };

    const touchesText = (x: number, y: number) => {
      const r = logoRect();
      if (!r || !mask) return false;
      const scale = mask.w / r.width;
      const u = Math.round((x - r.left) * scale);
      const v = Math.round((y - r.top) * scale);
      const rad = Math.max(1, Math.round(HIT_RADIUS_PX * scale));
      for (let dy = -rad; dy <= rad; dy++) {
        for (let dx = -rad; dx <= rad; dx++) {
          const mx = u + dx;
          const my = v + dy;
          if (mx < 0 || my < 0 || mx >= mask.w || my >= mask.h) continue;
          if (mask.alpha[(my * mask.w + mx) * 4 + 3] > HIT_ALPHA) return true;
        }
      }
      return false;
    };

    const setupGrid = () => {
      const nextCols = Math.ceil(innerWidth / CELL_PX);
      const nextRows = Math.ceil(innerHeight / CELL_PX);
      if (nextCols === cols && nextRows === rows) return;
      cols = nextCols;
      rows = nextRows;
      cvs.width = cols;
      cvs.height = rows;
      a = new Float32Array(cols * rows);
      b = new Float32Array(cols * rows);
      image = cvs.getContext("2d")?.createImageData(cols, rows) ?? null;
    };

    /** Rasterise the logo at grid resolution where it sits on screen; keep only its outline cells. */
    const sampleEdge = () => {
      const r = logoRect();
      if (!r || !mask || !cols) return;
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const ctx = off.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(mask.img, r.left / CELL_PX, r.top / CELL_PX, r.width / CELL_PX, r.height / CELL_PX);
      const alpha = ctx.getImageData(0, 0, cols, rows).data;
      const inside = (x: number, y: number) =>
        x >= 0 && y >= 0 && x < cols && y < rows && alpha[(y * cols + x) * 4 + 3] > HIT_ALPHA;
      const cells: number[] = [];
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          if (inside(x, y) && (!inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1))) {
            cells.push(y * cols + x);
          }
        }
      }
      edge = Int32Array.from(cells);
      washEl.style.setProperty("--cx", `${r.left + r.width / 2}px`);
      washEl.style.setProperty("--cy", `${r.top + r.height / 2}px`);
    };

    const step = () => {
      const ctx = cvs.getContext("2d");
      if (!ctx || !image) return;

      // Simulate on every other frame (~30 steps/s) so waves travel slowly.
      frame++;
      if (frame % 2 === 0) {
        if (source.k < source.n) {
          const amp = 9 * Math.sin((Math.PI * source.k) / source.n);
          for (const i of edge) a[i] += amp;
          source.k++;
        }
        let energy = 0;
        for (let y = 1; y < rows - 1; y++) {
          for (let x = 1; x < cols - 1; x++) {
            const i = y * cols + x;
            const v = ((a[i - 1] + a[i + 1] + a[i - cols] + a[i + cols]) / 2 - b[i]) * 0.988;
            b[i] = v;
            energy += Math.abs(v);
          }
        }
        [a, b] = [b, a];
        glow.energy = energy / (cols * rows);

        // Ordered (Bayer) dither: wave height decides how many cells in each 4×4 block light up.
        const px = image.data;
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const i = y * cols + x;
            const intensity = Math.min(1, Math.abs(a[i]) / 70);
            const on = intensity > 0.08 && intensity > BAYER_4[(y & 3) * 4 + (x & 3)];
            px[i * 4] = 255;
            px[i * 4 + 1] = 255;
            px[i * 4 + 2] = 255;
            px[i * 4 + 3] = on ? 0.3 * 255 + intensity * 0.3 * 255 : 0;
          }
        }
        ctx.putImageData(image, 0, 0);
      }

      glow.warm += (Math.min(1, glow.energy / 2) - glow.warm) * 0.02;
      glow.phase += glow.energy * 0.004;
      washEl.style.setProperty("--warm", glow.warm.toFixed(3));
      washEl.style.setProperty("--hue", (Math.sin(glow.phase) * 26).toFixed(2));

      raf = source.k < source.n || glow.energy > 0.02 || glow.warm > 0.01 ? requestAnimationFrame(step) : null;
    };

    const pulse = () => {
      sampleEdge();
      source = {k: 0, n: RAMP_STEPS};
      if (!raf) raf = requestAnimationFrame(step);
    };

    const activate = () => {
      active = true;
      onActive.current(true);
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (fadeTimer) clearTimeout(fadeTimer);
      fadeTimer = null;
      cvs.style.opacity = "";
      washEl.style.opacity = "";
      setupGrid();
      pulse();
      if (pulseTimer) clearInterval(pulseTimer);
      pulseTimer = window.setInterval(pulse, PULSE_MS);
    };

    const deactivate = () => {
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = null;
      if (!active) return;
      active = false;
      onActive.current(false);
      if (pulseTimer) clearInterval(pulseTimer);
      pulseTimer = null;
      source = {k: 0, n: 0};
      cvs.style.opacity = "0";
      washEl.style.opacity = "0";
      fadeTimer = window.setTimeout(() => {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
        a.fill(0);
        b.fill(0);
        cvs.getContext("2d")?.clearRect(0, 0, cvs.width, cvs.height);
        glow = {warm: 0, phase: 0, energy: 0};
        washEl.style.setProperty("--warm", "0");
        fadeTimer = null;
      }, FADE_MS);
    };

    const onMove = (e: PointerEvent) => {
      if (touchesText(e.clientX, e.clientY)) {
        if (leaveTimer) clearTimeout(leaveTimer);
        leaveTimer = null;
        if (!active) activate();
      } else if (active && !leaveTimer) {
        leaveTimer = window.setTimeout(deactivate, LEAVE_GRACE_MS);
      }
    };

    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerleave", deactivate);
    return () => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", deactivate);
      if (raf) cancelAnimationFrame(raf);
      if (pulseTimer) clearInterval(pulseTimer);
      if (leaveTimer) clearTimeout(leaveTimer);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, [src, targetRef]);

  return (
    <>
      <div
        ref={wash}
        aria-hidden
        className="work-home-bloom-wash pointer-events-none fixed inset-0 z-[-1] transition-opacity duration-500 ease-out"
      />
      <canvas
        ref={canvas}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[-1] h-screen w-screen transition-opacity duration-500 ease-out [image-rendering:pixelated]"
      />
    </>
  );
}
