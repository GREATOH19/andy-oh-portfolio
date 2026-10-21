"use client";

import {useEffect, useRef} from "react";

const CELL_PX = 4;
const SIM_EVERY = 2;
const DAMPING = 0.97;
/** Wave height added around each touch point per touch event. */
const SPLASH = 28;
/** Where the banner bloom can't run: no room for the banner logo, or no hover. */
const TOUCH_MEDIA = "(max-width: 767px), (hover: none)";
const BAYER_4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((n) => (n + 0.5) / 16);

/**
 * Work home on phones / touch screens: dragging or scrolling with a finger leaves a fading trail of
 * dithered pixel ripples where it touched, in the same style as the desktop banner bloom.
 */
export function WorkHomeTouchRipple() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvas.current;
    const ctx = cvs?.getContext("2d");
    if (!cvs || !ctx) return;
    const touchMedia = matchMedia(TOUCH_MEDIA);
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

    let cols = 0;
    let rows = 0;
    let a = new Float32Array(0);
    let b = new Float32Array(0);
    let image: ImageData | null = null;
    let frame = 0;
    let energy = 0;
    let raf: number | null = null;

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
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const px = cx + dx;
          const py = cy + dy;
          if (px > 0 && py > 0 && px < cols - 1 && py < rows - 1) a[py * cols + px] += SPLASH;
        }
      }
    };

    const step = () => {
      frame++;
      if (frame % SIM_EVERY === 0 && image) {
        let sum = 0;
        for (let y = 1; y < rows - 1; y++) {
          for (let x = 1; x < cols - 1; x++) {
            const i = y * cols + x;
            const v = ((a[i - 1] + a[i + 1] + a[i - cols] + a[i + cols]) / 2 - b[i]) * DAMPING;
            b[i] = v;
            sum += Math.abs(v);
          }
        }
        [a, b] = [b, a];
        energy = sum / (cols * rows);

        const px = image.data;
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const i = y * cols + x;
            const intensity = Math.min(1, Math.abs(a[i]) / 30);
            const on = intensity > 0.08 && intensity > BAYER_4[(y & 3) * 4 + (x & 3)];
            px[i * 4] = 56;
            px[i * 4 + 1] = 160;
            px[i * 4 + 2] = 255;
            px[i * 4 + 3] = on ? 0.25 * 255 + intensity * 0.35 * 255 : 0;
          }
        }
        ctx.putImageData(image, 0, 0);
      }

      if (energy > 0.002) {
        raf = requestAnimationFrame(step);
      } else {
        raf = null;
        a.fill(0);
        b.fill(0);
        ctx.clearRect(0, 0, cvs.width, cvs.height);
      }
    };

    const onTouch = (e: TouchEvent) => {
      if (!touchMedia.matches || reducedMotion.matches) return;
      setupGrid();
      for (const t of Array.from(e.touches)) splash(t.clientX, t.clientY);
      energy = Math.max(energy, 1);
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
    <canvas
      ref={canvas}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[-1] [image-rendering:pixelated]"
    />
  );
}
