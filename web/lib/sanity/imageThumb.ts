import type {SanityImageField} from "@/lib/types/project";

export function sanityImageHasTransparency(image: SanityImageField | null | undefined): boolean {
  const metadata = image?.asset?.metadata;
  if (!metadata) return false;
  if (typeof metadata.isOpaque === "boolean") return !metadata.isOpaque;
  return metadata.hasAlpha === true;
}

export const imageThumbFramedClass =
  "bg-zinc-200 shadow-sm ring-1 ring-slate-200/60 rounded-2xl group-hover:shadow-lg";

export const imageThumbFramelessClass =
  "bg-transparent shadow-none ring-0 rounded-none group-hover:shadow-none";

export function imageThumbFrameClass(image: SanityImageField | null | undefined, fillFrame: boolean): string {
  if (fillFrame) return "h-full rounded-none shadow-none ring-0";
  return sanityImageHasTransparency(image) ? imageThumbFramelessClass : imageThumbFramedClass;
}
