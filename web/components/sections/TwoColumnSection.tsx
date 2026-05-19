"use client";

import {PortableBody} from "@/components/PortableBody";
import {useTypoClass} from "@/components/TypographyProvider";
import type {PortableTextBlock} from "@portabletext/types";

export function TwoColumnSection({
  left,
  right,
}: {
  left?: PortableTextBlock[] | null;
  right?: PortableTextBlock[] | null;
}) {
  const bodyClass = useTypoClass("body");
  const hasLeft = Boolean(left?.length);
  const hasRight = Boolean(right?.length);

  if (!hasLeft && !hasRight) return null;

  return (
    <section className="grid gap-10 md:grid-cols-2 md:gap-12">
      <div>{hasLeft ? <PortableBody value={left ?? undefined} className={bodyClass} /> : null}</div>
      <div>{hasRight ? <PortableBody value={right ?? undefined} className={bodyClass} /> : null}</div>
    </section>
  );
}
