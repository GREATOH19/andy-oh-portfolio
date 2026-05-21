import type {PortableTextBlock} from "@portabletext/types";

/** CMS typography options — keep in sync with `schemaTypes/fontStyle.js` */
export type SiteBrandFont = "serif" | "sans" | "mono" | "dmSans" | "instrument" | "pinyon" | "gloock";

export type TypographyRole = "display" | "heading" | "body" | "meta";

export type SiteTypography = {
  display?: SiteBrandFont | null;
  heading?: SiteBrandFont | null;
  body?: SiteBrandFont | null;
  meta?: SiteBrandFont | null;
};

export type SanityImageField = {
  _type?: "image";
  asset?: {
    _ref?: string;
    _id?: string;
    metadata?: {
      dimensions?: {width: number; height: number; aspectRatio?: number} | null;
    } | null;
  } | null;
  alt?: string;
} | null;

export type SanityVideoField = {
  _type?: "file";
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string | null;
    mimeType?: string | null;
    originalFilename?: string | null;
  } | null;
  alt?: string;
  loop?: boolean;
} | null;

export type SanityMediaField = SanityImageField | SanityVideoField;

/** Raw CMS object before normalization (Studio-safe shape). */
export type CmsMediaItemRaw = {
  _type?: "cmsMediaItem";
  _key?: string;
  mediaType?: "image" | "video" | null;
  image?: SanityImageField;
  video?: SanityVideoField;
  alt?: string | null;
  loop?: boolean | null;
} | null;

export type CmsMediaInput = SanityMediaField | CmsMediaItemRaw;

export type ProjectListItem = {
  _id: string;
  title: string;
  slug: string | null;
  subtitle?: string | null;
  year?: string | null;
  role?: string;
  excerpt?: string;
  coverImage: SanityImageField;
  /** Detail-page hero; used as Work grid thumbnail when coverImage is empty */
  heroImage?: SanityImageField;
};

export type ProjectMetaItem = {
  label?: string | null;
  value: string;
};

export type ProjectCollaborator = {
  name: string;
  logo?: SanityImageField;
  href?: string | null;
};

export type ProjectAward = {
  image: SanityImageField;
  label?: string | null;
  href?: string | null;
};

export type ProjectDetail = ProjectListItem & {
  heroImage?: SanityImageField;
  /** Width/height of the asset used for the detail hero (for compact layout). */
  projectHeroDimensions?: {width: number; height: number} | null;
  metaItems?: ProjectMetaItem[] | null;
  contributions?: string[] | null;
  collaborators?: ProjectCollaborator[] | null;
  awards?: ProjectAward[] | null;
  mediumUrl?: string | null;
  gallery?: CmsMediaInput[] | null;
  body?: PortableTextBlock[] | null;
  sections?: ProjectSection[] | null;
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
};

export type GallerySection = {
  _type: "gallerySection";
  images?: CmsMediaInput[] | null;
  caption?: string | null;
  columns?: number | null;
};

export type TwoColumnSection = {
  _type: "twoColumnSection";
  left?: PortableTextBlock[] | null;
  right?: PortableTextBlock[] | null;
};

export type QuoteSection = {
  _type: "quoteSection";
  quote?: string | null;
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
};

export type PhotographyBlock = MoreBlockBase & {
  _type: "photographyBlock";
  albums?: PhotoAlbum[] | null;
};

export type BehindTheScenesBlock = MoreBlockBase & {
  _type: "behindTheScenesBlock";
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
  alt?: string | null;
  image?: SanityImageField;
};

export type SiteSettingsDocument = {
  _id: string;
  typography?: SiteTypography | null;
  heroLottieUrl?: string | null;
  contactSection?: ContactSection | null;
  brand?: SiteBrand | null;
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
