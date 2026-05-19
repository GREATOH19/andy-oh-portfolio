import {client} from "@/lib/sanity/client";
import {morePageQuery} from "@/lib/sanity/queries";
import type {MoreBlock, MorePageDocument} from "@/lib/types/project";

const DEFAULT_MORE_BLOCKS: MoreBlock[] = [
  {
    _type: "archiveBlock",
    _key: "default-archive",
    enabled: true,
    defaultExpanded: false,
    heading: "Archive",
    archiveProjects: [],
  },
  {
    _type: "photographyBlock",
    _key: "default-photography",
    enabled: true,
    defaultExpanded: false,
    heading: "Photography",
    albums: [],
  },
  {
    _type: "behindTheScenesBlock",
    _key: "default-bts",
    enabled: true,
    defaultExpanded: false,
    heading: "Behind the scene",
    images: [],
  },
];

function withDefaultBlocks(page: MorePageDocument): MorePageDocument {
  const blocks = page.blocks ?? [];
  if (blocks.some((b) => b.enabled !== false)) return page;
  return {...page, blocks: blocks.length > 0 ? blocks : DEFAULT_MORE_BLOCKS};
}

/** Always returns a More hub document; uses placeholder blocks when CMS is not configured yet. */
export async function fetchMorePage(): Promise<MorePageDocument> {
  const page = await client.fetch<MorePageDocument | null>(morePageQuery);
  if (page) return withDefaultBlocks(page);

  return {
    _id: "fallback-more",
    title: "More",
    slug: "more",
    blocks: DEFAULT_MORE_BLOCKS,
  };
}
