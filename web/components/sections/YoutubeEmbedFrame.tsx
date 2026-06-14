"use client";

import {
  type GridAspectRatio,
  type GridCropFocus,
  gridAspectRatioBoxStyle,
  normalizeGridAspectRatio,
} from "@/lib/gridAspectRatio";
import {gridNaturalTileBoxStyle, portraitEmbedBoxStyle} from "@/lib/imageAspect";
import type {MediaAspect} from "@/lib/gridRowAspect";
import {
  parseYoutubeVideoId,
  resolveYoutubeVideoAspect,
  youtubeEmbedSrc,
} from "@/lib/youtube/parseYoutubeUrl";
import type {YoutubeVideoAspectSetting} from "@/lib/youtube/parseYoutubeUrl";

export function YoutubeEmbedFrame({
  url,
  title,
  videoAspect,
  gridAspectRatio = "auto",
  cropFocus: _cropFocus = "auto",
  inGrid = false,
  gridRowAspect,
  fillFrame = false,
  className,
}: {
  url: string;
  title?: string | null;
  videoAspect?: YoutubeVideoAspectSetting | null;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
  inGrid?: boolean;
  gridRowAspect?: MediaAspect | null;
  fillFrame?: boolean;
  className?: string;
}) {
  const videoId = parseYoutubeVideoId(url);
  if (!videoId) return null;

  const aspect = resolveYoutubeVideoAspect(url, videoAspect);
  const isPortrait = aspect === "portrait";
  const iframeTitle = title?.trim() || "YouTube video";

  const gridBox = gridAspectRatioBoxStyle(normalizeGridAspectRatio(gridAspectRatio));
  const rowBox = gridRowAspect
    ? gridNaturalTileBoxStyle(gridRowAspect.width, gridRowAspect.height)
    : null;
  const boxStyle = fillFrame
    ? {width: "100%", height: "100%"}
    : gridBox ??
      rowBox ??
      (inGrid
        ? gridNaturalTileBoxStyle(isPortrait ? 3 : 16, isPortrait ? 4 : 9)
        : isPortrait
          ? portraitEmbedBoxStyle()
          : {aspectRatio: "16 / 9", width: "100%"});

  return (
    <div
      className={[
        "media-thumb relative w-full overflow-hidden rounded-2xl bg-zinc-900 shadow-sm ring-1 ring-slate-200/60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={boxStyle}
    >
      <iframe
        src={youtubeEmbedSrc(videoId)}
        title={iframeTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
