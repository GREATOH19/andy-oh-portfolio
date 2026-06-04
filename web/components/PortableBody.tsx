import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { ReactNode } from "react";
import { StoryInlineMedia } from "@/components/project/StoryInlineMedia";
import { cmsFontClass } from "@/lib/cmsFontClass";
import { STORY_BODY_TEXT_CLASS } from "@/lib/portableText/bodyTypography";
import {filterEmptyPortableTextBlocks} from "@/lib/portableText/filterEmptyBlocks";

/** Readable body stack inside a chapter (not section-to-section rhythm). */
const STORY_BLOCK_STACK_CLASS = "project-story-prose-stack";

function headingText(children: ReactNode): string {
  if (children == null) return "";
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(headingText).join("");
  return "";
}

function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildHeadingId(children: ReactNode, key?: string) {
  const text = headingText(children);
  const slug = slugifyHeading(text);
  if (key) return slug ? `${slug}-${key}` : `heading-${key}`;
  return slug || undefined;
}

const markWrap =
  (className: string) =>
  ({ children }: { children?: ReactNode }) => <span className={className}>{children}</span>;

function portableTextFontSizeMark({
  value,
  children,
}: {
  value?: { size?: number };
  children?: ReactNode;
}) {
  const px = value?.size;
  if (typeof px !== "number" || !Number.isFinite(px) || px <= 0) return <>{children}</>;
  return (
    <span className="story-pt-font-size" style={{ fontSize: `${px}px` }}>
      {children}
    </span>
  );
}

const portableTextTypographyMarks = {
  font: ({ value, children }: { value?: { font?: string }; children?: ReactNode }) => (
    <span className={cmsFontClass(value?.font)}>{children}</span>
  ),
  fontSize: portableTextFontSizeMark,
  sizeSm: markWrap("text-sm"),
  sizeLg: markWrap("text-lg"),
  sizeXl: markWrap("text-xl"),
} satisfies PortableTextComponents["marks"];

type ListVariant = "default" | "story" | "muted";

