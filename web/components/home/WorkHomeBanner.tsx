"use client";

import Link from "next/link";
import {useEffect, useLayoutEffect, useRef, useState} from "react";

import {BrandMark} from "@/components/BrandMark";
import {useTypoClass} from "@/components/TypographyProvider";
import {WorkHomeBannerBloom} from "@/components/home/WorkHomeBannerBloom";
import {WorkHomeTouchRipple} from "@/components/home/WorkHomeTouchRipple";
import {hasSiteBrandContent, resolveWorkHomeLogo} from "@/lib/siteBrand";
import {workHomeBannerImageUrl} from "@/lib/sanity/workHomeBannerImage";
import type {HomeWelcomeIntroContent, SiteBrand} from "@/lib/types/project";

const INTRO_SEEN_SESSION_KEY = "portfolio-home-welcome-seen";

function WorkHomeIntro({heading, body}: {heading: string; body: string}) {
  const displayClass = useTypoClass("display");
  const bodyClass = useTypoClass("body");

  return (
    <div className="work-home-intro flex shrink-0 flex-col items-center gap-1.5 text-center">
      {heading ? (
        <h1 className={`cms-title-tone text-lg font-semibold tracking-tight sm:text-xl ${displayClass}`}>
          {heading}
        </h1>
      ) : null}
      {body ? <p className={`text-sm text-muted sm:text-[0.9375rem] ${bodyClass}`}>{body}</p> : null}
    </div>
  );
}

type WorkHomeBannerProps = {
  workHomeLogo?: SiteBrand | null;
  headerBrand?: SiteBrand | null;
  welcomeIntro?: HomeWelcomeIntroContent | null;
};

/**
 * Work fold banner: CMS banner logo (desktop) with the short intro (name + one line) underneath.
 * The intro shows only on the first visit in a browser session.
 * Mobile shows the intro only — the banner logo lives in the footer there.
 */
export function WorkHomeBanner({workHomeLogo, headerBrand, welcomeIntro}: WorkHomeBannerProps) {
  const heading = welcomeIntro?.heading?.trim() ?? "";
  const body = welcomeIntro?.body?.trim() ?? "";
  const brand = resolveWorkHomeLogo(workHomeLogo, headerBrand);
  const hasLogo = hasSiteBrandContent(brand);
  const glowEnabled = Boolean(brand?.shadowGlowEnabled && brand?.shadowImage?.asset);
  const bloomSrc = brand?.mode === "image" && brand.image?.asset ? workHomeBannerImageUrl(brand.image) : null;

  const slotRef = useRef<HTMLDivElement>(null);
  const [bannerHover, setBannerHover] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);
  const hasIntro = firstVisit && (heading.length > 0 || body.length > 0);

  useLayoutEffect(() => {
    try {
      // Only ever switch on: a Strict Mode re-run sees the flag already set and must not hide it.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is external; must run before paint.
      if (sessionStorage.getItem(INTRO_SEEN_SESSION_KEY) !== "1") setFirstVisit(true);
    } catch {
      /* private mode */
    }
  }, []);

  useEffect(() => {
    if (!firstVisit) return;
    try {
      sessionStorage.setItem(INTRO_SEEN_SESSION_KEY, "1");
    } catch {
      /* private mode / quota */
    }
  }, [firstVisit]);

  return (
    <>
      <div className="work-home-logo hidden md:flex md:flex-col md:items-center md:pb-4" aria-label="Studio logo">
        {hasLogo ? (
          <div
            ref={slotRef}
            className={`work-home-logo__slot h-auto min-h-0 flex-1${bannerHover ? " work-home-logo__slot--glow" : ""}`}
            {...(bloomSrc
              ? {}
              : {
                  onPointerEnter: () => setBannerHover(true),
                  onPointerLeave: (e: React.PointerEvent<HTMLDivElement>) => {
                    const next = e.relatedTarget;
                    if (next instanceof Node && e.currentTarget.contains(next)) return;
                    setBannerHover(false);
                  },
                })}
          >
            <Link
              href="/about"
              className={`block h-full w-full ${bannerHover ? "cursor-pointer" : "cursor-default"}`}
              onClick={(e) => {
                // The logo image spans the whole banner: a mouse click only counts on the letters (where it glows).
                if ((e.nativeEvent as PointerEvent).pointerType === "mouse" && !bannerHover) e.preventDefault();
              }}
            >
              <BrandMark
                brand={brand}
                variant="workHome"
                linkable={false}
                bannerGlow={glowEnabled}
                bannerGlowActive={bannerHover}
              />
            </Link>
          </div>
        ) : null}
        {hasLogo && bloomSrc ? (
          <WorkHomeBannerBloom src={bloomSrc} targetRef={slotRef} onActiveChange={setBannerHover} />
        ) : null}
        {hasIntro ? <WorkHomeIntro heading={heading} body={body} /> : null}
      </div>

      {hasIntro ? (
        <div className="pb-2 pt-8 md:hidden">
          <WorkHomeIntro heading={heading} body={body} />
        </div>
      ) : null}

      <WorkHomeTouchRipple />
    </>
  );
}
