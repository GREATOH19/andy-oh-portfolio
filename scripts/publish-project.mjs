/**
 * inbox/<name> → Sanity DRAFT project (publish it in Studio when happy).
 * Usage: npm run publish:project -- inbox/<name>
 */
import fs from 'node:fs'
import path from 'node:path'
import {randomUUID} from 'node:crypto'
import {createClient} from '@sanity/client'
import {buildCaption, collectImages, loadEnv, readBrief} from '../tools/inbox.mjs'

loadEnv()
const dir = process.argv[2]
if (!dir) throw new Error('Usage: npm run publish:project -- inbox/<name>')
if (!process.env.SANITY_WRITE_TOKEN) throw new Error('Set SANITY_WRITE_TOKEN (Editor token)')

const client = createClient({
  projectId: 'sttir3vc',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const {meta, paragraphs} = readBrief(dir)
const files = collectImages(dir)
console.log(`Uploading ${files.length} image(s)…`)
const assets = []
for (const f of files) {
  const a = await client.assets.upload('image', fs.createReadStream(f), {filename: path.basename(f)})
  assets.push(a._id)
  process.stdout.write('.')
}
console.log()

const img = (ref, alt) => ({_type: 'image', asset: {_type: 'reference', _ref: ref}, ...(alt ? {alt} : {})})
const coverRef = assets[Math.max(0, Number(meta.cover || 1) - 1)] ?? assets[0]
const key = () => randomUUID().slice(0, 12)

const doc = {
  _id: `drafts.project-${meta.slug}`,
  _type: 'project',
  title: meta.title,
  slug: {_type: 'slug', current: meta.slug},
  subtitle: meta.subtitle,
  year: meta.year,
  coverImage: img(coverRef, meta.title),
  heroImage: {_type: 'cmsMediaItem', mediaType: 'image', image: img(coverRef, meta.title), alt: meta.title},
  lead: paragraphs.map((text) => ({
    _type: 'block', _key: key(), style: 'normal', markDefs: [],
    children: [{_type: 'span', _key: key(), text, marks: []}],
  })),
  highlights: meta.highlights,
  story: [
    {
      _type: 'projectGallery',
      _key: key(),
      columns: 2,
      images: assets.map((ref) => ({
        _type: 'cmsMediaItem', _key: key(), mediaType: 'image', image: img(ref, meta.title), alt: meta.title,
      })),
    },
  ],
}

// createOrReplace keeps re-runs idempotent (overwrites the draft only).
await client.createOrReplace(doc)
fs.writeFileSync(path.join(dir, '_published.json'), JSON.stringify({draftId: doc._id, assets}, null, 2))
console.log(`Draft created: ${doc._id}\nOpen Sanity Studio → Project → "${meta.title}" → Publish.`)
console.log('\nSuggested Instagram caption:\n' + buildCaption(meta, paragraphs))
