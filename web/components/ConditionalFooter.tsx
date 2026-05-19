"use client";

import { usePathname } from "next/navigation";

const HIDDEN_FOOTER_PREFIXES = ["/about"];

export function ConditionalFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname && HIDDEN_FOOTER_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }
  return <>{children}</>;
}
