import type { SiteBrandFont, SiteTypography, TypographyRole } from "@/lib/types/project";

/** Mirrors CMS `CMS_FONT_OPTIONS` / Sanity `brand.font` */
export const CMS_FONT_CLASSES: Record<SiteBrandFont, string> = {
  serif: "font-serif",
  sans: "font-sans",
  mono: "font-mono",
  dmSans: "font-brand-dm",
  instrument: "font-brand-instrument",
  pinyon: "font-brand-pinyon",
  gloock: "font-brand-gloock",
};

/** Optional CMS font: returns a Tailwind class, or "" to inherit layout defaults */
export function cmsFontClass(font?: string | null): string {
  if (!font || !(font in CMS_FONT_CLASSES)) return "";
  return CMS_FONT_CLASSES[font as SiteBrandFont];
}

/** When no CMS value, use this fallback (e.g. logo defaults to serif) */
export function cmsFontClassOrDefault(font?: string | null, fallback: SiteBrandFont = "serif"): string {
  return cmsFontClass(font) || CMS_FONT_CLASSES[fallback];
}

/** Project / rich-text headings that default to the `magazine-serif` utility */
export function cmsMagazineOrFont(font?: string | null): string {
  return cmsFontClass(font) || "magazine-serif";
}

/** Site-wide typography role → Tailwind class (with built-in defaults when CMS value is empty) */
export function typoRoleClass(role: TypographyRole, typography?: SiteTypography | null): string {
  const font = typography?.[role];
  switch (role) {
    case "display":
      return cmsMagazineOrFont(font);
    case "heading":
      return cmsFontClass(font) || "font-serif";
    case "body":
      return cmsFontClass(font);
    case "meta":
      return cmsFontClass(font);
    default:
      return "";
  }
}
