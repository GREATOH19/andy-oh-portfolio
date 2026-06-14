import type {PortableTextBlock} from "@portabletext/types";
import {portableTextHasVisibleContent} from "@/lib/portableText/filterEmptyBlocks";

function splitLegacyParagraphs(value: string): string[] {
  return value
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Supports legacy plain-text lead until content is re-saved in Studio. */
export function normalizeLeadBlocks(
  lead: PortableTextBlock[] | string | null | undefined,
): PortableTextBlock[] | null {
  if (Array.isArray(lead)) {
    return portableTextHasVisibleContent(lead) ? lead : null;
  }
  if (typeof lead !== "string" || !lead.trim()) return null;
  return splitLegacyParagraphs(lead).map((text, index) => ({
    _type: "block",
    _key: `legacy-lead-${index}`,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `legacy-lead-${index}-span`,
        text,
        marks: [],
      },
    ],
  }));
}

export function leadHasContent(
  lead: PortableTextBlock[] | string | null | undefined,
): boolean {
  return normalizeLeadBlocks(lead) != null;
}

function blockPlainText(block: PortableTextBlock): string {
  if (block._type !== "block") return "";
  return (block.children ?? [])
    .filter((child) => child._type === "span" && "text" in child)
    .map((child) => ("text" in child && typeof child.text === "string" ? child.text : ""))
    .join("")
    .trim();
}

/** First paragraph for meta description (legacy string or portable text). */
export function leadExcerptText(
  lead: PortableTextBlock[] | string | null | undefined,
): string | undefined {
  const blocks = normalizeLeadBlocks(lead);
  if (!blocks?.length) return undefined;
  for (const block of blocks) {
    const text = blockPlainText(block);
    if (text) return text;
  }
  return undefined;
}
