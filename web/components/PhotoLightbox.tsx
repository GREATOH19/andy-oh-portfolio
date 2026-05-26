"use client";

import {useCallback, useEffect, useRef, useState, type TouchList as ReactTouchList} from "react";
import {createPortal} from "react-dom";
import {sanityImageAssetId, urlForImage} from "@/lib/sanity/image";
import type {SanityImageField} from "@/lib/types/project";

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const CLICK_ZOOM_SCALE = 2.5;
const DRAG_THRESHOLD_PX = 8;

function clampScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

function touchDistance(touches: ReactTouchList) {
  const dx = touches[1].clientX - touches[0].clientX;
  const dy = touches[1].clientY - touches[0].clientY;
  return Math.hypot(dx, dy);
}

function touchMidpoint(touches: ReactTouchList, rect: DOMRect) {
  const x = (touches[0].clientX + touches[1].clientX) / 2 - rect.left - rect.width / 2;
  const y = (touches[0].clientY + touches[1].clientY) / 2 - rect.top - rect.height / 2;
  return {x, y};
}

export function PhotoLightbox({
  images,
  index,
  onClose,
  onIndexChange,
  embedded = false,
  onZoomChange,
  onRegisterReset,
}: {
  images: SanityImageField[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  /** Render only the zoomable viewport (parent provides overlay chrome). */
  embedded?: boolean;
  onZoomChange?: (zoomed: boolean) => void;
  onRegisterReset?: (reset: () => void) => void;
}) {
  const image = images[index];
  const assetId = image ? sanityImageAssetId(image) : null;
  const hasMultiple = images.length > 1;

  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);

  const scaleRef = useRef(scale);
  const offsetRef = useRef(offset);
  scaleRef.current = scale;
  offsetRef.current = offset;

  const pinchRef = useRef<{distance: number; scale: number} | null>(null);

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({x: 0, y: 0});
  }, []);

  const zoomAtPoint = useCallback((clientX: number, clientY: number, nextScale: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const px = clientX - rect.left - rect.width / 2;
    const py = clientY - rect.top - rect.height / 2;
    const currentScale = scaleRef.current;
    const currentOffset = offsetRef.current;
    const ratio = nextScale / currentScale;

    setScale(nextScale);
    setOffset({
      x: px - (px - currentOffset.x) * ratio,
      y: py - (py - currentOffset.y) * ratio,
    });
  }, []);

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length);
  }, [images.length, index, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % images.length);
  }, [images.length, index, onIndexChange]);

  useEffect(() => {
    resetZoom();
  }, [index, resetZoom]);

  useEffect(() => {
    onZoomChange?.(scale > 1);
  }, [onZoomChange, scale]);

  useEffect(() => {
    onRegisterReset?.(resetZoom);
  }, [onRegisterReset, resetZoom]);

  useEffect(() => {
    if (embedded) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [embedded]);

  useEffect(() => {
    if (embedded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (scaleRef.current > 1) {
          resetZoom();
          return;
        }
        onClose();
      }
      if (scaleRef.current > 1) return;
      if (e.key === "ArrowLeft" && hasMultiple) goPrev();
      if (e.key === "ArrowRight" && hasMultiple) goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [embedded, goNext, goPrev, hasMultiple, onClose, resetZoom]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const nextScale = clampScale(scaleRef.current * delta);
      if (nextScale === scaleRef.current) return;
      zoomAtPoint(e.clientX, e.clientY, nextScale);
    };

    viewport.addEventListener("wheel", onWheel, {passive: false});
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [zoomAtPoint]);

  const handleBackdropClick = () => {
    if (scale > 1) {
      resetZoom();
      return;
    }
    onClose();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    const pointerId = e.pointerId;
    const startX = e.clientX;
    const startY = e.clientY;
    let lastX = startX;
    let lastY = startY;
    let moved = false;

    const onPointerMove = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;

      if (!moved) {
        const dist = Math.hypot(ev.clientX - startX, ev.clientY - startY);
        if (dist <= DRAG_THRESHOLD_PX) return;
        moved = true;
        if (scaleRef.current <= 1) return;
        setIsDragging(true);
        lastX = ev.clientX;
        lastY = ev.clientY;
        return;
      }

      if (scaleRef.current <= 1) return;
      ev.preventDefault();
      const dx = ev.clientX - lastX;
      const dy = ev.clientY - lastY;
      lastX = ev.clientX;
      lastY = ev.clientY;
      setOffset((prev) => ({x: prev.x + dx, y: prev.y + dy}));
    };

    const endPointer = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endPointer);
      window.removeEventListener("pointercancel", endPointer);
      setIsDragging(false);

      if (!moved && scaleRef.current <= 1.05) {
        zoomAtPoint(ev.clientX, ev.clientY, CLICK_ZOOM_SCALE);
      }
    };

    window.addEventListener("pointermove", onPointerMove, {passive: false});
    window.addEventListener("pointerup", endPointer);
    window.addEventListener("pointercancel", endPointer);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 2) return;
    pinchRef.current = {distance: touchDistance(e.touches), scale: scaleRef.current};
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 2 || !pinchRef.current || !viewportRef.current) return;
    e.preventDefault();
    const distance = touchDistance(e.touches);
    const nextScale = clampScale(pinchRef.current.scale * (distance / pinchRef.current.distance));
    const midpoint = touchMidpoint(e.touches, viewportRef.current.getBoundingClientRect());
    const rect = viewportRef.current.getBoundingClientRect();
    const clientX = midpoint.x + rect.left + rect.width / 2;
    const clientY = midpoint.y + rect.top + rect.height / 2;
    zoomAtPoint(clientX, clientY, nextScale);
  };

  const handleTouchEnd = () => {
    pinchRef.current = null;
  };

  if (!assetId || !image) return null;

  const src = urlForImage(image).width(4096).quality(95).url();
  const alt = image.alt ?? "";
  const isZoomed = scale > 1;

  const viewport = (
    <div
      ref={viewportRef}
      className={`relative flex touch-none select-none items-center justify-center overflow-hidden ${
        embedded
          ? "h-full w-full"
          : `h-[min(100dvh,100vh)] w-[min(100dvw,100vw)] p-4 pt-14 sm:p-8 sm:pt-16`
      } ${isZoomed ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"}`}
      onClick={(e) => {
        if (!embedded) e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (scaleRef.current > 1.05) resetZoom();
      }}
      onPointerDown={handlePointerDown}
      onDragStart={(e) => e.preventDefault()}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="pointer-events-none max-h-[calc(100dvh-5rem)] max-w-[calc(100dvw-2rem)] select-none object-contain will-change-transform sm:max-h-[calc(100dvh-8rem)] sm:max-w-[calc(100dvw-4rem)]"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
        }}
      />
    </div>
  );

  if (embedded) return viewport;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen photo"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95"
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-4 top-4 z-10 flex h-14 w-14 items-center justify-center rounded-full text-4xl leading-none text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:right-6 sm:top-6 sm:h-16 sm:w-16 sm:text-5xl"
        aria-label="Close"
      >
        ×
      </button>

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full px-2 py-3 text-2xl leading-none text-white/70 transition-colors hover:text-white sm:left-4 sm:px-3 sm:py-4 sm:text-3xl"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full px-2 py-3 text-2xl leading-none text-white/70 transition-colors hover:text-white sm:right-4 sm:px-3 sm:py-4 sm:text-3xl"
            aria-label="Next photo"
          >
            ›
          </button>
          <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-widest text-white/60">
            {index + 1} / {images.length}
          </p>
        </>
      ) : null}

      <p
        className={`pointer-events-none absolute left-1/2 z-10 hidden -translate-x-1/2 text-[10px] uppercase tracking-widest text-white/40 sm:block ${
          hasMultiple ? "bottom-12" : "bottom-4"
        }`}
      >
        {isZoomed ? "Scroll to zoom · Drag to pan · Esc to reset" : "Click or scroll to zoom"}
      </p>

      <div onClick={(e) => e.stopPropagation()}>{viewport}</div>
    </div>,
    document.body,
  );
}
