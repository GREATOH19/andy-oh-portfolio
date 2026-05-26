"use client";

import Image from "next/image";
import {useState, type CSSProperties} from "react";
import {MediaLightbox} from "@/components/MediaLightbox";
import {PhotoLightbox} from "@/components/PhotoLightbox";
import {useTypoClass} from "@/components/TypographyProvider";
import {urlForImage} from "@/lib/sanity/image";
import {isSanityImage, isSanityVideo, sanityVideoUrl} from "@/lib/sanity/media";
import type {SanityMediaField} from "@/lib/types/project";

export const PROJECT_HERO_COMPACT =
  "max-md:portrait:block [@media(orientation:landscape)_and_(max-width:1024px)]:block";
export const PROJECT_HERO_DESKTOP =
  "max-md:portrait:hidden [@media(orientation:landscape)_and_(max-width:1024px)]:hidden";

const COMPACT_BLOCK = `hidden ${PROJECT_HERO_COMPACT}`;
const COMPACT_HIDDEN = PROJECT_HERO_DESKTOP;

function HeroBottomGradient({compact = false}: {compact?: boolean}) {
  return (
    <div
      aria-hidden="true"
      className={`project-hero-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 z-[5] ${
        compact ? "h-48 sm:h-56" : "h-56 sm:h-64 md:h-80"
      }`}
    />
  );
}

function HeroBottomChrome({title, subtitle}: {title: string; subtitle?: string | null}) {
  const displayClass = useTypoClass("display");
  const bodyClass = useTypoClass("body");

  return (
    <div className="project-hero-bottom-bar pointer-events-none absolute inset-x-0 bottom-5 z-10 px-8 sm:bottom-7 md:px-16 lg:px-24">
      <div className="relative flex items-end">
        <div className="mb-8 max-w-[min(72%,40rem)] pr-14 sm:mb-10 sm:pr-16">
          <h1
            className={`project-hero-overlay-text text-4xl leading-[1.05] sm:text-5xl md:text-6xl ${displayClass}`}
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              className={`project-hero-overlay-text mt-1.5 text-lg leading-snug sm:mt-2 sm:text-xl ${bodyClass}`}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
        <a
          href="#project-header"
          aria-label="Scroll to project description"
          className="project-hero-overlay-text pointer-events-auto absolute bottom-0 left-1/2 -translate-x-1/2 text-white/90 transition-opacity hover:text-white"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="animate-bounce sm:h-10 sm:w-10"
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
      </div>
    </div>
  );
}

/** Compact hero — image only + scroll cue (matches pre-overlay mobile layout). */
function HeroMobileScrollNavigator() {
  return (
    <>
      <HeroBottomGradient compact />
      <a
        href="#project-header"
        aria-label="Scroll to project description"
        className="project-hero-overlay-text absolute inset-x-0 bottom-5 z-10 mx-auto flex w-fit text-white/90 transition-opacity hover:text-white sm:bottom-7"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-7 w-7 animate-bounce"
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

function ProjectHeroChrome({title, subtitle}: {title: string; subtitle?: string | null}) {
  return (
    <div className={COMPACT_HIDDEN}>
      <HeroBottomGradient />
      <HeroBottomChrome title={title} subtitle={subtitle} />
    </div>
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
  title,
  subtitle,
  intrinsicWidth,
  intrinsicHeight,
}: {
  media: SanityMediaField;
  alt: string;
  title: string;
  subtitle?: string | null;
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
    const viewLabel = videoAlt ? `Play ${videoAlt}` : "Play project cover video";

    return (
      <>
        <section
          aria-label="Project cover"
          className={`relative -mt-[var(--site-header-height)] h-[100dvh] w-full overflow-hidden bg-zinc-100 ${COMPACT_HIDDEN}`}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute inset-0 z-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 [&_video]:pointer-events-none"
            aria-label={viewLabel}
          >
            <HeroVideo
              src={src}
              alt={videoAlt}
              loop={loop}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </button>
          <ProjectHeroChrome title={title} subtitle={subtitle} />
        </section>

        <section
          aria-label="Project cover"
          className={`relative mt-0 w-full bg-zinc-100 leading-none ${COMPACT_BLOCK}`}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="block w-full cursor-pointer text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 [&_video]:pointer-events-none"
            aria-label={viewLabel}
          >
            <HeroVideo
              src={src}
              alt={videoAlt}
              loop={loop}
              className="block h-auto w-full max-w-full object-cover"
              style={{aspectRatio: `${layoutW} / ${layoutH}`}}
            />
          </button>
          <HeroMobileScrollNavigator />
        </section>

        {lightboxOpen ? (
          <MediaLightbox
            items={[media]}
            index={0}
            onClose={() => setLightboxOpen(false)}
            onIndexChange={() => {}}
          />
        ) : null}
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
          className="absolute inset-0 z-0 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
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
        <ProjectHeroChrome title={title} subtitle={subtitle} />
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
        <HeroMobileScrollNavigator />
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
