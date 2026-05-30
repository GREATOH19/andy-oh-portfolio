"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import type {PortableTextBlock} from "@portabletext/types";
import type {ProjectStoryBlock} from "@/lib/types/project";

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
    if (b._type !== "projectChapter") continue;

    chapterIndex += 1;
    h2Index = 0;
    h3Index = 0;

    const chapterNum = pad2(chapterIndex);
    const chapterId = chapterAnchorId(b, i);
    const rawTitle = b.title?.trim() || "";
    const rawToc = b.tocTitle?.trim() || "";
    const chapterLabel = (rawToc || rawTitle || `Chapter ${chapterIndex}`).trim();
    const chapterTooltip = rawToc && rawTitle && rawToc !== rawTitle ? rawTitle : undefined;
    items.push({
      id: chapterId,
      label: chapterLabel,
      tooltip: chapterTooltip,
      level: 1,
      number: chapterNum,
    });

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

export function ProjectToc({
  blocks,
  variant,
}: {
  blocks: ProjectStoryBlock[];
  variant: "mobile" | "desktop";
}) {
  const items = useMemo(() => tocFromStory(blocks), [blocks]);
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const mobileSentinelRef = useRef<HTMLDivElement>(null);
  const [mobilePinned, setMobilePinned] = useState(false);

  useEffect(() => {
    if (!items.length) return;

    const ids = items.map((i) => i.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const headerPx = cssVarToPx("--site-header-height");
    const tocPx = cssVarToPx("--project-toc-height");
    const topOffset = headerPx + tocPx + 12;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement);
        if (!visible.length) return;

        // Closest to top (but below sticky chrome)
        visible.sort((a, b) => Math.abs(a.getBoundingClientRect().top - topOffset) - Math.abs(b.getBoundingClientRect().top - topOffset));
        setActiveId(visible[0].id);
      },
      {
        root: null,
        threshold: [0.2, 0.4, 0.6],
        rootMargin: `-${topOffset}px 0px -70% 0px`,
      },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  useEffect(() => {
    if (variant !== "mobile" || !items.length) return;

    const sentinel = mobileSentinelRef.current;
    if (!sentinel) return;

    const updatePinned = () => {
      const headerPx = cssVarToPx("--site-header-height");
      setMobilePinned(sentinel.getBoundingClientRect().top <= headerPx);
    };

    updatePinned();
    window.addEventListener("scroll", updatePinned, {passive: true});
    window.addEventListener("resize", updatePinned);
    return () => {
      window.removeEventListener("scroll", updatePinned);
      window.removeEventListener("resize", updatePinned);
    };
  }, [variant, items.length]);

  if (items.length <= 1) return null;

  if (variant === "mobile") {
    return (
      <div style={{["--project-toc-height" as never]: "2.75rem"}}>
        <div ref={mobileSentinelRef} className="pointer-events-none h-0" aria-hidden />
        <div
          className={[
            "z-[49] border-b border-zinc-200/60 bg-[rgba(234,252,255,0.72)] backdrop-blur-md",
            mobilePinned
              ? "fixed inset-x-0 top-[var(--site-header-height)]"
              : "relative",
          ].join(" ")}
        >
          <nav
            aria-label="On this page"
            className="flex gap-3 overflow-x-auto px-[10px] py-2"
          >
            {items
              .filter((i) => i.level === 1)
              .map((item) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToId(item.id)}
                    className={[
                      "shrink-0 rounded-full border px-3 py-1 text-[12px] uppercase tracking-[0.18em]",
                      "transition-colors",
                      isActive
                        ? "border-zinc-900/20 bg-white/70 text-zinc-900"
                        : "border-zinc-900/10 bg-white/35 text-zinc-600 hover:text-zinc-900",
                    ].join(" ")}
                  >
                    <span className="mr-2 tabular-nums text-zinc-500">{item.number}</span>
                    {item.label}
                  </button>
                );
              })}
          </nav>
        </div>
        {mobilePinned ? (
          <div className="h-[var(--project-toc-height)] shrink-0" aria-hidden />
        ) : null}
      </div>
    );
  }

  return (
    <div className="sticky top-[calc(var(--site-header-height)+3rem)]">
      <nav aria-label="On this page" className="text-sm">
        <div className="mb-4 text-[11px] uppercase tracking-[0.22em] text-zinc-400">Contents</div>
        <div className="relative pl-4">
          <div aria-hidden className="absolute left-1 top-1 bottom-1 w-px bg-zinc-300/60" />
          <ul className="space-y-2">
            {items.map((item) => {
              const isActive = activeId === item.id;
              const indent = item.level === 1 ? "" : item.level === 2 ? "pl-3" : "pl-6";
              const dot =
                item.level === 1 ? "h-2 w-2" : item.level === 2 ? "h-1.5 w-1.5" : "h-1 w-1";
              return (
                <li key={item.id} className={`relative ${indent}`}>
                  <button
                    type="button"
                    onClick={() => scrollToId(item.id)}
                    className={[
                      "group flex w-full items-start gap-2 text-left",
                      isActive ? "text-zinc-950" : "text-zinc-600 hover:text-zinc-900",
                    ].join(" ")}
                    title={item.tooltip}
                  >
                    <span
                      className={[
                        "mt-1.5 rounded-full bg-zinc-400/70 transition-colors",
                        dot,
                        isActive ? "bg-zinc-900" : "group-hover:bg-zinc-700",
                      ].join(" ")}
                      aria-hidden
                    />
                    <span className="min-w-[2.6rem] tabular-nums text-zinc-500">
                      {item.number}
                    </span>
                    <span className="ml-auto text-right leading-snug">{item.label}</span>
                  </button>
                  {item.tooltip ? (
                    <div className="pointer-events-none absolute left-6 top-full z-10 mt-2 hidden w-[min(22rem,70vw)] rounded-md border border-zinc-200/70 bg-white/80 p-2 text-[12px] leading-snug text-zinc-600 shadow-sm backdrop-blur-md group-hover:block">
                      {item.tooltip}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}

