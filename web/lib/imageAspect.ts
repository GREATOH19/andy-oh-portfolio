import type {CSSProperties} from "react";
import type {SanityImageField} from "@/lib/types/project";

/** Layout box for `next/image` fill + `object-contain` from Sanity asset dimensions. */
export function aspectBoxStyle(image: SanityImageField | null | undefined): CSSProperties {
  const d = image?.asset?.metadata?.dimensions;
  if (d?.width && d?.height && d.width > 0 && d.height > 0) {
    return {aspectRatio: `${d.width} / ${d.height}`};
  }
  return {aspectRatio: "16 / 9"};
}
