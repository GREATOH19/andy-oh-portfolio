"use client";

import {GallerySection} from "@/components/sections/GallerySection";
import {ImageSection} from "@/components/sections/ImageSection";
import {QuoteSection} from "@/components/sections/QuoteSection";
import {RichTextSection} from "@/components/sections/RichTextSection";
import type {ProjectStoryBlock} from "@/lib/types/project";

export function ProjectStory({blocks}: {blocks: ProjectStoryBlock[]}) {
  return (
    <div className="project-story mt-20 space-y-16 md:mt-24 md:space-y-24">
      {blocks.map((block, idx) => {
        const key = `${block._type}-${idx}`;

        switch (block._type) {
          case "projectChapter":
            return (
              <div key={key} className="mx-auto max-w-3xl">
                <RichTextSection title={block.title} body={block.body} />
              </div>
            );
          case "projectMedia":
            return (
              <div key={key} className="w-full">
                <ImageSection item={block.media} caption={block.caption} />
              </div>
            );
          case "projectGallery":
            return (
              <div key={key} className="w-full">
                <GallerySection
                  images={block.images}
                  caption={block.caption}
                  columns={block.columns}
                />
              </div>
            );
          case "projectQuote":
            return (
              <div key={key} className="mx-auto max-w-3xl py-2 md:py-4">
                <QuoteSection quote={block.quote} attribution={block.attribution} />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
