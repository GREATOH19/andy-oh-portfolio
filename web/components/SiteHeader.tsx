"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { MoreNavLink } from "@/components/MoreNavLink";
import type { MoreNavItem } from "@/lib/more/nav";
import type { SiteBrand } from "@/lib/types/project";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/", label: "Work" },
] as const;

const SCROLL_THRESHOLD_PX = 16;

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
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const showScrolledHeader = isScrolled && !isHome;

  useLayoutEffect(() => {
    const update = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 relative flex h-[var(--site-header-height)] shrink-0 overflow-visible",
        "transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-out",
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
