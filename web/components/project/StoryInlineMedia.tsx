"use client";

import {SanityAspectMedia} from "@/components/sections/SanityAspectMedia";
import {useTypoClass} from "@/components/TypographyProvider";
import {imageSectionMedia} from "@/lib/sanity/imageSectionMedia";
import {
  projectStoryLayoutClasses,
  type ProjectStoryLayoutOptions,
} from "@/lib/projectStory/layout";
import type {CmsMediaItemRaw, GridMediaCropFields} from "@/lib/types/project";

type InlineMediaValue = ProjectStoryLayoutOptions & GridMediaCropFields & {
  media?: CmsMediaItemRaw;
  caption?: string | null;
};

export function StoryInlineMedia({value}: {value: InlineMediaValue}) {
  const metaClass = useTypoClass("meta");
  const items = imageSectionMedia({item: value.media});
  const media = items[0];
  if (!media) return null;

  const {wrapper} = projectStoryLayoutClasses(value);
  const alt = value.caption ?? ("alt" in media ? media.alt : "") ?? "";

  return (
    <figure className={`${wrapper} m-0`}>
      <SanityAspectMedia
        media={media}
        alt={alt}
        maxWidth={1400}
        quality={90}
        sizes="(max-width: 768px) 100vw, min(1400px, 90vw)"
        gridAspectRatio={value.gridAspectRatio}
        cropFocus={value.cropFocus}
      />
      {value.caption ? (
        <figcaption className={`mt-2 text-sm text-zinc-500 ${metaClass}`}>{value.caption}</figcaption>
      ) : null}
    </figure>
  );
}
