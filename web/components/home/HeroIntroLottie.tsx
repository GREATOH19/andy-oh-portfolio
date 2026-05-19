"use client";

import Lottie from "lottie-react";
import {useEffect, useState} from "react";

type LottieData = Record<string, unknown>;

type HeroIntroLottieProps = {
  /** URL pointing to a Lottie JSON file (Sanity asset URL or /public path). */
  src: string;
  /** Fires when the (single) playback ends. Use to trigger dissolve/finalize. */
  onComplete: () => void;
};

/** Avoid trapping the home shell on a blank intro if the Lottie JSON never resolves. */
const LOAD_ABORT_MS = 12_000;

export function HeroIntroLottie({src, onComplete}: HeroIntroLottieProps) {
  const [data, setData] = useState<LottieData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setFailed(false);
    const abortId = window.setTimeout(() => {
      if (cancelled) return;
      setFailed(true);
      onComplete();
    }, LOAD_ABORT_MS);
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load Lottie JSON: ${res.status}`);
        return res.json();
      })
      .then((json: LottieData) => {
        window.clearTimeout(abortId);
        if (!cancelled) setData(json);
      })
      .catch(() => {
        window.clearTimeout(abortId);
        if (cancelled) return;
        setFailed(true);
        onComplete();
      });
    return () => {
      cancelled = true;
      window.clearTimeout(abortId);
    };
  }, [src, onComplete]);

  if (failed || !data) return null;

  return (
    <Lottie
      animationData={data}
      loop={false}
      autoplay
      onComplete={onComplete}
      className="pointer-events-none block h-auto w-[min(80vw,640px)]"
      rendererSettings={{preserveAspectRatio: "xMidYMid meet"}}
    />
  );
}
