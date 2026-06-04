import type {PortableTextBlock} from "@portabletext/types";

/** True when a portable-text block has no visible text (empty line in Studio). */
export function isEmptyPortableTextBlock(block: PortableTextBlock): boolean {
  if (block._type !== "block") return false;
  const children = block.children ?? [];
  if (children.length === 0) return true;
  return children.every((child) => {
    if (child._type !== "span") return false;
    const text = "text" in child && typeof child.text === "string" ? child.text : "";
    return text.trim() === "";
  });
}

export function filterEmptyPortableTextBlocks(
  value: PortableTextBlock[] | null | undefined,
): PortableTextBlock[] {
  return (value ?? []).filter((block) => !isEmptyPortableTextBlock(block));
}

/** Chapter/column body has visible text or inline media blocks */
export function portableTextHasVisibleContent(
  value: Array<{_type?: string}> | null | undefined,
): boolean {
  return (value ?? []).some(
    (block) =>
      block._type === "projectInlineMedia" ||
      (block._type === "block" && !isEmptyPortableTextBlock(block as PortableTextBlock)),
  );
}
