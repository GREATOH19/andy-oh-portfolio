import Image from "next/image";
import Link from "next/link";
import { cmsBrandTextClass } from "@/lib/cmsFontClass";
import { urlForImage } from "@/lib/sanity/image";
import {sanityImageObjectPosition} from "@/lib/sanity/imagePosition";
import {workHomeBannerImageUrl} from "@/lib/sanity/workHomeBannerImage";
import type {BannerFocus, SiteBrand} from "@/lib/types/project";

const defaultText = "Andy Oh";

function shouldUseImage(brand: SiteBrand | null | undefined): brand is SiteBrand & {image: NonNullable<SiteBrand["image"]>} {
  if (!brand?.image?.asset) return false;
  return brand.mode === "image";
}

export function BrandMark({
  brand,
  variant = "header",
  linkable = true,
}: {
  brand?: SiteBrand | null;
  variant?: "header" | "footer" | "workHome";
  /** When false, render logo without a link (e.g. Work homepage fold). */
  linkable?: boolean;
}) {
  const text = brand?.text?.trim() || defaultText;
  const alt = brand?.alt?.trim() || text;
  const fontClass = cmsBrandTextClass(brand);

  const textClassName =
    variant === "header"
      ? `${fontClass} text-[1.6875rem] leading-tight tracking-tight`
      : variant === "workHome"
        ? `${fontClass} work-home-logo__text leading-[0.95] tracking-tight`
        : `${fontClass} text-4xl leading-[1.08] tracking-tight sm:text-5xl md:text-6xl`;

  const wrapperClassName =
    variant === "header"
      ? "inline-flex max-w-[min(100%,20rem)] items-center text-foreground transition-opacity hover:opacity-70"
      : variant === "workHome"
        ? "work-home-logo__wrapper relative block h-full w-full min-h-0 min-w-0 text-foreground"
        : "inline-flex max-w-[min(100%,min(92vw,32rem))] items-center justify-center text-foreground transition-opacity hover:opacity-70";

  const pixelH = variant === "header" ? 88 : 150;
  const imageWidth = variant === "header" ? 280 : 480;
  const imageHeight = variant === "header" ? 44 : 100;
  const imageClassName =
    variant === "header"
      ? "h-11 w-auto max-w-[280px] object-contain object-left"
      : "h-20 w-auto max-w-[min(92vw,480px)] object-contain object-center sm:h-24 md:h-28";
  const imageSizes = variant === "header" ? "280px" : "(max-width: 768px) 92vw, 480px";

  const wrap = (children: React.ReactNode) =>
    linkable ? (
      <Link href="/" className={wrapperClassName}>
        {children}
      </Link>
    ) : (
      <span className={wrapperClassName}>{children}</span>
    );

  if (shouldUseImage(brand)) {
    if (variant === "workHome") {
      const focus = (brand.bannerFocus ?? "auto") as BannerFocus;
      const objectPosition = sanityImageObjectPosition(brand.image, focus);
      const src = workHomeBannerImageUrl(brand.image);
      const dims = brand.image.asset?.metadata?.dimensions;
      const intrinsicW = dims?.width ?? 1600;
      const intrinsicH = dims?.height ?? 500;

      return wrap(
        <Image
          src={src}
          alt={alt}
          width={intrinsicW}
          height={intrinsicH}
          unoptimized
          className="work-home-logo__image"
          style={{objectPosition}}
          sizes="(max-width: 767px) 360px, 100vw"
          priority
        />,
      );
    }

    const src = urlForImage(brand.image).height(pixelH).fit("max").auto("format").url();

    return wrap(
      <Image
        src={src}
        alt={alt}
        width={imageWidth}
        height={imageHeight}
        className={imageClassName}
        sizes={imageSizes}
        priority={variant === "header"}
      />,
    );
  }

  return wrap(<span className={textClassName}>{text}</span>);
}
