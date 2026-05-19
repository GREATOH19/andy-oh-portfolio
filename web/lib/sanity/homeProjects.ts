import type {SanityClient} from "next-sanity";

import {homeFeaturedProjectsFallbackQuery} from "@/lib/sanity/queries";
import type {ProjectListItem} from "@/lib/types/project";

export async function resolveHomeFeaturedProjects(
  client: SanityClient,
  featured?: ProjectListItem[] | null,
): Promise<ProjectListItem[]> {
  const fromCms = (featured ?? []).filter((p) => p?.slug);
  if (fromCms.length > 0) return fromCms;
  return client.fetch<ProjectListItem[]>(homeFeaturedProjectsFallbackQuery);
}
