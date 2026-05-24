"use client";

import { useEffect } from "react";

import { grainTileStyle } from "@/lib/grain";

/** Softer than linear scroll — less “mechanical” drift */
function smoothScrollT(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function getGradient(scrollRatio: number) {
  const t = smoothScrollT(scrollRatio);
  const dx = 3;
  const dy = 2;

  return [
    `radial-gradient(1100px 720px at ${54 + t * dx}% ${18 + t * dy}%, rgba(86, 205, 255, 0.145), rgba(86, 205, 255, 0) 66%)`,
    `radial-gradient(980px 820px at ${16 - t * dx * 0.72}% ${56 + t * dy * 0.85}%, rgba(112, 215, 255, 0.125), rgba(112, 215, 255, 0) 68%)`,
    `radial-gradient(760px 480px at ${68 + t * dx * 0.48}% ${66 - t * dy * 0.42}%, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0) 72%)`,
  ].join(",");
}

export function ScrollGradient() {
  useEffect(() => {
    const el = document.getElementById("scroll-gradient");
    if (!el) return;

    let ticking = false;
    let onScroll: (() => void) | undefined;

    const applyStyles = (ratio: number) => {
      el.style.background = getGradient(ratio);
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundPosition = "center center";
      el.style.backgroundSize = "cover";
    };

    const readRatio = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      return Math.min(1, scrollTop / scrollHeight);
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      if (onScroll) {
        window.removeEventListener("scroll", onScroll);
        onScroll = undefined;
      }
      if (mq.matches) {
        applyStyles(0);
        return;
      }
      onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            applyStyles(readRatio());
            ticking = false;
          });
        }
      };
      applyStyles(readRatio());
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      if (onScroll) window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 isolate z-0"
      aria-hidden
    >
      <div id="scroll-gradient" className="absolute inset-0" />
      <div
        className="absolute inset-0 mix-blend-soft-light opacity-[0.07]"
        style={grainTileStyle}
      />
    </div>
  );
}
