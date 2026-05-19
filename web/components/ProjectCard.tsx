"use client";

import Image from "next/image";
import Link from "next/link";
import {useCallback, useEffect, useMemo, useState} from "react";

import {urlForImage} from "@/lib/sanity/image";
import {useTypoClass} from "@/components/TypographyProvider";
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

export function ProjectCard({project}: {project: ProjectListItem}) {
  const displayClass = useTypoClass("display");
  const bodyClass = useTypoClass("body");
  const href = project.slug ? `/projects/${project.slug}` : "#";
  const touchPrimary = useTouchPrimary();
  const [touchOverlayOpen, setTouchOverlayOpen] = useState(false);

  const thumb =
    project.coverImage?.asset?._ref ? project.coverImage : project.heroImage?.asset?._ref ? project.heroImage : null;
  const src = thumb?.asset?._ref
    ? urlForImage(thumb).width(1600).height(1200).quality(90).url()
    : null;
  const thumbAlt = thumb?.alt ?? project.title;

  const tagline = useMemo(() => {
    const s = project.subtitle?.trim();
    if (s) return s;
    const e = project.excerpt?.trim();
    if (e) return e.length > 120 ? `${e.slice(0, 117)}…` : e;
    return project.role?.trim() || null;
  }, [project.subtitle, project.excerpt, project.role]);

  const imageBlurClass =
    touchPrimary && touchOverlayOpen
      ? "blur-xl"
      : "[@media(hover:hover)]:group-hover:blur-xl group-focus-within:blur-xl";

  const onImageAreaClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!touchPrimary) return;
      if ((e.target as HTMLElement).closest("a[data-project-card-link]")) return;
      e.preventDefault();
      setTouchOverlayOpen((o) => !o);
    },
    [touchPrimary],
  );

  return (
    <article className="block" aria-label={project.title}>
      <div
        className="group relative aspect-[4/3] w-full cursor-default overflow-hidden bg-background transition-shadow duration-500 [@media(hover:hover)]:cursor-pointer [@media(hover:hover)]:group-hover:shadow-lg [@media(hover:none)]:cursor-pointer"
        onClick={onImageAreaClick}
      >
        {src ? (
          <Image
            src={src}
            alt={thumbAlt}
            fill
            className={`object-cover transition-[filter] duration-500 ease-out ${imageBlurClass}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.2em] text-muted">
            Project Image
          </div>
        )}

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

        {/* Centered title + tagline over blurred image */}
        <div
          className={`pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 text-center text-white transition-opacity duration-500 ease-out ${
            touchPrimary
              ? touchOverlayOpen
                ? "opacity-100"
                : "opacity-0"
              : "opacity-0 [@media(hover:hover)]:group-hover:opacity-100 group-focus-within:opacity-100"
          }`}
        >
          <h2
            className={`max-w-[18ch] text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl md:text-[2.75rem] ${displayClass}`}
          >
            {project.title}
          </h2>
          {tagline ? (
            <p
              className={`mt-3 max-w-md text-sm font-normal leading-relaxed text-white/90 sm:text-base ${bodyClass}`}
            >
              {tagline}
            </p>
          ) : null}

          {touchPrimary && touchOverlayOpen ? (
            <Link
              href={href}
              data-project-card-link
              className="pointer-events-auto mt-8 inline-flex border border-white/35 bg-white/10 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              View project
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
