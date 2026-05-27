import {groq} from "next-sanity";

const cmsMediaItemFields = groq`
  ...,
  mediaType,
  loop,
  alt,
  image {
    ...,
    asset->{
      "_ref": coalesce(_ref, _id),
      metadata {
        dimensions
      }
    }
  },
  video {
    ...,
    asset->{
      "_ref": coalesce(_ref, _id),
      url,
      mimeType,
      originalFilename
    }
  },
  asset->{
    "_ref": coalesce(_ref, _id),
    metadata {
      dimensions
    }
  }
`;

const siteBrandFields = groq`
  mode,
  text,
  font,
  fontWeight,
  alt,
  bannerFocus,
  shadowGlowEnabled,
  bannerHoverEffect,
  bannerShadowMask {
    ...,
    hotspot,
    crop,
    asset->{
      "_ref": coalesce(_ref, _id),
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    }
  },
  shadowImage {
    ...,
    hotspot,
    crop,
    asset->{
      "_ref": coalesce(_ref, _id),
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    }
  },
  image {
    ...,
    hotspot,
    crop,
    asset->{
      "_ref": coalesce(_ref, _id),
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    }
  }
`;

const projectListItemFields = groq`
  _id,
  title,
  "slug": slug.current,
  subtitle,
  year,
  role,
  coverImage,
  cardOverlayScrim,
  heroImage {
    ${cmsMediaItemFields}
  }
`;

const projectStoryFields = groq`
  _type,
  title,
  body,
  quote,
  attribution,
  caption,
  columns,
  media {
    ${cmsMediaItemFields}
  },
  images[] {
    ${cmsMediaItemFields}
  }
`;

export const projectsQuery = groq`
  *[_type == "project" && defined(slug.current)] | order(orderRank asc, title asc) {
    ${projectListItemFields}
  }
`;

/** First 9 projects by Studio order — used when Work homepage featured list is empty. */
export const homeFeaturedProjectsFallbackQuery = groq`
  *[_type == "project" && defined(slug.current)] | order(orderRank asc, title asc)[0...9] {
    ${projectListItemFields}
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)].slug.current
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    cardOverlayScrim,
    year,
    role,
    lead,
    details[] {
      label,
      value
    },
    highlights,
    partners[] {
      name,
      logo,
      href
    },
    awards[] {
      image,
      label,
      href
    },
    articleUrl,
    coverImage,
    heroImage {
      ${cmsMediaItemFields}
    },
    "projectHeroDimensions": coalesce(
      select(
        heroImage._type == "cmsMediaItem" && heroImage.mediaType == "image" => heroImage.image.asset->metadata.dimensions,
        heroImage._type == "image" => heroImage.asset->metadata.dimensions
      ),
      coverImage.asset->metadata.dimensions
    ),
    story[] {
      ${projectStoryFields}
    }
  }
`;

export const homeQuery = groq`
  *[_type == "home"][0] {
    _id,
    title,
    welcomeIntro {
      heading,
      body
    },
    featuredProjects[]-> {
      ${projectListItemFields}
    },
    sections[] {
      _type,
      headline,
      subheadline,
      ctaLabel,
      ctaHref,
      heading,
      email,
      links[] {
        label,
        href
      }
    }
  }
`;

export const aboutQuery = groq`
  *[_type == "about"][0] {
    _id,
    title,
    name,
    role,
    meta,
    portrait {
      asset,
      alt
    },
    bio,
    education[] {
      school,
      degree,
      period
    },
    skillGroups[] {
      title,
      items
    },
    "resumeUrl": resume.asset->url,
    "resumeFilename": resume.asset->originalFilename
  }
`;

export const contactQuery = groq`
  *[_type == "contact"][0] {
    _id,
    title,
    headline,
    headlineEmphasis,
    channels[] {
      label,
      value,
      href,
      sub,
      icon
    },
    footnote
  }
`;

export const morePageQuery = groq`
  *[_type == "page" && slug.current == "more"][0] {
    _id,
    title,
    "slug": slug.current,
    blocks[] {
      _type,
      _key,
      enabled,
      defaultExpanded,
      heading,
      archiveProjects[]-> {
        ${projectListItemFields}
      },
      albums[] {
        year,
        title,
        images[] {
          ${cmsMediaItemFields}
        }
      },
      images[] {
        ${cmsMediaItemFields}
      }
    },
    sections[] {
      _type,
      title,
      body,
      quote,
      attribution,
      caption,
      columns,
      left,
      right,
      "image": image{
        ...,
        asset->{
          "_ref": coalesce(_ref, _id),
          metadata {
            dimensions
          }
        }
      },
      "item": item{
        ${cmsMediaItemFields}
      },
      "images": images[]{
        ${cmsMediaItemFields}
      }
    }
  }
`;

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    blocks[] {
      _type,
      _key,
      enabled,
      defaultExpanded,
      heading,
      archiveProjects[]-> {
        ${projectListItemFields}
      },
      albums[] {
        year,
        title,
        images[] {
          ${cmsMediaItemFields}
        }
      },
      images[] {
        ${cmsMediaItemFields}
      }
    },
    sections[] {
      _type,
      title,
      body,
      quote,
      attribution,
      caption,
      columns,
      left,
      right,
      "image": image{
        ...,
        asset->{
          "_ref": coalesce(_ref, _id),
          metadata {
            dimensions
          }
        }
      },
      "item": item{
        ${cmsMediaItemFields}
      },
      "images": images[]{
        ${cmsMediaItemFields}
      }
    }
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    _id,
    typography {
      display,
      displayWeight,
      heading,
      headingWeight,
      body,
      bodyWeight,
      meta,
      metaWeight
    },
    brand {
      ${siteBrandFields}
    },
    workHomeLogo {
      ${siteBrandFields}
    },
    "heroLottieUrl": heroIntroLottie.asset->url,
    contactSection {
      footerBody,
      links[] {
        label,
        href
      }
    }
  }
`;
