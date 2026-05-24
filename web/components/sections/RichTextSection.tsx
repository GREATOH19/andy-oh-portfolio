"use client";

import {PortableBody} from "@/components/PortableBody";
import {useTypoClass} from "@/components/TypographyProvider";
import type {PortableTextBlock} from "@portabletext/types";

export function RichTextSection({
  title,
  body,
}: {
  title?: string | null;
  body?: PortableTextBlock[] | null;
}) {
  const displayClass = useTypoClass("display");
  const bodyClass = useTypoClass("body");

  return (
    <section>
      {title ? (
        <h2 className={`mb-4 mt-10 text-4xl leading-tight ${displayClass}`}>{title}</h2>
      ) : null}
      <PortableBody value={body ?? undefined} className={bodyClass} />
    </section>
  );
}
