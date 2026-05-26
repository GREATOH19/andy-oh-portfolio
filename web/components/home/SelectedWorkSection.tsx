"use client";

import {useEffect, useRef, useState} from "react";

import {ProjectCard} from "@/components/ProjectCard";
import {WorkHomeFoldHero} from "@/components/home/WorkHomeFoldHero";
import {WorkHomeLogo} from "@/components/home/WorkHomeLogo";
import type {HomeWelcomeIntroContent, ProjectListItem, SiteBrand} from "@/lib/types/project";

/** Close mobile card overlay after this idle period (no taps in #work). */
const TOUCH_OVERLAY_IDLE_MS = 10_000;

const FOLD_ROW_COUNT = 3;

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
  /** Mobile first-visit welcome copy (no banner logo on mobile). */
  welcomeIntro?: HomeWelcomeIntroContent | null;
  compactBottomPadding?: boolean;
}) {
  const visibleProjects = projects.filter((p) => p.slug);
  const [openTouchCardId, setOpenTouchCardId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const foldProjects = visibleProjects.slice(0, FOLD_ROW_COUNT);
  const restProjects = visibleProjects.slice(FOLD_ROW_COUNT);

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
      <div className="work-home-fold">
        <WorkHomeLogo workHomeLogo={workHomeLogo} headerBrand={headerBrand} />
        <WorkHomeFoldHero welcomeIntro={welcomeIntro} />

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
    </section>
  );
}
