"use client";

import Link from "next/link";
import type {MoreNavItem} from "@/lib/more/nav";

export function MoreNavLink({
  href,
  label,
  dropdownItems,
}: {
  href: string;
  label: string;
  dropdownItems: MoreNavItem[];
}) {
  return (
    <>
      <Link href={href} className="nav-link md:hidden">
        {label}
      </Link>

      <div className="relative hidden md:block group/more">
        <Link href={href} className="nav-link" aria-haspopup={dropdownItems.length > 0 ? "menu" : undefined}>
          {label}
        </Link>

        {dropdownItems.length > 0 ? (
          <div
            className="invisible absolute right-0 top-full z-50 min-w-[12rem] pt-2 opacity-0 transition-[opacity,visibility] duration-200 group-hover/more:visible group-hover/more:opacity-100 group-focus-within/more:visible group-focus-within/more:opacity-100"
            role="menu"
            aria-label={`${label} pages`}
          >
            <ul className="overflow-hidden rounded-sm border border-slate-100/90 bg-[rgba(234,252,255,0.94)] py-1 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-md">
              {dropdownItems.map((item) => (
                <li key={item.href} role="none">
                  <Link
                    href={item.href}
                    role="menuitem"
                    className="block px-4 py-2.5 text-xs uppercase tracking-widest text-muted transition-colors hover:bg-white/70 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </>
  );
}
