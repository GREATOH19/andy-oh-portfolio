import type {PortableTextBlock} from "@portabletext/types";
import type {GridAspectRatio, GridCropFocus} from "@/lib/gridAspectRatio";

/** CMS typography options — keep in sync with `schemaTypes/fontStyle.js` */
export type SiteBrandFont =
  | "serif"
  | "sans"
  | "mono"
  | "dmSans"
  | "instrument"
  | "pinyon"
  | "gloock"
  | "spaceGrotesk";

export type TypographyRole = "display" | "heading" | "body" | "meta";

/** CMS font weight options — keep in sync with `schemaTypes/fontStyle.js` */
export type SiteFontWeight = "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";

export type SiteTypography = {
  display?: SiteBrandFont | null;
  displayWeight?: SiteFontWeight | null;
  heading?: SiteBrandFont | null;
  headingWeight?: SiteFontWeight | null;
  body?: SiteBrandFont | null;
  bodyWeight?: SiteFontWeight | null;
  meta?: SiteBrandFont | null;
  metaWeight?: SiteFontWeight | null;
};

export type SanityImageHotspot = {
  x?: number | null;
  y?: number | null;
  width?: number | null;
  height?: number | null;
};

export type SanityImageField = {
  _type?: "image";
  asset?: {
    _ref?: string;
    _id?: string;
    metadata?: {
      dimensions?: {width: number; height: number; aspectRatio?: number} | null;
      hasAlpha?: boolean | null;
      isOpaque?: boolean | null;
    } | null;
  } | null;
  alt?: string;
  hotspot?: SanityImageHotspot | null;
  crop?: {top?: number; bottom?: number; left?: number; right?: number} | null;
} | null;

export type BannerFocus = "auto" | "top" | "center" | "lower";

export type SanityFileAsset = {
  _ref?: string;
  _id?: string;
  url?: string | null;
  mimeType?: string | null;
  originalFilename?: string | null;
} | null;

export type SanityVideoField = {
  _type?: "file";
  asset?: SanityFileAsset;
  /** Optional lightweight file for inline loop playback (full asset used in lightbox). */
  loopPreview?: {asset?: SanityFileAsset} | null;
  alt?: string;
  loop?: boolean;
  loopDissolve?: boolean;
} | null;

export type SanityYoutubeField = {
  _type: "youtube";
  url: string;
  alt?: string;
  videoAspect?: "auto" | "landscape" | "portrait" | null;
};

export type SanityMediaField = SanityImageField | SanityVideoField | SanityYoutubeField;

/** Raw CMS object before normalization (Studio-safe shape). */
export type CmsMediaItemRaw = {
  _type?: "cmsMediaItem";
  _key?: string;
  mediaType?: "image" | "video" | "youtube" | null;
  image?: SanityImageField;
  video?: SanityVideoField;
  youtubeUrl?: string | null;
  videoAspect?: "auto" | "landscape" | "portrait" | null;
  alt?: string | null;
  loop?: boolean | null;
  loopDissolve?: boolean | null;
  loopPreview?: {asset?: SanityFileAsset} | null;
} | null;

export type CmsMediaInput = SanityMediaField | CmsMediaItemRaw;

export type ProjectListItem = {
  _id: string;
  title: string;
  slug: string | null;
  subtitle?: string | null;
  year?: string | null;
  coverImage: SanityImageField;
  /** Detail-page hero; used as Work grid thumbnail when coverImage is empty */
  heroImage?: CmsMediaInput;
  /** CMS: enable soft scrim behind hover title when cover/hero is dark */
  cardOverlayScrim?: boolean | null;
};

export type DetailLine = {
  label?: string | null;
  value: string;
};

export type ProjectPartner = {
  name: string;
  logo?: SanityImageField;
  href?: string | null;
};

export type ProjectAward = {
  image: SanityImageField;
  label?: string | null;
  href?: string | null;
};

export type ProjectAttachment = {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  filename?: string | null;
  size?: number | null;
};

export type ProjectChapterTextAlign = "left" | "center" | "right";

export type ProjectMobileStackOrder = "default" | "mediaFirst" | "textFirst";
export type ProjectChapterMobileBlockOrder = ProjectMobileStackOrder;
export type ProjectZigzagMobileStackOrder = ProjectMobileStackOrder;

