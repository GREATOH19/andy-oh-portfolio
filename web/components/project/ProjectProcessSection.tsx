"use client";

import {Fragment, useCallback, useMemo, useState} from "react";
import {MediaLightbox} from "@/components/MediaLightbox";
import {SanityAspectMedia} from "@/components/sections/SanityAspectMedia";
import {useTypoClass} from "@/components/TypographyProvider";
import {tallestRowAspect, type MediaAspect} from "@/lib/gridRowAspect";
import {galleryGridThumbSizes, normalizeGalleryColumns} from "@/lib/projectStory/galleryGrid";
import {useGalleryBreakpointColumns} from "@/lib/projectStory/useGalleryBreakpointColumns";
import {storyImageSizing} from "@/lib/sanity/imageRequestWidth";
import {
  isSanityImage,
  isSanityLightboxMedia,
  isSanityMedia,
  isSanityVideo,
  normalizeMediaItem,
  sanityMediaKey,
} from "@/lib/sanity/media";
import {clampGridTileAspect, type GridAspectRatio, type GridCropFocus} from "@/lib/gridAspectRatio";
import type {
  ProjectProcessBlock,
  ProjectProcessStep,
  ProjectStoryMediaWidth,
  SanityMediaField,
} from "@/lib/types/project";

type ResolvedStep = {
  key: string;
  media: NonNullable<SanityMediaField>;
  caption?: string | null;
  globalIndex: number;
};

function resolveSteps(raw?: ProjectProcessStep[] | null): ResolvedStep[] {
  if (!raw?.length) return [];

  const resolved: ResolvedStep[] = [];
  raw.forEach((step, i) => {
    const media = normalizeMediaItem(step.media);
    if (!media || !isSanityMedia(media)) return;
    resolved.push({
      key: step._key ?? sanityMediaKey(media, i),
      media,
      caption: step.caption,
      globalIndex: i,
    });
  });
  return resolved;
}

function chunkSteps(steps: ResolvedStep[], columns: number): ResolvedStep[][] {
  if (columns < 1) return [steps];
  const rows: ResolvedStep[][] = [];
  for (let i = 0; i < steps.length; i += columns) {
    rows.push(steps.slice(i, i + columns));
  }
  return rows;
}

function ProcessStepNumber({number}: {number: number}) {
  return (
    <span
      className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex h-7 min-w-7 items-center justify-center rounded-full bg-[var(--background-mid)] px-1 font-mono text-base font-bold leading-none text-white tabular-nums shadow-sm ring-1 ring-white/60 [text-shadow:0_1px_2px_rgba(74,85,104,0.45)]"
      aria-hidden
    >
      {number}
    </span>
  );
}

function ProcessStepChevron() {
  return (
    <span
      className="flex w-6 shrink-0 items-center justify-center self-center text-[var(--cms-title-tone)] sm:w-7"
      aria-hidden
    >
      <svg
        className="h-5 w-5 sm:h-6 sm:w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8.5 5.5l7 6.5-7 6.5" />
      </svg>
    </span>
  );
}

function ProcessStepTile({
  step,
  thumbMaxWidth,
  sizes,
  quality,
  gridAspectRatio,
  cropFocus,
  gridRowAspect,
  onVideoLayout,
  onOpenLightbox,
}: {
  step: ResolvedStep;
  thumbMaxWidth: number;
  sizes: string;
  quality: number;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
  gridRowAspect?: MediaAspect | null;
  onVideoLayout?: (aspect: MediaAspect) => void;
  onOpenLightbox: (globalIndex: number) => void;
}) {
  const metaClass = useTypoClass("meta");
  const {media, caption, globalIndex} = step;
  const alt = media.alt ?? "";
  const isClickable = isSanityLightboxMedia(media);
  const label = isSanityVideo(media)
    ? alt
      ? `Play ${alt}`
      : `Play video ${globalIndex + 1}`
    : alt
      ? `View ${alt}`
      : `View photo ${globalIndex + 1}`;

  const tileClass =
    "group w-full text-left transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.006] active:translate-y-0 active:scale-[0.997] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 [&_video]:pointer-events-none";
  const imageClass = isSanityImage(media) ? "cursor-zoom-in" : "cursor-pointer";

  const stepNumber = globalIndex + 1;
  const mediaNode = (
    <div className="relative w-full">
      <ProcessStepNumber number={stepNumber} />
      <SanityAspectMedia
        media={media}
        alt={alt}
        maxWidth={thumbMaxWidth}
        quality={quality}
        sizes={sizes}
        gridAspectRatio={gridAspectRatio}
        cropFocus={cropFocus}
        inGrid
        gridRowAspect={gridRowAspect}
        onVideoLayout={onVideoLayout}
      />
    </div>
  );

  return (
    <div className="min-w-0 flex-1">
      {isClickable ? (
        isSanityVideo(media) ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => onOpenLightbox(globalIndex)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpenLightbox(globalIndex);
              }
            }}
            className={`${tileClass} ${imageClass}`}
            aria-label={`Step ${stepNumber}. ${label}`}
          >
            {mediaNode}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onOpenLightbox(globalIndex)}
            className={`${tileClass} ${imageClass}`}
            aria-label={`Step ${stepNumber}. ${label}`}
          >
            {mediaNode}
          </button>
        )
      ) : (
        <div className="w-full [&_iframe]:pointer-events-auto">{mediaNode}</div>
      )}
      {caption ? (
        <p className={`mt-2 text-center text-sm text-zinc-600 ${metaClass}`}>{caption}</p>
      ) : null}
    </div>
  );
}

