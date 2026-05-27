"use client";

import {useEffect, useMemo, useRef, useState} from "react";

import {ProjectCard} from "@/components/ProjectCard";
import {WorkHomeBanner} from "@/components/home/WorkHomeBanner";
import type {HomeWelcomeIntroContent, ProjectListItem, SiteBrand} from "@/lib/types/project";

/** Close mobile card overlay after this idle period (no taps in #work). */
const TOUCH_OVERLAY_IDLE_MS = 10_000;

const FOLD_ROW_COUNT_DESKTOP = 3;

export function SelectedWorkSection({
  projects,
  workHomeLogo,
  headerBrand,
  welcomeIntro,
  compactBottomPadding = false,
}: {
  /** Featured projects from Work homepage → Featured on Work (max 9). */
  projects: ProjectListItem[];
  /** Site Settings → Work homepage logo (desktop banner; mobile footer). */
  workHomeLogo?: SiteBrand | null;
  /** Site Settings → Header logo (fallback when banner logo unset). */
  headerBrand?: SiteBrand | null;
  /** First-visit welcome copy (replaces desktop banner once; mobile has no fold banner). */
  welcomeIntro?: HomeWelcomeIntroContent | null;
  compactBottomPadding?: boolean;
}) {
  const visibleProjects = projects.filter((p) => p.slug);
  const [openTouchCardId, setOpenTouchCardId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Desktop-only composition: first viewport shows banner + first 3 cards.
   * On mobile / 2-column widths, keep one continuous grid to avoid a “gap jump”
   * between the 3rd and 4th cards caused by the fold split.
   */
  const [useFoldSplit, setUseFoldSplit] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setUseFoldSplit(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const {foldProjects, restProjects} = useMemo(() => {
    if (!useFoldSplit) {
      return {foldProjects: [] as ProjectListItem[], restProjects: visibleProjects};
    }
    return {
      foldProjects: visibleProjects.slice(0, FOLD_ROW_COUNT_DESKTOP),
      restProjects: visibleProjects.slice(FOLD_ROW_COUNT_DESKTOP),
    };
  }, [useFoldSplit, visibleProjects]);

  useEffect(() => {
    if (!openTouchCardId) return;

    const section = sectionRef.current;
    if (!section) return;

    let timeoutId = window.setTimeout(() => setOpenTouchCardId(null), TOUCH_OVERLAY_IDLE_MS);

    const resetIdleTimer = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setOpenTouchCardId(null), TOUCH_OVERLAY_IDLE_MS);
    };

    section.addEventListener("touchstart", resetIdleTimer, {passive: true});
    section.addEventListener("pointerdown", resetIdleTimer);

    return () => {
      window.clearTimeout(timeoutId);
      section.removeEventListener("touchstart", resetIdleTimer);
      section.removeEventListener("pointerdown", resetIdleTimer);
    };
  }, [openTouchCardId]);

  const renderCard = (project: ProjectListItem) => (
    <ProjectCard
      key={project._id}
      project={project}
      touchOverlayOpen={openTouchCardId === project._id}
      onTouchOverlayToggle={() =>
        setOpenTouchCardId((id) => (id === project._id ? null : project._id))
      }
    />
  );

  if (visibleProjects.length === 0) {
    return (
      <section id="work" className="scroll-mt-24 layout-chrome">
        <p className="text-sm text-slate-500">No projects to show yet. Add projects in Sanity Studio.</p>
      </section>
    );
  }

  const belowFoldPadding = compactBottomPadding ? "pb-12 md:pb-16" : "pb-20 md:pb-32";

  return (
    <section id="work" ref={sectionRef} className="scroll-mt-24">
      {useFoldSplit ? (
        <>
          <div className="work-home-fold work-home-fold--fullbleed">
            <WorkHomeBanner
              workHomeLogo={workHomeLogo}
              headerBrand={headerBrand}
              welcomeIntro={welcomeIntro}
            />

            {foldProjects.length > 0 ? (
              <div
                className={`layout-chrome work-home-fold-chrome${restProjects.length === 0 ? ` ${belowFoldPadding}` : ""}`}
              >
                <div className="work-grid work-grid--fold-row" aria-label="Featured projects, row one">
                  {foldProjects.map((project) => (
                    <div key={project._id}>{renderCard(project)}</div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {restProjects.length > 0 ? (
            <div className={`layout-chrome work-page-chrome ${belowFoldPadding}`}>
              <div id="work-grid-rest" className="work-grid work-grid--below-fold">
                {restProjects.map((project) => (
                  <div key={project._id}>{renderCard(project)}</div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="layout-chrome">
            <WorkHomeBanner
              workHomeLogo={workHomeLogo}
              headerBrand={headerBrand}
              welcomeIntro={welcomeIntro}
            />
          </div>
          <div className={`layout-chrome work-page-chrome ${belowFoldPadding}`}>
            <div id="work-grid-rest" className="work-grid work-grid--below-fold">
              {visibleProjects.map((project) => (
                <div key={project._id}>{renderCard(project)}</div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
