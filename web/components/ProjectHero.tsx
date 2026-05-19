"use client";

import Image from "next/image";
import {useState} from "react";
import {PhotoLightbox} from "@/components/PhotoLightbox";
import {urlForImage} from "@/lib/sanity/image";
import type {SanityImageField} from "@/lib/types/project";
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

/**
 * Full-bleed cover above the project header.
 * Default: pulls up with `-mt-[var(--site-header-height)]` so the image sits under the sticky header.
 * Compact (narrow portrait or landscape ≤1024px): flush below the header, intrinsic image height (no vertical letterboxing).
 */
export function ProjectHero({
  image,
  alt,
  intrinsicWidth,
  intrinsicHeight,
}: {
  image: SanityImageField;
  alt: string;
  /** From Sanity `asset.metadata.dimensions` for correct compact layout */
  intrinsicWidth?: number;
  intrinsicHeight?: number;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!image?.asset?._ref) {    // #region agent log
    void fetch("http://127.0.0.1:7874/ingest/30e55b5c-45b0-4b40-95bc-fb3850ef4ee0", {
      method: "POST",
      headers: {"Content-Type": "application/json", "X-Debug-Session-Id": "76da51"},
      body: JSON.stringify({
        sessionId: "76da51",
        runId: "pre-fix",
        hypothesisId: "B",
        location: "ProjectHero.tsx:nullBranch",
        message: "ProjectHero returning null (no asset._ref)",
        data: {
          hasImageObject: image != null,
          assetKeys: image?.asset ? Object.keys(image.asset) : [],
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return null;
  }
  const src = urlForImage(image).width(2400).quality(92).url();
  // #region agent log
  void fetch("http://127.0.0.1:7874/ingest/30e55b5c-45b0-4b40-95bc-fb3850ef4ee0", {
    method: "POST",
    headers: {"Content-Type": "application/json", "X-Debug-Session-Id": "76da51"},
    body: JSON.stringify({
      sessionId: "76da51",
      runId: "pre-fix",
      hypothesisId: "D",
      location: "ProjectHero.tsx:beforeRender",
      message: "ProjectHero built CDN src",
      data: {
        srcHost: (() => {
          try {
            return new URL(src).hostname;
          } catch {
            return "invalid-url";
          }
        })(),
        srcPathPrefix: (() => {
          try {
            return new URL(src).pathname.slice(0, 24);
          } catch {
            return "";
          }
        })(),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

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