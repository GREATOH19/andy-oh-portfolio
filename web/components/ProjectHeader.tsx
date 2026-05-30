"use client";

import Image from "next/image";
import {SiMedium} from "react-icons/si";
import {useTypoClass} from "@/components/TypographyProvider";
import {urlForImage} from "@/lib/sanity/image";
import {PROJECT_HERO_COMPACT} from "@/components/ProjectHero";
import type {ProjectDetail} from "@/lib/types/project";

/**
 * Intro below the hero: lead copy + optional sidebar (details, highlights, partners, awards, article).
 */
export function ProjectHeader({
  project,
  titleInHero = false,
}: {
  project: ProjectDetail;
  titleInHero?: boolean;
  /** When true, title/subtitle on full-bleed hero; omitted here except on compact mobile */
}) {
  const displayClass = useTypoClass("display");
  const bodyClass = useTypoClass("body");
  const metaClass = useTypoClass("meta");

  const paragraphs = splitParagraphs(project.lead);
  const details =
    project.details?.filter((d) => d?.value?.trim() || d?.label?.trim()) ?? [];
  const highlights = project.highlights?.filter(Boolean) ?? [];
  const partners = project.partners?.filter((p) => p?.name) ?? [];
  const awards = project.awards?.filter((a) => a?.image?.asset?._ref) ?? [];
  const yearLine = formatYear(project.year);

  const hasSidebar =
    details.length > 0 ||
    highlights.length > 0 ||
    partners.length > 0 ||
    awards.length > 0 ||
    Boolean(project.articleUrl) ||
    yearLine ||
    project.role;

  const titleBlockClass = titleInHero ? `hidden ${PROJECT_HERO_COMPACT}` : "block";

  return (
    <header
      id="project-header"
      className={`scroll-mt-[var(--site-header-height)] pt-16 max-md:portrait:pt-8 [@media(orientation:landscape)_and_(max-width:1024px)]:pt-8 ${
        titleInHero
          ? "md:portrait:pt-16 [@media(orientation:landscape)_and_(min-width:1025px)]:pt-16"
          : "md:pt-24"
      }`}
    >
      <div className={titleBlockClass}>
        <h1 className={`text-4xl leading-[1.05] sm:text-5xl md:text-6xl ${displayClass}`}>
          {project.title}
        </h1>
        {project.subtitle && (
          <p className={`mt-3 text-base text-zinc-500 sm:text-lg ${bodyClass}`}>{project.subtitle}</p>
        )}
      </div>

      <div
        className={`border-t border-zinc-300/60 ${
          titleInHero
            ? "mt-8 md:portrait:mt-0 [@media(orientation:landscape)_and_(min-width:1025px)]:mt-0"
            : "mt-8"
        }`}
      />

      {(paragraphs.length > 0 || hasSidebar) && (
        <div className="mx-auto max-w-5xl">
          <div
            className={
              hasSidebar
                ? "mt-10 grid gap-x-12 gap-y-10 md:grid-cols-[minmax(0,1fr)_minmax(0,14rem)] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,18rem)]"
                : "mt-10"
            }
          >
            {paragraphs.length > 0 && (
              <div className="space-y-5 md:col-start-1">
                {paragraphs.map((p, i) => (
                  <p key={i} className={`text-[15px] leading-[1.7] text-zinc-700 ${bodyClass}`}>
                    {p}
                  </p>
                ))}
              </div>
            )}

            {hasSidebar && (
              <aside
                className={`text-right text-sm text-zinc-700 md:col-start-2 ${metaClass} ${
                  paragraphs.length === 0 ? "md:col-span-1 md:justify-self-end" : ""
                }`}
              >
                {awards.length > 0 && (
                  <div className="mb-6 flex flex-wrap items-start justify-end gap-3">
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
                  {details.length > 0
                    ? details.map((item, i) => (
                        <p key={i}>
                          {item.label && item.value?.trim() ? (
                            <>
                              <span className="text-zinc-500">{item.label}:</span> {item.value}
                            </>
                          ) : (
                            item.value?.trim() || item.label
                          )}
                        </p>
                      ))
                    : [yearLine, project.role]
                        .filter(Boolean)
                        .map((line, i) => <p key={i}>{line}</p>)}
                </div>

                {highlights.length > 0 && (
                  <div className="mt-6">
                    <p className="text-zinc-500">What I did</p>
                    <ul className="mt-1 list-none space-y-0.5">
                      {highlights.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.articleUrl && (
                  <div className="mt-6">
                    <p className="text-zinc-500">Article</p>
                    <a
                      href={project.articleUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center justify-end gap-2 font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-600"
                    >
                      <SiMedium className="h-4 w-4 shrink-0" aria-hidden />
                      Read article
                    </a>
                  </div>
                )}

                {partners.length > 0 && (
                  <div className="mt-6">
                    <p className="text-zinc-500">In collaboration with</p>
                    <div className="mt-3 flex flex-wrap items-center justify-end gap-6">
                      {partners.map((c, i) => {
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
        </div>
      )}
    </header>
  );
}

function formatYear(year?: string | number | null): string | null {
  if (year == null) return null;
  const text = String(year).trim();
  return text || null;
}

function splitParagraphs(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}
