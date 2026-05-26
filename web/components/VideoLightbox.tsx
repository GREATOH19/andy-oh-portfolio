"use client";

import {useEffect, useRef} from "react";
import {sanityVideoUrl} from "@/lib/sanity/media";
import type {SanityVideoField} from "@/lib/types/project";

export function VideoLightboxContent({
  video,
  autoPlay = true,
}: {
  video: NonNullable<SanityVideoField>;
  autoPlay?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const src = sanityVideoUrl(video);
  const alt = video.alt?.trim() ?? "";

  useEffect(() => {
    if (!autoPlay) return;
    const el = ref.current;
    if (!el) return;
    void el.play().catch(() => {});
  }, [autoPlay, src]);

  if (!src) return null;

  return (
    <video
      ref={ref}
      key={src}
      src={src}
      controls
      playsInline
      className="max-h-[calc(100dvh-5rem)] max-w-[calc(100dvw-2rem)] object-contain sm:max-h-[calc(100dvh-8rem)] sm:max-w-[calc(100dvw-4rem)]"
      aria-label={alt || "Video"}
    />
  );
}
