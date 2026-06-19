"use client";

import {useMemo, useState, type CSSProperties} from "react";
import {MediaLightbox} from "@/components/MediaLightbox";
import {SanityAspectMedia} from "@/components/sections/SanityAspectMedia";
import {useTypoClass} from "@/components/TypographyProvider";
import {storyImageSizing} from "@/lib/sanity/imageRequestWidth";
import {
  isSanityLightboxMedia,
  isSanityMedia,
  isSanityVideo,
  isSanityYoutube,
  normalizeMediaItem,
  sanityMediaKey,
} from "@/lib/sanity/media";
import type {CmsMediaInput, ProjectStoryMediaWidth, SanityMediaField} from "@/lib/types/project";
import {
  gridAspectRatioBoxStyle,
  gridUsesUniformCrop,
  normalizeGridAspectRatio,
  type GridAspectRatio,
  type GridCropFocus,
} from "@/lib/gridAspectRatio";

type CollageMedia = {
  key: string;
  media: NonNullable<SanityMediaField>;
  globalIndex: number;
};

type CollageStripItem =
  | {kind: "single"; entry: CollageMedia}
  | {kind: "pair"; key: string; left: CollageMedia; right: CollageMedia};

const PORTRAIT_COL_FR = 1;
const STRIP_COL_FR = 1;
/** Strip row height as a fraction of strip column width — 5/8 is slightly wider/shorter than 4:3. */
const STRIP_ROW_HEIGHT_NUM = 5;
const STRIP_ROW_HEIGHT_DEN = 8;

/** Desktop collage W/H so portrait height equals stacked strip rows. */
function matchedCollageAspectRatio(stripCount: number): string {
  const totalFr = PORTRAIT_COL_FR + STRIP_COL_FR;
  const widthUnits = STRIP_ROW_HEIGHT_DEN * totalFr;
  const heightUnits = STRIP_ROW_HEIGHT_NUM * stripCount * STRIP_COL_FR;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(widthUnits, heightUnits);
  return `${widthUnits / g} / ${heightUnits / g}`;
}

function resolveCollageMedia(
  portrait?: CmsMediaInput | null,
  strips?: Array<
    | CmsMediaInput
    | {
        _type: "projectPhotoCollagePair";
        _key?: string;
        swap?: boolean | null;
        left?: CmsMediaInput | null;
        right?: CmsMediaInput | null;
      }
  > | null,
): {portrait: CollageMedia | null; strips: CollageStripItem[]} {
  let portraitEntry: CollageMedia | null = null;
  const stripItems: CollageStripItem[] = [];
  let index = 0;

  const portraitMedia = normalizeMediaItem(portrait ?? null);
  if (portraitMedia && isSanityMedia(portraitMedia)) {
    portraitEntry = {
      key: sanityMediaKey(portraitMedia, index),
      media: portraitMedia,
      globalIndex: index,
    };
    index += 1;
  }

  for (const raw of strips ?? []) {
    if (!raw) continue;

    if (typeof raw === "object" && (raw as {_type?: string})?._type === "projectPhotoCollagePair") {
      const swap = Boolean((raw as {swap?: boolean | null}).swap);
      const leftField = (raw as {left?: CmsMediaInput | null}).left ?? null;
      const rightField = (raw as {right?: CmsMediaInput | null}).right ?? null;
      const leftMedia = normalizeMediaItem(swap ? rightField : leftField);
      const rightMedia = normalizeMediaItem(swap ? leftField : rightField);
      if (!leftMedia || !rightMedia || !isSanityMedia(leftMedia) || !isSanityMedia(rightMedia)) continue;
      const left: CollageMedia = {
        key: sanityMediaKey(leftMedia, index),
        media: leftMedia,
        globalIndex: index,
      };
      index += 1;
      const right: CollageMedia = {
        key: sanityMediaKey(rightMedia, index),
        media: rightMedia,
        globalIndex: index,
      };
      index += 1;
      stripItems.push({
        kind: "pair",
        key: (raw as {_key?: string})._key ?? `${left.key}--${right.key}`,
        left,
        right,
      });
      continue;
    }

    const media = normalizeMediaItem(raw as CmsMediaInput);
    if (!media || !isSanityMedia(media)) continue;
    const entry: CollageMedia = {
      key: sanityMediaKey(media, index),
      media,
      globalIndex: index,
    };
    index += 1;
    stripItems.push({kind: "single", entry});
  }

  return {portrait: portraitEntry, strips: stripItems};
}

function collageMediaLabel(
  media: NonNullable<SanityMediaField>,
  globalIndex: number,
  alt: string,
): string {
  if (isSanityYoutube(media)) {
    return alt ? `YouTube: ${alt}` : `YouTube video ${globalIndex + 1}`;
  }
  if (isSanityVideo(media)) {
    return alt ? `Play ${alt}` : `Play video ${globalIndex + 1}`;
  }
  return alt ? `View ${alt}` : `View photo ${globalIndex + 1}`;
}

