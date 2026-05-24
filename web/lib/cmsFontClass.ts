import type {
  SiteBrand,
  SiteBrandFont,
  SiteFontWeight,
  SiteTypography,
  TypographyRole,
} from "@/lib/types/project";

/** Mirrors CMS `CMS_FONT_OPTIONS` / Sanity `brand.font` */
export const CMS_FONT_CLASSES: Record<SiteBrandFont, string> = {
  serif: "font-serif",
  sans: "font-sans",
  mono: "font-mono",
  dmSans: "font-brand-dm",
  instrument: "font-brand-instrument",
  pinyon: "font-brand-pinyon",
  gloock: "font-brand-gloock",
  spaceGrotesk: "font-brand-space-grotesk",
};

/** Mirrors CMS `CMS_FONT_WEIGHT_OPTIONS` */
export const CMS_FONT_WEIGHT_CLASSES: Record<SiteFontWeight, string> = {
  "100": "font-thin",
  "200": "font-extralight",
  "300": "font-light",
  "400": "font-normal",
  "500": "font-medium",
  "600": "font-semibold",
  "700": "font-bold",
  "800": "font-extrabold",
  "900": "font-black",
};

const ROLE_WEIGHT_KEY = {
  display: "displayWeight",
  heading: "headingWeight",
  body: "bodyWeight",
  meta: "metaWeight",
} as const satisfies Record<TypographyRole, keyof SiteTypography>;

const DEFAULT_ROLE_WEIGHT: Record<TypographyRole, SiteFontWeight> = {
  display: "300",
  heading: "500",
  body: "400",
  meta: "500",
};

/** Optional CMS font: returns a Tailwind class, or "" to inherit layout defaults */
export function cmsFontClass(font?: string | null): string {
  if (!font || !(font in CMS_FONT_CLASSES)) return "";
  return CMS_FONT_CLASSES[font as SiteBrandFont];
}

/** Optional CMS weight: returns a Tailwind class, or "" when invalid */
export function cmsFontWeightClass(weight?: string | null): string {
  if (!weight || !(weight in CMS_FONT_WEIGHT_CLASSES)) return "";
  return CMS_FONT_WEIGHT_CLASSES[weight as SiteFontWeight];
}

/** When no CMS value, use this fallback (e.g. logo defaults to serif) */
export function cmsFontClassOrDefault(font?: string | null, fallback: SiteBrandFont = "serif"): string {
  return cmsFontClass(font) || CMS_FONT_CLASSES[fallback];
}

/** Logo text: font + weight (default weight medium) */
export function cmsBrandTextClass(brand?: SiteBrand | null): string {
  const font = cmsFontClassOrDefault(brand?.font, "serif");
  const weight = cmsFontWeightClass(brand?.fontWeight) || CMS_FONT_WEIGHT_CLASSES["500"];
  return `${font} ${weight}`;
}

/** Project / rich-text headings that default to Playfair (font-serif) */
export function cmsMagazineOrFont(font?: string | null): string {
  return cmsFontClass(font) || "font-serif";
}

function typoRoleFontClass(role: TypographyRole, typography?: SiteTypography | null): string {
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

/** Site-wide typography role → weight class (built-in default when CMS value is empty) */
export function typoRoleWeightClass(role: TypographyRole, typography?: SiteTypography | null): string {
  const weight = typography?.[ROLE_WEIGHT_KEY[role]];
  return cmsFontWeightClass(weight) || CMS_FONT_WEIGHT_CLASSES[DEFAULT_ROLE_WEIGHT[role]];
}

/** Site-wide typography role → font + weight Tailwind classes */
export function typoRoleClass(role: TypographyRole, typography?: SiteTypography | null): string {
  return [typoRoleFontClass(role, typography), typoRoleWeightClass(role, typography)].filter(Boolean).join(" ");
}
