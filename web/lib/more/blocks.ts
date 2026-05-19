import type {
  ArchiveBlock,
  BehindTheScenesBlock,
  MoreBlock,
  MorePageDocument,
  PhotographyBlock,
  ProjectListItem,
} from "@/lib/types/project";
import {sortProjectsByYearDesc} from "@/lib/more/year";
import {flattenAlbumImages, filterValidImages, MORE_PREVIEW_LIMIT} from "@/lib/more/photos";

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

export function previewArchiveProjects(page: MorePageDocument | null): ProjectListItem[] {
  return getArchiveProjects(page).slice(0, MORE_PREVIEW_LIMIT);
}

export function previewPhotographyImages(page: MorePageDocument | null) {
  const block = getPhotographyBlock(page);
  if (!block?.enabled) return [];
  return flattenAlbumImages(block.albums).slice(0, MORE_PREVIEW_LIMIT);
}

export function previewBehindTheScenesImages(page: MorePageDocument | null) {
  const block = getBehindTheScenesBlock(page);
  if (!block?.enabled) return [];
  return filterValidImages(block.images).slice(0, MORE_PREVIEW_LIMIT);
}
