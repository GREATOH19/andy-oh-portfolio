"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { MoreNavLink } from "@/components/MoreNavLink";
import type { MoreNavItem } from "@/lib/more/nav";
import type { SiteBrand } from "@/lib/types/project";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/", label: "Work" },
] as const;

const SCROLL_THRESHOLD_PX = 16;
const SCROLL_DIRECTION_DELTA_PX = 8;

function isProjectDetailPath(pathname: string): boolean {
  return pathname.startsWith("/projects/") && pathname.length > "/projects/".length;
}

function setChromeHiddenAttr(hidden: boolean) {
  document.documentElement.toggleAttribute("data-chrome-hidden", hidden);
}

export function SiteHeader({
  brand,
  moreNavDropdownItems = [],
  moreNavLabel = "More",
}: {
  brand?: SiteBrand | null;
  moreNavDropdownItems?: MoreNavItem[];
  moreNavLabel?: string;
}) {
  const pathname = usePathname();
  const isProjectPage = isProjectDetailPath(pathname);
  const [isScrolled, setIsScrolled] = useState(false);
  const [chromeHidden, setChromeHidden] = useState(false);
  const hiddenRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const showScrolledHeader = isScrolled;

  useLayoutEffect(() => {
    const update = () => {
      const y = window.scrollY;
      setIsScrolled(y > SCROLL_THRESHOLD_PX);
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      if (!isProjectPage) {
        if (hiddenRef.current) {
          hiddenRef.current = false;
          setChromeHidden(false);
          setChromeHiddenAttr(false);
        }
        lastScrollYRef.current = y;
        return;
      }

      const delta = y - lastScrollYRef.current;
      let nextHidden = hiddenRef.current;

      if (y <= SCROLL_THRESHOLD_PX) {
        nextHidden = false;
      } else if (!isMobile && delta > SCROLL_DIRECTION_DELTA_PX) {
        nextHidden = true;
      }

      if (nextHidden !== hiddenRef.current) {
        hiddenRef.current = nextHidden;
        setChromeHidden(nextHidden);
        setChromeHiddenAttr(nextHidden);
      }

      if (isMobile && hiddenRef.current) {
        hiddenRef.current = false;
        setChromeHidden(false);
        setChromeHiddenAttr(false);
      }

      lastScrollYRef.current = y;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      setChromeHiddenAttr(false);
    };
  }, [isProjectPage]);

  return (
    <header
      className={[
        "sticky top-0 z-50 flex h-[var(--site-header-height)] shrink-0 overflow-visible",
        "transition-[transform,background-color,box-shadow,backdrop-filter] duration-300 ease-out",
        isProjectPage && chromeHidden ? "-translate-y-full" : "translate-y-0",
        showScrolledHeader
          ? "bg-[rgba(234,252,255,0.58)] backdrop-blur-md shadow-[inset_0_-1px_0_rgba(17,17,17,0.06)]"
          : "bg-transparent shadow-none",
      ].join(" ")}
    >
      <div className="layout-chrome relative z-10 mx-auto flex h-full w-full max-w-[1370px] items-center justify-between overflow-visible px-8 md:px-17 lg:px-25">
        <BrandMark brand={brand} variant="header" />

        <nav className="flex items-center gap-6 md:gap-10">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
          <MoreNavLink href="/more" label={moreNavLabel} dropdownItems={moreNavDropdownItems} />
        </nav>
      </div>
    </header>
  );
}
