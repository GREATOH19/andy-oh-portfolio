"use client";

import type {CSSProperties, ReactNode} from "react";
import {
  STORY_CHAPTER_GAP_ATTR,
  STORY_CHAPTER_GAP_CLASS,
  STORY_CHAPTER_UNIT_CLASS,
  STORY_CHAPTER_UNIT_MOBILE_REORDER_CLASS,
  STORY_ZIGZAG_BODY_IMAGES_CLASS,
  STORY_ZIGZAG_BODY_IMAGES_CAPTION_ROW_CLASS,
  STORY_ZIGZAG_BODY_IMAGES_END_CLASS,
  STORY_ZIGZAG_CENTER_TEXT_CLASS,
  STORY_ZIGZAG_MEDIA_CAPTION_CLASS,
  STORY_ZIGZAG_MEDIA_MAIN_CLASS,
  STORY_ZIGZAG_TEXT_BODY_CLASS,
  STORY_ZIGZAG_TEXT_COL_CLASS,
} from "@/lib/projectStory/storySpacingGrammar";
import {PROJECT_STORY_SPACING_CSS} from "@/lib/projectStory/storySpacingRules";
import {PortableBody} from "@/components/PortableBody";
import {
  projectBodyProseFontClass,
  projectBodyProseStyle,
} from "@/lib/portableText/bodyTypography";
import {GallerySection} from "@/components/sections/GallerySection";
import {ImageSection} from "@/components/sections/ImageSection";
import {MediaCarousel} from "@/components/MediaCarousel";
import {zigzagRowMedia} from "@/lib/sanity/zigzagRowMedia";
import {QuoteSection} from "@/components/sections/QuoteSection";
import {RichTextSection} from "@/components/sections/RichTextSection";
import {ProjectColumnsSection} from "@/components/project/ProjectColumnsSection";
import {ProjectInstagramFeed} from "@/components/project/ProjectInstagramFeed";
import {ProjectAudioSection} from "@/components/project/ProjectAudioSection";
import {ProjectYoutubeEmbed} from "@/components/project/ProjectYoutubeEmbed";
import {ProjectPhotoCollageSection} from "@/components/project/ProjectPhotoCollageSection";
import {ProjectProcessSection} from "@/components/project/ProjectProcessSection";
import {StoryBlockLayout} from "@/components/project/StoryBlockLayout";
import {
  galleryColumnWidthClass,
  gallerySupportsSideText,
  galleryTextIsLeft,
  mobileOnlyStackOrderClass,
} from "@/lib/projectStory/gallerySideLayout";
import {storyUsesMobileCarousel} from "@/lib/projectStory/layout";
import {useTypoClass} from "@/components/TypographyProvider";
import {portableTextHasVisibleContent} from "@/lib/portableText/filterEmptyBlocks";
import {
  buildStoryRenderUnits,
  buildStorySegments,
  mobileBlockOrderClass,
  type StorySegment,
  zigzagBodyImagesEndGridClasses,
  zigzagMobileOrderClasses,
} from "@/lib/projectStory/chapterGroups";
import type {
  ProjectChapterMobileBlockOrder,
  ProjectStoryBlock,
  ProjectStoryLayoutFields,
} from "@/lib/types/project";

function chapterAnchorId(block: {_key?: string}, idx: number) {
  return `chapter-${block._key ?? idx + 1}`;
}

type StoryBlockType = ProjectStoryBlock["_type"];

function storyLayoutFromBlock(block: ProjectStoryLayoutFields) {
  return {
    mediaWidth: block.mediaWidth,
    mediaAlign: block.mediaAlign,
    mobileCarousel: block.mobileCarousel,
  };
}

function storyBlockUsesMobileEdge(block: ProjectStoryBlock): boolean {
  if (
    block._type !== "projectMedia" &&
    block._type !== "projectGallery" &&
    block._type !== "projectPhotoCollage" &&
    block._type !== "projectProcess" &&
    block._type !== "projectYoutube"
  ) {
    return false;
  }
  const width = block.mediaWidth ?? "full";
  return width === "full" || width === "bleed";
}

