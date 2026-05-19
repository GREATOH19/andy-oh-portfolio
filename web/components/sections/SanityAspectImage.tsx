import Image from "next/image";
import {aspectBoxStyle} from "@/lib/imageAspect";
import {sanityImageAssetId, urlForImage} from "@/lib/sanity/image";
import type {SanityImageField} from "@/lib/types/project";

export function SanityAspectImage({
  image,
  alt,
  maxWidth,
  quality = 88,
  sizes,
}: {
  image: SanityImageField;
  alt: string;
  maxWidth: number;
  quality?: number;
  sizes: string;
}) {
  if (image == null || !sanityImageAssetId(image)) return null;
  const src = urlForImage(image).width(maxWidth).quality(quality).url();

  return (
    <div
      className="relative w-full overflow-hidden rounded-[2px] bg-zinc-200"
      style={aspectBoxStyle(image)}
    >
      <Image src={src} alt={alt} fill className="object-contain" sizes={sizes} />
    </div>
  );
}
