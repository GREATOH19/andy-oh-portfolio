"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {MediaLightbox} from "@/components/MediaLightbox";
import {SanityAspectMedia} from "@/components/sections/SanityAspectMedia";
import {useTypoClass} from "@/components/TypographyProvider";
import {
  FULL_WIDTH_MEDIA_DISPLAY_PX,
  FULL_WIDTH_MEDIA_SIZES,
} from "@/lib/sanity/imageRequestWidth";
import {isSanityImage, isSanityMedia, isSanityVideo, sanityMediaKey} from "@/lib/sanity/media";
import type {SanityMediaField} from "@/lib/types/project";

export function MediaCarousel({
  images,
  caption,
  thumbMaxWidth = FULL_WIDTH_MEDIA_DISPLAY_PX,
  sizes = FULL_WIDTH_MEDIA_SIZES,
  quality = 95,
  unoptimized = false,
}: {
  images: SanityMediaField[];
  caption?: string | null;
  thumbMaxWidth?: number;
  sizes?: string;
  quality?: number;
  unoptimized?: boolean;
}) {
  const metaClass = useTypoClass("meta");
  const validMedia = images.filter(isSanityMedia) as NonNullable<SanityMediaField>[];
  const [index, setIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const count = validMedia.length;
  const hasMultiple = count > 1;
  const safeIndex = count > 0 ? Math.min(index, count - 1) : 0;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      const wrapped = ((next % count) + count) % count;
      setIndex(wrapped);
      slideRefs.current[wrapped]?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    },
    [count],
  );

  useEffect(() => {
    if (!hasMultiple) return;
    const root = scrollRef.current;
    if (!root) return;

    const onScroll = () => {
      const {scrollLeft, clientWidth} = root;
      if (clientWidth <= 0) return;
      const next = Math.round(scrollLeft / clientWidth);
      setIndex((prev) => (prev === next ? prev : next));
    };

    root.addEventListener("scroll", onScroll, {passive: true});
    return () => root.removeEventListener("scroll", onScroll);
  }, [hasMultiple]);

  useEffect(() => {
    setIndex(0);
    slideRefs.current = [];
    scrollRef.current?.scrollTo({left: 0});
  }, [count]);

  if (count === 0) return null;

  const openLightbox = (i: number) => {
    const item = validMedia[i];
    if (isSanityImage(item) || isSanityVideo(item)) {
      setLightboxIndex(i);
    }
  };

  const renderSlide = (item: NonNullable<SanityMediaField>, i: number) => {
    const alt = item?.alt ?? "";
    const isClickable = isSanityImage(item) || isSanityVideo(item);
    const label = isSanityVideo(item)
      ? alt
        ? `Play ${alt}`
        : `Play video ${i + 1}`
      : alt
        ? `View ${alt}`
        : `View photo ${i + 1}`;

    const media = (
      <SanityAspectMedia
        media={item}
        alt={alt}
        maxWidth={thumbMaxWidth}
        quality={quality}
        sizes={sizes}
        unoptimized={unoptimized}
      />
    );

    if (!isClickable) {
      return <div className="w-full">{media}</div>;
    }

    return (
      <button
        type="button"
        onClick={() => openLightbox(i)}
        className={`group w-full text-left transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.006] active:translate-y-0 active:scale-[0.997] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 ${
          isSanityImage(item) ? "cursor-zoom-in" : "cursor-pointer"
        } [&_video]:pointer-events-none`}
        aria-label={label}
      >
        {media}
      </button>
    );
  };

  if (!hasMultiple) {
    return (
      <figure className="w-full">
        {renderSlide(validMedia[0]!, 0)}
        {caption ? (
          <figcaption className={`mt-3 text-sm text-zinc-500 ${metaClass}`}>{caption}</figcaption>
        ) : null}
        {lightboxIndex !== null ? (
          <MediaLightbox
            items={validMedia}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onIndexChange={setLightboxIndex}
          />
        ) : null}
      </figure>
    );
  }

  return (
    <figure className="w-full">
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-roledescription="carousel"
          aria-label="Image carousel"
        >
          {validMedia.map((item, i) => (
            <div
              key={sanityMediaKey(item, i)}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="w-full shrink-0 snap-start"
              aria-hidden={i !== safeIndex}
            >
              {renderSlide(item, i)}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(safeIndex - 1)}
          className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl leading-none text-white/90 transition-colors hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => goTo(safeIndex + 1)}
          className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl leading-none text-white/90 transition-colors hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Next slide"
        >
          ›
        </button>

        <div
          className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5"
          aria-hidden
        >
          {validMedia.map((item, i) => (
            <span
              key={sanityMediaKey(item, i)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === safeIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      <p className={`mt-2 text-center text-xs uppercase tracking-widest text-zinc-400 ${metaClass}`}>
        {safeIndex + 1} / {count}
      </p>

      {caption ? (
        <figcaption className={`mt-2 text-sm text-zinc-500 ${metaClass}`}>{caption}</figcaption>
      ) : null}

      {lightboxIndex !== null ? (
        <MediaLightbox
          items={validMedia}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      ) : null}
    </figure>
  );
}
