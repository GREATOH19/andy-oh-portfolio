import {BrandMark} from "@/components/BrandMark";
import {hasSiteBrandContent} from "@/lib/siteBrand";
import type {SiteBrand} from "@/lib/types/project";

type WorkHomeLogoProps = {
  /** Work homepage logo from Site Settings → Work homepage logo (not the header). */
  brand?: SiteBrand | null;
};

/**
 * Fold logo slot on Work (/). Renders CMS `workHomeLogo` when set; otherwise leaves
 * `.work-home-logo__slot` empty for a custom asset in this file.
 */
export function WorkHomeLogo({brand}: WorkHomeLogoProps) {
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