function collageMobileCellProps(
  uniformCrop: boolean,
  gridAspectRatio: GridAspectRatio | null | undefined,
  role: "portrait" | "strip",
): {className: string; style?: CSSProperties} {
  if (uniformCrop) {
    return {
      className: "relative w-full",
      style: gridAspectRatioBoxStyle(normalizeGridAspectRatio(gridAspectRatio)) ?? undefined,
    };
  }
  return {
    className:
      role === "portrait"
        ? "relative aspect-[4/5] w-full md:aspect-auto md:min-h-0"
        : "relative aspect-[3/2] w-full md:aspect-auto md:min-h-0",
  };
}

function CollageCell({
  entry,
  lightboxItems,
  onOpenLightbox,
  sizing,
  gridAspectRatio = "auto",
  cropFocus = "auto",
}: {
  entry: CollageMedia;
  lightboxItems: SanityMediaField[];
  onOpenLightbox: (index: number) => void;
  sizing: ReturnType<typeof storyImageSizing>;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
}) {
  const {media, globalIndex} = entry;
  const alt = media.alt ?? "";
  const isClickable = isSanityLightboxMedia(media);
  const isLoopVideo = isSanityVideo(media) && Boolean(media.loop);
  const label = collageMediaLabel(media, globalIndex, alt);
  const uniformCrop = gridUsesUniformCrop(normalizeGridAspectRatio(gridAspectRatio));

  const mediaNode = (
    <SanityAspectMedia
      media={media}
      alt={alt}
      maxWidth={sizing.displayPx}
      quality={sizing.quality}
      sizes={sizing.sizes}
      fillFrame={!uniformCrop}
      gridAspectRatio={gridAspectRatio}
      cropFocus={cropFocus}
    />
  );

  const tileClass = [
    "group absolute inset-0 overflow-hidden rounded-lg bg-zinc-300 shadow-sm ring-1 ring-slate-200/60 transition-transform duration-200 ease-out hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400",
    uniformCrop ? "flex items-center justify-center" : "",
    isClickable && !isLoopVideo ? "[&_video]:pointer-events-none" : "",
    isLoopVideo ? "[&_video]:pointer-events-none [&_button]:pointer-events-auto" : "",
    uniformCrop
      ? "[&_.media-thumb]:h-auto [&_.media-thumb]:max-h-full [&_.media-thumb]:w-full [&_.media-thumb]:rounded-none"
      : "[&_.media-thumb]:h-full [&_.media-thumb]:rounded-none",
  ]
    .filter(Boolean)
    .join(" ");

  const openLightbox = () => {
    if (!isSanityLightboxMedia(media)) return;
    const lbIndex = lightboxItems.indexOf(media);
    if (lbIndex >= 0) onOpenLightbox(lbIndex);
  };

  if (!isClickable) {
    return (
      <div className={`${tileClass} [&_iframe]:pointer-events-auto`}>{mediaNode}</div>
    );
  }

  if (isSanityVideo(media)) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={`${tileClass} cursor-pointer`}
        aria-label={label}
        onClick={openLightbox}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openLightbox();
          }
        }}
      >
        <div className={uniformCrop ? "pointer-events-none w-full max-h-full" : "pointer-events-none h-full w-full"}>
          {mediaNode}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`${tileClass} cursor-zoom-in`}
      aria-label={label}
      onClick={openLightbox}
    >
      <div className={uniformCrop ? "pointer-events-none w-full max-h-full" : "pointer-events-none h-full w-full"}>
        {mediaNode}
      </div>
    </button>
  );
}

