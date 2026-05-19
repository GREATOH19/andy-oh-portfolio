import type {MoreBlock, MorePageDocument} from "@/lib/types/project";

export type MoreNavItem = {
  href: string;
  label: string;
};

const MORE_SUBPAGE_BY_TYPE: Partial<
  Record<MoreBlock["_type"], {href: string; defaultLabel: string}>
> = {
  archiveBlock: {href: "/more/archive", defaultLabel: "Archive"},
  photographyBlock: {href: "/more/photography", defaultLabel: "Photography"},
  behindTheScenesBlock: {href: "/more/behind-the-scenes", defaultLabel: "Behind the scene"},
};

/** Enabled More blocks as header dropdown links (detail pages only). */
export function getMoreNavDropdownItems(page: MorePageDocument): MoreNavItem[] {
  const items: MoreNavItem[] = [];

  for (const block of page.blocks ?? []) {
    if (block.enabled === false) continue;

    const config = MORE_SUBPAGE_BY_TYPE[block._type];
    if (!config) continue;

    items.push({
      href: config.href,
      label: block.heading?.trim() || config.defaultLabel,
    });
  }

  return items;
}
