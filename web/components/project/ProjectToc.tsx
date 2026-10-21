"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import type {PortableTextBlock} from "@portabletext/types";
import {BrandMark} from "@/components/BrandMark";
import type {ProjectStoryBlock, SiteBrand} from "@/lib/types/project";

type TocLevel = 1 | 2 | 3;

type TocItem = {
  id: string;
  label: string;
  tooltip?: string;
  level: TocLevel;
  number: string;
};

function isHeadingBlock(block: PortableTextBlock | null | undefined): boolean {
  const style = (block as {style?: string} | undefined)?.style;
  return typeof style === "string" && (style.startsWith("h2") || style.startsWith("h3"));
}

function headingLevel(block: PortableTextBlock): TocLevel | null {
  const style = (block as {style?: string} | undefined)?.style;
  if (style?.startsWith("h2")) return 2;
  if (style?.startsWith("h3")) return 3;
  return null;
}

function blockPlainText(block: PortableTextBlock): string {
  const children = (block as unknown as {children?: Array<{text?: string}>})?.children ?? [];
  return children.map((c) => c?.text ?? "").join("").trim();
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function chapterAnchorId(block: { _key?: string }, idx: number) {
  return `chapter-${block._key ?? idx + 1}`;
}

function tocFromStory(blocks: ProjectStoryBlock[]): TocItem[] {
  const items: TocItem[] = [];

  let chapterIndex = 0;
  let h2Index = 0;
  let h3Index = 0;

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b._type === "projectSlide") {
      const label =
        b.tocTitle?.trim() || [b.title, b.titleAccent].filter(Boolean).join(" ").trim();
      if (!label) continue;
      chapterIndex += 1;
      h2Index = 0;
      h3Index = 0;
      items.push({id: chapterAnchorId(b, i), label, level: 1, number: pad2(chapterIndex)});
      continue;
    }
    if (b._type !== "projectChapter") continue;

    chapterIndex += 1;
    h2Index = 0;
    h3Index = 0;

    const chapterNum = pad2(chapterIndex);
    const chapterId = chapterAnchorId(b, i);
    const rawTitle = b.title?.trim() || "";
    const rawToc = b.tocTitle?.trim() || "";

    if (rawToc || rawTitle) {
      const chapterLabel = (rawToc || rawTitle).trim();
      const chapterTooltip = rawToc && rawTitle && rawToc !== rawTitle ? rawTitle : undefined;
      items.push({
        id: chapterId,
        label: chapterLabel,
        tooltip: chapterTooltip,
        level: 1,
        number: chapterNum,
      });
    }

    const body = b.body ?? [];
    for (const pt of body) {
      if (!pt || !isHeadingBlock(pt)) continue;
      const lvl = headingLevel(pt);
      if (!lvl) continue;

      const label = blockPlainText(pt);
      if (!label) continue;

      const key = (pt as unknown as {_key?: string})?._key;
      if (!key) continue;

      if (lvl === 2) {
        h2Index += 1;
        h3Index = 0;
        items.push({
          id: `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${key}`,
          label,
          level: 2,
          number: `${chapterNum}.${h2Index}`,
        });
      } else {
        if (h2Index === 0) h2Index = 1;
        h3Index += 1;
        items.push({
          id: `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${key}`,
          label,
          level: 3,
          number: `${chapterNum}.${h2Index}.${h3Index}`,
        });
      }
    }
  }

  return items;
}

function cssVarToPx(varName: string): number {
  if (typeof window === "undefined") return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (!raw) return 0;
  const n = Number.parseFloat(raw);
  if (Number.isNaN(n)) return 0;
  if (raw.endsWith("px")) return n;
  if (raw.endsWith("rem")) {
    const rootFont = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return n * rootFont;
  }
  return n;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({behavior: "smooth", block: "start"});
  try {
    history.replaceState(null, "", `#${encodeURIComponent(id)}`);
  } catch {
    /* ignore */
  }
}

function resolveActiveChapterId(
  chapterItems: TocItem[],
  topOffset: number,
): string | null {
  if (!chapterItems.length) return null;

  let active = chapterItems[0].id;
  for (const item of chapterItems) {
    const el = document.getElementById(item.id);
    if (!el) continue;
    if (el.getBoundingClientRect().top - topOffset <= 1) {
      active = item.id;
    }
  }
  return active;
}

