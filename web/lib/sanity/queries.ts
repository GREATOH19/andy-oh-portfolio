import {groq} from "next-sanity";

const projectListItemFields = groq`
  _id,
  title,
  "slug": slug.current,
  subtitle,
  year,
  role,
  excerpt,
  coverImage,
  heroImage
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
    year,
    role,
    excerpt,
    metaItems[] {
      label,
      value
    },
    contributions,
    collaborators[] {
      name,
      logo,
      href
    },
    awards[] {
      image,
      label,
      href
    },
    mediumUrl,
    coverImage,
    heroImage,
    "projectHeroDimensions": coalesce(
      heroImage.asset->metadata.dimensions,
      coverImage.asset->metadata.dimensions
    ),
    "gallery": gallery[]{
      ...,
      asset->{
        "_ref": coalesce(_ref, _id),
        metadata {
          dimensions
        }
      }
    },
    body,
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
      "images": images[]{
        ...,
        asset->{
          "_ref": coalesce(_ref, _id),
          metadata {
            dimensions
          }
        }
      }
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

const cmsImageFields = groq`
  ...,
  asset->{
    "_ref": coalesce(_ref, _id),
    metadata {
      dimensions
    }
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
          ${cmsImageFields}
        }
      },
      images[] {
        ${cmsImageFields}
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
      "images": images[]{
        ...,
        asset->{
          "_ref": coalesce(_ref, _id),
          metadata {
            dimensions
          }
        }
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
          ${cmsImageFields}
        }
      },
      images[] {
        ${cmsImageFields}
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
      "images": images[]{
        ...,
        asset->{
          "_ref": coalesce(_ref, _id),
          metadata {
            dimensions
          }
        }
      }
    }
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    _id,
    typography {
      display,
      heading,
      body,
      meta
    },
    brand {
      mode,
      text,
      font,
      alt,
      image
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
