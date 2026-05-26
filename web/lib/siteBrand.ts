import type {SiteBrand} from "@/lib/types/project";

export function hasSiteBrandContent(brand?: SiteBrand | null): boolean {
  if (!brand) return false;
  if (brand.mode === "image") return Boolean(brand.image?.asset?._ref || brand.image?.asset?._id);
  return Boolean(brand.text?.trim());
}

/** Work homepage / mobile footer logo — falls back to header logo when unset. */
export function resolveWorkHomeLogo(
  workHome?: SiteBrand | null,
  header?: SiteBrand | null,
): SiteBrand | null {
  if (hasSiteBrandContent(workHome)) return workHome ?? null;
  if (hasSiteBrandContent(header)) return header ?? null;
  return null;
}
