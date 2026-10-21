"use client";

import Image from "next/image";
import Link from "next/link";
import {useEffect, useLayoutEffect, useRef, useState} from "react";

import {
  getProjectCardImage,
  getProjectCardImageUrl,
  projectCardHasVideoHero,
} from "@/lib/projectCardMedia";
import {buildSanityImageSrc} from "@/lib/sanity/image";
import {
  isSanityImage,
  isSanityVideo,
  normalizeMediaItem,
  sanityInlineLoopVideoUrl,
} from "@/lib/sanity/media";
import {useTypoClass} from "@/components/TypographyProvider";
import type {ProjectListItem} from "@/lib/types/project";

const TAGLINE_MIN_FONT_PX = 10;

/** One line: shrinks the font until the text fits, down to TAGLINE_MIN_FONT_PX, then truncates. */
function ProjectCardTagline({text, className}: {text: string; className: string}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      el.style.fontSize = "";
      let size = parseFloat(getComputedStyle(el).fontSize);
      if (!size) return;
      while (el.scrollWidth > el.clientWidth && size > TAGLINE_MIN_FONT_PX) {
        size = Math.max(TAGLINE_MIN_FONT_PX, size - 0.25);
        el.style.fontSize = `${size}px`;
      }
    };

    fit();
    void document.fonts?.ready.then(fit);

    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  return (
    <p ref={ref} className={`truncate ${className}`} title={text}>
      {text}
    </p>
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
      preload="none"
      aria-label={alt || undefined}
    />
  );
}

export function ProjectCard({project}: {project: ProjectListItem}) {
  const displayClass = useTypoClass("display");
  const bodyClass = useTypoClass("body");
  const metaClass = useTypoClass("meta");
  const href = project.slug ? `/projects/${project.slug}` : "#";
  const [hovered, setHovered] = useState(false);

  const heroMedia = normalizeMediaItem(project.heroImage);
  const heroVideo = isSanityVideo(heroMedia) ? heroMedia : null;
  const heroImage = isSanityImage(heroMedia) ? heroMedia : null;

  const thumbnail = getProjectCardImage(project);

  const thumbSrc = getProjectCardImageUrl(project, {width: 1600, height: 1200});
  const heroImageSrc =
    heroImage?.asset?._ref && heroImage !== thumbnail
      ? buildSanityImageSrc(heroImage, {displayWidth: 1600, quality: 90})
      : null;
  const heroVideoSrc = heroVideo ? sanityInlineLoopVideoUrl(heroVideo) : null;

  const thumbAlt = thumbnail?.alt ?? project.title;
  const heroAlt = heroVideo?.alt ?? heroImage?.alt ?? project.title;

  const hasDistinctHeroImage = Boolean(heroImageSrc);
  const hasDistinctHeroVideo = Boolean(heroVideoSrc && thumbSrc);
  const hasVideoOnlyHero = projectCardHasVideoHero(project) && Boolean(heroVideoSrc && !thumbSrc);
  const hasDistinctHero = hasDistinctHeroImage || hasDistinctHeroVideo;
  const thumbHiddenClass =
    "opacity-100 [@media(hover:hover)]:group-hover:opacity-0 group-focus-visible:opacity-0";
  const heroOverlayClass =
    "opacity-0 [@media(hover:hover)]:group-hover:opacity-100 group-focus-visible:opacity-100";

  const tagline = project.subtitle?.trim() || null;
  const year = project.year?.trim() || null;
  const cardMeta = project.cardMeta?.trim() || null;

  return (
    <article className="block" aria-label={project.title}>
      <Link
        href={href}
        className="group block rounded-2xl outline-none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <div className="work-thumb relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60 transition-[transform,box-shadow] duration-200 ease-out motion-reduce:transition-none group-hover:-translate-y-0.5 group-hover:shadow-lg group-focus-visible:-translate-y-0.5 group-focus-visible:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-foreground/40 group-active:translate-y-0 group-active:scale-[0.997] group-active:shadow-lg">
          {hasDistinctHero && thumbSrc ? (
            <Image
              src={thumbSrc}
              alt={thumbAlt}
              fill
              className={`object-cover transition-opacity duration-500 ease-out ${thumbHiddenClass}`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
          ) : null}
          {hasDistinctHeroVideo && heroVideoSrc ? (
            <ProjectCardHeroVideo
              src={heroVideoSrc}
              loop={heroVideo?.loop ?? true}
              alt={heroAlt}
              active={hovered}
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
              unoptimized
            />
          ) : null}
          {hasVideoOnlyHero && heroVideoSrc ? (
            <ProjectCardHeroVideo
              src={heroVideoSrc}
              loop={heroVideo?.loop ?? true}
              alt={heroAlt}
              active
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          {!hasDistinctHero && !hasVideoOnlyHero && thumbSrc ? (
            <Image
              src={thumbSrc}
              alt={thumbAlt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
          ) : null}
          {!hasDistinctHero && !hasVideoOnlyHero && !thumbSrc ? (
            <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.2em] text-muted">
              Project Image
            </div>
          ) : null}
        </div>

        <div className="project-card-caption mt-3 px-0.5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className={`cms-title-tone text-base font-semibold tracking-tight sm:text-lg ${displayClass}`}>
              {project.title}
            </h2>
            {year ? (
              <span className={`shrink-0 text-xs tabular-nums text-muted ${metaClass}`}>{year}</span>
            ) : null}
          </div>
          {tagline ? (
            <ProjectCardTagline
              text={tagline}
              className={`mt-1 text-sm leading-snug text-muted ${bodyClass}`}
            />
          ) : null}
          {cardMeta ? (
            <p className={`mt-1 text-xs font-medium text-muted ${metaClass}`}>{cardMeta}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
