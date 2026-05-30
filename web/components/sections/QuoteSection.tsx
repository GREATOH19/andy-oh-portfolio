"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import {useTypoClass} from "@/components/TypographyProvider";
import { cmsFontClass } from "@/lib/cmsFontClass";

export function QuoteSection({
  quote,
  attribution,
}: {
  quote?: PortableTextBlock[] | null;
  attribution?: string | null;
}) {
  const displayClass = useTypoClass("display");
  const metaClass = useTypoClass("meta");

  if (!quote) return null;

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="text-xl leading-snug md:text-2xl">{children}</p>
      ),
      sizeSm: ({ children }) => (
        <p className="text-xl leading-snug md:text-lg">{children}</p>
      ),
      sizeLg: ({ children }) => (
        <p className="text-xl leading-snug md:text-3xl">{children}</p>
      ),
      sizeXl: ({ children }) => (
        <p className="text-xl leading-snug md:text-4xl">{children}</p>
      ),
    },
    marks: {
      font: ({ value, children }) => (
        <span className={cmsFontClass(value?.font)}>{children}</span>
      ),
      fontSerif: ({ children }) => <span className="font-serif">{children}</span>,
      fontSans: ({ children }) => <span className="font-sans">{children}</span>,
      fontMono: ({ children }) => <span className="font-mono">{children}</span>,
      fontDmSans: ({ children }) => <span className="font-brand-dm">{children}</span>,
      fontInstrument: ({ children }) => <span className="font-brand-instrument">{children}</span>,
      fontPinyon: ({ children }) => <span className="font-brand-pinyon">{children}</span>,
      fontGloock: ({ children }) => <span className="font-brand-gloock">{children}</span>,
      fontSpaceGrotesk: ({ children }) => <span className="font-brand-space-grotesk">{children}</span>,
    },
  };

  return (
    <figure>
      <blockquote className={`${displayClass}`}>
        <span aria-hidden>“</span>
        <PortableText value={quote} components={components} />
        <span aria-hidden>”</span>
      </blockquote>
      {attribution ? (
        <p className={`mt-3 text-sm text-zinc-600 ${metaClass}`}>— {attribution}</p>
      ) : null}
    </figure>
  );
}
