/**
 * Create the Monklap project as a draft. The story is the portfolio slides
 * (images/monklap/slide-*.jpg) shown in order, followed by the demo video.
 * Run from repo root: npm run seed:monklap
 * Publish the draft in Studio afterwards. Safe to re-run: replaces the draft.
 */
import {createReadStream} from 'node:fs'
import {basename, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})
const dir = join(fileURLToPath(new URL('..', import.meta.url)), 'images', 'monklap')

let k = 0
const key = () => `monklap${(k++).toString(36)}`

const assetCache = new Map()
async function upload(kind, file) {
  if (!assetCache.has(file)) {
    const asset = await client.assets.upload(kind, createReadStream(join(dir, file)), {
      filename: basename(file),
    })
    assetCache.set(file, asset._id)
  }
  return {_type: 'reference', _ref: assetCache.get(file)}
}

async function image(file, alt) {
  return {
    _type: 'cmsMediaItem',
    _key: key(),
    mediaType: 'image',
    alt,
    image: {_type: 'image', asset: await upload('image', file), alt},
  }
}

async function video(file, alt) {
  return {
    _type: 'cmsMediaItem',
    _key: key(),
    mediaType: 'video',
    alt,
    loop: true,
    video: {_type: 'file', asset: await upload('file', file)},
  }
}

const para = (text) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: key(), text, marks: []}],
})

const media = (item, caption, extra = {}) => ({
  _type: 'projectMedia',
  _key: key(),
  media: item,
  caption,
  mediaWidth: 'full',
  mediaAlign: 'center',
  ...extra,
})

const slides = [
  'Monklap — portfolio cover',
  'Overview — scent, on cue',
  'Target users — Monklap is for…',
  'ESP32 & sensors — two sensors, two outcomes',
  'Inside the face — wireframe breakdown',
  'System & assembly — fill, twist, clap',
  'Sketch & ideation — from a button to a clap',
  'Process & lessons',
  'Final prototype — Monklap, awake',
]

async function main() {
  const slideFile = (i) => `slide-0${i + 1}.jpg`
  // Slide 1 is the cover: it opens the page as the hero.
  const hero = await image(slideFile(0), slides[0])
  const demo = await video('monklap-demo.mp4', 'Monklap waking, smiling and misting after a clap')

  const story = []
  for (let i = 1; i < slides.length; i++) {
    story.push(media(await image(slideFile(i), slides[i])))
  }
  story.push(media(demo, 'Rest → wake → smile → pulse', {mediaWidth: 'medium'}))

  const doc = {
    _id: 'drafts.project-monklap',
    _type: 'project',
    title: 'Monklap',
    slug: {_type: 'slug', current: 'monklap'},
    subtitle: 'A touchless ambient scent system that answers a clap.',
    year: '2026',
    coverImage: {
      _type: 'image',
      asset: await upload('image', 'render-front.jpg'),
      alt: 'Monklap rendering',
    },
    heroImage: hero,
    lead: [
      para(
        'Monklap is a wall-mounted or desktop IoT diffuser shaped like a friendly monkey. Clap, and it wakes, smiles back and releases a 1.5-second pulse of mist — no buttons, no app, nothing to touch. Made for the Design Principle class in Industrial Design at RISD.',
      ),
    ],
    details: [
      {_type: 'detailLine', _key: key(), label: 'Type', value: 'Personal project · Design Principle class, RISD Industrial Design'},
      {_type: 'detailLine', _key: key(), label: 'Duration', value: 'October 2026'},
      {_type: 'detailLine', _key: key(), label: 'Key skills', value: 'Rhino 8, Bambu Studio, ESP32, soldering, 3D printing'},
      {_type: 'detailLine', _key: key(), label: 'Size', value: 'Wall-mounted / desktop object'},
      {_type: 'detailLine', _key: key(), label: 'Material', value: '3D-printed shell, ultrasonic atomizer, 2.8″ OLED'},
    ],
    highlights: ['Industrial design', 'Interaction design', 'Electronics', 'Prototyping', '3D printing'],
    story,
  }

  await client.createOrReplace(doc)
  console.log('Created draft project “Monklap” → /projects/monklap (publish it in Studio).')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
