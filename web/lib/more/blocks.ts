import type {
  ArchiveBlock,
  BehindTheScenesBlock,
  MoreBlock,
  MorePageDocument,
  PhotographyBlock,
  PhotoAlbum,
  ProjectListItem,
  SanityMediaField,
} from "@/lib/types/project";
import {sortProjectsByYearDesc} from "@/lib/more/year";
import {flattenAlbumImages, normalizeBlockAlbums} from "@/lib/more/photos";
import {pickMorePreview} from "@/lib/more/preview";

export function getArchiveBlock(page: MorePageDocument | null): ArchiveBlock | null {
  const block = page?.blocks?.find(
    (b): b is ArchiveBlock => b._type === "archiveBlock" && b.enabled !== false,
  );
  return block ?? null;
}

export function getPhotographyBlock(page: MorePageDocument | null): PhotographyBlock | null {
  const block = page?.blocks?.find(
    (b): b is PhotographyBlock => b._type === "photographyBlock" && b.enabled !== false,
  );
  return block ?? null;
}

export function getBehindTheScenesBlock(page: MorePageDocument | null): BehindTheScenesBlock | null {
  const block = page?.blocks?.find(
    (b): b is BehindTheScenesBlock => b._type === "behindTheScenesBlock" && b.enabled !== false,
  );
  return block ?? null;
}

export function getArchiveProjects(page: MorePageDocument | null): ProjectListItem[] {
  const block = getArchiveBlock(page);
  if (!block?.enabled) return [];
  const projects = (block.archiveProjects ?? []).filter((p) => p?.slug);
  return sortProjectsByYearDesc(projects);
}

export function getAllArchiveProjectsAcrossBlocks(blocks?: MoreBlock[] | null): ProjectListItem[] {
  const all: ProjectListItem[] = [];
  for (const block of blocks ?? []) {
    if (block._type !== "archiveBlock" || block.enabled === false) continue;
    for (const p of block.archiveProjects ?? []) {
      if (p?.slug) all.push(p);
    }
  }
  return sortProjectsByYearDesc(all);
}

export function getArchiveAlbums(page: MorePageDocument | null): PhotoAlbum[] {
  const block = getArchiveBlock(page);
  if (!block?.enabled) return [];
  return normalizeBlockAlbums(block.archiveAlbums, block.archiveMedia);
}

export function getAllArchiveAlbumsAcrossBlocks(blocks?: MoreBlock[] | null): PhotoAlbum[] {
  const all: PhotoAlbum[] = [];
  for (const block of blocks ?? []) {
    if (block._type !== "archiveBlock" || block.enabled === false) continue;
    all.push(...normalizeBlockAlbums(block.archiveAlbums, block.archiveMedia));
  }
  return all;
}

export function getPhotographyAlbums(page: MorePageDocument | null): PhotoAlbum[] {
  const block = getPhotographyBlock(page);
  if (!block?.enabled) return [];
  return normalizeBlockAlbums(block.albums);
}

export function getBehindTheScenesAlbums(page: MorePageDocument | null): PhotoAlbum[] {
  const block = getBehindTheScenesBlock(page);
  if (!block?.enabled) return [];
  return normalizeBlockAlbums(block.albums, block.images);
}

export type ArchivePreviewItem =
  | {kind: "project"; item: ProjectListItem}
  | {kind: "media"; item: SanityMediaField};

export function buildArchivePreviewItems(block: ArchiveBlock): ArchivePreviewItem[] {
  const projects: ArchivePreviewItem[] = (block.archiveProjects ?? [])
    .filter((p) => p?.slug)
    .map((item) => ({kind: "project" as const, item}));
  const media: ArchivePreviewItem[] = flattenAlbumImages(block.archiveAlbums, block.archiveMedia).map((item) => ({
    kind: "media" as const,
    item,
  }));
  return [...projects, ...media];
}

export function previewArchiveProjects(page: MorePageDocument | null): ProjectListItem[] {
  const block = getArchiveBlock(page);
  if (!block) return [];
  return pickMorePreview(getArchiveProjects(page), block._key);
}

export function previewPhotographyImages(page: MorePageDocument | null) {
  const block = getPhotographyBlock(page);
  if (!block?.enabled) return [];
  return pickMorePreview(flattenAlbumImages(block.albums), block._key);
}

export function previewBehindTheScenesImages(page: MorePageDocument | null) {
  const block = getBehindTheScenesBlock(page);
  if (!block?.enabled) return [];
  return pickMorePreview(flattenAlbumImages(block.albums, block.images), block._key);
}
