"use client";

import {PortableBody} from "@/components/PortableBody";
import {useTypoClass} from "@/components/TypographyProvider";
import {cmsMagazineOrFont} from "@/lib/cmsFontClass";
import {
  filterEmptyPortableTextBlocks,
  portableTextHasVisibleContent,
} from "@/lib/portableText/filterEmptyBlocks";
import type {PortableTextBlock} from "@portabletext/types";
import {
  projectBodyProseFontClass,
  projectBodyProseStyle,
} from "@/lib/portableText/bodyTypography";
import type {ProjectBodyTypographyFields, ProjectChapterTextAlign} from "@/lib/types/project";

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
  textAlign?: ProjectChapterTextAlign | null;
  bodyFont?: ProjectBodyTypographyFields["bodyFont"];
  bodyFontSize?: ProjectBodyTypographyFields["bodyFontSize"];
  /** Story chapters: title-to-body gap matches title-to-content blocks */
  spacing?: "default" | "story";
  /** Render only the chapter title, body, or both */
  part?: "all" | "title" | "body";
};

const TEXT_ALIGN_CLASS: Record<ProjectChapterTextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function chapterTextAlignClass(align?: ProjectChapterTextAlign | null): string {
  if (!align || align === "left") return TEXT_ALIGN_CLASS.left;
  return TEXT_ALIGN_CLASS[align];
}

export function RichTextSection({
  title,
  tocTitle,
  body,
  anchorId,
  titleFont,
  titleSize,
  textAlign,
  bodyFont,
  bodyFontSize,
  spacing = "default",
  part = "all",
}: RichTextSectionProps) {
  const displayClass = useTypoClass("display");
  const bodyClass = useTypoClass("body");

  const desktopSizeClass = titleSize ? TITLE_SIZE_CLASS[titleSize] : "text-4xl";
  const titleSizeClasses = `text-3xl md:${desktopSizeClass}`;
  const fontClass = cmsMagazineOrFont(titleFont);
  const hasTitle = Boolean(title?.trim());
  const hasTocLabel = Boolean(tocTitle?.trim());
  const hasBody = portableTextHasVisibleContent(body);
  const scrollMargin =
    "calc(var(--site-header-height) + var(--project-toc-height) + 0.75rem)";

  if (!hasTitle && !hasBody && !hasTocLabel) return null;
  if (part === "title" && !hasTitle && !hasTocLabel) return null;
  if (part === "body" && !hasBody) return null;

  const showTitle = part !== "body" && hasTitle;
  const showTocAnchor = part !== "body" && !hasTitle && anchorId && hasTocLabel;
  const showBody = part !== "title" && hasBody;

  const titleGapClass =
    spacing === "story" ? "project-story-chapter-title" : "mb-5 md:mb-6";
  const titleAlignClass = chapterTextAlignClass(textAlign);
  const bodyAlignClass =
    textAlign === "right" ? TEXT_ALIGN_CLASS.left : titleAlignClass;
  const bodyTypo = {bodyFont, bodyFontSize};
  const bodyProseStyle = projectBodyProseStyle(bodyTypo);

  return (
    <section className={bodyClass}>
      {showTitle ? (
        <h2
          id={anchorId}
          data-toc-anchor={anchorId ? "true" : undefined}
          data-toc-level={anchorId ? "1" : undefined}
          className={`${titleGapClass} mt-0 leading-[1.1] md:leading-tight ${titleSizeClasses} ${fontClass} ${displayClass} ${titleAlignClass}`}
          style={{scrollMarginTop: scrollMargin}}
        >
          <span className="block w-full min-w-0">{title}</span>
        </h2>
      ) : showTocAnchor ? (
        <div
          id={anchorId}
          data-toc-anchor="true"
          data-toc-level="1"
          className="sr-only"
          aria-label={tocTitle ?? undefined}
          style={{scrollMarginTop: scrollMargin}}
        />
      ) : null}
      {showBody ? (
        <div
          className={[
            bodyAlignClass,
            spacing === "story" ? "project-story-prose" : undefined,
            projectBodyProseFontClass(bodyTypo),
          ]
            .filter(Boolean)
            .join(" ")}
          style={bodyProseStyle}
        >
          <PortableBody
            value={body ?? undefined}
            className={spacing === "story" ? bodyClass : undefined}
            bodyFont={spacing === "story" ? bodyFont : undefined}
            spacing={spacing === "story" ? "story" : "default"}
          />
        </div>
      ) : null}
    </section>
  );
}