/** Tailwind preflight strips list markers; explicit list + listItem serializers restore them. */
function portableTextListComponents(
  variant: ListVariant,
): Pick<PortableTextComponents, "list" | "listItem"> {
  const itemClass =
    variant === "story"
      ? `${STORY_BODY_TEXT_CLASS} leading-[1.95] text-zinc-700`
      : variant === "muted"
        ? "text-base leading-relaxed text-slate-600"
        : "text-[1.02rem] leading-[1.95] text-zinc-700";
  const listClass =
    variant === "story"
      ? "story-body-list m-0 list-outside space-y-2 pl-6"
      : variant === "muted"
        ? "mb-4 list-outside space-y-1 pl-6 last:mb-0"
        : "mb-5 list-outside space-y-2 pl-6";

  return {
    list: {
      bullet: ({ children }) => (
        <ul className={`${listClass} list-disc`}>{children}</ul>
      ),
      number: ({ children }) => (
        <ol className={`${listClass} list-decimal`}>{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className={itemClass}>{children}</li>,
      number: ({ children }) => <li className={itemClass}>{children}</li>,
    },
  };
}

const components: PortableTextComponents = {
  ...portableTextListComponents("default"),
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-[1.02rem] leading-[1.95] text-zinc-700">{children}</p>
    ),
    sizeSm: ({ children }) => (
      <p className="mb-5 text-sm leading-[1.95] text-zinc-700">{children}</p>
    ),
    sizeLg: ({ children }) => (
      <p className="mb-5 text-lg leading-[1.95] text-zinc-700">{children}</p>
    ),
    sizeXl: ({ children }) => (
      <p className="mb-5 text-xl leading-[1.95] text-zinc-700">{children}</p>
    ),
    // Legacy: older schema used block styles for font selection (kept for existing content).
    fontSerif: ({ children }) => (
      <p className="mb-5 text-[1.02rem] leading-[1.95] text-zinc-700 font-serif">{children}</p>
    ),
    fontSans: ({ children }) => (
      <p className="mb-5 text-[1.02rem] leading-[1.95] text-zinc-700 font-sans">{children}</p>
    ),
    fontMono: ({ children }) => (
      <p className="mb-5 text-[1.02rem] leading-[1.95] text-zinc-700 font-mono">{children}</p>
    ),
    fontDmSans: ({ children }) => (
      <p className="mb-5 text-[1.02rem] leading-[1.95] text-zinc-700 font-brand-dm">{children}</p>
    ),
    fontInstrument: ({ children }) => (
      <p className="mb-5 text-[1.02rem] leading-[1.95] text-zinc-700 font-brand-instrument">{children}</p>
    ),
    fontPinyon: ({ children }) => (
      <p className="mb-5 text-[1.02rem] leading-[1.95] text-zinc-700 font-brand-pinyon">{children}</p>
    ),
    fontGloock: ({ children }) => (
      <p className="mb-5 text-[1.02rem] leading-[1.95] text-zinc-700 font-brand-gloock">{children}</p>
    ),
    fontSpaceGrotesk: ({ children }) => (
      <p className="mb-5 text-[1.02rem] leading-[1.95] text-zinc-700 font-brand-space-grotesk">{children}</p>
    ),
    h2: ({ children, value }) => {
      const id = buildHeadingId(children, (value as { _key?: string } | undefined)?._key);
      return (
        <h2
          id={id}
          data-toc-anchor={id ? "true" : undefined}
          data-toc-level={id ? "2" : undefined}
          className="cms-title-tone magazine-serif mb-4 mt-10 block w-full min-w-0 text-xl leading-[1.1] md:text-4xl md:leading-tight"
          style={{
            scrollMarginTop:
              "calc(var(--site-header-height) + var(--project-toc-height) + 0.75rem)",
          }}
        >
          {children}
        </h2>
      );
    },
    h2Sm: ({ children }) => (
      <h2 className="cms-title-tone magazine-serif mb-4 mt-10 block w-full min-w-0 text-xl leading-[1.1] md:text-2xl md:leading-tight">
        {children}
      </h2>
    ),
    h2Lg: ({ children }) => (
      <h2 className="cms-title-tone magazine-serif mb-4 mt-10 block w-full min-w-0 text-xl leading-[1.1] md:text-5xl md:leading-tight">
        {children}
      </h2>
    ),
    h2Xl: ({ children }) => (
      <h2 className="cms-title-tone magazine-serif mb-4 mt-10 block w-full min-w-0 text-xl leading-[1.1] md:text-6xl md:leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => {
      const id = buildHeadingId(children, (value as { _key?: string } | undefined)?._key);
      return (
        <h3
          id={id}
          data-toc-anchor={id ? "true" : undefined}
          data-toc-level={id ? "3" : undefined}
          className="cms-title-tone magazine-serif mb-3 mt-8 block w-full min-w-0 text-lg leading-[1.1] md:text-2xl md:leading-tight"
          style={{
            scrollMarginTop:
              "calc(var(--site-header-height) + var(--project-toc-height) + 0.75rem)",
          }}
        >
          {children}
        </h3>
      );
    },
    h3Sm: ({ children }) => (
      <h3 className="cms-title-tone magazine-serif mb-3 mt-8 block w-full min-w-0 text-lg leading-[1.1] md:text-xl md:leading-tight">
        {children}
      </h3>
    ),
    h3Lg: ({ children }) => (
      <h3 className="cms-title-tone magazine-serif mb-3 mt-8 block w-full min-w-0 text-lg leading-[1.1] md:text-3xl md:leading-tight">
        {children}
      </h3>
    ),
    h3Xl: ({ children }) => (
      <h3 className="cms-title-tone magazine-serif mb-3 mt-8 block w-full min-w-0 text-lg leading-[1.1] md:text-4xl md:leading-tight">
        {children}
      </h3>
    ),
  },
  marks: portableTextTypographyMarks,
};

const storyScrollMargin = {
  scrollMarginTop:
    "calc(var(--site-header-height) + var(--project-toc-height) + 0.75rem)",
};

