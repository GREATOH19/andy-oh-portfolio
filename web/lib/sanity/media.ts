import {sanityImageAssetId} from "@/lib/sanity/image";
import type {
  CmsMediaInput,
  CmsMediaItemRaw,
  SanityImageField,
  SanityMediaField,
  SanityVideoField,
} from "@/lib/types/project";

export function sanityVideoAssetId(
  source: {asset?: {_ref?: string | null; _id?: string | null} | null} | null | undefined,
): string | null {
  const id = source?.asset?._ref ?? source?.asset?._id;
  return typeof id === "string" && id.length > 0 ? id : null;
}

export function normalizeMediaItem(item: CmsMediaInput | null | undefined): SanityMediaField | null {
  if (item == null || typeof item !== "object") return null;

  const raw = item as NonNullable<CmsMediaItemRaw>;

  // Legacy flat image on hero/gallery (asset + crop + hotspot at root, pre–cmsMediaItem).
  if (!raw.mediaType && sanityImageAssetId(item as SanityImageField)) {
    const legacy = item as SanityImageField;
    return {
      _type: "image",
      ...legacy,
      alt: raw.alt ?? legacy?.alt,
    };
  }

  // cmsMediaItem shape — match by mediaType because Studio may store a legacy _type during schema migration.
  if (raw.mediaType === "video" && raw.video) {
    return {
      _type: "file",
      asset: raw.video.asset,
      alt: raw.alt ?? raw.video.alt,
      loop: raw.loop ?? false,
    };
  }
  if (raw.mediaType === "image" && raw.image) {
    return {
      ...raw.image,
      alt: raw.alt ?? raw.image.alt,
    };
  }

  if (item._type === "image" && sanityImageAssetId(item)) {
    return item as SanityImageField;
  }

  if (item._type === "file" && (sanityVideoAssetId(item) || item.asset?.url)) {
    return item as SanityVideoField;
  }

  return null;
}

export function normalizeMediaList(items?: CmsMediaInput[] | null): SanityMediaField[] {
  return (items ?? [])
    .map(normalizeMediaItem)
    .filter((item): item is NonNullable<SanityMediaField> => item != null);
}

export function isSanityVideo(
  source: SanityMediaField | null | undefined,
): source is NonNullable<SanityVideoField> {
  return source?._type === "file" && Boolean(sanityVideoAssetId(source) || source.asset?.url);
}

export function isSanityImage(
  source: SanityMediaField | null | undefined,
): source is NonNullable<SanityImageField> {
  return source?._type === "image" && Boolean(sanityImageAssetId(source));
}

export function isSanityMedia(
  source: SanityMediaField | null | undefined,
): source is NonNullable<SanityMediaField> {
  return isSanityImage(source) || isSanityVideo(source);
}

function sanityFileUrlFromRef(ref: string): string | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return null;

  const match = ref.match(/^file-(.+)-(\w+)$/);
  if (!match) return null;

  const [, hash, ext] = match;
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${hash}.${ext}`;
}

export function sanityVideoUrl(source: SanityVideoField | null | undefined): string | null {
  const url = source?.asset?.url;
  if (typeof url === "string" && url.length > 0) return url;

  const ref = sanityVideoAssetId(source);
  return ref ? sanityFileUrlFromRef(ref) : null;
}

export function sanityMediaKey(source: SanityMediaField, index: number): string {
  if (isSanityImage(source)) return `${sanityImageAssetId(source)!}-${index}`;
  if (isSanityVideo(source)) return `${sanityVideoAssetId(source) ?? source.asset?.url}-${index}`;
  return `media-${index}`;
}
