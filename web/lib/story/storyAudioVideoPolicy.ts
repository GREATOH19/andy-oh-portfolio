import {useEffect, useRef, type RefObject} from "react";

export function hasAudibleVideo(): boolean {
  if (typeof document === "undefined") return false;
  return Array.from(document.querySelectorAll("video")).some(
    (video) => !video.paused && !video.muted && video.volume > 0,
  );
}

/** Pause story audio while an unmuted video plays; resume when video is muted or stops. */
export function usePauseAudioForAudibleVideo(audioRef: RefObject<HTMLAudioElement | null>) {
  const suspendedByVideoRef = useRef(false);

  useEffect(() => {
    const sync = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (hasAudibleVideo()) {
        if (!audio.paused) {
          audio.pause();
          suspendedByVideoRef.current = true;
        }
        return;
      }

      if (suspendedByVideoRef.current) {
        suspendedByVideoRef.current = false;
        void audio.play().catch(() => {});
      }
    };

    document.addEventListener("play", sync, true);
    document.addEventListener("pause", sync, true);
    document.addEventListener("volumechange", sync, true);
    document.addEventListener("ended", sync, true);

    sync();

    return () => {
      document.removeEventListener("play", sync, true);
      document.removeEventListener("pause", sync, true);
      document.removeEventListener("volumechange", sync, true);
      document.removeEventListener("ended", sync, true);
    };
  }, [audioRef]);
}
