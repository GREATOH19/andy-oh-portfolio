import type {SanityVideoField} from "@/lib/types/project";
import {sanityVideoUrl} from "@/lib/sanity/media";

export function SanityAspectVideo({video}: {video: NonNullable<SanityVideoField>}) {
  const src = sanityVideoUrl(video);
  if (!src) return null;

  const loop = Boolean(video.loop);
  const alt = video.alt?.trim() ?? "";

  return (
    <div
      className="media-thumb relative w-full overflow-hidden rounded-2xl bg-zinc-200 shadow-sm ring-1 ring-slate-200/60 transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.006] group-hover:shadow-lg active:translate-y-0 active:scale-[0.997]"
      style={{aspectRatio: "16 / 9"}}
    >
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
