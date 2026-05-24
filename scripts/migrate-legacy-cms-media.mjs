/**
 * One-time: move legacy flat image objects into cmsMediaItem shape.
 * Run from repo root: npm run migrate:media
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

function migrateGallery(gallery) {
  if (!Array.isArray(gallery)) return gallery
  let changed = false
  const next = gallery.map((item) => {
    if (!isLegacyFlatImage(item)) return item
    changed = true
    return toCmsMediaItem(item)
  })
  return changed ? next : gallery
}

async function main() {
  const projects = await client.fetch(
    `*[_type == "project"]{_id, title, heroImage, gallery}`,
  )

  for (const doc of projects) {
    const patch = {}
    if (isLegacyFlatImage(doc.heroImage)) {
      patch.heroImage = toCmsMediaItem(doc.heroImage)
    }
    const gallery = migrateGallery(doc.gallery)
    if (gallery !== doc.gallery) {
      patch.gallery = gallery
    }
    if (Object.keys(patch).length > 0) {
      await client.patch(doc._id).set(patch).commit()
      console.log(`Patched project: ${doc.title || doc._id}`)
    }
  }

  const aboutDocs = await client.fetch(`*[_type == "about"]{_id, portrait}`)
  for (const doc of aboutDocs) {
    const p = doc.portrait
    if (p?.asset && p._type !== 'image') {
      await client
        .patch(doc._id)
        .set({portrait: {...p, _type: 'image'}})
        .commit()
      console.log(`Patched about portrait: ${doc._id}`)
    }
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
