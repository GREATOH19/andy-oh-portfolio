"use client";

import {useMemo, useState} from "react";
import {MediaLightbox} from "@/components/MediaLightbox";
import {PortableBody} from "@/components/PortableBody";
import {SanityAspectMedia} from "@/components/sections/SanityAspectMedia";
import {type MediaAspect, mediaNaturalAspect} from "@/lib/gridRowAspect";
import {portableTextHasVisibleContent} from "@/lib/portableText/filterEmptyBlocks";
import {
  isSanityLightboxMedia,
  isSanityMedia,
  normalizeMediaItem,
  normalizeMediaList,
  sanityMediaKey,
} from "@/lib/sanity/media";
import type {
  ProjectSlideBlock,
  ProjectSlideItem,
  ProjectSlideItemsStyle,
  SanityMediaField,
} from "@/lib/types/project";

/* Deck palette (inbox/monklap/images/slide-*.jpg): navy headline, brown accent, blue numerals, slate labels. */
const INK = "text-[#101a2e]";
const ACCENT = "text-[#7a4a2b]";
const NUM = "font-mono text-[0.7rem] tracking-[0.18em] text-[#1d6fa5]";
const LABEL = "font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[#4a5a6e]";
const RULE = "border-[#7a4a2b]/45";

const SCROLL_MARGIN = {
  scrollMarginTop: "calc(var(--site-header-height) + var(--project-toc-height) + 0.75rem)",
};

const CARD_TONES = [
  "bg-[#f3e6d3] text-[#101a2e]",
  "bg-[#cdb89c] text-[#101a2e]",
  "bg-[#6e4a33] text-[#fbf4ea]",
];

const pad2 = (n: number) => String(n + 1).padStart(2, "0");

/** One crop for every tile in a row (average of their shapes), so tops, bottoms and captions line up. */
function sharedRowAspect(items: SanityMediaField[]): MediaAspect | undefined {
  if (items.length < 2) return undefined;
  const ratios = items.map((m) => {
    const {width, height} = mediaNaturalAspect(m);
    return height / width;
  });
  const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  return {width: 1000, height: Math.round(avg * 1000)};
}

/** Media rows: one column per item on every screen size, so a row stays a row. */
const ROW_COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

/** "Columns" items: one column per item on desktop (up to 4). */
const COLUMN_COLS: Record<number, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 md:grid-cols-4",
};

function SlideMedia({
  media,
  sizes,
  onOpen,
  rowAspect,
}: {
  media: NonNullable<SanityMediaField>;
  sizes: string;
  onOpen?: () => void;
  rowAspect?: MediaAspect;
}) {
  const alt = media.alt ?? "";
  const node = (
    <SanityAspectMedia
      media={media}
      alt={alt}
      maxWidth={1600}
      quality={92}
      sizes={sizes}
      gridRowAspect={rowAspect}
    />
  );
  return (
    <figure className="m-0 min-w-0">
      {onOpen && isSanityLightboxMedia(media) ? (
        <button
          type="button"
          onClick={onOpen}
          className="group block w-full cursor-zoom-in text-left [&_video]:pointer-events-none"
          aria-label={alt ? `View ${alt}` : "View media"}
        >
          {node}
        </button>
      ) : (
        <div className="w-full">{node}</div>
      )}
      {alt ? <figcaption className={`mt-3 ${LABEL} max-sm:tracking-[0.06em]`}>{alt}</figcaption> : null}
    </figure>
  );
}

