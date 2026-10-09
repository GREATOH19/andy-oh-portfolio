/**
 * Create the Monklap project document (Work card + intro details) as a draft.
 * The project page itself is custom: web/app/projects/monklap/page.tsx.
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

const para = (text) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: key(), text, marks: []}],
})

async function main() {
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
  }

  await client.createOrReplace(doc)
  console.log('Created draft project “Monklap” → /projects/monklap (publish it in Studio).')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
