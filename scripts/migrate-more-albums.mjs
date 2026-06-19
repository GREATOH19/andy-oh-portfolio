/**
 * Migrate More page media to mediaAlbum documents:
 * - Embedded photoAlbum objects → mediaAlbum docs + references
 * - Flat archiveMedia / images arrays → one mediaAlbum each
 *
 * Run from repo root: npm run migrate:more-albums
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})

function randomKey() {
  return Math.random().toString(36).slice(2, 10)
}

function isReference(item) {
  return item?._type === 'reference' && item?._ref
}

function isEmbeddedPhotoAlbum(item) {
  return item && !isReference(item) && (item._type === 'photoAlbum' || Array.isArray(item.images))
}

async function createMediaAlbum({title, year, images}) {
  if (!Array.isArray(images) || images.length === 0) return null
  const doc = await client.create({
    _type: 'mediaAlbum',
    title: title || 'Untitled album',
    ...(year ? {year} : {}),
    images,
  })
  return {_type: 'reference', _ref: doc._id, _key: randomKey()}
}

async function migrateEmbeddedAlbums(items, fallbackTitle) {
  if (!Array.isArray(items) || items.length === 0) return {refs: [], changed: false}

  if (items.every(isReference)) {
    return {refs: items, changed: false}
  }

  const refs = []
  for (const item of items) {
    if (isReference(item)) {
      refs.push(item)
      continue
    }
    if (!isEmbeddedPhotoAlbum(item)) continue
    const ref = await createMediaAlbum({
      title: item.title || fallbackTitle,
      year: item.year,
      images: item.images,
    })
    if (ref) refs.push(ref)
  }

  return {refs, changed: true}
}

async function migrateFlatMedia(items, title) {
  if (!Array.isArray(items) || items.length === 0) return {ref: null, changed: false}
  const ref = await createMediaAlbum({title, images: items})
  return {ref, changed: Boolean(ref)}
}

async function main() {
  const pages = await client.fetch(`*[_type == "page"]{_id, title, blocks}`)

  for (const page of pages) {
    const blocks = [...(page.blocks ?? [])]
    let pageChanged = false

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]

      if (block._type === 'photographyBlock' && Array.isArray(block.albums)) {
        const {refs, changed} = await migrateEmbeddedAlbums(block.albums, 'Photography')
        if (changed) {
          blocks[i] = {...block, albums: refs}
          pageChanged = true
          console.log(`Migrated photography albums on page: ${page.title || page._id}`)
        }
      }

      if (block._type === 'archiveBlock') {
        if (Array.isArray(block.archiveAlbums) && block.archiveAlbums.some(isEmbeddedPhotoAlbum)) {
          const {refs, changed} = await migrateEmbeddedAlbums(block.archiveAlbums, 'Archive')
          if (changed) {
            blocks[i] = {...block, archiveAlbums: refs}
            pageChanged = true
          }
        }

        if (Array.isArray(block.archiveMedia) && block.archiveMedia.length > 0) {
          const {ref, changed} = await migrateFlatMedia(block.archiveMedia, 'Archive media')
          if (changed && ref) {
            const archiveAlbums = [...(blocks[i].archiveAlbums ?? []), ref]
            blocks[i] = {...blocks[i], archiveAlbums, archiveMedia: []}
            pageChanged = true
            console.log(`Migrated flat archiveMedia on page: ${page.title || page._id}`)
          }
        }
      }

      if (block._type === 'behindTheScenesBlock') {
        if (Array.isArray(block.albums) && block.albums.some(isEmbeddedPhotoAlbum)) {
          const {refs, changed} = await migrateEmbeddedAlbums(block.albums, 'Behind the scene')
          if (changed) {
            blocks[i] = {...block, albums: refs}
            pageChanged = true
          }
        }

        if (Array.isArray(block.images) && block.images.length > 0) {
          const {ref, changed} = await migrateFlatMedia(block.images, 'Behind the scene')
          if (changed && ref) {
            const albums = [...(blocks[i].albums ?? []), ref]
            blocks[i] = {...blocks[i], albums, images: []}
            pageChanged = true
            console.log(`Migrated flat BTS images on page: ${page.title || page._id}`)
          }
        }
      }
    }

    if (pageChanged) {
      await client.patch(page._id).set({blocks}).commit()
      console.log(`Patched page: ${page.title || page._id}`)
    }
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
