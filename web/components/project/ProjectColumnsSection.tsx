"use client";

import {PortableBody} from "@/components/PortableBody";
import {useTypoClass} from "@/components/TypographyProvider";
import type {PortableTextBlock} from "@portabletext/types";

const RATIO_CLASS = {
  "50-50": "md:grid-cols-2",
  "40-60": "md:grid-cols-[2fr_3fr]",
  "60-40": "md:grid-cols-[3fr_2fr]",
} as const;

export function ProjectColumnsSection({
  ratio,
  left,
  right,
}: {
  ratio?: "50-50" | "40-60" | "60-40" | null;
  left?: PortableTextBlock[] | null;
  right?: PortableTextBlock[] | null;
}) {
  const bodyClass = useTypoClass("body");
  const gridClass = RATIO_CLASS[ratio ?? "50-50"] ?? RATIO_CLASS["50-50"];
  const hasLeft = Boolean(left?.length);
  const hasRight = Boolean(right?.length);
  if (!hasLeft && !hasRight) return null;

  return (
    <section className={`grid items-start gap-8 ${gridClass}`}>
      {hasLeft ? (
        <div className="project-story-prose min-w-0">
          <PortableBody value={left} className={bodyClass} spacing="story" />
        </div>
      ) : null}
      {hasRight ? (
        <div className="project-story-prose min-w-0">
          <PortableBody value={right} className={bodyClass} spacing="story" />
        </div>
      ) : null}
    </section>
  );
}
