"use client";

import {motion, useReducedMotion} from "framer-motion";
import {useLayoutEffect, useState} from "react";

import {BrandMark} from "@/components/BrandMark";
import {useTypoClass} from "@/components/TypographyProvider";
import {hasSiteBrandContent, resolveWorkHomeLogo} from "@/lib/siteBrand";
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

function WorkHomeWelcomeContent({
  heading,
  body,
  mobileBodyLines,
  displayClass,
  reduceMotion,
}: {
  heading: string;
  body: string;
  mobileBodyLines?: [string, string];
  displayClass: string;
  reduceMotion: boolean | null;
}) {
  return (
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
        <>
          <p
            className="work-home-welcome__body welcome-intro-subcopy mx-auto mt-5 w-full max-w-[100vw] px-3 text-center leading-snug text-slate-600 md:hidden"
            aria-label={body}
          >
            <span className="block whitespace-nowrap">{mobileBodyLines[0]}</span>
            {mobileBodyLines[1] ? (
              <span className="block whitespace-nowrap">{mobileBodyLines[1]}</span>
            ) : null}
          </p>
          <p className="work-home-welcome__body mx-auto mt-5 hidden max-w-2xl text-base leading-relaxed text-slate-600 sm:max-w-none sm:whitespace-nowrap md:mt-7 md:block md:text-lg">
            {body}
          </p>
        </>
      ) : null}
    </motion.div>
  );
}

type WorkHomeBannerProps = {
  workHomeLogo?: SiteBrand | null;
  headerBrand?: SiteBrand | null;
  welcomeIntro?: HomeWelcomeIntroContent | null;
};

/**
 * Work fold banner slot: first session shows welcome (replaces banner on desktop + mobile);
 * every later visit shows the CMS banner logo on desktop (mobile logo lives in the footer).
 */
export function WorkHomeBanner({workHomeLogo, headerBrand, welcomeIntro}: WorkHomeBannerProps) {
  const heading = welcomeIntro?.heading?.trim() ?? "";
  const body = welcomeIntro?.body?.trim() ?? "";
  const mobileBodyLines = body ? splitWelcomeBodyAtKorea(body) : undefined;
  const hasWelcome = heading.length > 0 || body.length > 0;
  const brand = resolveWorkHomeLogo(workHomeLogo, headerBrand);
  const hasLogo = hasSiteBrandContent(brand);

  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);
  const reduceMotion = useReducedMotion();
  const displayClass = useTypoClass("display");

  useLayoutEffect(() => {
    if (!hasWelcome) {
      setShowWelcome(false);
      return;
    }
    try {
      if (sessionStorage.getItem(WELCOME_SEEN_SESSION_KEY) === "1") {
        setShowWelcome(false);
        return;
      }
      sessionStorage.setItem(WELCOME_SEEN_SESSION_KEY, "1");
    } catch {
      setShowWelcome(false);
      return;
    }
    setShowWelcome(true);
  }, [hasWelcome]);

  const desktopAriaLabel = showWelcome ? "Welcome introduction" : "Studio logo";

  return (
    <>
      <div className="work-home-logo hidden md:flex" aria-label={desktopAriaLabel}>
        <div className="work-home-logo__slot">
          {showWelcome === true ? (
            <WorkHomeWelcomeContent
              heading={heading}
              body={body}
              mobileBodyLines={mobileBodyLines}
              displayClass={displayClass}
              reduceMotion={reduceMotion}
            />
          ) : showWelcome === false && hasLogo ? (
            <BrandMark brand={brand} variant="workHome" linkable={false} />
          ) : null}
        </div>
      </div>

      {showWelcome === true ? (
        <div className="work-home-logo flex md:hidden" aria-label="Welcome introduction">
          <div className="work-home-logo__slot">
            <WorkHomeWelcomeContent
              heading={heading}
              body={body}
              mobileBodyLines={mobileBodyLines}
              displayClass={displayClass}
              reduceMotion={reduceMotion}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
