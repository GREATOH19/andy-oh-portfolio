"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Clears inline overflow locks on route changes. Home intro uses body overflow;
 * if a transition unmounts before cleanup runs, navigation can leave the document stuck.
 */
export function DocumentOverflowReset() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("overflow");
  }, [pathname]);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