/** Story body: vertical rhythm from .project-story-prose-stack gap only (no mb-5 / mt-10 utilities). */
const storyComponents: PortableTextComponents = {
  ...portableTextListComponents("story"),
  block: {
    normal: ({ children }) => (
      <p className={`m-0 ${STORY_BODY_TEXT_CLASS} leading-[1.95] text-zinc-700`}>{children}</p>
    ),
    sizeSm: ({ children }) => (
      <p className="m-0 text-sm leading-[1.95] text-zinc-700">{children}</p>
    ),
    sizeLg: ({ children }) => (
      <p className="m-0 text-lg leading-[1.95] text-zinc-700">{children}</p>
    ),
    sizeXl: ({ children }) => (
      <p className="m-0 text-xl leading-[1.95] text-zinc-700">{children}</p>
    ),
    fontSerif: ({ children }) => (
      <p className={`m-0 ${STORY_BODY_TEXT_CLASS} leading-[1.95] text-zinc-700 font-serif`}>
        {children}
      </p>
    ),
    fontSans: ({ children }) => (
      <p className={`m-0 ${STORY_BODY_TEXT_CLASS} leading-[1.95] text-zinc-700 font-sans`}>
        {children}
      </p>
    ),
    fontMono: ({ children }) => (
      <p className={`m-0 ${STORY_BODY_TEXT_CLASS} leading-[1.95] text-zinc-700 font-mono`}>
        {children}
      </p>
    ),
    fontDmSans: ({ children }) => (
      <p className={`m-0 ${STORY_BODY_TEXT_CLASS} leading-[1.95] text-zinc-700 font-brand-dm`}>
        {children}
      </p>
    ),
    fontInstrument: ({ children }) => (
      <p
        className={`m-0 ${STORY_BODY_TEXT_CLASS} leading-[1.95] text-zinc-700 font-brand-instrument`}
      >
        {children}
      </p>
    ),
    fontPinyon: ({ children }) => (
      <p className={`m-0 ${STORY_BODY_TEXT_CLASS} leading-[1.95] text-zinc-700 font-brand-pinyon`}>
        {children}
      </p>
    ),
    fontGloock: ({ children }) => (
      <p className={`m-0 ${STORY_BODY_TEXT_CLASS} leading-[1.95] text-zinc-700 font-brand-gloock`}>
        {children}
      </p>
    ),
    fontSpaceGrotesk: ({ children }) => (
      <p
        className={`m-0 ${STORY_BODY_TEXT_CLASS} leading-[1.95] text-zinc-700 font-brand-space-grotesk`}
      >
        {children}
      </p>
    ),
    h2: ({ children, value }) => {
      const id = buildHeadingId(children, (value as { _key?: string } | undefined)?._key);
      return (
        <h2
          id={id}
          data-toc-anchor={id ? "true" : undefined}
          data-toc-level={id ? "2" : undefined}
          className="cms-title-tone magazine-serif m-0 block w-full min-w-0 text-xl leading-[1.1] md:text-4xl md:leading-tight"
          style={storyScrollMargin}
        >
          {children}
        </h2>
      );
    },
    h2Sm: ({ children }) => (
      <h2 className="cms-title-tone magazine-serif m-0 block w-full min-w-0 text-xl leading-[1.1] md:text-2xl md:leading-tight">
        {children}
      </h2>
    ),
    h2Lg: ({ children }) => (
      <h2 className="cms-title-tone magazine-serif m-0 block w-full min-w-0 text-xl leading-[1.1] md:text-5xl md:leading-tight">
        {children}
      </h2>
    ),
    h2Xl: ({ children }) => (
      <h2 className="cms-title-tone magazine-serif m-0 block w-full min-w-0 text-xl leading-[1.1] md:text-6xl md:leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => {
      const id = buildHeadingId(children, (value as { _key?: string } | undefined)?._key);
      return (
        <h3
          id={id}
          data-toc-anchor={id ? "true" : undefined}
          data-toc-level={id ? "3" : undefined}
          className="cms-title-tone magazine-serif m-0 block w-full min-w-0 text-lg leading-[1.1] md:text-2xl md:leading-tight"
          style={storyScrollMargin}
        >
          {children}
        </h3>
      );
    },
    h3Sm: ({ children }) => (
      <h3 className="cms-title-tone magazine-serif m-0 block w-full min-w-0 text-lg leading-[1.1] md:text-xl md:leading-tight">
        {children}
      </h3>
    ),
    h3Lg: ({ children }) => (
      <h3 className="cms-title-tone magazine-serif m-0 block w-full min-w-0 text-lg leading-[1.1] md:text-3xl md:leading-tight">
        {children}
      </h3>
    ),
    h3Xl: ({ children }) => (
      <h3 className="cms-title-tone magazine-serif m-0 block w-full min-w-0 text-lg leading-[1.1] md:text-4xl md:leading-tight">
        {children}
      </h3>
    ),
  },
  marks: portableTextTypographyMarks,
};

