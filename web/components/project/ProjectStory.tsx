"use client";

import {PortableBody} from "@/components/PortableBody";
import {GallerySection} from "@/components/sections/GallerySection";
import {ImageSection} from "@/components/sections/ImageSection";
import {QuoteSection} from "@/components/sections/QuoteSection";
import {RichTextSection} from "@/components/sections/RichTextSection";
import {useTypoClass} from "@/components/TypographyProvider";
import type {ProjectStoryBlock} from "@/lib/types/project";

function chapterAnchorId(block: { _key?: string }, idx: number) {
  return `chapter-${block._key ?? idx + 1}`;
}

export function ProjectStory({blocks}: {blocks: ProjectStoryBlock[]}) {
  const bodyClass = useTypoClass("body");

  return (
    <div className="project-story space-y-16 md:space-y-24">
      {blocks.map((block, idx) => {
        const key = `${block._type}-${idx}`;

        switch (block._type) {
          case "projectChapter":
            return (
              <div key={key} className="w-full">
                <RichTextSection
                  title={block.title}
                  tocTitle={block.tocTitle}
                  body={block.body}
                  anchorId={chapterAnchorId(block, idx)}
                  titleFont={block.titleFont}
                  titleSize={block.titleSize}
                />
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
              <div key={key} className="w-full py-2 md:py-4">
                <QuoteSection quote={block.quote} attribution={block.attribution} />
              </div>
            );
          case "projectZigzagRow": {
            const hasText = Boolean(block.body?.length);
            const hasMedia = Boolean(block.media);
            if (!hasText && !hasMedia) return null;

            const zigzagRowIndex = blocks
              .slice(0, idx)
              .reduce((count, b) => count + (b._type === "projectZigzagRow" ? 1 : 0), 0);

            const layout = block.layout ?? "auto";
            const isAuto = layout === "auto";
            const isTextLeft = layout === "textLeft" || (isAuto && zigzagRowIndex % 2 === 0);

            return (
              <section
                key={key}
                className="grid items-start gap-10 md:grid-cols-2 md:gap-12"
              >
                <div className={isTextLeft ? "md:order-1" : "md:order-2"}>
                  {hasText ? <PortableBody value={block.body ?? undefined} className={bodyClass} /> : null}
                </div>
                <div className={isTextLeft ? "md:order-2" : "md:order-1"}>
                  {hasMedia ? <ImageSection item={block.media} caption={block.caption} /> : null}
                </div>
              </section>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