export type ProjectBodyTypographyFields = {
  bodyFont?: string | null;
  bodyFontSize?: number | null;
};

export type ProjectChapterBlock = {
  _type: "projectChapter";
  _key?: string;
  title?: string | null;
  tocTitle?: string | null;
  titleFont?: string | null;
  titleSize?: "sm" | "md" | "lg" | "xl" | null;
  textAlign?: ProjectChapterTextAlign | null;
  body?: PortableTextBlock[] | null;
  mobileBlockOrder?: ProjectChapterMobileBlockOrder | null;
} & ProjectBodyTypographyFields;

export type ProjectStoryMediaWidth = "narrow" | "medium" | "full" | "bleed";
export type ProjectStoryMediaAlign = "left" | "center" | "right";
export type ProjectStoryMobileCarousel = "carousel" | "stack";

export type ProjectStoryLayoutFields = {
  mediaWidth?: ProjectStoryMediaWidth | null;
  mediaAlign?: ProjectStoryMediaAlign | null;
  /** When 2+ items: carousel (default) or stacked list on mobile */
  mobileCarousel?: ProjectStoryMobileCarousel | null;
};

export type GridMediaCropFields = {
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
};

export type ProjectInlineMediaBlock = {
  _type: "projectInlineMedia";
  _key?: string;
  media?: CmsMediaItemRaw;
  caption?: string | null;
} & ProjectStoryLayoutFields &
  GridMediaCropFields;

export type ProjectMediaBlock = {
  _type: "projectMedia";
  _key?: string;
  items?: CmsMediaInput[] | null;
  media?: CmsMediaItemRaw;
  caption?: string | null;
} & ProjectStoryLayoutFields &
  GridMediaCropFields;

export type ProjectGalleryBlock = {
  _type: "projectGallery";
  _key?: string;
  images?: CmsMediaInput[] | null;
  caption?: string | null;
  columns?: number | null;
  /** Beside the grid when Width is narrow or medium */
  body?: PortableTextBlock[] | null;
  layout?: "auto" | "textLeft" | "textRight" | null;
  mobileStackOrder?: ProjectZigzagMobileStackOrder | null;
} & ProjectBodyTypographyFields &
  ProjectStoryLayoutFields &
  GridMediaCropFields;

export type ProjectProcessStep = {
  _key?: string;
  media?: CmsMediaInput | null;
  caption?: string | null;
};

export type ProjectProcessBlock = {
  _type: "projectProcess";
  _key?: string;
  steps?: ProjectProcessStep[] | null;
  columns?: number | null;
  caption?: string | null;
} & ProjectStoryLayoutFields &
  GridMediaCropFields;

export type ProjectPhotoCollageBlock = {
  _type: "projectPhotoCollage";
  _key?: string;
  portraitSide?: "left" | "right" | null;
  portrait?: CmsMediaInput | null;
  strips?: Array<
    | CmsMediaInput
    | {
        _type: "projectPhotoCollagePair";
        _key?: string;
        swap?: boolean | null;
        left?: CmsMediaInput | null;
        right?: CmsMediaInput | null;
      }
  > | null;
  caption?: string | null;
} & ProjectStoryLayoutFields &
  GridMediaCropFields;

export type ProjectColumnsBlock = {
  _type: "projectColumns";
  _key?: string;
  ratio?: "50-50" | "40-60" | "60-40" | null;
  left?: PortableTextBlock[] | null;
  right?: PortableTextBlock[] | null;
};

export type ProjectQuoteBlock = {
  _type: "projectQuote";
  _key?: string;
  quote?: PortableTextBlock[] | null;
  attribution?: string | null;
};

export type ProjectInstagramFeedBlock = {
  _type: "projectInstagramFeed";
  _key?: string;
  handle?: string | null;
  maxPosts?: number | null;
  columns?: number | null;
  caption?: string | null;
} & GridMediaCropFields;

export type SanityAudioField = {
  asset?: {
    _ref?: string | null;
    _id?: string | null;
    url?: string | null;
    mimeType?: string | null;
    originalFilename?: string | null;
  } | null;
};