function storyBlockWrapperClass(
  block: ProjectStoryBlock,
  spacingClass: string,
  mobileOrderClass: string,
): string {
  return [
    "w-full",
    spacingClass,
    mobileOrderClass,
    storyBlockUsesMobileEdge(block) ? "project-story-block--mobile-edge" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Spacing for pre-chapter solo blocks only (between-chapter blocks use flex gap on wrapper). */
function storyBlockSpacing(type: StoryBlockType, prevType: StoryBlockType | null) {
  if (!prevType || type === "projectChapter") return "";
  return "story-spacing-between-chapters";
}

type RenderContext = {
  blocks: ProjectStoryBlock[];
  bodyClass: string;
  metaClass: string;
  prevType: StoryBlockType | null;
  mobileBlockOrder: ProjectChapterMobileBlockOrder;
  deferChapterBody: boolean;
  insideChapterHead: boolean;
  insideBetweenChapters: boolean;
};

function resolveSpacingClass(
  block: ProjectStoryBlock,
  prevType: StoryBlockType | null,
  ctx: Pick<RenderContext, "insideChapterHead" | "insideBetweenChapters">,
): string {
  if (ctx.insideChapterHead || ctx.insideBetweenChapters) return "";
  return storyBlockSpacing(block._type, prevType);
}

function renderStoryBlock(ctx: RenderContext, idx: number): ReactNode {
  const {
    blocks,
    bodyClass,
    metaClass,
    prevType,
    mobileBlockOrder,
    deferChapterBody,
    insideChapterHead,
    insideBetweenChapters,
  } = ctx;
  const block = blocks[idx];
  const key = `${block._type}-${idx}`;
  const spacingClass = resolveSpacingClass(block, prevType, {
    insideChapterHead,
    insideBetweenChapters,
  });
  const mobileOrderClass =
    mobileBlockOrder === "default"
      ? ""
      : mobileBlockOrderClass(block, mobileBlockOrder);

  switch (block._type) {
    case "projectChapter": {
      const tocMarkerOnly =
        !block.title?.trim() &&
        !portableTextHasVisibleContent(block.body) &&
        Boolean(block.tocTitle?.trim());
      const hasBody = portableTextHasVisibleContent(block.body);

      if (deferChapterBody) {
        return (
          <div key={key} className="contents">
            <div
              className={[
                "w-full",
                tocMarkerOnly ? "" : spacingClass,
                "max-md:order-1",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <RichTextSection
                title={block.title}
                tocTitle={block.tocTitle}
                anchorId={chapterAnchorId(block, idx)}
                titleFont={block.titleFont}
                titleSize={block.titleSize}
                textAlign={block.textAlign}
                spacing="story"
                part="title"
              />
            </div>
            {hasBody ? (
              <div className="w-full max-md:order-3">
                <RichTextSection
                  body={block.body}
                  textAlign={block.textAlign}
                  bodyFont={block.bodyFont}
                  bodyFontSize={block.bodyFontSize}
                  spacing="story"
                  part="body"
                />
              </div>
            ) : null}
          </div>
        );
      }

      return (
        <div
          key={key}
          className={`w-full ${tocMarkerOnly ? "" : spacingClass}`.trim()}
        >
          <RichTextSection
            title={block.title}
            tocTitle={block.tocTitle}
            body={block.body}
            anchorId={chapterAnchorId(block, idx)}
            titleFont={block.titleFont}
            titleSize={block.titleSize}
            textAlign={block.textAlign}
            bodyFont={block.bodyFont}
            bodyFontSize={block.bodyFontSize}
            spacing="story"
          />
        </div>
      );
    }
    case "projectMedia":
      return (
        <div key={key} className={storyBlockWrapperClass(block, spacingClass, mobileOrderClass)}>
          <StoryBlockLayout layout={storyLayoutFromBlock(block)}>
                  <ImageSection
                    item={block.items?.length ? undefined : block.media}
                    media={block.items}
                    caption={block.caption}
                    mediaWidth={block.mediaWidth}
                    storyMobileCarousel={storyUsesMobileCarousel(block.mobileCarousel)}
                    gridAspectRatio={block.gridAspectRatio}
                    cropFocus={block.cropFocus}
                  />
          </StoryBlockLayout>
        </div>
      );
    case "projectGallery": {
      const hasSideText =
        portableTextHasVisibleContent(block.body) &&
        gallerySupportsSideText(block.mediaWidth);

      if (hasSideText) {
        const isTextLeft = galleryTextIsLeft(block.layout, block.mediaAlign);
        const {text: textOrderClass, media: mediaOrderClass} = zigzagMobileOrderClasses(
          block.mobileStackOrder,
          isTextLeft,
        );

        return (
          <div key={key} className={storyBlockWrapperClass(block, spacingClass, mobileOrderClass)}>
            <section
              className={[
                "flex flex-col items-start story-spacing-zigzag",
                isTextLeft ? "md:flex-row" : "md:flex-row-reverse",
              ].join(" ")}
            >
              <div
                className={[mobileOnlyStackOrderClass(textOrderClass), "min-w-0 flex-1"]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div
                  className={[
                    "project-story-prose",
                    projectBodyProseFontClass(block),
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={projectBodyProseStyle(block)}
                >
                  <PortableBody
                    value={block.body ?? undefined}
                    className={bodyClass}
                    bodyFont={block.bodyFont}
                    spacing="story"
                  />
                </div>
              </div>
              <div
                className={[
                  mobileOnlyStackOrderClass(mediaOrderClass),
                  galleryColumnWidthClass(block.mediaWidth),
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <GallerySection
                  images={block.images}
                  caption={block.caption}
                  columns={block.columns}
                  mediaWidth={block.mediaWidth}
                  storyMobileCarousel={storyUsesMobileCarousel(block.mobileCarousel)}
                  gridAspectRatio={block.gridAspectRatio}
                  cropFocus={block.cropFocus}
                />
              </div>
            </section>
          </div>
        );
      }

      return (
        <div key={key} className={storyBlockWrapperClass(block, spacingClass, mobileOrderClass)}>
          <StoryBlockLayout layout={storyLayoutFromBlock(block)}>
            <GallerySection
              images={block.images}
              caption={block.caption}
              columns={block.columns}
              mediaWidth={block.mediaWidth}
              storyMobileCarousel={storyUsesMobileCarousel(block.mobileCarousel)}
              gridAspectRatio={block.gridAspectRatio}
              cropFocus={block.cropFocus}
            />
          </StoryBlockLayout>
        </div>
      );
    }
    case "projectPhotoCollage": {
      if (!block.portrait || !block.strips?.length) return null;
      return (
        <div key={key} className={storyBlockWrapperClass(block, spacingClass, mobileOrderClass)}>
          <StoryBlockLayout layout={storyLayoutFromBlock(block)}>
            <ProjectPhotoCollageSection
              portrait={block.portrait}
              strips={block.strips}
              portraitSide={block.portraitSide}
              caption={block.caption}
              mediaWidth={block.mediaWidth}
              gridAspectRatio={block.gridAspectRatio}
              cropFocus={block.cropFocus}
            />
          </StoryBlockLayout>
        </div>
      );
    }
    case "projectProcess": {
      if (!block.steps?.length) return null;
      return (
        <div key={key} className={storyBlockWrapperClass(block, spacingClass, mobileOrderClass)}>
          <StoryBlockLayout layout={storyLayoutFromBlock(block)}>
            <ProjectProcessSection
              steps={block.steps}
              columns={block.columns}
              caption={block.caption}
              mediaWidth={block.mediaWidth}
              gridAspectRatio={block.gridAspectRatio}
              cropFocus={block.cropFocus}
            />
          </StoryBlockLayout>
        </div>
      );
    }
    case "projectInstagramFeed": {
      if (!block.handle?.trim()) return null;
      return (
        <div key={key} className={`w-full ${spacingClass} ${mobileOrderClass}`.trim()}>
          <ProjectInstagramFeed
            handle={block.handle}
            maxPosts={block.maxPosts}
            columns={block.columns}
            caption={block.caption}
            gridAspectRatio={block.gridAspectRatio}
            cropFocus={block.cropFocus}
          />
        </div>
      );
    }
    case "projectAudio": {
      return (
        <div key={key} className={`w-full ${spacingClass} ${mobileOrderClass}`.trim()}>
          <ProjectAudioSection block={block} />
        </div>
      );
    }
    case "projectYoutube": {
      if (!block.url?.trim()) return null;
      return (
        <div key={key} className={storyBlockWrapperClass(block, spacingClass, mobileOrderClass)}>
          <StoryBlockLayout layout={storyLayoutFromBlock(block)}>
            <ProjectYoutubeEmbed
              url={block.url}
              title={block.title}
              caption={block.caption}
              videoAspect={block.videoAspect}
              mediaAlign={block.mediaAlign}
              gridAspectRatio={block.gridAspectRatio}
              cropFocus={block.cropFocus}
            />
          </StoryBlockLayout>
        </div>
      );
    }
    case "projectColumns":
      return (
        <div key={key} className={`w-full ${spacingClass} ${mobileOrderClass}`.trim()}>
          <ProjectColumnsSection ratio={block.ratio} left={block.left} right={block.right} />
        </div>
      );
    case "projectQuote":
      return (
        <div
          key={key}
          className={`w-full ${spacingClass} ${mobileOrderClass}`.trim()}
        >
          <div className="project-story-prose">
            <QuoteSection quote={block.quote} attribution={block.attribution} />
          </div>
        </div>
      );
    case "projectTextBox": {
      if (!portableTextHasVisibleContent(block.body)) return null;
      return (
        <div key={key} className={`w-full ${spacingClass} ${mobileOrderClass}`.trim()}>
          <RichTextSection
            body={block.body}
            textAlign={block.textAlign}
            bodyFont={block.bodyFont}
            bodyFontSize={block.bodyFontSize}
            spacing="story"
            part="body"
          />
        </div>
      );
    }
    case "projectZigzagRow": {
      const hasText = Boolean(block.body?.length);
      const hasBodyImages = Boolean(block.bodyImages?.length);
      const zigzagMedia = zigzagRowMedia(block);
      const hasMedia = zigzagMedia.length > 0;
      if (!hasText && !hasBodyImages && !hasMedia) return null;

      const zigzagRowIndex = blocks
        .slice(0, idx)
        .reduce((count, b) => count + (b._type === "projectZigzagRow" ? 1 : 0), 0);

      const layout = block.layout ?? "auto";
      const isAuto = layout === "auto";
      const isTextLeft = layout === "textLeft" || (isAuto && zigzagRowIndex % 2 === 0);
      const {text: textOrderClass, media: mediaOrderClass} = zigzagMobileOrderClasses(
        block.mobileStackOrder,
        isTextLeft,
      );
      const bodyImagesEnd = hasBodyImages && hasMedia;
      const bodyImagesEndGrid = bodyImagesEnd
        ? zigzagBodyImagesEndGridClasses(isTextLeft)
        : null;

      const alignClass = block.centerTextWithMedia ? STORY_ZIGZAG_CENTER_TEXT_CLASS : "";
      const bodyImagesEndClass = bodyImagesEnd ? STORY_ZIGZAG_BODY_IMAGES_END_CLASS : "";
      const bodyImagesCaptionRowClass =
        bodyImagesEnd && block.caption ? STORY_ZIGZAG_BODY_IMAGES_CAPTION_ROW_CLASS : "";

      return (
        <section
          key={key}
          className={[
            "grid items-start story-spacing-zigzag md:grid-cols-2",
            bodyImagesEnd ? "md:items-stretch" : "",
            alignClass,
            bodyImagesEndClass,
            bodyImagesCaptionRowClass,
            spacingClass,
            mobileOrderClass,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div
            className={[
              textOrderClass,
              STORY_ZIGZAG_TEXT_COL_CLASS,
              bodyImagesEndGrid?.text,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {hasText ? (
              <div className={bodyImagesEnd ? STORY_ZIGZAG_TEXT_BODY_CLASS : undefined}>
                <div
                  className={[
                    "project-story-prose",
                    projectBodyProseFontClass(block),
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={projectBodyProseStyle(block)}
                >
                  <PortableBody
                    value={block.body ?? undefined}
                    className={bodyClass}
                    bodyFont={block.bodyFont}
                    spacing="story"
                  />
                </div>
              </div>
            ) : null}
            {hasBodyImages ? (
              <div className={STORY_ZIGZAG_BODY_IMAGES_CLASS}>
                <GallerySection
                  images={block.bodyImages}
                  columns={block.bodyImageColumns ?? 3}
                  storyMobileCarousel={false}
                  gridAspectRatio={block.bodyGridAspectRatio}
                  cropFocus={block.bodyCropFocus}
                />
              </div>
            ) : null}
          </div>
          {hasMedia ? (
            <div
              className={[
                mediaOrderClass,
                bodyImagesEnd ? STORY_ZIGZAG_MEDIA_MAIN_CLASS : "",
                bodyImagesEndGrid?.media,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <MediaCarousel
                images={zigzagMedia}
                caption={bodyImagesEnd ? undefined : block.caption}
                gridAspectRatio={block.gridAspectRatio}
                cropFocus={block.cropFocus}
              />
              {bodyImagesEnd && block.caption ? (
                <p className={`mt-3 text-sm text-zinc-500 md:hidden ${metaClass}`}>
                  {block.caption}
                </p>
              ) : null}
            </div>
          ) : null}
          {bodyImagesEnd && block.caption ? (
            <p
              className={[
                STORY_ZIGZAG_MEDIA_CAPTION_CLASS,
                mediaOrderClass,
                bodyImagesEndGrid?.caption,
                "hidden text-sm text-zinc-500 md:block",
                metaClass,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {block.caption}
            </p>
          ) : null}
        </section>
      );
    }
    default:
      return null;
  }
}

function betweenChaptersModifier(
  order: ProjectChapterMobileBlockOrder,
): string {
  if (order === "mediaFirst") return "project-story-between-chapters--media-first";
  if (order === "textFirst") return "project-story-between-chapters--text-first";
  return "";
}

function renderBetweenChapters(
  blocks: ProjectStoryBlock[],
  bodyClass: string,
  metaClass: string,
  segment: Extract<StorySegment, {kind: "betweenChapters"}>,
  prevType: StoryBlockType | null,
): {nodes: ReactNode[]; lastType: StoryBlockType | null} {
  const betweenModifier = betweenChaptersModifier(segment.mobileBlockOrder);
  const betweenWrapperClass = ["project-story-between-chapters", betweenModifier]
    .filter(Boolean)
    .join(" ");
  const betweenNodes: ReactNode[] = [];
  let betweenPrevType: StoryBlockType | null = prevType;

  for (let idx = segment.start; idx < segment.end; idx++) {
    const ctx: RenderContext = {
      blocks,
      bodyClass,
      metaClass,
      prevType: betweenPrevType,
      mobileBlockOrder: segment.mobileBlockOrder,
      deferChapterBody: false,
      insideChapterHead: false,
      insideBetweenChapters: true,
    };
    const node = renderStoryBlock(ctx, idx);
    if (node) betweenNodes.push(node);
    betweenPrevType = blocks[idx]._type;
  }

  if (betweenNodes.length === 0) {
    return {nodes: [], lastType: prevType};
  }

  return {
    nodes: [
      <div key={`between-${segment.start}`} className={betweenWrapperClass}>
        {betweenNodes}
      </div>,
    ],
    lastType: betweenPrevType,
  };
}

export function ProjectStory({blocks}: {blocks: ProjectStoryBlock[]}) {
  const bodyClass = useTypoClass("body");
  const metaClass = useTypoClass("meta");
  const renderUnits = buildStoryRenderUnits(buildStorySegments(blocks));
  const nodes: ReactNode[] = [];
  let prevType: StoryBlockType | null = null;
  let chapterUnitIndex = 0;

  for (const item of renderUnits) {
    if (item.kind === "solo") {
      const ctx: RenderContext = {
        blocks,
        bodyClass,
        metaClass,
        prevType,
        mobileBlockOrder: "default",
        deferChapterBody: false,
        insideChapterHead: false,
        insideBetweenChapters: false,
      };
      const node = renderStoryBlock(ctx, item.index);
      if (node) nodes.push(node);
      prevType = blocks[item.index]._type;
      continue;
    }

    const {head, between} = item.unit;
    const addChapterGap = chapterUnitIndex > 0 || prevType !== null;
    chapterUnitIndex += 1;

    const chapterBlock = blocks[head.index];
    const deferChapterBody =
      head.mobileBlockOrder !== "default" &&
      chapterBlock._type === "projectChapter" &&
      portableTextHasVisibleContent(chapterBlock.body);

    const headCtx: RenderContext = {
      blocks,
      bodyClass,
      metaClass,
      prevType,
      mobileBlockOrder: head.mobileBlockOrder,
      deferChapterBody,
      insideChapterHead: true,
      insideBetweenChapters: false,
    };
    const headNode = renderStoryBlock(headCtx, head.index);

    const betweenResult = between
      ? renderBetweenChapters(blocks, bodyClass, metaClass, between, prevType)
      : {nodes: [], lastType: prevType};

    if (!headNode && betweenResult.nodes.length === 0) continue;

    const unitClass = [
      STORY_CHAPTER_UNIT_CLASS,
      addChapterGap ? STORY_CHAPTER_GAP_CLASS : "",
      deferChapterBody ? STORY_CHAPTER_UNIT_MOBILE_REORDER_CLASS : "",
    ]
      .filter(Boolean)
      .join(" ");
    const chapterGapStyle: CSSProperties | undefined = addChapterGap
      ? {marginTop: "var(--story-chapter-gap)"}
      : undefined;

    nodes.push(
      <div
        key={`chapter-unit-${head.index}`}
        className={unitClass}
        style={chapterGapStyle}
        {...(addChapterGap ? {[STORY_CHAPTER_GAP_ATTR]: ""} : {})}
      >
        {headNode ? (
          <div className="project-story-chapter-head">{headNode}</div>
        ) : null}
        {betweenResult.nodes}
      </div>,
    );

    prevType = betweenResult.lastType ?? chapterBlock._type;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: PROJECT_STORY_SPACING_CSS}} />
      <div className="project-story">{nodes}</div>
    </>
  );
}
