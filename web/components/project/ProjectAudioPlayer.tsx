"use client";

import Image from "next/image";
import {useCallback, useEffect, useRef, useState} from "react";
import {MdLoop, MdPause, MdPlayArrow, MdVolumeOff, MdVolumeUp} from "react-icons/md";
import {sanityImageAssetId, urlForImage} from "@/lib/sanity/image";
import {sanityImageRequestWidth} from "@/lib/sanity/imageRequestWidth";
import {hasAudibleVideo, usePauseAudioForAudibleVideo} from "@/lib/story/storyAudioVideoPolicy";
import type {SanityImageField} from "@/lib/types/project";

function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

type ProjectAudioPlayerProps = {
  src: string;
  title?: string | null;
  cover?: SanityImageField;
  caption?: string | null;
  loop?: boolean | null;
  autoplay?: boolean | null;
};

const COVER_DISPLAY_PX = 160;

export function ProjectAudioPlayer({
  src,
  title,
  cover,
  caption,
  loop = false,
  autoplay = false,
}: ProjectAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const coverAlt = cover?.alt?.trim() || title?.trim() || "Album cover";
  const coverSrc =
    cover && sanityImageAssetId(cover)
      ? urlForImage(cover)
          .width(sanityImageRequestWidth(cover, COVER_DISPLAY_PX))
          .quality(88)
          .url()
      : null;
  const hasCover = Boolean(coverSrc);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (hasAudibleVideo()) return;
      void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }, []);

  const seekToClientX = useCallback(
    (clientX: number) => {
      const audio = audioRef.current;
      const track = trackRef.current;
      if (!audio || !track || duration <= 0) return;

      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      audio.currentTime = ratio * duration;
      setCurrentTime(audio.currentTime);
    },
    [duration],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      setDuration(audio.duration);
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      if (!loop) setPlaying(false);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("durationchange", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    if (audio.readyState >= 1) onLoaded();

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("durationchange", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [loop, src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [muted, volume]);

  usePauseAudioForAudibleVideo(audioRef);

  useEffect(() => {
    if (!autoplay) return;

    const audio = audioRef.current;
    const container = containerRef.current;
    if (!audio || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible && audio.paused && !hasAudibleVideo()) {
          void audio.play().catch(() => {});
        }
      },
      {threshold: 0.35},
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [autoplay, src]);

  return (
    <figure className="project-audio-block">
      {title && !hasCover ? (
        <p className="project-audio-block__title meta mb-2 text-[length:var(--meta-font-size)] uppercase tracking-[0.14em] text-[var(--muted)]">
          {title}
        </p>
      ) : null}

      <div
        ref={containerRef}
        className={`project-audio-player${hasCover ? " project-audio-player--with-cover" : ""}${playing ? " project-audio-player--playing" : ""}`}
      >
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          loop={Boolean(loop)}
          className="sr-only"
        />

        {hasCover ? (
          <button
            type="button"
            className="project-audio-player__cover"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
          >
            <Image
              src={coverSrc!}
              alt={coverAlt}
              width={COVER_DISPLAY_PX}
              height={COVER_DISPLAY_PX}
              className="project-audio-player__cover-image"
              sizes="(max-width: 479px) 72px, 80px"
              quality={88}
            />
            <span className="project-audio-player__cover-control" aria-hidden>
              <span className="project-audio-player__cover-badge">
                {playing ? (
                  <MdPause className="h-4 w-4" />
                ) : (
                  <MdPlayArrow className="h-4 w-4 translate-x-px" />
                )}
              </span>
            </span>
          </button>
        ) : (
          <button
            type="button"
            className="project-audio-player__play"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <MdPause className="h-5 w-5" aria-hidden />
            ) : (
              <MdPlayArrow className="h-5 w-5 translate-x-px" aria-hidden />
            )}
          </button>
        )}

        <div className="project-audio-player__main">
          {hasCover && title ? (
            <p className="project-audio-player__inline-title">{title}</p>
          ) : null}
          <div
            ref={trackRef}
            className="project-audio-player__track"
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            aria-valuetext={`${formatAudioTime(currentTime)} of ${formatAudioTime(duration)}`}
            onClick={(event) => seekToClientX(event.clientX)}
            onKeyDown={(event) => {
              const audio = audioRef.current;
              if (!audio || duration <= 0) return;
              const step = event.shiftKey ? 10 : 5;
              if (event.key === "ArrowRight") {
                event.preventDefault();
                audio.currentTime = Math.min(duration, audio.currentTime + step);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                audio.currentTime = Math.max(0, audio.currentTime - step);
              } else if (event.key === "Home") {
                event.preventDefault();
                audio.currentTime = 0;
              } else if (event.key === "End") {
                event.preventDefault();
                audio.currentTime = duration;
              }
            }}
          >
            <div className="project-audio-player__track-bg" aria-hidden />
            <div
              className="project-audio-player__track-fill"
              style={{width: `${progress}%`}}
              aria-hidden
            />
            <div
              className="project-audio-player__thumb"
              style={{left: `${progress}%`}}
              aria-hidden
            />
          </div>

          <div className="project-audio-player__meta">
            <span className="project-audio-player__time tabular-nums">
              {formatAudioTime(currentTime)}
              <span className="project-audio-player__time-sep" aria-hidden>
                /
              </span>
              {formatAudioTime(duration)}
            </span>

            <div className="project-audio-player__controls">
              {loop ? (
                <span
                  className="project-audio-player__loop-badge"
                  title="Looping"
                  aria-label="Looping enabled"
                >
                  <MdLoop className="h-4 w-4" aria-hidden />
                </span>
              ) : null}

              <button
                type="button"
                className="project-audio-player__icon-btn"
                onClick={() => setMuted((value) => !value)}
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted || volume === 0 ? (
                  <MdVolumeOff className="h-4 w-4" aria-hidden />
                ) : (
                  <MdVolumeUp className="h-4 w-4" aria-hidden />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setVolume(next);
                  setMuted(next === 0);
                }}
                className="project-audio-player__volume"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      </div>

      {caption ? (
        <figcaption className="project-audio-block__caption mt-2 meta text-[length:var(--meta-font-size)] text-[var(--muted)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
