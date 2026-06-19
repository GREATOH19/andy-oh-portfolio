"use client";

import {YoutubeEmbedFrame} from "@/components/sections/YoutubeEmbedFrame";
import {useTypoClass} from "@/components/TypographyProvider";
import type {ProjectStoryMediaAlign} from "@/lib/types/project";
import type {GridAspectRatio, GridCropFocus} from "@/lib/gridAspectRatio";
import {parseYoutubeVideoId, resolveYoutubeVideoAspect} from "@/lib/youtube/parseYoutubeUrl";

function portraitFigureAlignClass(mediaAlign?: ProjectStoryMediaAlign | null): string {
  if (mediaAlign === "center") return "mx-auto";
  if (mediaAlign === "right") return "ml-auto";
  return "";
}

export function ProjectYoutubeEmbed({
  url,
  title,
  caption,
  videoAspect,
  mediaAlign,
  gridAspectRatio = "auto",
  cropFocus = "auto",
}: {
  url?: string | null;
  title?: string | null;
  caption?: string | null;
  videoAspect?: "auto" | "landscape" | "portrait" | null;
  mediaAlign?: ProjectStoryMediaAlign | null;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
}) {
  const metaClass = useTypoClass("meta");
  if (!url || !parseYoutubeVideoId(url)) return null;

  const isPortrait = resolveYoutubeVideoAspect(url, videoAspect) === "portrait";

  return (
    <figure
      className={[
        "w-full",
        isPortrait ? portraitFigureAlignClass(mediaAlign) : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <YoutubeEmbedFrame
        url={url}
        title={title}
        videoAspect={videoAspect}
        gridAspectRatio={gridAspectRatio}
        cropFocus={cropFocus}
      />
      {caption ? (
        <figcaption className={`mt-3 text-sm text-zinc-500 ${metaClass}`}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
