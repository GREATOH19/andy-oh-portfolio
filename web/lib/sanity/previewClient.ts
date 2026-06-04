import {createClient} from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_READ_TOKEN;

export function getPreviewClient() {
  if (!projectId || !dataset || !token) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    token,
    perspective: "previewDrafts",
    stega: false,
  });
}
