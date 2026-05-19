import {ProjectCard} from "@/components/ProjectCard";
import {groupProjectsByYear} from "@/lib/more/year";
import type {ProjectListItem} from "@/lib/types/project";

export function ProjectsByYear({projects}: {projects: ProjectListItem[]}) {
  const groups = groupProjectsByYear(projects);
  if (groups.length === 0) return null;

  return (
    <div className="space-y-16 md:space-y-20">
      {groups.map((group) => (
        <section key={group.yearLabel}>
          <h2 className="mb-8 font-serif text-3xl font-light text-slate-950 sm:text-4xl">{group.yearLabel}</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 sm:gap-y-14 md:grid-cols-3">
            {group.items.map((project) => (
              <div key={project._id}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
