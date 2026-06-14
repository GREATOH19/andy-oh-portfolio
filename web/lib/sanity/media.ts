import {sanityImageAssetId} from "@/lib/sanity/image";
import {parseYoutubeVideoId} from "@/lib/youtube/parseYoutubeUrl";
import type {
  CmsMediaInput,
  CmsMediaItemRaw,
  SanityImageField,
  SanityMediaField,
  SanityVideoField,
  SanityYoutubeField,
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
  if (raw.mediaType === "video") {
    if (!raw.video?.asset || (!sanityVideoAssetId(raw.video) && !raw.video.asset?.url)) {
      return null;
    }
    return {
      _type: "file",
      asset: raw.video.asset,
      loopPreview: raw.loopPreview ?? undefined,
      alt: raw.alt ?? raw.video.alt,
      loop: raw.loop ?? false,
      loopDissolve: raw.loopDissolve ?? false,
    };
  }
  if (raw.mediaType === "youtube" && raw.youtubeUrl) {
    const url = raw.youtubeUrl.trim();
    if (!parseYoutubeVideoId(url)) return null;
    return {
      _type: "youtube",
      url,
      alt: raw.alt ?? undefined,
      videoAspect: raw.videoAspect ?? undefined,
    } satisfies SanityYoutubeField;
  }
  if (raw.mediaType === "image") {
    if (!raw.image || !sanityImageAssetId(raw.image)) return null;
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

export function isSanityYoutube(
  source: SanityMediaField | null | undefined,
): source is SanityYoutubeField {
  return source?._type === "youtube" && Boolean(parseYoutubeVideoId(source.url));
}

export function isSanityMedia(
  source: SanityMediaField | null | undefined,
): source is NonNullable<SanityMediaField> {
  return isSanityImage(source) || isSanityVideo(source) || isSanityYoutube(source);
}

export function isSanityLightboxMedia(
  source: SanityMediaField | null | undefined,
): source is NonNullable<SanityImageField> | NonNullable<SanityVideoField> {
  return isSanityImage(source) || isSanityVideo(source);
}

export function sanityFileRefToCdnUrl(ref: string): string | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return null;

  const match = ref.match(/^file-(.+)-(\w+)$/);
  if (!match) return null;

  const [, hash, ext] = match;
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${hash}.${ext}`;
}

function sanityFileAssetUrl(
  source: {asset?: {_ref?: string | null; _id?: string | null; url?: string | null} | null} | null | undefined,
): string | null {
  const url = source?.asset?.url;
  if (typeof url === "string" && url.length > 0) return url;

  const ref = source?.asset?._ref ?? source?.asset?._id;
  return typeof ref === "string" && ref.length > 0 ? sanityFileRefToCdnUrl(ref) : null;
}

/** Full-quality video URL (lightbox, controls, download). */
export function sanityVideoUrl(source: SanityVideoField | null | undefined): string | null {
  return sanityFileAssetUrl(source);
}

/** Lightweight loop preview when uploaded; otherwise null. */
export function sanityLoopPreviewVideoUrl(source: SanityVideoField | null | undefined): string | null {
  const preview = source?.loopPreview;
  if (!preview?.asset) return null;
  return sanityFileAssetUrl(preview);
}

/** Inline muted loop — preview when available, else full file. */
export function sanityInlineLoopVideoUrl(source: SanityVideoField | null | undefined): string | null {
  return sanityLoopPreviewVideoUrl(source) ?? sanityVideoUrl(source);
}

export function sanityAudioUrl(
  source: {asset?: {_ref?: string | null; _id?: string | null; url?: string | null} | null} | null | undefined,
): string | null {
  const url = source?.asset?.url;
  if (typeof url === "string" && url.length > 0) return url;

  const ref = source?.asset?._ref ?? source?.asset?._id;
  return typeof ref === "string" && ref.length > 0 ? sanityFileRefToCdnUrl(ref) : null;
}

export function sanityMediaKey(source: SanityMediaField, index: number): string {
  if (isSanityImage(source)) return `${sanityImageAssetId(source)!}-${index}`;
  if (isSanityVideo(source)) return `${sanityVideoAssetId(source) ?? source.asset?.url}-${index}`;
  if (isSanityYoutube(source)) return `youtube-${parseYoutubeVideoId(source.url)}-${index}`;
  return `media-${index}`;
}
