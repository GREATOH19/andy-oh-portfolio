"use client";

import {motion, useReducedMotion} from "framer-motion";
import {useLayoutEffect, useState} from "react";

import {BrandMark} from "@/components/BrandMark";
import {useTypoClass} from "@/components/TypographyProvider";
import {hasSiteBrandContent} from "@/lib/siteBrand";
import type {HomeWelcomeIntroContent, SiteBrand} from "@/lib/types/project";

const WELCOME_SEEN_SESSION_KEY = "portfolio-home-welcome-seen";

/** Mobile subcopy: line 1 ends at “Korea,” — line 2 is the rest (always 2 rows). */
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

type HeroMode = "logo" | "welcome";

type WorkHomeFoldHeroProps = {
  brand?: SiteBrand | null;
  welcomeIntro?: HomeWelcomeIntroContent | null;
};

/**
 * Mobile fold hero only (md+ uses WorkHomeLogo). First session: welcome heading in the
 * logo slot (same size + rhythm); later visits: CMS Work homepage logo.
 */
export function WorkHomeFoldHero({brand, welcomeIntro}: WorkHomeFoldHeroProps) {
  const heading = welcomeIntro?.heading?.trim() ?? "";
  const body = welcomeIntro?.body?.trim() ?? "";
  const mobileBodyLines = body ? splitWelcomeBodyAtKorea(body) : undefined;
  const hasWelcome = heading.length > 0 || body.length > 0;
  const hasLogo = hasSiteBrandContent(brand);

  const [heroMode, setHeroMode] = useState<HeroMode | null>(() => (hasWelcome ? null : "logo"));
  const reduceMotion = useReducedMotion();
  const displayClass = useTypoClass("display");

  useLayoutEffect(() => {
    if (!hasWelcome) {
      setHeroMode("logo");
      return;
    }
    try {
      if (sessionStorage.getItem(WELCOME_SEEN_SESSION_KEY) === "1") {
        setHeroMode("logo");
        return;
      }
      sessionStorage.setItem(WELCOME_SEEN_SESSION_KEY, "1");
    } catch {
      setHeroMode("logo");
      return;
    }
    setHeroMode("welcome");
  }, [hasWelcome]);

  const showWelcome = heroMode === "welcome";
  const showLogo = heroMode === "logo" && hasLogo;
  const ariaLabel = showWelcome ? "Welcome introduction" : "Studio logo";

  return (
    <div className="work-home-logo flex md:hidden" aria-label={ariaLabel}>
      <div className="work-home-logo__slot">
        {showWelcome ? (
          <motion.div
            className="work-home-logo__wrapper work-home-welcome"
            initial={reduceMotion ? false : {opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.4}}
          >
            {heading ? (
              <h2 className={`work-home-logo__text whitespace-nowrap ${displayClass}`}>{heading}</h2>
            ) : null}
            {body && mobileBodyLines ? (
              <p
                className="work-home-welcome__body welcome-intro-subcopy mx-auto mt-5 w-full max-w-[100vw] px-3 text-center leading-snug text-slate-600"
                aria-label={body}
              >
                <span className="block whitespace-nowrap">{mobileBodyLines[0]}</span>
                {mobileBodyLines[1] ? (
                  <span className="block whitespace-nowrap">{mobileBodyLines[1]}</span>
                ) : null}
              </p>
            ) : null}
          </motion.div>
        ) : showLogo ? (
          <BrandMark brand={brand} variant="workHome" linkable={false} />
        ) : null}
      </div>
    </div>
  );
}
