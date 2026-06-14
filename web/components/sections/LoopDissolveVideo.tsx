"use client";

import {useCallback, useEffect, useRef, type SyntheticEvent} from "react";

const DISSOLVE_SEC = 0.2;

export function LoopDissolveVideo({
  src,
  muted,
  alt,
  objectFit = "contain",
  objectPosition,
  onLoadedMetadata,
  onError,
}: {
  src: string;
  muted: boolean;
  alt: string;
  objectFit?: "contain" | "cover";
  objectPosition?: string;
  onLoadedMetadata?: (event: SyntheticEvent<HTMLVideoElement>) => void;
  onError?: () => void;
}) {
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);
  const activeRef = useRef<0 | 1>(0);
  const dissolvingRef = useRef(false);
  const bSrcReadyRef = useRef(false);

  const syncMuted = useCallback(() => {
    const a = refA.current;
    const b = refB.current;
    if (!a || !b) return;
    a.muted = muted;
    b.muted = muted;
  }, [muted]);

  useEffect(() => {
    syncMuted();
  }, [syncMuted]);

  useEffect(() => {
    if (muted) return;
    const active = activeRef.current === 0 ? refA.current : refB.current;
    if (active) void active.play().catch(() => {});
  }, [muted]);

  useEffect(() => {
    const a = refA.current;
    const b = refB.current;
    if (!a || !b) return;

    const videos: [HTMLVideoElement, HTMLVideoElement] = [a, b];

    const tryPlay = (el: HTMLVideoElement) => {
      if (!muted) return;
      if (el.readyState < 1) el.load();
      void el.play().catch(() => {});
    };

    const resetLayer = (el: HTMLVideoElement, visible: boolean) => {
      el.style.opacity = visible ? "1" : "0";
      if (!visible) {
        el.pause();
        el.currentTime = 0;
      }
    };

    const ensureBackupSrc = (to: HTMLVideoElement) => {
      if (bSrcReadyRef.current) return;
      to.src = src;
      bSrcReadyRef.current = true;
    };

    const startDissolve = (from: HTMLVideoElement, to: HTMLVideoElement) => {
      if (dissolvingRef.current) return;
      const duration = from.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;

      ensureBackupSrc(to);
      dissolvingRef.current = true;
      to.currentTime = 0;
      to.style.opacity = "0";
      void to.play().catch(() => {});

      const dissolveSec = Math.min(DISSOLVE_SEC, duration / 2);
      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / (dissolveSec * 1000));
        from.style.opacity = String(1 - t);
        to.style.opacity = String(t);

        if (t < 1) {
          requestAnimationFrame(tick);
          return;
        }

        from.pause();
        from.currentTime = 0;
        from.style.opacity = "0";
        to.style.opacity = "1";
        activeRef.current = activeRef.current === 0 ? 1 : 0;
        dissolvingRef.current = false;
      };

      requestAnimationFrame(tick);
    };

    const onTimeUpdate = (index: 0 | 1) => {
      if (activeRef.current !== index || dissolvingRef.current) return;
      const from = videos[index];
      const to = videos[index === 0 ? 1 : 0];
      const duration = from.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;

      const dissolveSec = Math.min(DISSOLVE_SEC, duration / 2);
      if (duration - from.currentTime <= dissolveSec) {
        startDissolve(from, to);
      }
    };

    const onTimeUpdateA = () => onTimeUpdate(0);
    const onTimeUpdateB = () => onTimeUpdate(1);

    a.addEventListener("timeupdate", onTimeUpdateA);
    b.addEventListener("timeupdate", onTimeUpdateB);

    bSrcReadyRef.current = false;
    resetLayer(a, true);
    resetLayer(b, false);
    activeRef.current = 0;
    tryPlay(a);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        const active = videos[activeRef.current];
        if (visible) tryPlay(active);
        else {
          a.pause();
          b.pause();
        }
      },
      {threshold: 0.2},
    );
    observer.observe(a);

    return () => {
      a.removeEventListener("timeupdate", onTimeUpdateA);
      b.removeEventListener("timeupdate", onTimeUpdateB);
      observer.disconnect();
    };
  }, [src, muted]);

  const videoClass = [
    "absolute inset-0 block h-full w-full",
    objectFit === "cover" ? "object-cover" : "object-contain",
  ].join(" ");
  const videoStyle = objectPosition ? {objectPosition} : undefined;

  return (
    <div className="relative h-full w-full">
      <video
        ref={refA}
        src={src}
        className={videoClass}
        style={videoStyle}
        playsInline
        muted={muted}
        loop={false}
        preload="none"
        aria-label={alt || undefined}
        onLoadedMetadata={onLoadedMetadata}
        onError={onError}
      />
      <video
        ref={refB}
        className={videoClass}
        style={videoStyle}
        playsInline
        muted={muted}
        loop={false}
        preload="none"
        aria-hidden
        onError={onError}
      />
    </div>
  );
}
