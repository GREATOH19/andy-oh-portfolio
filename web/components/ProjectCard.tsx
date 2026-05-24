"use client";

import Image from "next/image";
import Link from "next/link";
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";

import {urlForImage} from "@/lib/sanity/image";
import {isSanityImage, isSanityVideo, normalizeMediaItem, sanityVideoUrl} from "@/lib/sanity/media";
import {useSiteTypography, useTypoClass} from "@/components/TypographyProvider";
import type {ProjectListItem} from "@/lib/types/project";

function useTouchPrimary() {
  const [touchPrimary, setTouchPrimary] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const sync = () => setTouchPrimary(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return touchPrimary;
}

function ProjectCardOverlayTitle({title, className}: {title: string; className: string}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = titleRef.current;
    if (!container || !el) return;

    const fit = () => {
      el.style.fontSize = "";
      const maxPx = parseFloat(getComputedStyle(el).fontSize);
      if (!maxPx) return;

      const minPx = Math.max(13, maxPx * 0.45);
      let size = maxPx;
      el.style.fontSize = `${size}px`;

      while (el.scrollWidth > container.clientWidth && size > minPx) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }
    };

    fit();
    void document.fonts?.ready.then(fit);

    const observer = new ResizeObserver(fit);
    observer.observe(container);
    return () => observer.disconnect();
  }, [title]);

  return (
    <div ref={containerRef} className="w-full min-w-0 px-2">
      <h2 ref={titleRef} className={`whitespace-nowrap ${className}`}>
        {title}
      </h2>
    </div>
  );
}

function ProjectCardHeroVideo({
  src,
  loop,
  alt,
  className,
  active,
}: {
  src: string;
  loop: boolean;
  alt: string;
  className: string;
  active: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (active) {
      void video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [active, src]);

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      muted
      loop={loop}
      playsInline
      preload="metadata"
      aria-label={alt || undefined}
    />
  );
}