const mutedComponents: PortableTextComponents = {
  ...portableTextListComponents("muted"),
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-slate-600 last:mb-0">{children}</p>
    ),
    sizeSm: ({ children }) => (
      <p className="mb-4 text-sm leading-relaxed text-slate-600 last:mb-0">{children}</p>
    ),
    sizeLg: ({ children }) => (
      <p className="mb-4 text-lg leading-relaxed text-slate-600 last:mb-0">{children}</p>
    ),
    sizeXl: ({ children }) => (
      <p className="mb-4 text-xl leading-relaxed text-slate-600 last:mb-0">{children}</p>
    ),
    // Legacy: older schema used block styles for font selection (kept for existing content).
    fontSerif: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-slate-600 last:mb-0 font-serif">{children}</p>
    ),
    fontSans: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-slate-600 last:mb-0 font-sans">{children}</p>
    ),
    fontMono: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-slate-600 last:mb-0 font-mono">{children}</p>
    ),
    fontDmSans: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-slate-600 last:mb-0 font-brand-dm">{children}</p>
    ),
    fontInstrument: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-slate-600 last:mb-0 font-brand-instrument">{children}</p>
    ),
    fontPinyon: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-slate-600 last:mb-0 font-brand-pinyon">{children}</p>
    ),
    fontGloock: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-slate-600 last:mb-0 font-brand-gloock">{children}</p>
    ),
    fontSpaceGrotesk: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-slate-600 last:mb-0 font-brand-space-grotesk">{children}</p>
    ),
    h2: ({ children, value }) => {
      const id = buildHeadingId(children, (value as { _key?: string } | undefined)?._key);
      return (
        <h2
          id={id}
          data-toc-anchor={id ? "true" : undefined}
          data-toc-level={id ? "2" : undefined}
          className="cms-title-tone magazine-serif mb-3 mt-6 text-2xl leading-tight"
          style={{
            scrollMarginTop:
              "calc(var(--site-header-height) + var(--project-toc-height) + 0.75rem)",
          }}
        >
          {children}
        </h2>
      );
    },
    h2Sm: ({ children }) => (
      <h2 className="cms-title-tone magazine-serif mb-3 mt-6 text-xl leading-tight">{children}</h2>
    ),
    h2Lg: ({ children }) => (
      <h2 className="cms-title-tone magazine-serif mb-3 mt-6 text-3xl leading-tight">{children}</h2>
    ),
    h2Xl: ({ children }) => (
      <h2 className="cms-title-tone magazine-serif mb-3 mt-6 text-4xl leading-tight">{children}</h2>
    ),
    h3: ({ children, value }) => {
      const id = buildHeadingId(children, (value as { _key?: string } | undefined)?._key);
      return (
        <h3
          id={id}
          data-toc-anchor={id ? "true" : undefined}
          data-toc-level={id ? "3" : undefined}
          className="cms-title-tone magazine-serif mb-2 mt-5 text-xl leading-tight"
          style={{
            scrollMarginTop:
              "calc(var(--site-header-height) + var(--project-toc-height) + 0.75rem)",
          }}
        >
          {children}
        </h3>
      );
    },
    h3Sm: ({ children }) => (
      <h3 className="cms-title-tone magazine-serif mb-2 mt-5 text-lg leading-tight">{children}</h3>
    ),
    h3Lg: ({ children }) => (
      <h3 className="cms-title-tone magazine-serif mb-2 mt-5 text-2xl leading-tight">{children}</h3>
    ),
    h3Xl: ({ children }) => (
      <h3 className="cms-title-tone magazine-serif mb-2 mt-5 text-3xl leading-tight">{children}</h3>
    ),
  },
  marks: {
    font: portableTextTypographyMarks.font,
    fontSize: portableTextTypographyMarks.fontSize,
  },
};

export function PortableBody({
  value,
  className,
  bodyFont,
  muted = false,
  spacing = "default",
}: {
  value: PortableTextBlock[] | null | undefined;
  /** Applied to a wrapper so font-* inherits into portable text */
  className?: string;
  /** Chapter/zigzag CMS body font (wins over className when both set font utilities) */
  bodyFont?: string | null;
  /** Slate footer-friendly typography */
  muted?: boolean;
  /** Story chapters: drop empty lines; stack blocks like image/quote sections */
  spacing?: "default" | "story";
}) {
  const blocks =
    spacing === "story" ? filterEmptyPortableTextBlocks(value) : (value ?? []);
  if (!blocks.length) return null;
  const base =
    spacing === "story" && !muted ? storyComponents : muted ? mutedComponents : components;
  const c: PortableTextComponents =
    spacing === "story"
      ? {
          ...base,
          types: {
            projectInlineMedia: ({ value }) => (
              <StoryInlineMedia value={value as Parameters<typeof StoryInlineMedia>[0]["value"]} />
            ),
          },
        }
      : base;
  const inner = <PortableText value={blocks} components={c} />;
  const stackClass = spacing === "story" ? STORY_BLOCK_STACK_CLASS : "";
  const stackFontClass = cmsFontClass(bodyFont) || className?.trim();
  const mergedClass = [stackClass, stackFontClass].filter(Boolean).join(" ");
  if (!mergedClass) return inner;
  return <div className={mergedClass}>{inner}</div>;
}
