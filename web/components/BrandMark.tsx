import Image from "next/image";
import Link from "next/link";
import { cmsFontClassOrDefault } from "@/lib/cmsFontClass";
import { urlForImage } from "@/lib/sanity/image";
import type { SiteBrand } from "@/lib/types/project";

const defaultText = "Andy Oh";

function shouldUseImage(brand: SiteBrand | null | undefined): brand is SiteBrand & {image: NonNullable<SiteBrand["image"]>} {
  if (!brand?.image?.asset) return false;
  return brand.mode === "image";
}

export function BrandMark({
  brand,
  variant = "header",
}: {
  brand?: SiteBrand | null;
  variant?: "header" | "footer";
}) {
  const text = brand?.text?.trim() || defaultText;
  const alt = brand?.alt?.trim() || text;
  const fontClass = cmsFontClassOrDefault(brand?.font, "serif");

  const textClassName =
    variant === "header"
      ? `${fontClass} text-[1.6875rem] leading-tight tracking-tight`
      : `${fontClass} text-4xl leading-[1.08] tracking-tight text-slate-950 sm:text-5xl md:text-6xl`;

  const linkClassName =
    variant === "header"
      ? "inline-flex max-w-[min(100%,20rem)] items-center text-foreground transition-opacity hover:opacity-70"
      : "inline-flex max-w-[min(100%,min(92vw,32rem))] items-center justify-center text-slate-950 transition-opacity hover:opacity-70";

  if (shouldUseImage(brand)) {
    const pixelH = variant === "header" ? 88 : 150;
    const src = urlForImage(brand.image).height(pixelH).fit("max").auto("format").url();

    return (
      <Link href="/" className={linkClassName}>
        <Image
          src={src}
          alt={alt}
          width={variant === "header" ? 280 : 480}
          height={variant === "header" ? 44 : 100}
          className={
            variant === "header"
              ? "h-11 w-auto max-w-[280px] object-contain object-left"
              : "h-20 w-auto max-w-[min(92vw,480px)] object-contain object-center sm:h-24 md:h-28"
          }
          sizes={variant === "header" ? "280px" : "(max-width: 768px) 92vw, 480px"}
          priority={variant === "header"}
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={linkClassName}>
      <span className={textClassName}>{text}</span>
    </Link>
  );
}
