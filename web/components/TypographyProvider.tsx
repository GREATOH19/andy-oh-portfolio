"use client";

import { createContext, useContext, type ReactNode } from "react";
import { typoRoleClass } from "@/lib/cmsFontClass";
import type { SiteTypography, TypographyRole } from "@/lib/types/project";

const TypographyContext = createContext<SiteTypography | null>(null);

export function TypographyProvider({
  typography,
  children,
}: {
  typography?: SiteTypography | null;
  children: ReactNode;
}) {
  return <TypographyContext.Provider value={typography ?? null}>{children}</TypographyContext.Provider>;
}

export function useSiteTypography(): SiteTypography | null {
  return useContext(TypographyContext);
}

export function useTypoClass(role: TypographyRole): string {
  const typography = useSiteTypography();
  return typoRoleClass(role, typography);
}
