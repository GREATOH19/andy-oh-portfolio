import {SanityAspectImage} from "@/components/sections/SanityAspectImage";
import {SanityAspectVideo} from "@/components/sections/SanityAspectVideo";
import {YoutubeEmbedFrame} from "@/components/sections/YoutubeEmbedFrame";
import type {GridAspectRatio, GridCropFocus} from "@/lib/gridAspectRatio";
import type {MediaAspect} from "@/lib/gridRowAspect";
import {isSanityImage, isSanityVideo, isSanityYoutube} from "@/lib/sanity/media";
import type {SanityMediaField} from "@/lib/types/project";

export function SanityAspectMedia({
  media,
  alt,
  maxWidth,
  quality,
  sizes,
  gridAspectRatio = "auto",
  cropFocus = "auto",
  inGrid = false,
  fillFrame = false,
  gridRowAspect,
  onVideoLayout,
}: {
  media: SanityMediaField;
  alt: string;
  maxWidth: number;
  quality?: number;
  sizes: string;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
  /** Multi-column grid tile — uniform box height with photos. */
  inGrid?: boolean;
  /** Fill a positioned frame (collage cells) — cover crop, no aspect box. */
  fillFrame?: boolean;
  gridRowAspect?: MediaAspect | null;
  onVideoLayout?: (aspect: MediaAspect) => void;
}) {
  if (isSanityImage(media)) {
    return (
      <SanityAspectImage
        image={media}
        alt={alt || media.alt || ""}
        maxWidth={maxWidth}
        quality={quality}
        sizes={sizes}
        gridAspectRatio={gridAspectRatio}
        cropFocus={cropFocus}
        fillFrame={fillFrame}
        gridRowAspect={gridRowAspect}
      />
    );
  }

  if (isSanityVideo(media)) {
    return (
      <SanityAspectVideo
        video={media}
        gridAspectRatio={gridAspectRatio}
        cropFocus={cropFocus}
        inGrid={inGrid}
        fillFrame={fillFrame}
        gridRowAspect={gridRowAspect}
        onVideoLayout={onVideoLayout}
      />
    );
  }

  if (isSanityYoutube(media)) {
    return (
      <YoutubeEmbedFrame
        url={media.url}
        title={alt || media.alt}
        videoAspect={media.videoAspect}
        gridAspectRatio={gridAspectRatio}
        cropFocus={cropFocus}
        inGrid={inGrid}
        fillFrame={fillFrame}
        gridRowAspect={gridRowAspect}
      />
    );
  }

  return null;
}
