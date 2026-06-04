import {draftMode} from "next/headers";
import {client} from "@/lib/sanity/client";
import {getPreviewClient} from "@/lib/sanity/previewClient";
import {projectBySlugQuery} from "@/lib/sanity/queries";
import type {ProjectDetail} from "@/lib/types/project";

export async function fetchProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const isDraft = (await draftMode()).isEnabled;
  const previewClient = getPreviewClient();
  const sanityClient = isDraft && previewClient ? previewClient : client;
  return sanityClient.fetch<ProjectDetail | null>(projectBySlugQuery, {slug});
}
