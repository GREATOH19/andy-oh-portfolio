import type {SanityVideoField} from "@/lib/types/project";
import {sanityVideoUrl} from "@/lib/sanity/media";

export function SanityAspectVideo({video}: {video: NonNullable<SanityVideoField>}) {
  const src = sanityVideoUrl(video);
  if (!src) return null;

  const loop = Boolean(video.loop);
  const alt = video.alt?.trim() ?? "";

  return (
    <div className="relative w-full overflow-hidden rounded-[2px] bg-zinc-200" style={{aspectRatio: "16 / 9"}}>
      <video
        src={src}
        className="h-full w-full object-contain"
        playsInline
        muted={loop}
        loop={loop}
        autoPlay={loop}
        controls={!loop}
        aria-label={alt || undefined}
      />
    </div>
  );
}