export type ProjectAudioBlock = {
  _type: "projectAudio";
  _key?: string;
  title?: string | null;
  audio?: SanityAudioField | null;
  cover?: SanityImageField;
  caption?: string | null;
  loop?: boolean | null;
  autoplay?: boolean | null;
  mediaWidth?: ProjectStoryMediaWidth | null;
  mediaAlign?: ProjectStoryMediaAlign | null;
};

export type ProjectYoutubeBlock = {
  _type: "projectYoutube";
  _key?: string;
  url?: string | null;
  /** iframe title / accessibility */
  title?: string | null;
  caption?: string | null;
  videoAspect?: "auto" | "landscape" | "portrait" | null;
} & ProjectStoryLayoutFields &
  GridMediaCropFields;

export type ProjectTextBoxBlock = {
  _type: "projectTextBox";
  _key?: string;
  label?: string | null;
  textAlign?: ProjectChapterTextAlign | null;
  body?: PortableTextBlock[] | null;
} & ProjectBodyTypographyFields;

export type ProjectZigzagRowBlock = {
  _type: "projectZigzagRow";
  _key?: string;
  layout?: "auto" | "textLeft" | "textRight" | null;
  mobileStackOrder?: ProjectZigzagMobileStackOrder | null;
  /** Tablet & desktop (≥48rem) — vertically center short text against the media column */
  centerTextWithMedia?: boolean | null;
  body?: PortableTextBlock[] | null;
  /** Small image grid under the text column */
  bodyImages?: CmsMediaInput[] | null;
  bodyImageColumns?: number | null;
  bodyGridAspectRatio?: GridAspectRatio | null;
  bodyCropFocus?: GridCropFocus | null;
  /** Current schema: array of media. Legacy rows may still have a single `media` object. */
  images?: CmsMediaInput[] | null;
  media?: CmsMediaItemRaw;
  caption?: string | null;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
} & ProjectBodyTypographyFields;

export type ProjectStoryBlock =
  | ProjectChapterBlock
  | ProjectTextBoxBlock
  | ProjectMediaBlock
  | ProjectGalleryBlock
  | ProjectPhotoCollageBlock
  | ProjectProcessBlock
  | ProjectQuoteBlock
  | ProjectZigzagRowBlock
  | ProjectInstagramFeedBlock
  | ProjectColumnsBlock
  | ProjectAudioBlock
  | ProjectYoutubeBlock;

export type ProjectDetail = ProjectListItem & {
  /** Width/height of the asset used for the detail hero (for compact layout). */
  projectHeroDimensions?: {width: number; height: number} | null;
  /** Portable text; legacy projects may still return a plain string until re-saved. */
  lead?: PortableTextBlock[] | string | null;
  details?: DetailLine[] | null;
  highlights?: string[] | null;
  partners?: ProjectPartner[] | null;
  awards?: ProjectAward[] | null;
  articleUrl?: string | null;
  attachments?: ProjectAttachment[] | null;
  story?: ProjectStoryBlock[] | null;
};

export type RichTextSection = {
  _type: "richTextSection";
  title?: string | null;
  body?: PortableTextBlock[] | null;
};

export type ImageSection = {
  _type: "imageSection";
  image?: SanityImageField;
  item?: CmsMediaItemRaw;
  caption?: string | null;
} & GridMediaCropFields;

export type GallerySection = {
  _type: "gallerySection";
  images?: CmsMediaInput[] | null;
  caption?: string | null;
  columns?: number | null;
} & GridMediaCropFields;

export type TwoColumnSection = {
  _type: "twoColumnSection";
  left?: PortableTextBlock[] | null;
  right?: PortableTextBlock[] | null;
};

export type QuoteSection = {
  _type: "quoteSection";
  quote?: PortableTextBlock[] | null;
  attribution?: string | null;
};

export type ProjectSection =
  | RichTextSection
  | ImageSection
  | GallerySection
  | TwoColumnSection
  | QuoteSection;

