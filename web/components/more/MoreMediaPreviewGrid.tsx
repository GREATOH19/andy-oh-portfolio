"use client";

import {useMemo, useState} from "react";
import {MediaLightbox} from "@/components/MediaLightbox";
import {
  MoreBlockPreviewLayout,
  useMorePreviewLayout,
} from "@/components/more/MoreBlockPreviewColumns";
import {SanityAspectMedia} from "@/components/sections/SanityAspectMedia";
import {isPortraitPreviewMedia} from "@/lib/more/previewAspect";
import {
  isSanityImage,
  isSanityLightboxMedia,
  isSanityVideo,
  sanityMediaKey,
} from "@/lib/sanity/media";
import type {SanityMediaField} from "@/lib/types/project";

function MoreMediaPreviewTile({
  media,
  onOpen,
}: {
  media: SanityMediaField;
  onOpen: () => void;
}) {
  const alt = media?.alt ?? "";
  const isClickable = isSanityLightboxMedia(media);
  const label = isSanityVideo(media)
    ? alt
      ? `Play ${alt}`
      : "Play video"
    : alt
      ? `View ${alt}`
      : "View photo";

  const tileClass = `group w-full text-left transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.006] active:translate-y-0 active:scale-[0.997] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 ${
    isSanityImage(media) ? "cursor-zoom-in" : "cursor-pointer"
  } [&_video]:pointer-events-none`;

  const content = (
    <SanityAspectMedia
      media={media}
      alt={alt}
      maxWidth={560}
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      gridAspectRatio="auto"
      cropFocus="auto"
    />
  );

  if (!isClickable) return <div className={tileClass}>{content}</div>;

  if (isSanityVideo(media)) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen();
          }
        }}
        className={tileClass}
        aria-label={label}
      >
        {content}
      </div>
    );
  }

  return (
    <button type="button" onClick={onOpen} className={tileClass} aria-label={label}>
      {content}
    </button>
  );
}

export function MoreMediaPreviewGrid({
  images,
  scopeKey,
}: {
  images: SanityMediaField[];
  scopeKey: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const layout = useMorePreviewLayout(images, scopeKey, isPortraitPreviewMedia);
  const lightboxItems = useMemo(
    () => layout.picked.filter(isSanityLightboxMedia),
    [layout.picked],
  );

  return (
    <>
      <MoreBlockPreviewLayout
        ready={layout.ready}
        columns={layout.columns}
        getKey={(item, index) => sanityMediaKey(item, index)}
        renderItem={(item) => (
          <MoreMediaPreviewTile
            media={item}
            onOpen={() => {
              if (!isSanityLightboxMedia(item)) return;
              const lbIndex = lightboxItems.indexOf(item);
              if (lbIndex >= 0) setActiveIndex(lbIndex);
            }}
          />
        )}
      />
      {activeIndex !== null && lightboxItems.length > 0 ? (
        <MediaLightbox
          items={lightboxItems}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onIndexChange={setActiveIndex}
        />
      ) : null}
    </>
  );
}
