import {createImageUrlBuilder} from "@sanity/image-url";
import {client} from "./client";

const builder = createImageUrlBuilder(client);

export function urlForImage(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

/** Shallow image fields use `asset._ref`; GROQ `asset->` documents usually only have `_id`. */
export function sanityImageAssetId(
  source: {asset?: {_ref?: string | null; _id?: string | null} | null} | null | undefined,
): string | null {
  const id = source?.asset?._ref ?? source?.asset?._id;
  return typeof id === "string" && id.length > 0 ? id : null;
}