function ProcessRow({
  row,
  thumbMaxWidth,
  sizes,
  quality,
  gridAspectRatio,
  cropFocus,
  onOpenLightbox,
}: {
  row: ResolvedStep[];
  thumbMaxWidth: number;
  sizes: string;
  quality: number;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
  onOpenLightbox: (globalIndex: number) => void;
}) {
  const [videoAspects, setVideoAspects] = useState<Record<string, MediaAspect>>({});
  const gridRowAspect = useMemo(() => {
    if (row.length < 2) return undefined;
    return tallestRowAspect(
      row.map((step) => step.media),
      videoAspects,
      (_, index) => row[index].key,
    );
  }, [row, videoAspects]);

  const onVideoLayout = useCallback((stepKey: string, aspect: MediaAspect) => {
    const clamped = clampGridTileAspect(aspect.width, aspect.height);
    setVideoAspects((prev) => {
      const current = prev[stepKey];
      if (current?.width === clamped.width && current?.height === clamped.height) return prev;
      return {...prev, [stepKey]: clamped};
    });
  }, []);

  return (
    <div className="flex w-full items-stretch gap-0.5 sm:gap-1">
      {row.map((step, stepIndex) => (
        <Fragment key={step.key}>
          {stepIndex > 0 ? <ProcessStepChevron /> : null}
          <ProcessStepTile
            step={step}
            thumbMaxWidth={thumbMaxWidth}
            sizes={sizes}
            quality={quality}
            gridAspectRatio={gridAspectRatio}
            cropFocus={cropFocus}
            gridRowAspect={gridRowAspect}
            onVideoLayout={
              isSanityVideo(step.media)
                ? (aspect) => onVideoLayout(step.key, aspect)
                : undefined
            }
            onOpenLightbox={onOpenLightbox}
          />
        </Fragment>
      ))}
    </div>
  );
}

export function ProjectProcessSection({
  steps: rawSteps,
  columns,
  caption,
  mediaWidth,
  gridAspectRatio = "auto",
  cropFocus = "auto",
}: Pick<
  ProjectProcessBlock,
  "steps" | "columns" | "caption" | "mediaWidth" | "gridAspectRatio" | "cropFocus"
> & {
  mediaWidth?: ProjectStoryMediaWidth | null;
}) {
  const metaClass = useTypoClass("meta");
  const steps = useMemo(() => resolveSteps(rawSteps), [rawSteps]);
  const cols = normalizeGalleryColumns(columns);
  const rowColumns = useGalleryBreakpointColumns(cols);
  const rows = useMemo(() => chunkSteps(steps, rowColumns), [steps, rowColumns]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxItems = useMemo(
    () => steps.map((s) => s.media).filter(isSanityLightboxMedia),
    [steps],
  );

  const sizing = storyImageSizing(mediaWidth);
  const sizes = mediaWidth === "bleed" ? sizing.sizes : galleryGridThumbSizes(cols);

  const openLightbox = useCallback(
    (globalIndex: number) => {
      const step = steps[globalIndex];
      if (!step || !isSanityLightboxMedia(step.media)) return;
      const lbIndex = lightboxItems.indexOf(step.media);
      if (lbIndex >= 0) setLightboxIndex(lbIndex);
    },
    [steps, lightboxItems],
  );

  if (steps.length === 0) return null;

  return (
    <section className="project-process w-full" aria-label="Process steps">
      <div className="flex flex-col gap-6 sm:gap-8">
        {rows.map((row, rowIndex) => (
          <div key={row.map((step) => step.key).join("-")} role="group" aria-label={`Process row ${rowIndex + 1}`}>
            <ProcessRow
              row={row}
              thumbMaxWidth={sizing.displayPx}
              sizes={sizes}
              quality={sizing.quality}
              gridAspectRatio={gridAspectRatio}
              cropFocus={cropFocus}
              onOpenLightbox={openLightbox}
            />
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
