"use client";

import {PortableBody} from "@/components/PortableBody";
import {useTypoClass} from "@/components/TypographyProvider";
import {cmsMagazineOrFont} from "@/lib/cmsFontClass";
import type {PortableTextBlock} from "@portabletext/types";

const TITLE_SIZE_CLASS: Record<NonNullable<RichTextSectionProps["titleSize"]>, string> = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-5xl",
  xl: "text-6xl",
};

type RichTextSectionProps = {
  title?: string | null;
  tocTitle?: string | null;
  body?: PortableTextBlock[] | null;
  anchorId?: string;
  titleFont?: string | null;
  titleSize?: "sm" | "md" | "lg" | "xl" | null;
};

export function RichTextSection({
  title,
  tocTitle,
  body,
  anchorId,
  titleFont,
  titleSize,
}: RichTextSectionProps) {
  const displayClass = useTypoClass("display");
  const bodyClass = useTypoClass("body");

  const desktopSizeClass = titleSize ? TITLE_SIZE_CLASS[titleSize] : "text-4xl";
  const titleSizeClasses = `text-3xl md:${desktopSizeClass}`;
  const fontClass = cmsMagazineOrFont(titleFont);
  const tocText = tocTitle?.trim();
  const showTocText = Boolean(tocText) && tocText !== (title ?? "").trim();

  return (
    <section>
      {title ? (
        <h2
          id={anchorId}
          data-toc-anchor={anchorId ? "true" : undefined}
          data-toc-level={anchorId ? "1" : undefined}
          className={`mb-4 mt-0 leading-[1.1] md:leading-tight ${titleSizeClasses} ${fontClass} ${displayClass}`}
          style={{
            scrollMarginTop:
              "calc(var(--site-header-height) + var(--project-toc-height) + 0.75rem)",
          }}
        >
          {/* Mobile: full-width title (TOC label lives in sticky bar) */}
          <span className="md:hidden block w-full min-w-0">{title}</span>

          {/* Desktop: title + right-aligned TOC label (no leader line) */}
          <span className="hidden md:flex w-full items-baseline justify-between gap-x-3">
            <span className="min-w-0">{title}</span>
            {showTocText ? (
              <span className="shrink-0 text-[11px] font-sans font-medium uppercase tracking-[0.26em] text-zinc-400/70">
                {tocText}
              </span>
            ) : null}
          </span>
        </h2>
      ) : null}
      <PortableBody value={body ?? undefined} className={bodyClass} />
    </section>
  );
}
