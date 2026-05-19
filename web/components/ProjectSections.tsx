import {GallerySection} from "@/components/sections/GallerySection";
import {ImageSection} from "@/components/sections/ImageSection";
import {QuoteSection} from "@/components/sections/QuoteSection";
import {RichTextSection} from "@/components/sections/RichTextSection";
import {TwoColumnSection} from "@/components/sections/TwoColumnSection";
import type {ProjectSection} from "@/lib/types/project";

export function ProjectSections({sections}: {sections: ProjectSection[]}) {
  return (
    <div className="space-y-14">
      {sections.map((section, idx) => {
        const key = `${section._type}-${idx}`;
        switch (section._type) {
          case "richTextSection":
            return <RichTextSection key={key} title={section.title} body={section.body} />;
          case "imageSection":
            return <ImageSection key={key} image={section.image} caption={section.caption} />;
          case "gallerySection":
            return (
              <GallerySection
                key={key}
                images={section.images}
                caption={section.caption}
                columns={section.columns}
              />
            );
          case "twoColumnSection":
            return <TwoColumnSection key={key} left={section.left} right={section.right} />;
          case "quoteSection":
            return (
              <QuoteSection key={key} quote={section.quote} attribution={section.attribution} />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
