/**
 * One-time: move legacy project fields → intro + story blocks.
 * Run from repo root: npm run migrate:project-cms
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})

function isLegacyFlatImage(value) {
  if (!value || typeof value !== 'object') return false
  if (value._type === 'cmsMediaItem') return false
  if (value.mediaType === 'image' || value.mediaType === 'video') return false
  const ref = value.asset?._ref ?? value.asset?._id
  return Boolean(ref)
}

function toCmsMediaItem(legacy) {
  if (!legacy) return undefined
  if (legacy._type === 'cmsMediaItem') return legacy
  if (isLegacyFlatImage(legacy)) {
    return {
      _type: 'cmsMediaItem',
      mediaType: 'image',
      image: {
        _type: 'image',
        asset: legacy.asset,
        ...(legacy.crop ? {crop: legacy.crop} : {}),
        ...(legacy.hotspot ? {hotspot: legacy.hotspot} : {}),
        ...(legacy.alt ? {alt: legacy.alt} : {}),
      },
      ...(legacy.alt ? {alt: legacy.alt} : {}),
    }
  }
  return legacy
}

function mapSection(section) {
  if (!section?._type) return null
  switch (section._type) {
    case 'richTextSection':
      return {
        _type: 'projectChapter',
        _key: section._key,
        title: section.title ?? undefined,
        body: section.body,
      }
    case 'imageSection': {
      const media = toCmsMediaItem(section.item) ?? toCmsMediaItem(section.image)
      if (!media) return null
      return {
        _type: 'projectMedia',
        _key: section._key,
        media,
        caption: section.caption ?? undefined,
      }
    }
    case 'gallerySection':
      return {
        _type: 'projectGallery',
        _key: section._key,
        images: (section.images ?? []).map((img) => toCmsMediaItem(img)).filter(Boolean),
        caption: section.caption ?? undefined,
        columns: section.columns ?? 2,
      }
    case 'quoteSection':
      return {
        _type: 'projectQuote',
        _key: section._key,
        quote: section.quote,
        attribution: section.attribution ?? undefined,
      }
    case 'twoColumnSection': {
      const left = section.left ?? []
      const right = section.right ?? []
      const body = [...left, ...right]
      if (body.length === 0) return null
      return {
        _type: 'projectChapter',
        _key: section._key,
        title: undefined,
        body,
      }
    }
    default:
      return null
  }
}

function mapCollaborators(collaborators) {
  if (!Array.isArray(collaborators)) return undefined
  return collaborators
    .filter((c) => c?.name)
    .map((c) => ({
      _type: 'partner',
      _key: c._key,
      name: c.name,
      logo: c.logo,
      href: c.href,
    }))
}

function mapAwards(awards) {
  if (!Array.isArray(awards)) return undefined
  return awards
    .filter((a) => a?.image?.asset?._ref || a?.image?.asset?._id)
    .map((a) => ({
      _type: 'projectAward',
      _key: a._key,
      image: a.image,
      label: a.label,
      href: a.href,
    }))
}

function mapDetails(metaItems) {
  if (!Array.isArray(metaItems)) return undefined
  return metaItems
    .filter((m) => m?.value)
    .map((m) => ({
      _type: 'detailLine',
      _key: m._key,
      label: m.label,
      value: m.value,
    }))
}

async function main() {
  const projects = await client.fetch(`*[_type == "project"]{
    _id,
    title,
    excerpt,
    lead,
    metaItems,
    details,
    contributions,
    highlights,
    collaborators,
    partners,
    awards,
    mediumUrl,
    articleUrl,
    sections,
    story,
    body,
    gallery
  }`)

  for (const doc of projects) {
    const set = {}
    const unset = []

    if (!doc.lead && doc.excerpt) set.lead = doc.excerpt
    if (!doc.details?.length && doc.metaItems?.length) set.details = mapDetails(doc.metaItems)
    if (!doc.highlights?.length && doc.contributions?.length) set.highlights = doc.contributions
    if (!doc.partners?.length && doc.collaborators?.length) {
      set.partners = mapCollaborators(doc.collaborators)
    }
    if (!doc.articleUrl && doc.mediumUrl) set.articleUrl = doc.mediumUrl

    const story = [...(doc.story ?? [])]
    if (story.length === 0) {
      const fromSections = (doc.sections ?? []).map(mapSection).filter(Boolean)
      story.push(...fromSections)

      if (doc.body?.length) {
        story.unshift({
          _type: 'projectChapter',
          title: 'Overview',
          body: doc.body,
        })
      }

      const galleryItems = (doc.gallery ?? []).map((img) => toCmsMediaItem(img)).filter(Boolean)
      if (galleryItems.length > 0) {
        story.push({
          _type: 'projectGallery',
          images: galleryItems,
          columns: 2,
        })
      }

      if (story.length > 0) set.story = story
    }

    if (doc.awards?.length && doc.awards[0]?._type !== 'projectAward') {
      set.awards = mapAwards(doc.awards)
    }

    for (const field of [
      'excerpt',
      'metaItems',
      'contributions',
      'collaborators',
      'mediumUrl',
      'sections',
      'body',
      'gallery',
    ]) {
      if (doc[field] != null && (Array.isArray(doc[field]) ? doc[field].length > 0 : true)) {
        unset.push(field)
      }
    }

    if (Object.keys(set).length === 0 && unset.length === 0) continue

    let patch = client.patch(doc._id)
    if (Object.keys(set).length > 0) patch = patch.set(set)
    if (unset.length > 0) patch = patch.unset(unset)
    await patch.commit()
    console.log(`Migrated: ${doc.title || doc._id}`)
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
