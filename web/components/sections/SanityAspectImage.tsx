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
      className="media-thumb relative w-full overflow-hidden rounded-2xl bg-zinc-200 shadow-sm ring-1 ring-slate-200/60 transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.006] group-hover:shadow-lg active:translate-y-0 active:scale-[0.997]"
      style={aspectBoxStyle(image)}
    >
      <Image src={src} alt={alt} fill className="object-contain" sizes={sizes} />
    </div>
  );
}
