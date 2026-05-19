import type {ProjectListItem} from "@/lib/types/project";

/** First 4-digit year in a string (e.g. "2022 ~ 2024" → 2022). */
export function parseYearNumber(year?: string | null): number | null {
  if (!year?.trim()) return null;
  const match = year.trim().match(/\d{4}/);
  return match ? Number.parseInt(match[0], 10) : null;
}

export function sortProjectsByYearDesc(projects: ProjectListItem[]): ProjectListItem[] {
  return [...projects].sort((a, b) => {
    const ya = parseYearNumber(a.year);
    const yb = parseYearNumber(b.year);
    if (ya != null && yb != null && ya !== yb) return yb - ya;
    if (ya != null && yb == null) return -1;
    if (ya == null && yb != null) return 1;
    return a.title.localeCompare(b.title);
  });
}

export type YearGroup<T> = {yearLabel: string; yearSort: number; items: T[]};

export function groupProjectsByYear(projects: ProjectListItem[]): YearGroup<ProjectListItem>[] {
  const map = new Map<string, ProjectListItem[]>();

  for (const p of projects) {
    const label = p.year?.trim() || "Other";
    const list = map.get(label) ?? [];
    list.push(p);
    map.set(label, list);
  }

  const groups: YearGroup<ProjectListItem>[] = [...map.entries()].map(([yearLabel, items]) => ({
    yearLabel,
    yearSort: parseYearNumber(yearLabel) ?? -1,
    items,
  }));

  groups.sort((a, b) => {
    if (a.yearSort !== b.yearSort) return b.yearSort - a.yearSort;
    return a.yearLabel.localeCompare(b.yearLabel);
  });

  return groups;
}
