"use client";

import {useMemo, useState} from "react";
import {MediaLightbox} from "@/components/MediaLightbox";
import {SanityAspectMedia} from "@/components/sections/SanityAspectMedia";
import {useTypoClass} from "@/components/TypographyProvider";
import {packBentoItems} from "@/lib/collage/bento";
import {storyImageSizing} from "@/lib/sanity/imageRequestWidth";
import {
  isSanityLightboxMedia,
  isSanityMedia,
  isSanityVideo,
  normalizeMediaItem,
  sanityMediaKey,
} from "@/lib/sanity/media";
import type {CollageItem, ProjectStoryMediaWidth} from "@/lib/types/project";

export function ProjectCollageSection({
  items,
  caption,
  mediaWidth,
}: {
  items?: CollageItem[] | null;
  caption?: string | null;
  mediaWidth?: ProjectStoryMediaWidth | null;
}) {
  const metaClass = useTypoClass("meta");
  const sizing = storyImageSizing(mediaWidth);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const resolved = useMemo(() => {
    const raw = (items ?? [])
      .map((item, index) => {
        const media = normalizeMediaItem(item.media ?? null);
        if (!media || !isSanityMedia(media)) return null;
        return {
          key: item._key ?? sanityMediaKey(media, index),
          media,
          tileSize: item.tileSize,
          globalIndex: index,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry != null);

    const {placed, rowCount} = packBentoItems(
      raw.map((entry) => ({_key: entry.key, tileSize: entry.tileSize ?? undefined})),
    );

    return {
      tiles: raw.map((entry, index) => ({
        ...entry,
        placement: placed[index],
      })),
      rowCount,
    };
  }, [items]);

  const lightboxItems = resolved.tiles.map((t) => t.media).filter(isSanityLightboxMedia);

  if (resolved.tiles.length === 0) return null;

  return (
    <section className="w-full" aria-label="Bento collage">
      <div
        className="grid w-full grid-cols-12 gap-1 sm:gap-1.5"
        style={{
          gridTemplateRows: `repeat(${resolved.rowCount}, minmax(0, clamp(3.25rem, 9vw, 5.75rem)))`,
        }}
      >
        {resolved.tiles.map((entry) => {
          const {media, placement, globalIndex} = entry;
          if (!placement) return null;

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
            "group relative min-h-0 overflow-hidden rounded-lg bg-zinc-300 shadow-sm ring-1 ring-slate-200/60 transition-transform duration-200 ease-out hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 [&_video]:pointer-events-none";

          const mediaNode = (
            <SanityAspectMedia
              media={media}
              alt={alt}
              maxWidth={sizing.displayPx}
              quality={sizing.quality}
              sizes={sizing.sizes}
              fillFrame
            />
          );

          const openLightbox = () => {
            if (!isSanityLightboxMedia(media)) return;
            const lbIndex = lightboxItems.indexOf(media);
            if (lbIndex >= 0) setLightboxIndex(lbIndex);
          };

          return (
            <div
              key={entry.key}
              className={tileClass}
              style={{
                gridColumn: `${placement.colStart} / span ${placement.colSpan}`,
                gridRow: `${placement.rowStart} / span ${placement.rowSpan}`,
              }}
            >
              {isClickable ? (
                isSanityVideo(media) ? (
                  <div
                    role="button"
                    tabIndex={0}
                    className="h-full w-full cursor-pointer"
                    aria-label={label}
                    onClick={openLightbox}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openLightbox();
                      }
                    }}
                  >
                    <div className="pointer-events-none h-full w-full [&_.media-thumb]:h-full [&_.media-thumb]:rounded-none">
                      {mediaNode}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="h-full w-full cursor-zoom-in"
                    aria-label={label}
                    onClick={openLightbox}
                  >
                    <div className="pointer-events-none h-full w-full [&_.media-thumb]:h-full [&_.media-thumb]:rounded-none">
                      {mediaNode}
                    </div>
                  </button>
                )
              ) : (
                <div className="h-full w-full [&_.media-thumb]:h-full [&_.media-thumb]:rounded-none [&_iframe]:pointer-events-auto">
                  {mediaNode}
                </div>
              )}
            </div>
          );
        })}
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
