"use client";

import Image from "next/image";
import {SiMedium} from "react-icons/si";
import {PortableBody} from "@/components/PortableBody";
import {useTypoClass} from "@/components/TypographyProvider";
import {PROJECT_HERO_COMPACT} from "@/components/ProjectHero";
import {urlForImage} from "@/lib/sanity/image";
import {projectDetailsForDisplay} from "@/lib/project/detailOrder";
import {leadHasContent, normalizeLeadBlocks} from "@/lib/portableText/leadContent";
import type {ProjectDetail} from "@/lib/types/project";

/**
 * Intro below the hero: lead copy + optional sidebar (details, highlights, partners, awards, article).
 */
export function ProjectHeader({
  project,
  titleInHero = false,
  titleInImage = false,
  layout = "default",
  belowChapterToc = false,
}: {
  project: ProjectDetail;
  titleInHero?: boolean;
  /** Hero artwork already shows the title: no title block here on any breakpoint */
  titleInImage?: boolean;
  /** When true, title/subtitle on full-bleed hero; omitted here except on compact mobile */
  layout?: "default" | "full";
  /** Chapter TOC sits directly above — reduce top padding */
  belowChapterToc?: boolean;
}) {
  const displayClass = useTypoClass("display");
  const bodyClass = useTypoClass("body");
  const metaClass = useTypoClass("meta");

  const leadBlocks = normalizeLeadBlocks(project.lead);
  const details = projectDetailsForDisplay(project.details);
  const highlights = project.highlights?.filter(Boolean) ?? [];
  const partners = project.partners?.filter((p) => p?.name) ?? [];
  const awards =
    project.awards?.filter(
      (a) => a?.label?.trim() || a?.image?.asset?._ref,
    ) ?? [];
  const yearLine = formatYear(project.year);

  const hasSidebar =
    details.length > 0 ||
    highlights.length > 0 ||
    partners.length > 0 ||
    awards.length > 0 ||
    Boolean(project.articleUrl) ||
    yearLine;

  const hasLead = leadHasContent(project.lead);
  /** No lead copy — spread intro meta across the overview band on md+. */
  const sidebarFillsWidth = hasSidebar && !hasLead;
  /** Lead-less desktop: left-column blocks stick start; right-column blocks stay end-aligned. */
  const metaStickLeft = sidebarFillsWidth ? "md:mr-auto md:text-left" : "";
  const metaStickRightCluster = sidebarFillsWidth
    ? "md:ml-auto md:shrink-0 md:text-right"
    : "";
  const metaStickFullLeft = sidebarFillsWidth ? "md:basis-full md:text-left" : "";

  const hasDetailsBlock = details.length > 0 || Boolean(yearLine);
  const hasRightMetaCluster =
    hasDetailsBlock || highlights.length > 0 || Boolean(project.articleUrl);

  const detailsBlock = hasDetailsBlock ? (
    <div className="space-y-1.5">
      {details.map((item, i) => (
        <p key={i}>
          {item.label && item.value?.trim() ? (
            <>
              <span className="text-zinc-500">{item.label}:</span> {item.value}
            </>
          ) : (
            item.value?.trim() || item.label
          )}
        </p>
      ))}
      {yearLine ? <p>{yearLine}</p> : null}
    </div>
  ) : null;

  const titleBlockClass = titleInImage
    ? "hidden"
    : titleInHero
      ? `hidden ${PROJECT_HERO_COMPACT}`
      : "block";

  const overviewWidthClass =
    layout === "full" ? "project-overview-narrow" : "mx-auto max-w-5xl";

  const topPaddingClass = belowChapterToc
    ? "pt-6 max-md:portrait:pt-5 md:pt-8"
    : `pt-16 max-md:portrait:pt-8 [@media(orientation:landscape)_and_(max-width:1024px)]:pt-8 ${
        titleInHero
          ? "md:portrait:pt-16 [@media(orientation:landscape)_and_(min-width:1025px)]:pt-16"
          : "md:pt-24"
      }`;

  return (
    <header
      id="project-header"
      className={`scroll-mt-[var(--site-header-height)] ${topPaddingClass} ${
        layout === "full" ? "max-md:pb-6" : ""
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

      {(hasLead || hasSidebar) && (
        <div className={overviewWidthClass}>
          <div
            className={
              hasSidebar && hasLead
                ? "mt-10 grid gap-x-12 gap-y-10 md:grid-cols-[minmax(0,1fr)_minmax(0,14rem)] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,18rem)]"
                : "mt-10"
            }
          >
            {hasLead && leadBlocks ? (
              <div className="project-overview-prose max-md:order-2 md:col-start-1">
                <PortableBody value={leadBlocks} className={bodyClass} spacing="story" />
              </div>
            ) : null}

            {hasSidebar && (
              <aside
                className={[
                  "max-md:order-1 text-sm text-zinc-700",
                  metaClass,
                  sidebarFillsWidth
                    ? "text-right md:flex md:w-full md:flex-wrap md:items-start md:justify-between md:gap-x-10 md:gap-y-8"
                    : "text-right md:col-start-2",
                ].join(" ")}
              >
                {awards.length > 0 && (
                  <div
                    className={
                      sidebarFillsWidth
                        ? `mb-6 md:mb-0 md:shrink-0 ${metaStickLeft}`
                        : "mb-6"
                    }
                  >
                    <p className="text-zinc-500">Awards</p>
                    <ul
                      className={`mt-3 flex flex-col gap-3 ${
                        sidebarFillsWidth ? "items-end md:items-start" : "items-end"
                      }`}
                    >
                      {awards.map((award, i) => {
                        const label = award.label?.trim();
                        const imageRef = award.image?.asset?._ref;
                        const caption = label ? (
                          <p className="min-w-0 flex-1 text-left text-[13px] leading-snug text-zinc-700">
                            {label}
                          </p>
                        ) : null;

                        if (!imageRef) {
                          return caption ? (
                            <li key={i} className="w-full max-w-[18rem]">
                              {caption}
                            </li>
                          ) : null;
                        }

                        const src = urlForImage(award.image!).width(160).quality(92).url();
                        const badge = (
                          <Image
                            src={src}
                            alt={award.image?.alt ?? label ?? "Award"}
                            width={48}
                            height={48}
                            className="h-auto w-10 shrink-0 object-contain sm:w-11"
                          />
                        );
                        const badgeNode = award.href ? (
                          <a
                            href={award.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex shrink-0"
                          >
                            {badge}
                          </a>
                        ) : (
                          <span className="inline-flex shrink-0">{badge}</span>
                        );

                        return (
                          <li
                            key={i}
                            className={`flex w-full max-w-[18rem] flex-row items-center gap-2.5 sm:gap-3 ${
                              sidebarFillsWidth ? "justify-end md:justify-start" : "justify-end"
                            }`}
                          >
                            {badgeNode}
                            {caption}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {hasRightMetaCluster &&
                  (sidebarFillsWidth ? (
                    <div className={`flex flex-col gap-6 ${metaStickRightCluster}`}>
                      {detailsBlock}

                      {highlights.length > 0 && (
                        <div>
                          <p className="text-zinc-500">What I did</p>
                          <ul className="mt-1 list-none space-y-0.5">
                            {highlights.map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {project.articleUrl && (
                        <div>
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
                    </div>
                  ) : (
                    <>
                      {detailsBlock}

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
                    </>
                  ))}

                {partners.length > 0 && (
                  <div
                    className={
                      sidebarFillsWidth
                        ? `mt-6 md:mt-8 ${metaStickFullLeft}`
                        : "mt-6"
                    }
                  >
                    <p className="text-zinc-500">In collaboration with</p>
                    <div
                      className={`mt-3 flex flex-wrap items-center gap-6 ${
                        sidebarFillsWidth ? "justify-end md:justify-start" : "justify-end"
                      }`}
                    >
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

