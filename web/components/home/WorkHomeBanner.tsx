"use client";

import {motion, useReducedMotion} from "framer-motion";
import {useEffect, useLayoutEffect, useState} from "react";

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
  overlay = false,
}: {
  heading: string;
  body: string;
  mobileBodyLines?: [string, string];
  displayClass: string;
  reduceMotion: boolean | null;
  /** Desktop: text over blurred banner + glass layer. */
  overlay?: boolean;
}) {
  return (
    <motion.div
      className={
        overlay
          ? "work-home-welcome work-home-welcome--overlay"
          : "work-home-logo__wrapper work-home-welcome"
      }
      initial={reduceMotion ? false : {opacity: 0, y: 12}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.4}}
    >
      {heading ? (
        <h2 className={`work-home-logo__text text-center ${displayClass}`}>{heading}</h2>
      ) : null}
      {body && mobileBodyLines ? (
        <div className="work-home-welcome__copy mt-5 sm:mt-7">
          <p
            className="work-home-welcome__body work-home-welcome__body--stack welcome-intro-subcopy text-slate-600 sm:hidden"
            aria-label={body}
          >
            <span>{mobileBodyLines[0]}</span>
            {mobileBodyLines[1] ? <span>{mobileBodyLines[1]}</span> : null}
          </p>
          <p className="work-home-welcome__body work-home-welcome__body--desktop hidden text-slate-600 sm:block">
            {body}
          </p>
        </div>
      ) : null}
    </motion.div>
  );
}

/** Desktop first visit: blurred banner image only + welcome copy on top (no full-panel frost). */
function WorkHomeDesktopWelcome({
  brand,
  hasLogo,
  heading,
  body,
  mobileBodyLines,
  displayClass,
  reduceMotion,
}: {
  brand: SiteBrand | null;
  hasLogo: boolean;
  heading: string;
  body: string;
  mobileBodyLines?: [string, string];
  displayClass: string;
  reduceMotion: boolean | null;
}) {
  return (
    <div className="work-home-logo__slot work-home-logo__slot--welcome">
      {hasLogo ? (
        <div className="work-home-welcome-backdrop" aria-hidden>
          <div className="work-home-welcome-backdrop__sharp">
            <BrandMark brand={brand} variant="workHome" linkable={false} />
          </div>
          <div className="work-home-welcome-backdrop__blur">
            <BrandMark brand={brand} variant="workHome" linkable={false} />
          </div>
        </div>
      ) : null}
      <WorkHomeWelcomeContent
        overlay
        heading={heading}
        body={body}
        mobileBodyLines={mobileBodyLines}
        displayClass={displayClass}
        reduceMotion={reduceMotion}
      />
    </div>
  );
}

type WorkHomeBannerProps = {
  workHomeLogo?: SiteBrand | null;
  headerBrand?: SiteBrand | null;
  welcomeIntro?: HomeWelcomeIntroContent | null;
};

/**
 * Work fold banner slot: first session shows welcome copy (desktop: blurred banner + glass;
 * mobile: text only — banner logo lives in footer). Later visits show the CMS banner on desktop.
 */
export function WorkHomeBanner({workHomeLogo, headerBrand, welcomeIntro}: WorkHomeBannerProps) {
  const heading = welcomeIntro?.heading?.trim() ?? "";
  const body = welcomeIntro?.body?.trim() ?? "";
  const mobileBodyLines = body ? splitWelcomeBodyAtKorea(body) : undefined;
  const hasWelcome = heading.length > 0 || body.length > 0;
  const brand = resolveWorkHomeLogo(workHomeLogo, headerBrand);
  const hasLogo = hasSiteBrandContent(brand);
  const glowEnabled = Boolean(brand?.shadowGlowEnabled && brand?.shadowImage?.asset);

  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);
  const [bannerHover, setBannerHover] = useState(false);
  const reduceMotion = useReducedMotion();
  const displayClass = useTypoClass("display");

  useLayoutEffect(() => {
    if (!hasWelcome) {
      setShowWelcome(false);
      return;
    }
    try {
      setShowWelcome(sessionStorage.getItem(WELCOME_SEEN_SESSION_KEY) !== "1");
    } catch {
      setShowWelcome(false);
    }
  }, [hasWelcome]);

  /** Mark seen only after committing to show — avoids Strict Mode double-mount hiding welcome. */
  useEffect(() => {
    if (showWelcome !== true) return;
    try {
      sessionStorage.setItem(WELCOME_SEEN_SESSION_KEY, "1");
    } catch {
      /* private mode / quota */
    }
  }, [showWelcome]);

  const desktopAriaLabel = showWelcome ? "Welcome introduction" : "Studio logo";

  return (
    <>
      <div className="work-home-logo hidden md:flex" aria-label={desktopAriaLabel}>
        {showWelcome === true ? (
          <WorkHomeDesktopWelcome
            brand={brand}
            hasLogo={hasLogo}
            heading={heading}
            body={body}
            mobileBodyLines={mobileBodyLines}
            displayClass={displayClass}
            reduceMotion={reduceMotion}
          />
        ) : showWelcome === false && hasLogo ? (
          <div
            className={`work-home-logo__slot${bannerHover ? " work-home-logo__slot--glow" : ""}`}
            onPointerEnter={() => setBannerHover(true)}
            onPointerLeave={(e) => {
              const next = e.relatedTarget;
              if (next instanceof Node && e.currentTarget.contains(next)) return;
              setBannerHover(false);
            }}
          >
            <BrandMark
              brand={brand}
              variant="workHome"
              linkable={false}
              bannerGlow={glowEnabled}
              bannerGlowActive={bannerHover}
            />
          </div>
        ) : null}
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
