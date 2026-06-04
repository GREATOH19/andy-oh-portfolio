import {SanityAspectImage} from "@/components/sections/SanityAspectImage";
import {SanityAspectVideo} from "@/components/sections/SanityAspectVideo";
import {isSanityImage, isSanityVideo} from "@/lib/sanity/media";
import type {SanityMediaField} from "@/lib/types/project";

export function SanityAspectMedia({
  media,
  alt,
  maxWidth,
  quality,
  sizes,
  unoptimized,
}: {
  media: SanityMediaField;
  alt: string;
  maxWidth: number;
  quality?: number;
  sizes: string;
  unoptimized?: boolean;
}) {
  if (isSanityImage(media)) {
    return (
      <SanityAspectImage
        image={media}
        alt={alt || media.alt || ""}
        maxWidth={maxWidth}
        quality={quality}
        sizes={sizes}
        unoptimized={unoptimized}
      />
    );
  }

  if (isSanityVideo(media)) {
    return <SanityAspectVideo video={media} />;
  }

  return null;
}
