/**
 * Create the Monklap project as a draft (assets from images/monklap/).
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

const chapter = (title, paragraphs) => ({
  _type: 'projectChapter',
  _key: key(),
  title,
  tocTitle: title,
  body: paragraphs.map(para),
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

const gallery = (images, caption, columns) => ({
  _type: 'projectGallery',
  _key: key(),
  images,
  caption,
  columns,
  mediaWidth: 'full',
  mediaAlign: 'center',
})

const hero = await image('render-front.jpg', 'Monklap rendering')
const demo = await video('monklap-demo.mp4', 'Monklap waking, smiling and misting after a clap')

const story = [
  chapter('Scent, on cue', [
    'Monklap is a wall-mounted or desktop diffuser shaped like a friendly monkey. Walk up and clap, and it responds with a pulse of fragrant mist from its mouth. No buttons, no app, nothing to touch.',
    'Touchless: sound and proximity replace the spray trigger, for moments when your hands are busy, wet or full. Interactive: an OLED face gives it a character and shows visible feedback for every state. Ambient: a wick-fed ultrasonic atomizer releases a 1.5-second burst of mist on demand, not a constant stream.',
  ]),
  media(demo, 'Rest → wake → smile → pulse', {mediaWidth: 'medium'}),
  chapter('Who it is for', [
    'Three groups who want scent to feel like a moment of play, not another chore.',
    'Aesthetic & tech enthusiasts: Gen Z and millennials looking for desk-friendly home objects with sound-driven, physical interaction rather than another standard IoT device.',
    'Touchless, functional users: people who need instant, hands-free odor control while cooking, caring for pets, or whenever their hands are busy.',
    'Experiential commercial spaces: pop-up stores, cafés and galleries that want interactive, sensory branding at the entrance — a scent that greets visitors.',
  ]),
  chapter('From a button to a clap', [
    'Monklap began as a “Sound & Scent System”: a comfort tool for public spaces that played music as people walked by, then sprayed fragrance on their wrists at the press of a button.',
    'What I kept: walk-up wake, a digital face, scent as a reward. What changed: the button became a clap; the form became a monkey.',
  ]),
  gallery(
    [
      await image('sketch-concept.jpg', 'Initial concept sketch: walk-by music and wrist spray'),
      await image('sketch-form.jpg', 'Form studies: head, sensors and tank'),
    ],
    'Initial concept — walk-by music & wrist spray · Form studies — head, sensors & tank',
    2,
  ),
  chapter('Two sensors, two outcomes', [
    'An ESP32 reads an ultrasonic sensor in the nostrils (is someone near?) and a sound sensor at the lower left (a clap or noise). It picks a face for the 2.8″ OLED eyes and decides when to fire the ultrasonic atomizer in the mouth.',
    'Interaction logic: Rest (nobody near, or no sound — screen dimmed), Wake (someone near plus a clap or noise — eyes open), Smile (recognizes the clap and smiles back), Pulse (atomizer on for 1.5 s, then back to rest).',
  ]),
  media(await image('diagram-system.jpg', 'ESP32 and sensor system diagram'), 'ESP32 & sensors'),
  gallery(
    [
      await image('face-rest.jpg', 'Rest face'),
      await image('face-wake.jpg', 'Wake face'),
      await image('face-smile.jpg', 'Smile face'),
      await image('face-pulse.jpg', 'Pulse face'),
    ],
    'Face states on the real screen — Rest · Wake · Smile · Pulse',
    4,
  ),
  chapter('Inside the face', [
    'The eyes are a 2.8″ OLED (62.6 × 33.7 mm), the nostrils hold the ultrasonic sensor, the mouth holds the atomizer and the sound sensor sits lower left. Four snap-fit hooks on the side walls hold the shell together.',
    'A J-shaped wick draws water up from the bayonet tank to the mouth by capillary action — the widest bend that fits.',
  ]),
  media(await image('diagram-wireframe.jpg', 'Wireframe breakdown drawn from the Rhino model'), 'Wireframe breakdown — hidden lines on, drawn from the Rhino model'),
  chapter('Fill, twist, clap.', [
    'Fill the tank with water and a water-soluble air freshener. Twist the lid’s bayonet into the head; the wick carries water up to the mouth. A keyhole slot on the back hangs it on a single screw. No buttons — the face does the rest.',
  ]),
  media(await image('assembly-exploded.jpg', 'Exploded assembly: fill, twist, hang and clap'), 'System & assembly', {mediaWidth: 'medium'}),
  chapter('Process & lessons', [
    'Modeling — Taking Monklap from rough sketches to 3D models in Rhino taught me that the more specific a plan is, the less time I lose troubleshooting changes later.',
    '3D printing — I printed the parts on a Bambu Lab A1 using Bambu Studio. Printing went smoothly, but some edges warped, so I had to sand those surfaces flat.',
    'Soldering — I troubleshot shorts caused by broken cords, cold solder joints and tangled stripped wires. Each time, I reopened the board, resoldered the joints and added hot glue so the same problem wouldn’t happen again.',
    'Assembly — Using the joint structures I designed during modeling, I fitted the sensors, display and atomizer in order. My plans for the circuits and wick didn’t always match reality; after four rounds of printing and fitting, I arrived at the current Monklap.',
  ]),
  gallery(
    [
      await image('process-modeling.jpg', 'Modeling in Rhino'),
      await image('process-printing.jpg', '3D printing on a Bambu Lab A1'),
      await image('process-soldering.jpg', 'Soldering the circuit board'),
      await image('process-assembly.jpg', 'Fitting the electronics into the shell'),
    ],
    'Modeling · Printing · Soldering · Assembly',
    2,
  ),
  chapter('Monklap, awake.', [
    'The finished Monklap: live OLED eyes, ultrasonic sensors in the nostrils and an atomizer in the mouth, all running on an ESP32.',
  ]),
  gallery(
    [
      await image('final-front.jpg', 'Monklap front, awake'),
      await image('final-three-quarter.jpg', 'Monklap three-quarter view'),
      await image('final-mist.jpg', 'Clap triggers a pulse of mist'),
    ],
    'Front — awake · Three-quarter view · Clap → pulse of mist',
    3,
  ),
]

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
