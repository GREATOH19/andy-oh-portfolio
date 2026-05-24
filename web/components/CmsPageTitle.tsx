"use client";

import {useTypoClass} from "@/components/TypographyProvider";

export function CmsPageTitle({title}: {title: string}) {
  const displayClass = useTypoClass("display");

  return (
    <h1 className={`text-5xl leading-[1.1] text-slate-950 sm:text-6xl ${displayClass}`}>{title}</h1>
  );
}