export function ProjectPhotoCollageSection({
  portrait,
  strips,
  portraitSide = "left",
  caption,
  mediaWidth,
  gridAspectRatio = "auto",
  cropFocus = "auto",
}: {
  portrait?: CmsMediaInput | null;
  strips?: Array<
    | CmsMediaInput
    | {
        _type: "projectPhotoCollagePair";
        _key?: string;
        left?: CmsMediaInput | null;
        right?: CmsMediaInput | null;
      }
  > | null;
  portraitSide?: "left" | "right" | null;
  caption?: string | null;
  mediaWidth?: ProjectStoryMediaWidth | null;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
}) {
  const metaClass = useTypoClass("meta");
  const sizing = storyImageSizing(mediaWidth);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const resolved = useMemo(() => resolveCollageMedia(portrait, strips), [portrait, strips]);
  const portraitEntry = resolved.portrait;
  const stripItems = resolved.strips;
  const lightboxItems = [
    ...(portraitEntry ? [portraitEntry.media] : []),
    ...stripItems.flatMap((s) =>
      s.kind === "pair" ? [s.left.media, s.right.media] : [s.entry.media],
    ),
  ].filter(isSanityLightboxMedia);
  const portraitOnRight = portraitSide === "right";
  const stripCount = stripItems.length;
  const portraitCol = portraitOnRight ? 2 : 1;
  const stripCol = portraitOnRight ? 1 : 2;
  const uniformCrop = gridUsesUniformCrop(normalizeGridAspectRatio(gridAspectRatio));

  if (!portraitEntry || stripCount === 0) return null;

  const portraitMobile = collageMobileCellProps(uniformCrop, gridAspectRatio, "portrait");
  const stripMobile = collageMobileCellProps(uniformCrop, gridAspectRatio, "strip");

  const stripCells = stripItems.map((item) => {
    if (item.kind === "pair") {
      return (
        <div key={item.key} className={stripMobile.className} style={stripMobile.style}>
          <div className="grid h-full w-full grid-cols-2 gap-1">
            <div className="relative min-h-0 min-w-0">
              <CollageCell
                entry={item.left}
                lightboxItems={lightboxItems}
                onOpenLightbox={setLightboxIndex}
                sizing={sizing}
                gridAspectRatio={gridAspectRatio}
                cropFocus={cropFocus}
              />
            </div>
            <div className="relative min-h-0 min-w-0">
              <CollageCell
                entry={item.right}
                lightboxItems={lightboxItems}
                onOpenLightbox={setLightboxIndex}
                sizing={sizing}
                gridAspectRatio={gridAspectRatio}
                cropFocus={cropFocus}
              />
            </div>
          </div>
        </div>
      );
    }

    const entry = item.entry;
    return (
      <div key={entry.key} className={stripMobile.className} style={stripMobile.style}>
        <CollageCell
          entry={entry}
          lightboxItems={lightboxItems}
          onOpenLightbox={setLightboxIndex}
          sizing={sizing}
          gridAspectRatio={gridAspectRatio}
          cropFocus={cropFocus}
        />
      </div>
    );
  });

  const portraitCell = (
    <div className={portraitMobile.className} style={portraitMobile.style}>
      <CollageCell
        entry={portraitEntry}
        lightboxItems={lightboxItems}
        onOpenLightbox={setLightboxIndex}
        sizing={sizing}
        gridAspectRatio={gridAspectRatio}
        cropFocus={cropFocus}
      />
    </div>
  );

  return (
    <section className="w-full" aria-label="Media collage">
      {/* Mobile: order follows layout */}
      <div className="flex flex-col gap-1 sm:gap-1.5 md:hidden">
        {portraitOnRight ? (
          <>
            {stripCells}
            {portraitCell}
          </>
        ) : (
          <>
            {portraitCell}
            {stripCells}
          </>
        )}
      </div>

      {/* Desktop: portrait row-span matches strip stack height exactly */}
      <div
        className="hidden w-full gap-1 sm:gap-1.5 md:grid md:grid-cols-2"
        style={{
          aspectRatio: matchedCollageAspectRatio(stripCount),
          gridTemplateRows: `repeat(${stripCount}, minmax(0, 1fr))`,
        }}
      >
        <div
          className="relative min-h-0 min-w-0"
          style={{gridColumn: portraitCol, gridRow: `1 / span ${stripCount}`}}
        >
          <CollageCell
            entry={portraitEntry}
            lightboxItems={lightboxItems}
            onOpenLightbox={setLightboxIndex}
            sizing={sizing}
            gridAspectRatio={gridAspectRatio}
            cropFocus={cropFocus}
          />
        </div>

        {stripItems.map((item, index) => (
          <div
            key={item.kind === "pair" ? item.key : item.entry.key}
            className="relative min-h-0 min-w-0"
            style={{gridColumn: stripCol, gridRow: index + 1}}
          >
            {item.kind === "pair" ? (
              <div className="grid h-full w-full grid-cols-2 gap-1">
                <div className="relative min-h-0 min-w-0">
                  <CollageCell
                    entry={item.left}
                    lightboxItems={lightboxItems}
                    onOpenLightbox={setLightboxIndex}
                    sizing={sizing}
                    gridAspectRatio={gridAspectRatio}
                    cropFocus={cropFocus}
                  />
                </div>
                <div className="relative min-h-0 min-w-0">
                  <CollageCell
                    entry={item.right}
                    lightboxItems={lightboxItems}
                    onOpenLightbox={setLightboxIndex}
                    sizing={sizing}
                    gridAspectRatio={gridAspectRatio}
                    cropFocus={cropFocus}
                  />
                </div>
              </div>
            ) : (
              <CollageCell
                entry={item.entry}
                lightboxItems={lightboxItems}
                onOpenLightbox={setLightboxIndex}
                sizing={sizing}
                gridAspectRatio={gridAspectRatio}
                cropFocus={cropFocus}
              />
            )}
          </div>
        ))}
      </div>

      {caption ? <p className={`mt-3 text-sm text-zinc-500 ${metaClass}`}>{caption}</p> : null}

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
