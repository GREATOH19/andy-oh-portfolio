"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {MediaLightbox} from "@/components/MediaLightbox";
import {SanityAspectMedia} from "@/components/sections/SanityAspectMedia";
import {useTypoClass} from "@/components/TypographyProvider";
import {
  FULL_WIDTH_MEDIA_DISPLAY_PX,
  FULL_WIDTH_MEDIA_SIZES,
} from "@/lib/sanity/imageRequestWidth";
import {
  isSanityImage,
  isSanityLightboxMedia,
  isSanityMedia,
  isSanityVideo,
  isSanityYoutube,
  sanityMediaKey,
} from "@/lib/sanity/media";
import type {SanityMediaField} from "@/lib/types/project";
import {resolveYoutubeVideoAspect} from "@/lib/youtube/parseYoutubeUrl";

function estimatedSlideHeight(
  item: NonNullable<SanityMediaField>,
  containerWidth: number,
): number | null {
  if (containerWidth <= 0) return null;
  if (isSanityImage(item)) {
    const d = item.asset?.metadata?.dimensions;
    if (d?.width && d?.height && d.width > 0) {
      return containerWidth * (d.height / d.width);
    }
    return containerWidth * (9 / 16);
  }
  if (isSanityYoutube(item)) {
    const portrait = resolveYoutubeVideoAspect(item.url, item.videoAspect) === "portrait";
    const width = containerWidth;
    return width * (portrait ? 16 / 9 : 9 / 16);
  }
  return null;
}

export function MediaCarousel({
  images,
  caption,
  thumbMaxWidth = FULL_WIDTH_MEDIA_DISPLAY_PX,
  sizes = FULL_WIDTH_MEDIA_SIZES,
  quality = 95,
}: {
  images: SanityMediaField[];
  caption?: string | null;
  thumbMaxWidth?: number;
  sizes?: string;
  quality?: number;
}) {
  const metaClass = useTypoClass("meta");
  const validMedia = images.filter(isSanityMedia) as NonNullable<SanityMediaField>[];
  const lightboxItems = validMedia.filter(isSanityLightboxMedia);
  const [index, setIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [slideHeights, setSlideHeights] = useState<number[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const count = validMedia.length;
  const hasMultiple = count > 1;
  const safeIndex = count > 0 ? Math.min(index, count - 1) : 0;

  const estimatedHeights = useMemo(
    () =>
      validMedia.map((item) => estimatedSlideHeight(item, containerWidth) ?? 0),
    [validMedia, containerWidth],
  );

  const measuredHeight = slideHeights[safeIndex] ?? slideHeights[0] ?? 0;
  const estimatedHeight = estimatedHeights[safeIndex] || estimatedHeights[0] || 0;
  const viewportHeight = measuredHeight > 0 ? measuredHeight : estimatedHeight;

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
    setSlideHeights([]);
    slideRefs.current = [];
    scrollRef.current?.scrollTo({left: 0});
  }, [count]);

  useEffect(() => {
    if (!hasMultiple) return;
    const root = containerRef.current;
    if (!root) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? 0;
      setContainerWidth((prev) => (prev === width ? prev : width));
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [hasMultiple]);

  useEffect(() => {
    if (!hasMultiple) return;

    const observers = slideRefs.current.map((slide, i) => {
      if (!slide) return null;

      const observer = new ResizeObserver(([entry]) => {
        const height = entry?.contentRect.height ?? 0;
        if (height <= 0) return;
        setSlideHeights((prev) => {
          if (prev[i] === height) return prev;
          const next = prev.length === count ? [...prev] : Array.from({length: count}, () => 0);
          next[i] = height;
          return next;
        });
      });
      observer.observe(slide);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [hasMultiple, count, validMedia]);

  if (count === 0) return null;

  const openLightbox = (i: number) => {
    const item = validMedia[i];
    if (!isSanityLightboxMedia(item)) return;
    const lbIndex = lightboxItems.indexOf(item);
    if (lbIndex >= 0) setLightboxIndex(lbIndex);
  };

  const renderSlide = (item: NonNullable<SanityMediaField>, i: number) => {
    const alt = item?.alt ?? "";
    const isClickable = isSanityLightboxMedia(item);
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
      />
    );

    if (!isClickable) {
      return <div className="w-full [&_iframe]:pointer-events-auto">{media}</div>;
    }

    const tileClass = `group w-full text-left transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.006] active:translate-y-0 active:scale-[0.997] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 ${
      isSanityImage(item) ? "cursor-zoom-in" : "cursor-pointer"
    } [&_video]:pointer-events-none`;

    if (isSanityVideo(item)) {
      return (
        <div
          role="button"
          tabIndex={0}
          onClick={() => openLightbox(i)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openLightbox(i);
            }
          }}
          className={tileClass}
          aria-label={label}
        >
          {media}
        </div>
      );
    }

    return (
      <button type="button" onClick={() => openLightbox(i)} className={tileClass} aria-label={label}>
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
        {lightboxIndex !== null && lightboxItems.length > 0 ? (
          <MediaLightbox
            items={lightboxItems}
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
      <div className="relative" ref={containerRef}>
        <div
          className="overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none"
          style={viewportHeight > 0 ? {height: `${viewportHeight}px`} : undefined}
        >
          <div
            ref={scrollRef}
            className="flex items-start snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

      {lightboxIndex !== null && lightboxItems.length > 0 ? (
        <MediaLightbox
          items={lightboxItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      ) : null}
    </figure>
  );
}
