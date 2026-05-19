"use client";

import {motion, useReducedMotion} from "framer-motion";
import {useEffect, useState} from "react";

import {useTypoClass} from "@/components/TypographyProvider";
import type {HomeWelcomeIntroContent} from "@/lib/types/project";

/** Tied to the hero intro session flag: when the hero animation plays,
 *  this welcome message also appears. After being shown once per session
 *  it stays hidden — matching the "first access only" UX of the hero intro. */
const WELCOME_SEEN_SESSION_KEY = "portfolio-home-welcome-seen";

function shouldShowOnMount(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(WELCOME_SEEN_SESSION_KEY) !== "1";
  } catch {
    return false;
  }
}

export function HomeWelcomeIntro({
  content,
}: {
  content: HomeWelcomeIntroContent | null;
}) {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  /** Mirror the About “name” heading: pulls the Site Settings → Typography → Display font. */
  const displayClass = useTypoClass("display");

  const heading = content?.heading?.trim() ?? "";
  const body = content?.body?.trim() ?? "";
  const hasContent = heading.length > 0 || body.length > 0;

  useEffect(() => {
    if (!hasContent) return;
    if (!shouldShowOnMount()) return;
    try {
      sessionStorage.setItem(WELCOME_SEEN_SESSION_KEY, "1");
    } catch {
      /* private mode / quota */
    }
    setVisible(true);
  }, [hasContent]);

  if (!visible) return null;

  return (
    <motion.section
      aria-label="Welcome introduction"
      initial={reduceMotion ? false : {opacity: 0, y: 12}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.4}}
      className="pb-14 md:pb-20"
    >
      {heading ? (
        <h2 className={`text-5xl font-light text-slate-950 sm:text-6xl ${displayClass}`}>
          {heading}
        </h2>
      ) : null}
      {body ? (
        <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-relaxed text-slate-600 sm:max-w-none sm:whitespace-nowrap md:mt-7 md:text-lg">
          {body}
        </p>
      ) : null}
    </motion.section>
  );
}
