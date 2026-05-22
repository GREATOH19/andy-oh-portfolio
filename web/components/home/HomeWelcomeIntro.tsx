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

/** Mobile subcopy: prefer a break after “Korea,” when present. */
function splitWelcomeBodyAtKorea(body: string): [string, string] {
  const normalized = body.replace(/\s+/g, " ").trim();
  const koreaComma = /korea,\s*/i.exec(normalized);
  if (koreaComma?.index !== undefined) {
    const end = koreaComma.index + koreaComma[0].length;
    return [normalized.slice(0, end).trimEnd(), normalized.slice(end).trim()];
  }
  const koreaCommaIdx = normalized.toLowerCase().indexOf("korea,");
  if (koreaCommaIdx !== -1) {
    const end = koreaCommaIdx + "korea,".length;
    return [normalized.slice(0, end).trim(), normalized.slice(end).trim()];
  }
  const commaIdx = normalized.indexOf(",");
  if (commaIdx !== -1) {
    return [normalized.slice(0, commaIdx + 1).trim(), normalized.slice(commaIdx + 1).trim()];
  }
  return [normalized, ""];
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
  const mobileBodyLines = body ? splitWelcomeBodyAtKorea(body) : undefined;
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
      className="layout-chrome pb-10 pt-10 text-center md:pb-12 md:pt-12"
    >
      {heading ? (
        <h2
          className={`whitespace-nowrap text-[clamp(1.875rem,7.5vw,3.75rem)] font-light leading-none text-slate-950 md:text-5xl md:leading-tight lg:text-6xl ${displayClass}`}
        >
          {heading}
        </h2>
      ) : null}
      {body && mobileBodyLines ? (
        <>
          <p
            className="mx-auto mt-5 w-full min-w-0 max-w-full px-3 text-center text-base font-normal leading-relaxed text-pretty text-slate-600 md:hidden"
            aria-label={body}
          >
            <span className="block">{mobileBodyLines[0]}</span>
            {mobileBodyLines[1] ? (
              <span className="block">{mobileBodyLines[1]}</span>
            ) : null}
          </p>
          <p className="mx-auto mt-5 hidden max-w-2xl text-base leading-relaxed text-slate-600 sm:max-w-none sm:whitespace-nowrap md:mt-7 md:block md:text-lg">
            {body}
          </p>
        </>
      ) : null}
    </motion.section>
  );
}