export function ProjectCard({
  project,
  touchOverlayOpen: touchOverlayOpenControlled,
  onTouchOverlayToggle,
}: {
  project: ProjectListItem;
  /** When set with onTouchOverlayToggle, only one card in the grid can be open (mobile). */
  touchOverlayOpen?: boolean;
  onTouchOverlayToggle?: () => void;
}) {
  const displayClass = useTypoClass("display");
  const bodyClass = useTypoClass("body");
  const typography = useSiteTypography();
  const overlayTitleClass =
    typography?.display === "gloock"
      ? "project-card-gloock-title tracking-tight"
      : "tracking-tight";
  const href = project.slug ? `/projects/${project.slug}` : "#";
  const touchPrimary = useTouchPrimary();
  const [touchOverlayOpenLocal, setTouchOverlayOpenLocal] = useState(false);
  const touchControlled = onTouchOverlayToggle !== undefined;
  const touchOverlayOpen = touchControlled
    ? (touchOverlayOpenControlled ?? false)
    : touchOverlayOpenLocal;
  const [hovered, setHovered] = useState(false);

  const coverMedia = normalizeMediaItem(project.coverImage);
  const heroMedia = normalizeMediaItem(project.heroImage);
  const heroVideo = isSanityVideo(heroMedia) ? heroMedia : null;
  const heroImage = isSanityImage(heroMedia) ? heroMedia : null;

  const thumbnail =
    isSanityImage(coverMedia) ? coverMedia : isSanityImage(heroMedia) ? heroMedia : null;

  const thumbSrc = thumbnail?.asset?._ref
    ? urlForImage(thumbnail).width(1600).height(1200).quality(90).url()
    : null;
  const heroImageSrc =
    heroImage?.asset?._ref && heroImage !== thumbnail
      ? urlForImage(heroImage).width(1600).height(1200).quality(90).url()
      : null;
  const heroVideoSrc = heroVideo ? sanityVideoUrl(heroVideo) : null;

  const thumbAlt = thumbnail?.alt ?? project.title;
  const heroAlt = heroVideo?.alt ?? heroImage?.alt ?? project.title;

  const hasDistinctHeroImage = Boolean(heroImageSrc);
  const hasDistinctHeroVideo = Boolean(heroVideoSrc && thumbSrc);
  const hasVideoOnlyHero = Boolean(heroVideoSrc && !thumbSrc);
  const hasDistinctHero = hasDistinctHeroImage || hasDistinctHeroVideo;
  const overlayOpen = touchPrimary && touchOverlayOpen;
  const heroVideoActive = hovered || overlayOpen;
  const thumbHiddenClass = overlayOpen
    ? "opacity-0"
    : "opacity-100 [@media(hover:hover)]:group-hover:opacity-0 group-focus-within:opacity-0";
  const heroOverlayClass = overlayOpen
    ? "opacity-100 blur-[2px]"
    : "opacity-0 blur-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:blur-[2px] group-focus-within:opacity-100 group-focus-within:blur-[2px]";

  const tagline = project.subtitle?.trim() || null;

  const onImageAreaClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!touchPrimary) return;
      if ((e.target as HTMLElement).closest("a[data-project-card-link]")) return;
      e.preventDefault();
      if (touchControlled) {
        onTouchOverlayToggle!();
      } else {
        setTouchOverlayOpenLocal((o) => !o);
      }
    },
    [touchPrimary, touchControlled, onTouchOverlayToggle],
  );

  return (
    <article className="block" aria-label={project.title}>
      <div
        className="group relative aspect-[4/3] w-full cursor-default overflow-hidden bg-background transition-shadow duration-500 [@media(hover:hover)]:cursor-pointer [@media(hover:hover)]:group-hover:shadow-lg [@media(hover:none)]:cursor-pointer"
        onClick={onImageAreaClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setHovered(false);
          }
        }}
      >
        {hasDistinctHero && thumbSrc ? (
          <Image
            src={thumbSrc}
            alt={thumbAlt}
            fill
            className={`object-cover transition-opacity duration-500 ease-out ${thumbHiddenClass}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
        {hasDistinctHeroVideo && heroVideoSrc ? (
          <ProjectCardHeroVideo
            src={heroVideoSrc}
            loop={heroVideo?.loop ?? true}
            alt={heroAlt}
            active={heroVideoActive}
            className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${heroOverlayClass}`}
          />
        ) : null}
        {heroImageSrc ? (
          <Image
            src={heroImageSrc}
            alt={heroAlt}
            fill
            className={`object-cover transition-opacity duration-500 ease-out ${heroOverlayClass}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
        {hasVideoOnlyHero && heroVideoSrc ? (
          <ProjectCardHeroVideo
            src={heroVideoSrc}
            loop={heroVideo?.loop ?? true}
            alt={heroAlt}
            active
            className={`absolute inset-0 h-full w-full object-cover transition-[filter] duration-500 ease-out ${overlayOpen ? "blur-[2px]" : "blur-0"} [@media(hover:hover)]:group-hover:blur-[2px] group-focus-within:blur-[2px]`}
          />
        ) : null}
        {!hasDistinctHero && !hasVideoOnlyHero && thumbSrc ? (
          <Image
            src={thumbSrc}
            alt={thumbAlt}
            fill
            className={`object-cover transition-[filter] duration-500 ease-out ${overlayOpen ? "blur-[2px]" : "blur-0"} [@media(hover:hover)]:group-hover:blur-[2px] group-focus-within:blur-[2px]`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
        {!hasDistinctHero && !hasVideoOnlyHero && !thumbSrc ? (
          <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.2em] text-muted">
            Project Image
          </div>
        ) : null}

        {/* Use next/link here too (not a raw <a>): matches touch “View project” path so client navigation / history stays consistent. */}
        <Link
          href={href}
          tabIndex={touchPrimary ? -1 : 0}
          aria-hidden={touchPrimary}
          aria-label={touchPrimary ? undefined : `View project: ${project.title}`}
          className={`absolute inset-0 z-[1] outline-offset-[-2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40 ${
            touchPrimary ? "pointer-events-none" : ""
          }`}
        />

        {/* Centered title + tagline over hero image */}
        <div
          className={`pointer-events-none absolute inset-0 z-[2] transition-opacity duration-500 ease-out ${
            touchPrimary
              ? touchOverlayOpen
                ? "opacity-100"
                : "opacity-0"
              : "opacity-0 [@media(hover:hover)]:group-hover:opacity-100 group-focus-within:opacity-100"
          }`}
        >
          <div className="project-card-hover-scrim" aria-hidden />
          <div className="project-card-overlay-body relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <ProjectCardOverlayTitle
              title={project.title}
              className={`project-card-overlay-title project-card-overlay-title-shadow ${overlayTitleClass} ${displayClass}`}
            />
            {tagline ? (
              <p
                className={`mt-3 max-w-md text-base leading-relaxed text-white/90 sm:text-lg ${bodyClass}`}
              >
                {tagline}
              </p>
            ) : null}

            {touchPrimary && touchOverlayOpen ? (
              <Link
                href={href}
                data-project-card-link
                aria-label={`View project: ${project.title}`}
                className="pointer-events-auto relative z-10 mt-8 inline-flex rounded-sm border border-white/50 bg-transparent px-5 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/95 transition-[border-color,background-color,color] duration-300 active:border-white/75 active:bg-white/10 active:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                View project
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
