"use client";

import {useTypoClass} from "@/components/TypographyProvider";

export function QuoteSection({
  quote,
  attribution,
}: {
  quote?: string | null;
  attribution?: string | null;
}) {
  const displayClass = useTypoClass("display");
  const metaClass = useTypoClass("meta");

  if (!quote) return null;

  return (
    <figure>
      <blockquote className={`text-2xl leading-snug text-zinc-900 ${displayClass}`}>“{quote}”</blockquote>
      {attribution ? (
        <p className={`mt-3 text-sm text-zinc-600 ${metaClass}`}>— {attribution}</p>
      ) : null}
    </figure>
  );
}
