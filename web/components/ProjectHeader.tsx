"use client";

import Image from "next/image";
import {SiMedium} from "react-icons/si";
import {useTypoClass} from "@/components/TypographyProvider";
import {urlForImage} from "@/lib/sanity/image";
import type {ProjectDetail} from "@/lib/types/project";

/**
 * Two-column project intro shown below the hero.
 * Left column: title, subtitle, intro paragraphs (`excerpt`).
 * Right column: meta items, contributions, collaborators, award badges.
 */
export function ProjectHeader({project}: {project: ProjectDetail}) {
  const displayClass = useTypoClass("display");
  const bodyClass = useTypoClass("body");
  const metaClass = useTypoClass("meta");

  const paragraphs = splitParagraphs(project.excerpt);
  const metaItems = project.metaItems?.filter((m) => m?.value) ?? [];
  const contributions = project.contributions?.filter(Boolean) ?? [];
  const collaborators = project.collaborators?.filter((c) => c?.name) ?? [];
  const awards = project.awards?.filter((a) => a?.image?.asset?._ref) ?? [];
  const yearLine = formatYear(project.year);

  const hasMetaColumn =
    metaItems.length > 0 ||
    contributions.length > 0 ||
    collaborators.length > 0 ||
    awards.length > 0 ||
    Boolean(project.mediumUrl) ||
    yearLine ||
    project.role;

  return (
    <header
      id="project-header"
      className="scroll-mt-[var(--site-header-height)] pt-16 max-md:portrait:pt-8 md:pt-24 [@media(orientation:landscape)_and_(max-width:1024px)]:pt-8"
    >
      <h1
        className={`text-4xl font-bold leading-[1.05] text-zinc-900 sm:text-5xl md:text-6xl ${displayClass}`}
      >
        {project.title}
      </h1>
      {project.subtitle && (
        <p className={`mt-3 text-base text-zinc-500 sm:text-lg ${bodyClass}`}>{project.subtitle}</p>
      )}

      <div className="mt-8 border-t border-zinc-300/60" />

      <div
        className={`mt-10 grid gap-x-12 gap-y-10 ${
          hasMetaColumn ? "md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]" : ""
        }`}
      >
        <div className="space-y-5">
          {paragraphs.length > 0
            ? paragraphs.map((p, i) => (
                <p key={i} className={`text-[15px] leading-[1.7] text-zinc-700 ${bodyClass}`}>
                  {p}
                </p>
              ))
            : null}
        </div>

        {hasMetaColumn && (
          <aside className={`text-sm text-zinc-700 ${metaClass}`}>
            {awards.length > 0 && (
              <div className="mb-6 flex flex-wrap items-start gap-3">
                {awards.map((award, i) => {
                  const src = urlForImage(award.image!).width(280).quality(92).url();
                  const badge = (
                    <Image
                      src={src}
                      alt={award.image?.alt ?? award.label ?? "Award"}
                      width={88}
                      height={88}
                      className="h-auto w-[72px] object-contain sm:w-[88px]"
                    />
                  );
                  return award.href ? (
                    <a
                      key={i}
                      href={award.href}
                      target="_blank"
                      rel="noreferrer"
                      title={award.label ?? undefined}
                      className="inline-flex"
                    >
                      {badge}
                    </a>
                  ) : (
                    <span key={i} title={award.label ?? undefined} className="inline-flex">
                      {badge}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="space-y-1.5">
              {metaItems.length > 0
                ? metaItems.map((item, i) => (
                    <p key={i}>
                      {item.label ? (
                        <>
                          <span className="text-zinc-500">{item.label}:</span> {item.value}
                        </>
                      ) : (
                        item.value
                      )}
                    </p>
                  ))
                : [yearLine, project.role]
                    .filter(Boolean)
                    .map((line, i) => <p key={i}>{line}</p>)}
            </div>

            {contributions.length > 0 && (
              <div className="mt-6">
                <p className="text-zinc-500">Contributions:</p>
                <ul className="mt-1 space-y-0.5">
                  {contributions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.mediumUrl && (
              <div className="mt-6">
                <p className="text-zinc-500">Article</p>
                <a
                  href={project.mediumUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-600"
                >
                  <SiMedium className="h-4 w-4 shrink-0" aria-hidden />
                  Read on Medium
                </a>
              </div>
            )}

            {collaborators.length > 0 && (
              <div className="mt-6">
                <p className="text-zinc-500">In collaboration with:</p>
                <div className="mt-3 flex flex-wrap items-center gap-6">
                  {collaborators.map((c, i) => {
                    const logoRef = c.logo?.asset?._ref;
                    const logoSrc = logoRef
                      ? urlForImage(c.logo!).width(360).quality(92).url()
                      : null;
                    const content = logoSrc ? (
                      <Image
                        src={logoSrc}
                        alt={c.logo?.alt ?? c.name}
                        width={120}
                        height={32}
                        className="h-7 w-auto object-contain sm:h-8"
                      />
                    ) : (
                      <span className="font-medium">{c.name}</span>
                    );
                    return c.href ? (
                      <a
                        key={i}
                        href={c.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center"
                      >
                        {content}
                      </a>
                    ) : (
                      <span key={i} className="inline-flex items-center">
                        {content}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </header>
  );
}

/** Normalize year for display (supports legacy numeric CMS values). */
function formatYear(year?: string | number | null): string | null {
  if (year == null) return null;
  const text = String(year).trim();
  return text || null;
}

/** Split a text field on blank lines into paragraphs. */
function splitParagraphs(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}
