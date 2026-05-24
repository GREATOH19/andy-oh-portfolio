"use client";

import Image from "next/image";
import {useState, type CSSProperties} from "react";
import {PhotoLightbox} from "@/components/PhotoLightbox";
import {urlForImage} from "@/lib/sanity/image";
import {isSanityImage, isSanityVideo, sanityVideoUrl} from "@/lib/sanity/media";
import type {SanityMediaField} from "@/lib/types/project";

const COMPACT_BLOCK =
  "hidden max-md:portrait:block [@media(orientation:landscape)_and_(max-width:1024px)]:block";
const COMPACT_HIDDEN =
  "max-md:portrait:hidden [@media(orientation:landscape)_and_(max-width:1024px)]:hidden";

function HeroScrollNavigator() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-white/95 via-white/45 to-transparent sm:h-36"
      />
      <a
        href="#project-header"
        aria-label="Scroll to project description"
        className="absolute inset-x-0 bottom-5 z-10 mx-auto flex w-fit flex-col items-center gap-1 text-zinc-700/90 transition-opacity hover:text-zinc-900 sm:bottom-7"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="animate-bounce drop-shadow-sm sm:h-11 sm:w-11"
        >
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </>
  );
}

function HeroVideo({
  src,
  alt,
  loop,
  className,
  style,
}: {
  src: string;
  alt: string;
  loop: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <video
      src={src}
      className={className}
      style={style}
      playsInline
      muted
      loop={loop}
      autoPlay
      controls={!loop}
      aria-label={alt || undefined}
    />
  );
}

/**
 * Full-bleed cover above the project header.
 * Default: pulls up with `-mt-[var(--site-header-height)]` so the media sits under the sticky header.
 * Compact (narrow portrait or landscape ≤1024px): flush below the header, intrinsic image height (no vertical letterboxing).
 */
export function ProjectHero({
  media,
  alt,
  intrinsicWidth,
  intrinsicHeight,
}: {
  media: SanityMediaField;
  alt: string;
  /** From Sanity `asset.metadata.dimensions` for correct compact layout */
  intrinsicWidth?: number;
  intrinsicHeight?: number;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (isSanityVideo(media)) {
    const src = sanityVideoUrl(media);
    if (!src) return null;

    const loop = media.loop ?? true;
    const videoAlt = media.alt?.trim() || alt;
    const layoutW = intrinsicWidth && intrinsicHeight ? intrinsicWidth : 1920;
    const layoutH = intrinsicWidth && intrinsicHeight ? intrinsicHeight : 1080;

    return (
      <>
        <section
          aria-label="Project cover"
          className={`relative -mt-[var(--site-header-height)] h-[100dvh] w-full overflow-hidden bg-zinc-100 ${COMPACT_HIDDEN}`}
        >
          <HeroVideo
            src={src}
            alt={videoAlt}
            loop={loop}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <HeroScrollNavigator />
        </section>

        <section
          aria-label="Project cover"
          className={`relative mt-0 w-full bg-zinc-100 leading-none ${COMPACT_BLOCK}`}
        >
          <HeroVideo
            src={src}
            alt={videoAlt}
            loop={loop}
            className="block h-auto w-full max-w-full object-cover"
            style={{aspectRatio: `${layoutW} / ${layoutH}`}}
          />
          <HeroScrollNavigator />
        </section>
      </>
    );
  }

  if (!isSanityImage(media)) {
    return null;
  }

  const image = media;
  const src = urlForImage(image).width(2400).quality(92).url();

  const layoutW = intrinsicWidth && intrinsicHeight ? intrinsicWidth : 2400;
  const layoutH = intrinsicWidth && intrinsicHeight ? intrinsicHeight : 1600;
  const viewLabel = alt ? `View ${alt}` : "View project cover";

  return (
    <>
      <section
        aria-label="Project cover"
        className={`relative -mt-[var(--site-header-height)] h-[100dvh] w-full overflow-hidden bg-zinc-100 ${COMPACT_HIDDEN}`}
      >
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
          aria-label={viewLabel}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </button>
        <HeroScrollNavigator />
      </section>

      <section
        aria-label="Project cover"
        className={`relative mt-0 w-full bg-zinc-100 leading-none ${COMPACT_BLOCK}`}
      >
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="block w-full cursor-zoom-in text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
          aria-label={viewLabel}
        >
          <Image
            src={src}
            alt={alt}
            width={layoutW}
            height={layoutH}
            priority
            sizes="100vw"
            className="block h-auto w-full max-w-full"
          />
        </button>
        <HeroScrollNavigator />
      </section>

      {lightboxOpen ? (
        <PhotoLightbox
          images={[image]}
          index={0}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={() => {}}
        />
      ) : null}
    </>
  );
}