export function ProjectToc({
  blocks,
  brand,
}: {
  blocks: ProjectStoryBlock[];
  brand?: SiteBrand | null;
}) {
  const items = useMemo(() => tocFromStory(blocks), [blocks]);
  const chapterItems = useMemo(() => items.filter((i) => i.level === 1), [items]);
  const [activeId, setActiveId] = useState<string | null>(chapterItems[0]?.id ?? null);
  const [chromeHidden, setChromeHidden] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const stickSentinelRef = useRef<HTMLDivElement>(null);
  const showTocLogo = isStuck && !isMobile;

  useEffect(() => {
    const sync = () => {
      setChromeHidden(document.documentElement.hasAttribute("data-chrome-hidden"));
    };

    sync();
    const attrObserver = new MutationObserver(sync);
    attrObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-chrome-hidden"],
    });
    return () => attrObserver.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!items.length) return;

    const sentinel = stickSentinelRef.current;
    if (!sentinel) return;

    const updateStuck = () => {
      setIsStuck(sentinel.getBoundingClientRect().top < 0);
    };

    updateStuck();
    window.addEventListener("scroll", updateStuck, {passive: true});
    window.addEventListener("resize", updateStuck);
    return () => {
      window.removeEventListener("scroll", updateStuck);
      window.removeEventListener("resize", updateStuck);
    };
  }, [items.length]);

  useEffect(() => {
    if (!chapterItems.length) return;

    const measureTopOffset = () => {
      const headerPx = isStuck || chromeHidden ? 0 : cssVarToPx("--site-header-height");
      const tocPx = cssVarToPx("--project-toc-height");
      return headerPx + tocPx + 12;
    };

    const syncActive = () => {
      const next = resolveActiveChapterId(chapterItems, measureTopOffset());
      if (next) setActiveId(next);
    };

    syncActive();
    window.addEventListener("scroll", syncActive, {passive: true});
    window.addEventListener("resize", syncActive);
    return () => {
      window.removeEventListener("scroll", syncActive);
      window.removeEventListener("resize", syncActive);
    };
  }, [chapterItems, chromeHidden, isStuck]);

  if (items.length <= 1) return null;

  return (
    <>
      <div ref={stickSentinelRef} className="pointer-events-none h-0" aria-hidden />
      <div
        className="project-toc-bar project-toc-full-bleed project-toc-bar--sticky z-[49] w-screen max-w-none border-b border-zinc-200/60 bg-[rgba(234,252,255,0.72)] backdrop-blur-md box-border"
        style={{["--project-toc-height" as never]: "2.75rem"}}
      >
      <nav
        aria-label="On this page"
        className="flex h-[var(--project-toc-height)] w-full items-center gap-1 px-[var(--project-bleed-gutter,2.5rem)]"
      >
        <div
          className={[
            "flex h-full shrink-0 items-center overflow-hidden transition-[width,opacity] duration-300 ease-out",
            showTocLogo ? "w-auto opacity-100" : "w-0 opacity-0 pointer-events-none",
          ].join(" ")}
          aria-hidden={!showTocLogo}
        >
          <BrandMark brand={brand} variant="toc" />
        </div>
        <div className="flex h-full min-w-0 flex-1 items-center gap-3 overflow-x-auto md:justify-center md:overflow-x-visible md:flex-wrap">
        {chapterItems.map((item) => {
            const isHighlighted = isStuck && activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToId(item.id)}
                className={[
                  "shrink-0 rounded-full border px-3 py-1 text-[12px] uppercase tracking-[0.18em]",
                  "transition-colors",
                  isHighlighted
                    ? "border-[#E5A800]/35 bg-[#FFC72C] text-zinc-900"
                    : "border-zinc-900/10 bg-white/35 text-zinc-600 hover:text-zinc-900",
                ].join(" ")}
              >
                <span
                  className={[
                    "mr-2 tabular-nums",
                    isHighlighted ? "text-zinc-900/70" : "text-zinc-500",
                  ].join(" ")}
                >
                  {item.number}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
      </div>
    </>
  );
}
