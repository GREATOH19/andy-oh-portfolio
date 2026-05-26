"use client";

import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { PortableBody } from "@/components/PortableBody";
import { useTypoClass } from "@/components/TypographyProvider";
import { CONTACT_ICON_MAP } from "@/lib/contactIcons";
import { hasSiteBrandContent, resolveWorkHomeLogo } from "@/lib/siteBrand";
import type { ContactChannel, SiteBrand } from "@/lib/types/project";
import type { PortableTextBlock } from "@portabletext/types";

type ContactLink = { label: string; href: string };

export function ContactFooter({
  links = [],
  brand = null,
  workHomeLogo = null,
  channels = [],
  footerBody,
}: {
  links?: ContactLink[] | null;
  /** Header logo — desktop footer. */
  brand?: SiteBrand | null;
  /** Work homepage banner logo — mobile footer (falls back to header logo). */
  workHomeLogo?: SiteBrand | null;
  /** Same `channels` as Contact page — bottom icon row */
  channels?: ContactChannel[] | null;
  footerBody?: PortableTextBlock[] | null;
}) {
  const metaClass = useTypoClass("meta");
  const safeLinks = links ?? [];
  const safeChannels = channels ?? [];
  const mobileFooterBrand = resolveWorkHomeLogo(workHomeLogo, brand);

  return (
    <footer className="relative z-[1] mt-auto border-t border-slate-100 py-14">
      <div className="container-wide flex flex-col items-center text-center">
        <div className="hidden w-full justify-center border-b border-slate-100 pb-4 pt-2 md:flex">
          <BrandMark brand={brand} variant="footer" />
        </div>

        {hasSiteBrandContent(mobileFooterBrand) ? (
          <div className="footer-work-home-logo flex w-full flex-col items-center justify-center border-b border-slate-100 pb-6 pt-4 md:hidden">
            <BrandMark brand={mobileFooterBrand} variant="workHome" linkable={false} />
          </div>
        ) : null}

        {footerBody?.length ? (
          <div className={`mx-auto w-full max-w-2xl px-4 pt-4 text-center ${metaClass}`}>
            <PortableBody value={footerBody} muted />
          </div>
        ) : null}

        {safeChannels.length > 0 ? (
          <nav
            className="flex w-full flex-wrap items-center justify-center gap-4 pt-12 sm:gap-6"
            aria-label="Social links"
          >
            {safeChannels.map((ch, i) => {
              const Icon = CONTACT_ICON_MAP[ch.icon];
              const isExternal = !ch.href.startsWith("mailto:") && !ch.href.startsWith("tel:");
              return (
                <a
                  key={`${ch.href}-${ch.label}-${i}`}
                  href={ch.href}
                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900"
                  aria-label={ch.label}
                  title={ch.label}
                >
                  {Icon ? <Icon className="h-5 w-5" /> : null}
                </a>
              );
            })}
          </nav>
        ) : safeLinks.length > 0 ? (
          <nav className={`flex w-full flex-wrap justify-center gap-x-8 gap-y-3 pt-12 text-sm uppercase tracking-[0.2em] text-slate-400 ${metaClass}`}>
            {safeLinks.map((l) => {
              const isExternal =
                /^https?:\/\//.test(l.href) || /^mailto:/.test(l.href) || /^tel:/.test(l.href);
              return isExternal ? (
                <a
                  key={`${l.href}-${l.label}`}
                  href={l.href}
                  target={/^https?:\/\//.test(l.href) ? "_blank" : undefined}
                  rel={/^https?:\/\//.test(l.href) ? "noopener noreferrer" : undefined}
                  className="transition-colors hover:text-slate-500"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={`${l.href}-${l.label}`}
                  href={l.href}
                  className="transition-colors hover:text-slate-500"
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </div>
    </footer>
  );
}
