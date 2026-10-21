"use client";

import {useEffect, useRef} from "react";

const CELL_PX = 4;
/** Simulate once every N frames (~20 steps/s), same pace as the desktop bloom. */
const SIM_EVERY = 3;
const DAMPING = 0.965;
/** Wave height added (Gaussian, centre weight) around each touch point per touch event. */
const SPLASH = 6;
const PIXEL_ALPHA = 0.25;
/** Background wash strength while touching (desktop bloom goes up to 1). */
const WARM_MAX = 0.45;
const WARM_IN = 0.03;
const WARM_OUT = 0.018;
/** The wash stays lit this long after the last touch event. */
const HOLD_MS = 250;
/** Where the banner bloom can't run: no room for the banner logo, or no hover. */
const TOUCH_MEDIA = "(max-width: 767px), (hover: none)";

/**
 * Work home on phones / touch screens: touching or scrolling softly tints the page around the finger
 * (same wash as the desktop banner bloom) and leaves faint white pixel ripples that fade out.
 */
export function WorkHomeTouchRipple() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wash = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cvs = canvas.current;
    const washEl = wash.current;
    const ctx = cvs?.getContext("2d");
    if (!cvs || !washEl || !ctx) return;
    const touchMedia = matchMedia(TOUCH_MEDIA);
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

    let cols = 0;
    let rows = 0;
    let a = new Float32Array(0);
    let b = new Float32Array(0);
    let image: ImageData | null = null;
    let frame = 0;
    let peak = 0;
    let raf: number | null = null;
    let lastTouch = 0;
    let target = {x: innerWidth / 2, y: innerHeight / 2};
    let glow = {warm: 0, phase: 0, x: target.x, y: target.y};

    // Sized to the tallest viewport so the mobile address bar showing/hiding doesn't reset the waves.
    const setupGrid = () => {
      const nextCols = Math.ceil(innerWidth / CELL_PX);
      const nextRows = Math.ceil(Math.max(innerHeight, screen.height) / CELL_PX);
      if (nextCols === cols && nextRows === rows) return;
      cols = nextCols;
      rows = nextRows;
      cvs.width = cols;
      cvs.height = rows;
      cvs.style.width = `${cols * CELL_PX}px`;
      cvs.style.height = `${rows * CELL_PX}px`;
      a = new Float32Array(cols * rows);
      b = new Float32Array(cols * rows);
      image = ctx.createImageData(cols, rows);
    };

    const splash = (x: number, y: number) => {
      const cx = Math.floor(x / CELL_PX);
      const cy = Math.floor(y / CELL_PX);
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const px = cx + dx;
          const py = cy + dy;
          if (px > 0 && py > 0 && px < cols - 1 && py < rows - 1) {
            a[py * cols + px] += SPLASH * Math.exp(-(dx * dx + dy * dy) / 2);
          }
        }
      }
    };

    const step = () => {
      frame++;
      if (frame % SIM_EVERY === 0 && image) {
        peak = 0;
        for (let y = 1; y < rows - 1; y++) {
          for (let x = 1; x < cols - 1; x++) {
            const i = y * cols + x;
            const v = ((a[i - 1] + a[i + 1] + a[i - cols] + a[i + cols]) / 2 - b[i]) * DAMPING;
            b[i] = v;
            peak = Math.max(peak, Math.abs(v));
          }
        }
        [a, b] = [b, a];

        // Continuous alpha (no dither): wave height fades the pixel in and out smoothly.
        const px = image.data;
        for (let i = 0; i < cols * rows; i++) {
          const intensity = Math.min(1, Math.abs(a[i]) / 10);
          px[i * 4] = 255;
          px[i * 4 + 1] = 255;
          px[i * 4 + 2] = 255;
          px[i * 4 + 3] = intensity * PIXEL_ALPHA * 255;
        }
        ctx.putImageData(image, 0, 0);
      }

      const touching = performance.now() - lastTouch < HOLD_MS;
      const goal = touching ? WARM_MAX : 0;
      glow.warm += (goal - glow.warm) * (goal > glow.warm ? WARM_IN : WARM_OUT);
      glow.phase += glow.warm * 0.01;
      glow.x += (target.x - glow.x) * 0.06;
      glow.y += (target.y - glow.y) * 0.06;
      washEl.style.setProperty("--warm", glow.warm.toFixed(3));
      washEl.style.setProperty("--hue", (Math.sin(glow.phase) * 26).toFixed(2));
      washEl.style.setProperty("--cx", `${glow.x.toFixed(1)}px`);
      washEl.style.setProperty("--cy", `${glow.y.toFixed(1)}px`);

      if (touching || peak > 1 || glow.warm > 0.005) {
        raf = requestAnimationFrame(step);
      } else {
        raf = null;
        a.fill(0);
        b.fill(0);
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        glow.warm = 0;
        washEl.style.setProperty("--warm", "0");
      }
    };

    const onTouch = (e: TouchEvent) => {
      if (!touchMedia.matches || reducedMotion.matches || !e.touches.length) return;
      setupGrid();
      for (const t of Array.from(e.touches)) splash(t.clientX, t.clientY);
      target = {x: e.touches[0].clientX, y: e.touches[0].clientY};
      if (glow.warm < 0.005) glow = {...glow, x: target.x, y: target.y};
      lastTouch = performance.now();
      if (!raf) raf = requestAnimationFrame(step);
    };

    addEventListener("touchstart", onTouch, {passive: true});
    addEventListener("touchmove", onTouch, {passive: true});
    return () => {
      removeEventListener("touchstart", onTouch);
      removeEventListener("touchmove", onTouch);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={wash} aria-hidden className="work-home-bloom-wash pointer-events-none fixed inset-0 z-[-1]" />
      <canvas
        ref={canvas}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[-1] [image-rendering:pixelated]"
      />
    </>
  );
}
