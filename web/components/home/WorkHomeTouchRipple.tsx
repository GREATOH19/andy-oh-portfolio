"use client";

import {useEffect, useRef} from "react";

import {BAYER_4, CELL_PX, DAMPING, FADE_MS, RAMP_STEPS, SIM_EVERY} from "@/components/home/WorkHomeBannerBloom";

/** Radius (cells) of the fingertip source — the banner bloom uses the logo outline instead. */
const SOURCE_RADIUS = 3;
const SOURCE_AMP = 5;
/** After the finger lifts (and its pulse has finished), the waves linger this long before fading out. */
const LINGER_MS = 1000;
/** Where the banner bloom can't run: no room for the banner logo, or no hover. */
const TOUCH_MEDIA = "(max-width: 767px), (hover: none)";

/**
 * Work home on phones / touch screens: the desktop banner bloom (WorkHomeBannerBloom), driven by the
 * finger instead of the logo. A touch swells a pulse of white dithered pixel waves from the finger
 * (following it while it scrolls) and warms the same background wash; once the finger has lifted and
 * the pulse is done, everything lingers briefly and fades out the way the bloom does on pointer leave.
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
    let finger = {x: 0, y: 0};
    let touching = false;
    let liftedAt = 0;
    let source = {k: 0, n: 0};
    let glow = {warm: 0, phase: 0, energy: 0};
    let frame = 0;
    let raf: number | null = null;
    let fadeTimer: number | null = null;

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

    const emit = (amp: number) => {
      const cx = Math.floor(finger.x / CELL_PX);
      const cy = Math.floor(finger.y / CELL_PX);
      for (let dy = -SOURCE_RADIUS; dy <= SOURCE_RADIUS; dy++) {
        for (let dx = -SOURCE_RADIUS; dx <= SOURCE_RADIUS; dx++) {
          const x = cx + dx;
          const y = cy + dy;
          if (dx * dx + dy * dy > SOURCE_RADIUS * SOURCE_RADIUS) continue;
          if (x > 0 && y > 0 && x < cols - 1 && y < rows - 1) a[y * cols + x] += amp;
        }
      }
    };

    const reset = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      a.fill(0);
      b.fill(0);
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      glow = {warm: 0, phase: 0, energy: 0};
      washEl.style.setProperty("--warm", "0");
      cvs.style.opacity = "";
      washEl.style.opacity = "";
      fadeTimer = null;
    };

    const fadeOut = () => {
      cvs.style.opacity = "0";
      washEl.style.opacity = "0";
      fadeTimer = window.setTimeout(reset, FADE_MS);
    };

    const step = () => {
      if (!image) return;

      frame++;
      if (frame % SIM_EVERY === 0) {
        if (source.k < source.n) {
          emit(SOURCE_AMP * Math.sin((Math.PI * source.k) / source.n));
          source.k++;
        }
        let energy = 0;
        for (let y = 1; y < rows - 1; y++) {
          for (let x = 1; x < cols - 1; x++) {
            const i = y * cols + x;
            const v = ((a[i - 1] + a[i + 1] + a[i - cols] + a[i + cols]) / 2 - b[i]) * DAMPING;
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

      glow.warm += (Math.min(1, glow.energy / 2) - glow.warm) * 0.008;
      glow.phase += glow.energy * 0.0015;
      washEl.style.setProperty("--warm", glow.warm.toFixed(3));
      washEl.style.setProperty("--hue", (Math.sin(glow.phase) * 26).toFixed(2));

      if (!fadeTimer && !touching && source.k >= source.n && performance.now() - liftedAt > LINGER_MS) fadeOut();
      raf = requestAnimationFrame(step);
    };

    const onTouch = (e: TouchEvent) => {
      if (!touchMedia.matches || reducedMotion.matches || !e.touches.length) return;
      if (fadeTimer) {
        clearTimeout(fadeTimer);
        fadeTimer = null;
        cvs.style.opacity = "";
        washEl.style.opacity = "";
      }
      setupGrid();
      touching = true;
      finger = {x: e.touches[0].clientX, y: e.touches[0].clientY};
      if (e.type === "touchstart" || source.k >= source.n) {
        source = {k: 0, n: RAMP_STEPS};
        // Re-centre the wash only while it's dark, so it never jumps while lit.
        if (glow.warm < 0.05) {
          washEl.style.setProperty("--cx", `${finger.x}px`);
          washEl.style.setProperty("--cy", `${finger.y}px`);
        }
      }
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onLift = (e: TouchEvent) => {
      if (e.touches.length) return;
      touching = false;
      liftedAt = performance.now();
    };

    addEventListener("touchstart", onTouch, {passive: true});
    addEventListener("touchmove", onTouch, {passive: true});
    addEventListener("touchend", onLift, {passive: true});
    addEventListener("touchcancel", onLift, {passive: true});
    return () => {
      removeEventListener("touchstart", onTouch);
      removeEventListener("touchmove", onTouch);
      removeEventListener("touchend", onLift);
      removeEventListener("touchcancel", onLift);
      if (raf) cancelAnimationFrame(raf);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, []);

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
        className="pointer-events-none fixed left-0 top-0 z-[-1] transition-opacity duration-500 ease-out [image-rendering:pixelated]"
      />
    </>
  );
}
