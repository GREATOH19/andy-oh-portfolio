import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-[1.02rem] leading-[1.95] text-zinc-700">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="cms-title-tone magazine-serif mb-4 mt-10 text-4xl leading-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="cms-title-tone magazine-serif mb-3 mt-8 text-2xl leading-tight">{children}</h3>
    ),
  },
};

const mutedComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-slate-600 last:mb-0">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="cms-title-tone magazine-serif mb-3 mt-6 text-2xl leading-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="cms-title-tone magazine-serif mb-2 mt-5 text-xl leading-tight">{children}</h3>
    ),
  },
};

export function PortableBody({
  value,
  className,
  muted = false,
}: {
  value: PortableTextBlock[] | null | undefined;
  /** Applied to a wrapper so font-* inherits into portable text */
  className?: string;
  /** Slate footer-friendly typography */
  muted?: boolean;
}) {
  if (!value?.length) return null;
  const c = muted ? mutedComponents : components;
  const inner = <PortableText value={value} components={c} />;
  if (!className?.trim()) return inner;
  return <div className={className}>{inner}</div>;
}
