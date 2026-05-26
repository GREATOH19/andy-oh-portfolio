import type {SiteBrand} from "@/lib/types/project";

export function hasSiteBrandContent(brand?: SiteBrand | null): boolean {
  if (!brand) return false;
  if (brand.mode === "image") return Boolean(brand.image?.asset?._ref || brand.image?.asset?._id);
  return Boolean(brand.text?.trim());
}
