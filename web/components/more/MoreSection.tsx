"use client";

import Link from "next/link";
import {useTypoClass} from "@/components/TypographyProvider";

export function MoreSection({
  title,
  moreHref,
  moreLabel = "+",
  children,
}: {
  title: string;
  moreHref: string;
  moreLabel?: string;
  children: React.ReactNode;
}) {
  const headingClass = useTypoClass("heading");

  return (
    <section className="w-full border-t border-slate-100 pt-10 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <h2
          className={`min-w-0 flex-1 truncate text-2xl text-slate-950 sm:text-3xl ${headingClass}`}
        >
          {title}
        </h2>
        <Link
          href={moreHref}
          aria-label={`View all ${title}`}
          className="flex shrink-0 items-center justify-center px-1 text-3xl font-light leading-none text-slate-800 transition-colors hover:text-slate-950 sm:text-4xl"
        >
          {moreLabel}
        </Link>
      </div>
      <div className="pt-8">{children}</div>
    </section>
  );
}
