"use client";

import {useCallback, useEffect, useRef, useState, type RefObject, type SyntheticEvent} from "react";
import {MdVolumeOff, MdVolumeUp} from "react-icons/md";
import {LoopDissolveVideo} from "@/components/sections/LoopDissolveVideo";
import {
  type GridAspectRatio,
  type GridCropFocus,
  gridAspectRatioBoxStyle,
  gridUsesUniformCrop,
  normalizeGridAspectRatio,
} from "@/lib/gridAspectRatio";
import {
  gridNaturalTileBoxStyle,
  isPortraitDimensions,
  portraitMediaCoverBoxStyle,
  portraitMediaBoxStyle,
} from "@/lib/imageAspect";
import type {MediaAspect} from "@/lib/gridRowAspect";
import {gridCropObjectPosition} from "@/lib/sanity/imagePosition";
import {sanityInlineLoopVideoUrl, sanityVideoUrl} from "@/lib/sanity/media";
import type {SanityVideoField} from "@/lib/types/project";

function readVideoLayout(el: HTMLVideoElement) {
  const {videoWidth, videoHeight} = el;
  if (videoWidth <= 0 || videoHeight <= 0) return null;
  return {
    width: videoWidth,
    height: videoHeight,
    portrait: isPortraitDimensions(videoWidth, videoHeight),
  };
}

function LoopVideo({
  src,
  muted,
  alt,
  objectFit,
  objectPosition,
  videoRef,
  onLoadedMetadata,
  onError,
}: {
  src: string;
  muted: boolean;
  alt: string;
  objectFit: "contain" | "cover";
  objectPosition?: string;
  videoRef: RefObject<HTMLVideoElement | null>;
  onLoadedMetadata?: (event: SyntheticEvent<HTMLVideoElement>) => void;
  onError?: () => void;
}) {
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const tryPlay = () => {
      if (!muted) return;
      if (el.readyState < 1) el.load();
      void el.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible) tryPlay();
        else el.pause();
      },
      {threshold: 0.2},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [muted, src, videoRef]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={[
        "absolute inset-0 block h-full w-full",
        objectFit === "cover" ? "object-cover" : "object-contain",
      ].join(" ")}
      style={objectPosition ? {objectPosition} : undefined}
      playsInline
      muted={muted}
      loop
      preload="none"
      aria-label={alt || undefined}
      onLoadedMetadata={onLoadedMetadata}
      onError={onError}
    />
  );
}

export function SanityAspectVideo({
  video,
  gridAspectRatio = "auto",
  cropFocus = "auto",
  inGrid = false,
  gridRowAspect,
  fillFrame = false,
  onVideoLayout,
}: {
  video: NonNullable<SanityVideoField>;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
  inGrid?: boolean;
  gridRowAspect?: MediaAspect | null;
  fillFrame?: boolean;
  onVideoLayout?: (aspect: MediaAspect) => void;
}) {
  const loop = Boolean(video.loop);
  const fullSrc = sanityVideoUrl(video);
  const initialSrc = loop ? sanityInlineLoopVideoUrl(video) : fullSrc;
  const loopDissolve = Boolean(video.loopDissolve);
  const alt = video.alt?.trim() ?? "";
  const [src, setSrc] = useState(initialSrc);
  const [muted, setMuted] = useState(true);
  const [layout, setLayout] = useState<{
    width: number;
    height: number;
    portrait: boolean;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onLoadedMetadata = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      const next = readVideoLayout(event.currentTarget);
      if (!next) return;
      setLayout((prev) =>
        prev?.width === next.width && prev?.height === next.height ? prev : next,
      );
      onVideoLayout?.({width: next.width, height: next.height});
    },
    [onVideoLayout],
  );

  const onVideoError = useCallback(() => {
    if (fullSrc && src !== fullSrc) setSrc(fullSrc);
  }, [fullSrc, src]);

  useEffect(() => {
    setSrc(initialSrc);
  }, [initialSrc]);

  if (!src) return null;

  const aspect = normalizeGridAspectRatio(gridAspectRatio);
  const uniformCrop = gridUsesUniformCrop(aspect);
  const fixedBox = gridAspectRatioBoxStyle(aspect);
  const rowBox = gridRowAspect
    ? gridNaturalTileBoxStyle(gridRowAspect.width, gridRowAspect.height)
    : null;
  const useCover = fillFrame || uniformCrop || gridRowAspect != null;
  const objectPosition = useCover
    ? gridCropObjectPosition(null, cropFocus ?? "auto")
    : undefined;

  const portrait = layout?.portrait ?? false;
  const objectFit = useCover
    ? "cover"
    : inGrid
      ? "contain"
      : portrait
        ? "cover"
        : "contain";

  const boxStyle = fillFrame
    ? {width: "100%", height: "100%"}
    : fixedBox ??
    rowBox ??
    (inGrid
      ? gridNaturalTileBoxStyle(layout?.width ?? 16, layout?.height ?? 9)
      : layout
        ? portrait
          ? portraitMediaCoverBoxStyle(layout.width, layout.height)
          : portraitMediaBoxStyle(layout.width, layout.height)
        : portrait
          ? portraitMediaCoverBoxStyle(9, 16)
          : {aspectRatio: "16 / 9", width: "100%"});

  const mediaObjectClass = [
    "absolute inset-0 block h-full w-full",
    objectFit === "cover" ? "object-cover" : "object-contain",
  ].join(" ");
  const mediaObjectStyle = objectPosition ? {objectPosition} : undefined;

  return (
    <div
      className={`media-thumb relative w-full overflow-hidden bg-zinc-200 shadow-sm ring-1 ring-slate-200/60 transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.006] group-hover:shadow-lg active:translate-y-0 active:scale-[0.997] ${fillFrame ? "h-full rounded-none shadow-none ring-0" : "rounded-2xl"}`}
      style={boxStyle}
    >
      {loop ? (
        <div className="absolute inset-0">
          {loopDissolve ? (
            <LoopDissolveVideo
              src={src}
              muted={muted}
              alt={alt}
              objectFit={objectFit}
              objectPosition={objectPosition}
              onLoadedMetadata={onLoadedMetadata}
              onError={onVideoError}
            />
          ) : (
            <LoopVideo
              src={src}
              muted={muted}
              alt={alt}
              objectFit={objectFit}
              objectPosition={objectPosition}
              videoRef={videoRef}
              onLoadedMetadata={onLoadedMetadata}
              onError={onVideoError}
            />
          )}
        </div>
      ) : (
        <video
          src={src}
          className={mediaObjectClass}
          style={mediaObjectStyle}
          playsInline
          muted={false}
          controls
          preload="metadata"
          aria-label={alt || undefined}
          onLoadedMetadata={onLoadedMetadata}
          onError={onVideoError}
        />
      )}
      {loop ? (
        <button
          type="button"
          className="pointer-events-auto absolute bottom-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
          aria-label={muted ? "Unmute video" : "Mute video"}
          onClick={(event) => {
            event.stopPropagation();
            setMuted((value) => {
              const next = !value;
              const el = videoRef.current;
              if (el && !next) {
                void el.play().catch(() => {});
              }
              return next;
            });
          }}
        >
          {muted ? (
            <MdVolumeOff className="h-4 w-4" aria-hidden />
          ) : (
            <MdVolumeUp className="h-4 w-4" aria-hidden />
          )}
        </button>
      ) : null}
    </div>
  );
}
