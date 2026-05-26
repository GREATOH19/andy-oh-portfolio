"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {PhotoLightbox} from "@/components/PhotoLightbox";
import {VideoLightboxContent} from "@/components/VideoLightbox";
import {isSanityImage, isSanityVideo} from "@/lib/sanity/media";
import type {SanityImageField, SanityMediaField} from "@/lib/types/project";

export function MediaLightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: NonNullable<SanityMediaField>[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const item = items[index];
  const hasMultiple = items.length > 1;
  const [photoZoomed, setPhotoZoomed] = useState(false);
  const photoResetRef = useRef<(() => void) | null>(null);

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + items.length) % items.length);
  }, [index, items.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % items.length);
  }, [index, items.length, onIndexChange]);

  useEffect(() => {
    setPhotoZoomed(false);
  }, [index]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isSanityImage(item) && photoZoomed) {
          photoResetRef.current?.();
          return;
        }
        onClose();
        return;
      }
      if (photoZoomed) return;
      if (e.key === "ArrowLeft" && hasMultiple) goPrev();
      if (e.key === "ArrowRight" && hasMultiple) goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, hasMultiple, item, onClose, photoZoomed]);

  if (!item) return null;

  const handleBackdropClick = () => {
    if (isSanityImage(item) && photoZoomed) {
      photoResetRef.current?.();
      return;
    }
    onClose();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isSanityVideo(item) ? "Fullscreen video" : "Fullscreen photo"}
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
            aria-label="Previous"
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
            aria-label="Next"
          >
            ›
          </button>
          <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-widest text-white/60">
            {index + 1} / {items.length}
          </p>
        </>
      ) : null}

      <div
        className="relative flex h-[min(100dvh,100vh)] w-[min(100dvw,100vw)] items-center justify-center p-4 pt-14 sm:p-8 sm:pt-16"
        onClick={(e) => e.stopPropagation()}
      >
        {isSanityImage(item) ? (
          <PhotoLightbox
            images={[item as NonNullable<SanityImageField>]}
            index={0}
            onClose={onClose}
            onIndexChange={() => {}}
            embedded
            onZoomChange={setPhotoZoomed}
            onRegisterReset={(reset) => {
              photoResetRef.current = reset;
            }}
          />
        ) : isSanityVideo(item) ? (
          <VideoLightboxContent video={item} />
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
