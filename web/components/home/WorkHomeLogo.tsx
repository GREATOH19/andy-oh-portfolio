import {BrandMark} from "@/components/BrandMark";
import {hasSiteBrandContent, resolveWorkHomeLogo} from "@/lib/siteBrand";
import type {SiteBrand} from "@/lib/types/project";

type WorkHomeLogoProps = {
  /** Site Settings → Work homepage logo (banner). */
  workHomeLogo?: SiteBrand | null;
  /** Site Settings → Header logo (fallback when banner logo unset). */
  headerBrand?: SiteBrand | null;
};

/** Desktop fold banner — `workHomeLogo`, else header logo. */
export function WorkHomeLogo({workHomeLogo, headerBrand}: WorkHomeLogoProps) {
  const brand = resolveWorkHomeLogo(workHomeLogo, headerBrand);

  return (
    <div className="work-home-logo hidden md:flex" aria-label="Studio logo">
      <div className="work-home-logo__slot">
        {hasSiteBrandContent(brand) ? (
          <BrandMark brand={brand} variant="workHome" linkable={false} />
        ) : null}
      </div>
    </div>
  );
}