export type HomeHeroSection = {
  _type: "heroSection";
  headline: string;
  subheadline?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

export type HomeSelectedWorkSection = {
  _type: "selectedWorkSection";
  heading?: string | null;
};

export type HomeContactCtaSection = {
  _type: "contactCtaSection";
  heading?: string | null;
  email?: string | null;
  links?: {label: string; href: string}[] | null;
};

export type HomeSection = HomeHeroSection | HomeSelectedWorkSection | HomeContactCtaSection;

export type HomeWelcomeIntroContent = {
  heading?: string | null;
  body?: string | null;
};

export type PhotoAlbum = {
  _id?: string;
  year?: string | null;
  title?: string | null;
  images?: CmsMediaInput[] | null;
};

export type MoreBlockBase = {
  _key: string;
  enabled?: boolean | null;
  defaultExpanded?: boolean | null;
  heading?: string | null;
};

export type ArchiveBlock = MoreBlockBase & {
  _type: "archiveBlock";
  archiveProjects?: ProjectListItem[] | null;
  archiveAlbums?: PhotoAlbum[] | null;
  /** @deprecated Migrated to archiveAlbums */
  archiveMedia?: CmsMediaInput[] | null;
};

export type PhotographyBlock = MoreBlockBase & {
  _type: "photographyBlock";
  albums?: PhotoAlbum[] | null;
};

export type BehindTheScenesBlock = MoreBlockBase & {
  _type: "behindTheScenesBlock";
  albums?: PhotoAlbum[] | null;
  /** @deprecated Migrated to albums */
  images?: CmsMediaInput[] | null;
};

export type MoreBlock = ArchiveBlock | PhotographyBlock | BehindTheScenesBlock;

export type HomeDocument = {
  _id: string;
  title: string;
  welcomeIntro?: HomeWelcomeIntroContent | null;
  featuredProjects?: ProjectListItem[] | null;
  sections: HomeSection[];
};

export type MorePageDocument = {
  _id: string;
  title: string;
  slug: string | null;
  blocks?: MoreBlock[] | null;
  sections?: ProjectSection[] | null;
};

/** @deprecated Use MorePageDocument — kept for generic slug pages */
export type PageDocument = MorePageDocument;

export type AboutEducationItem = {
  school: string;
  degree?: string | null;
  period?: string | null;
};

export type AboutSkillGroup = {
  title: string;
  items?: string[] | null;
};

export type ContactIcon =
  | "email"
  | "linkedin"
  | "instagram"
  | "twitter"
  | "github"
  | "behance"
  | "dribbble"
  | "youtube"
  | "website";

export type ContactChannel = {
  label: string;
  value: string;
  href: string;
  sub?: string | null;
  icon: ContactIcon;
};

export type ContactDocument = {
  _id: string;
  title: string;
  headline?: string | null;
  headlineEmphasis?: string | null;
  channels?: ContactChannel[] | null;
  footnote?: string | null;
};

export type ContactSectionLink = {label: string; href: string};

export type ContactSection = {
  footerBody?: PortableTextBlock[] | null;
  links?: ContactSectionLink[] | null;
};

export type SiteBrand = {
  mode?: "image" | "text" | null;
  text?: string | null;
  font?: SiteBrandFont | null;
  fontWeight?: SiteFontWeight | null;
  alt?: string | null;
  image?: SanityImageField;
  /** Work homepage banner: optional shadow/outline layer (PNG) to glow on hover. */
  shadowImage?: SanityImageField;
  /** Work homepage banner: enable shadow glow layer (requires shadowImage). */
  shadowGlowEnabled?: boolean | null;
  /** Legacy: hover effect name (e.g. "fluoro-shadow-auto"). */
  bannerHoverEffect?: string | null;
  /** Legacy: shadow-only mask image (PNG) used for glow layer. */
  bannerShadowMask?: SanityImageField;
  /** Work homepage banner crop anchor (ignored for header logo). */
  bannerFocus?: BannerFocus | null;
};

export type SiteSettingsDocument = {
  _id: string;
  typography?: SiteTypography | null;
  heroLottieUrl?: string | null;
  contactSection?: ContactSection | null;
  /** Header + footer */
  brand?: SiteBrand | null;
  /** Work homepage fold — separate from header */
  workHomeLogo?: SiteBrand | null;
};

export type AboutDocument = {
  _id: string;
  title: string;
  name: string;
  role?: string | null;
  meta?: string[] | null;
  portrait?: SanityImageField;
  bio?: PortableTextBlock[] | null;
  education?: AboutEducationItem[] | null;
  skillGroups?: AboutSkillGroup[] | null;
  resumeUrl?: string | null;
  resumeFilename?: string | null;
};
