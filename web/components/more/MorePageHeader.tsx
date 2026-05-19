"use client";

import Link from "next/link";
import {useTypoClass} from "@/components/TypographyProvider";

export function MorePageHeader({
  title,
  backHref = "/more",
  backLabel = "More",
}: {
  title: string;
  backHref?: string;
  backLabel?: string;
}) {
  const headingClass = useTypoClass("heading");

  return (
    <header className="mb-5 border-b border-slate-100 pb-2.5 md:mb-6">
      <Link
        href={backHref}
        className="mb-1.5 inline-block text-sm font-medium uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-slate-700"
      >
        ← {backLabel}
      </Link>
      <h1 className={`text-2xl font-medium leading-tight text-slate-950 sm:text-3xl ${headingClass}`}>
        {title}
      </h1>
    </header>
  );
}
