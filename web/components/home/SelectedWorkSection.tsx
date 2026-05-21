"use client";

import {useEffect, useRef, useState} from "react";

import {ProjectCard} from "@/components/ProjectCard";
import type {ProjectListItem} from "@/lib/types/project";

/** Close mobile card overlay after this idle period (no taps in #work). */
const TOUCH_OVERLAY_IDLE_MS = 10_000;

export function SelectedWorkSection({
  projects,
}: {
  /** Featured projects from Work homepage → Featured on Work (max 9). */
  projects: ProjectListItem[];
}) {
  const visibleProjects = projects.filter((p) => p.slug);
  const [openTouchCardId, setOpenTouchCardId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

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

  if (visibleProjects.length === 0) {
    return (
      <section id="work" className="scroll-mt-24">
        <p className="text-sm text-slate-500">No projects to show yet. Add projects in Sanity Studio.</p>
      </section>
    );
  }

  return (
    <section id="work" ref={sectionRef} className="scroll-mt-24">
      <div className="work-grid">
        {visibleProjects.map((project) => (
          <div key={project._id}>
            <ProjectCard
              project={project}
              touchOverlayOpen={openTouchCardId === project._id}
              onTouchOverlayToggle={() =>
                setOpenTouchCardId((id) => (id === project._id ? null : project._id))
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}
