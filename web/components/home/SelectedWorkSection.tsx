import {ProjectCard} from "@/components/ProjectCard";
import type {ProjectListItem} from "@/lib/types/project";

export function SelectedWorkSection({
  projects,
}: {
  /** Featured projects from Work homepage → Featured on Work (max 9). */
  projects: ProjectListItem[];
}) {
  const visibleProjects = projects.filter((p) => p.slug);

  if (visibleProjects.length === 0) {
    return (
      <section id="work" className="scroll-mt-24">
        <p className="text-sm text-slate-500">No projects to show yet. Add projects in Sanity Studio.</p>
      </section>
    );
  }

  return (
    <section id="work" className="scroll-mt-24">
      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 md:grid-cols-3 md:gap-x-6 md:gap-y-14">
        {visibleProjects.map((project) => (
          <div key={project._id}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}