function SlideItems({items, style}: {items: ProjectSlideItem[]; style: ProjectSlideItemsStyle}) {
  if (style === "cards") {
    return (
      <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const media = normalizeMediaItem(item.media);
          const dark = i % 3 === 2;
          return (
            <li
              key={item._key ?? i}
              className={`flex flex-col rounded-2xl p-6 ${CARD_TONES[i % CARD_TONES.length]}`}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`font-sans text-[2.75rem] font-semibold leading-none tracking-[-0.03em] ${
                    dark ? "text-[#d9b48f]" : ACCENT
                  }`}
                >
                  {pad2(i)}
                </span>
                {media ? (
                  <div className="w-[38%] shrink-0 overflow-hidden rounded-lg [&_.media-thumb]:rounded-lg [&_.media-thumb]:shadow-none [&_.media-thumb]:ring-0">
                    <SanityAspectMedia
                      media={media}
                      alt={media.alt ?? ""}
                      maxWidth={480}
                      quality={85}
                      sizes="(max-width: 640px) 40vw, 160px"
                      gridAspectRatio="photo"
                      inGrid
                    />
                  </div>
                ) : null}
              </div>
              {item.title ? (
                <h3 className="mt-5 font-sans text-[1.35rem] font-semibold leading-[1.15] tracking-[-0.02em]">
                  {item.title}
                </h3>
              ) : null}
              {item.text ? (
                <p className={`mt-3 text-[0.95rem] leading-[1.6] ${dark ? "text-[#fbf4ea]/85" : "text-[#4a5568]"}`}>
                  {item.text}
                </p>
              ) : null}
              {item.tags?.length ? (
                <ul className="mt-auto flex list-none flex-wrap gap-1.5 p-0 pt-5">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className={`rounded-full border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] ${
                        dark ? "border-[#fbf4ea]/40 text-[#fbf4ea]/85" : "border-[#1d6fa5]/35 text-[#1d6fa5]"
                      }`}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  if (style === "list") {
    return (
      <ol className="m-0 list-none p-0">
        {items.map((item, i) => {
          const media = normalizeMediaItem(item.media);
          return (
            <li
              key={item._key ?? i}
              className={`grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 border-t py-5 ${RULE} ${
                media ? "md:grid-cols-[2rem_minmax(0,1fr)_6rem]" : ""
              }`}
            >
              <span className={`${NUM} pt-1.5`}>{pad2(i)}</span>
              <div>
                {item.title ? (
                  <h3 className={`font-sans text-[1.2rem] font-semibold leading-[1.2] tracking-[-0.015em] ${INK}`}>
                    {item.title}
                  </h3>
                ) : null}
                {item.text ? (
                  <p className="mt-1.5 text-[0.95rem] leading-[1.6] text-[#4a5568]">{item.text}</p>
                ) : null}
              </div>
              {media ? (
                <div className="col-start-2 mt-3 w-24 md:col-start-3 md:mt-0 [&_.media-thumb]:rounded-lg [&_.media-thumb]:shadow-none [&_.media-thumb]:ring-0">
                  <SanityAspectMedia
                    media={media}
                    alt={media.alt ?? ""}
                    maxWidth={240}
                    quality={85}
                    sizes="96px"
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    );
  }

  if (style === "table") {
    const twoCols = items.length > 3;
    return (
      <dl className={`m-0 grid gap-x-10 ${twoCols ? "md:grid-cols-2" : ""}`}>
        {items.map((item, i) => (
          <div
            key={item._key ?? i}
            className={`grid grid-cols-[7rem_minmax(0,1fr)] gap-x-6 border-t py-5 ${RULE}`}
          >
            <dt className={`font-sans text-[1.05rem] font-semibold leading-[1.4] ${INK}`}>{item.title}</dt>
            <dd className="m-0 text-[0.95rem] leading-[1.65] text-[#4a5568]">{item.text}</dd>
          </div>
        ))}
      </dl>
    );
  }

  const columnMedia = items
    .map((item) => normalizeMediaItem(item.media))
    .filter((m): m is NonNullable<SanityMediaField> => m != null);
  const columnAspect = sharedRowAspect(columnMedia);
  const colCount = Math.min(items.length, 4);
  const colsClass = columnMedia.length ? `gap-3 sm:gap-8 ${ROW_COLS[colCount] ?? ""}` : `gap-8 ${COLUMN_COLS[colCount] ?? ""}`;
  return (
    <ul className={`m-0 grid list-none border-t p-0 pt-6 ${colsClass} ${RULE}`}>
      {items.map((item, i) => {
        const media = normalizeMediaItem(item.media);
        return (
        <li key={item._key ?? i}>
          {media ? (
            <div className="mb-5 [&_.media-thumb]:rounded-xl [&_.media-thumb]:shadow-none [&_.media-thumb]:ring-0">
              <SanityAspectMedia
                media={media}
                alt={media.alt ?? ""}
                maxWidth={640}
                quality={88}
                sizes="(max-width: 640px) 100vw, 25vw"
                gridRowAspect={columnAspect}
              />
            </div>
          ) : null}
          <span className={NUM}>{pad2(i)}</span>
          {item.title ? (
            <h3 className={`mt-3 font-sans text-[1.35rem] font-semibold leading-[1.15] tracking-[-0.02em] ${ACCENT}`}>
              {item.title}
            </h3>
          ) : null}
          {item.text ? (
            <p className="mt-3 text-[0.95rem] leading-[1.6] text-[#4a5568]">{item.text}</p>
          ) : null}
        </li>
        );
      })}
    </ul>
  );
}

export function ProjectSlideSection({block, anchorId}: {block: ProjectSlideBlock; anchorId: string}) {
  const media = useMemo(() => normalizeMediaList(block.images).filter(isSanityMedia), [block.images]);
  const lightboxItems = useMemo(() => media.filter(isSanityLightboxMedia), [media]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = (block.slideItems ?? []).filter((item) => item.title?.trim() || item.text?.trim());
  const itemsStyle = block.itemsStyle ?? "columns";
  const hasBody = portableTextHasVisibleContent(block.body);
  const side = media.length > 0 && block.mediaSide !== "below" ? (block.mediaSide ?? "right") : "below";
  /** Deck convention: the accent gets its own line unless the headline runs over a full-width media row. */
  const accentBreaks = !(side === "below" && media.length > 0);
  const title = block.title?.trim();
  const accent = block.titleAccent?.trim();
  if (!title && !accent) return null;

  const openLightbox = (item: NonNullable<SanityMediaField>) => {
    if (!isSanityLightboxMedia(item)) return;
    const i = lightboxItems.indexOf(item);
    if (i >= 0) setLightboxIndex(i);
  };

  const head = (
    <header>
      {block.eyebrow ? <p className={`m-0 ${LABEL}`}>{block.eyebrow}</p> : null}
      <h2
        id={anchorId}
        data-toc-anchor="true"
        data-toc-level="1"
        className={`m-0 mt-6 font-sans text-[clamp(2.5rem,5.2vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] ${INK}`}
        style={SCROLL_MARGIN}
      >
        {title}
        {accent ? (
          <>
            {accentBreaks ? <br /> : " "}
            <span className={ACCENT}>{accent}</span>
          </>
        ) : null}
      </h2>
    </header>
  );

  const body = hasBody ? (
    <div className="mt-7 max-w-[34rem] font-sans [&_p]:mb-3 [&_p]:text-[1.05rem] [&_p]:leading-[1.6] [&_p]:text-[#1b2430] [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-[#101a2e]">
      <PortableBody value={block.body} bodyFont="sans" />
    </div>
  ) : null;

  const itemsNode = items.length ? (
    <div className="mt-10">
      <SlideItems items={items} style={itemsStyle} />
    </div>
  ) : null;

  const mediaCols = Math.min(media.length, 4);
  const rowAspect = sharedRowAspect(media);
  const mediaRow = media.length ? (
    <div
      className={`grid gap-2 sm:gap-4 ${
        side === "below" ? (ROW_COLS[mediaCols] ?? "") : mediaCols > 1 ? "grid-cols-2" : ""
      }`}
    >
      {media.map((item, i) => (
        <SlideMedia
          key={sanityMediaKey(item, i)}
          media={item}
          rowAspect={rowAspect}
          sizes={
            side === "below"
              ? `${Math.round(100 / mediaCols)}vw`
              : mediaCols > 1
                ? "(max-width: 768px) 50vw, 25vw"
                : "(max-width: 768px) 100vw, 40vw"
          }
          onOpen={() => openLightbox(item)}
        />
      ))}
    </div>
  ) : null;

  return (
    <section className="project-slide w-full" aria-labelledby={anchorId}>
      {side === "below" ? (
        <>
          {head}
          {body}
          {mediaRow ? <div className="mt-10">{mediaRow}</div> : null}
          {itemsNode}
        </>
      ) : (
        <div
          className={`grid gap-10 md:items-start md:gap-14 ${
            mediaCols > 1
              ? "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
              : "md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"
          }`}
        >
          <div className={side === "left" ? "md:order-2" : ""}>
            {head}
            {body}
            {itemsNode}
          </div>
          <div className={side === "left" ? "md:order-1" : ""}>{mediaRow}</div>
        </div>
      )}

      {lightboxIndex !== null && lightboxItems.length > 0 ? (
        <MediaLightbox
          items={lightboxItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      ) : null}
    </section>
  );
}
