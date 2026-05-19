"use client";

import {motion, useReducedMotion} from "framer-motion";
import {useCallback, useEffect, useLayoutEffect, useState} from "react";

import {HeroIntroLottie} from "@/components/home/HeroIntroLottie";

const INTRO_SEEN_SESSION_KEY = "portfolio-home-intro-seen";
const FALLBACK_LOTTIE_URL = "/lottie/oh-logo.json";
const DISSOLVE_MS = 900;

type HomeIntroPhase = "checking" | "intro" | "dissolve" | "done";

function getInitialIntroPhase(): HomeIntroPhase {
  if (typeof window === "undefined") return "done";
  try {
    if (sessionStorage.getItem(INTRO_SEEN_SESSION_KEY) === "1") return "done";
  } catch {
    /* private mode / quota */
  }
  return "checking";
}

type HomePageShellProps = {
  children: React.ReactNode;
  /** Optional Sanity-managed Lottie URL. Falls back to /public/lottie/oh-logo.json. */
  heroLottieUrl?: string | null;
};

export function HomePageShell({children, heroLottieUrl}: HomePageShellProps) {
  const [phase, setPhase] = useState<HomeIntroPhase>(getInitialIntroPhase);
  const reduceMotion = useReducedMotion();

  const finalizeIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SEEN_SESSION_KEY, "1");
    } catch {
      /* private mode / quota */
    }
    setPhase("done");
  }, []);

  /** Before paint: skip intro when already seen (e.g. back from a project). */
  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(INTRO_SEEN_SESSION_KEY) === "1") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is external; must run before paint.
        setPhase("done");
      }
    } catch {
      /* treat as first visit */
    }
  }, []);

  useEffect(() => {
    let introSeen = false;
    try {
      introSeen = sessionStorage.getItem(INTRO_SEEN_SESSION_KEY) === "1";
    } catch {
      /* treat as first visit */
    }
    if (introSeen) {
      setPhase("done");
      return;
    }

    const prefersReduced =
      reduceMotion !== null
        ? reduceMotion
        : window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced === true) {
      finalizeIntro();
      return;
    }

    setPhase("intro");
  }, [reduceMotion, finalizeIntro]);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      try {
        if (sessionStorage.getItem(INTRO_SEEN_SESSION_KEY) === "1") {
          setPhase("done");
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    if (phase !== "intro" || reduceMotion !== true) return;
    finalizeIntro();
  }, [phase, reduceMotion, finalizeIntro]);

  const handleIntroComplete = useCallback(() => {
    setPhase((prev) => (prev === "intro" ? "dissolve" : prev));
  }, []);

  useEffect(() => {
    if (phase !== "dissolve") return;
    const id = window.setTimeout(finalizeIntro, DISSOLVE_MS);
    return () => window.clearTimeout(id);
  }, [phase, finalizeIntro]);

  const blockScroll = phase === "checking" || phase === "intro" || phase === "dissolve";

  useEffect(() => {
    if (!blockScroll) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [blockScroll]);

  const showBackdrop = phase === "checking" || phase === "intro" || phase === "dissolve";
  /** `useReducedMotion()` can be `null` on first paint; treat non-true as “motion ok” so intro is not a blank screen. */
  const showIntroAnimation = phase === "intro" && reduceMotion !== true;
  const contentVisible = phase === "dissolve" || phase === "done";
  const lottieSrc = heroLottieUrl ?? FALLBACK_LOTTIE_URL;

  return (
    <>
      {showBackdrop ? (
        <motion.div
          data-debug-hero-backdrop
          className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center bg-[#eafcff]"
          style={{top: "var(--site-header-height)"}}
          initial={false}
          animate={{opacity: phase === "dissolve" ? 0 : 1}}
          transition={{
            duration: phase === "dissolve" ? DISSOLVE_MS / 1000 : 0,
            ease: [0.4, 0, 0.2, 1],
          }}
          aria-hidden
        >
          {showIntroAnimation ? (
            <HeroIntroLottie src={lottieSrc} onComplete={handleIntroComplete} />
          ) : null}
        </motion.div>
      ) : null}
      {/*
        Do not hide children with Framer opacity. After client navigations, motion can leave opacity:0
        on the wrapper so the page stays blank even when the intro backdrop is gone. The fixed backdrop
        already covers the work area during intro/dissolve.
      */}
      <div
        className={contentVisible ? undefined : "pointer-events-none select-none"}
        aria-hidden={!contentVisible}
      >
        {children}
      </div>
    </>
  );
}
