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
  ...(paragraphs.length ? {body: paragraphs.map(para)} : {}),
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

const hero = await image('render-front.jpg', 'Monklap rendering')
const demo = await video('monklap-demo.mp4', 'Monklap waking, smiling and misting after a clap')

const heading = (text) => ({...para(text), style: 'h3'})
const bullet = (text) => ({...para(text), listItem: 'bullet', level: 1})
const labeled = (label, text) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [
    {_type: 'span', _key: key(), text: `${label} `, marks: ['strong']},
    {_type: 'span', _key: key(), text, marks: []},
  ],
})

const textBox = (label, body) => ({_type: 'projectTextBox', _key: key(), label, body})
const h2 = (text) => ({...para(text), style: 'h2'})

const zigzag = (layout, body, images, caption, extra = {}) => ({
  _type: 'projectZigzagRow',
  _key: key(),
  layout,
  body,
  images,
  caption,
  ...extra,
})

const columns = (ratio, left, right) => ({
  _type: 'projectColumns',
  _key: key(),
  ratio,
  left,
  right,
})

const quote = (text, attribution) => ({
  _type: 'projectQuote',
  _key: key(),
  quote: [para(text)],
  attribution,
})

const process = (steps, cols, caption) => ({
  _type: 'projectProcess',
  _key: key(),
  columns: cols,
  caption,
  steps,
})

const step = (media, caption) => ({_type: 'processStep', _key: key(), media, caption})

const faceStates = [
  ['rest', '01 Rest — nobody near, or no sound'],
  ['wake', '02 Wake — someone near + clap or noise'],
  ['smile', '03 Smile — smiles back at the clap'],
  ['pulse', '04 Pulse — 1.5 s burst of mist'],
]

const story = [
  chapter('Concept', [
    'Monklap is a wall-mounted or desktop diffuser shaped like a friendly monkey. Walk up and clap, and it responds with a pulse of fragrant mist from its mouth.',
  ]),
  zigzag(
    'textLeft',
    [
      labeled('Touchless.', 'Sound and proximity replace the spray trigger, for moments when your hands are busy, wet or full.'),
      labeled('Interactive.', 'An OLED face gives it a character and shows visible feedback for every state.'),
      labeled('Ambient.', 'A wick-fed ultrasonic atomizer releases a 1.5-second burst of mist on demand, not a constant stream.'),
    ],
    [demo],
    'Rest → wake → smile → pulse',
  ),
  quote('No buttons, no app, nothing to touch.', 'Monklap'),

  textBox('Who it is for', [h2('Who it is for'), para('Three groups who want scent to feel like a moment of play, not another chore.')]),
  columns(
    '50-50',
    [
      heading('Aesthetic & tech enthusiasts'),
      para('Gen Z and millennials looking for desk-friendly home objects with sound-driven, physical interaction rather than another standard IoT device.'),
      heading('Touchless, functional users'),
      para('People who need instant, hands-free odor control while cooking, caring for pets, or whenever their hands are busy.'),
    ],
    [
      heading('Experiential commercial spaces'),
      para('Pop-up stores, cafés and galleries that want interactive, sensory branding at the entrance — a scent that greets visitors.'),
      heading('Where it lives'),
      bullet('Desk setups'),
      bullet('Kitchens'),
      bullet('Pop-ups, cafés and galleries'),
    ],
  ),

  textBox('From a button to a clap', [
    h2('From a button to a clap'),
    para('Monklap began as a “Sound & Scent System”: a comfort tool for public spaces that played music as people walked by, then sprayed fragrance on their wrists at the press of a button.'),
    para('I kept the walk-up wake, the digital face and scent as a reward. The button became a clap, and the form became a monkey.'),
  ]),
  media(await image('sketch-concept.jpg', 'Initial concept sketch'), 'Initial concept — walk-by music & wrist spray', {mediaWidth: 'medium'}),
  media(await image('sketch-form.jpg', 'Form studies'), 'Form studies — head, sensors & tank', {mediaWidth: 'medium'}),

  chapter('How it works', [
    'An ESP32 reads two sensors, picks a face for the OLED eyes and decides when to fire the atomizer. It runs on USB 5V.',
  ]),
  columns(
    '50-50',
    [
      heading('Input · Sense'),
      labeled('Ultrasonic sensor (nostrils).', 'Checks that someone is near.'),
      labeled('Sound sensor (lower left).', 'Listens for a clap or noise.'),
    ],
    [
      heading('Output · Respond'),
      labeled('2.8″ OLED display (eyes).', 'Draws the face state.'),
      labeled('Ultrasonic atomizer (mouth).', 'Fires a 1.5 s burst of mist through a driver board.'),
    ],
  ),
  process(
    await Promise.all(
      faceStates.map(async ([name, cap]) => step(await image(`face-${name}.jpg`, `${name} face on the real screen`), cap)),
    ),
    4,
    'Interaction logic — face states on the real screen',
  ),

  textBox('Inside the face', [
    h2('Inside the face'),
    para('Everything lives inside the monkey’s face: the OLED eyes, ultrasonic sensors in the nostrils, the atomizer in the mouth and the sound sensor at the lower left. Four snap-fit hooks hold the shell together, and a bayonet tank lid and tub print as one piece.'),
    para('A J-shaped wick, the widest bend that fits, draws water from the tank up to the mouth by capillary action.'),
  ]),
  media(await image('wireframe.jpg', 'Front and side wireframe breakdown with labels'), 'Wireframe breakdown — hidden lines on, drawn from the Rhino model', {mediaWidth: 'bleed'}),

  zigzag(
    'textRight',
    [
      heading('Fill, twist, clap.'),
      labeled('1. Fill the tank.', 'Fill it with water and a water-soluble air freshener.'),
      labeled('2. Twist into the head.', 'The lid’s bayonet locks into the head. A wick carries water up to the mouth.'),
      labeled('3. Hang it and clap.', 'A keyhole slot on the back hangs it on a single screw. No buttons — the face does the rest.'),
    ],
    [await image('assembly-exploded.jpg', 'Exploded assembly: fill, twist, hang and clap')],
    'System & assembly',
  ),

  chapter('Process & result', [
    'Four rounds of printing and fitting took Monklap from rough sketches to a working prototype.',
  ]),
  process(
    [
      step(await image('process-modeling.jpg', 'Modeling in Rhino'), 'Modeling'),
      step(await image('process-printing.jpg', '3D printing on a Bambu Lab A1'), 'Printing'),
      step(await image('process-soldering.jpg', 'Soldering the circuit board'), 'Soldering'),
      step(await image('process-assembly.jpg', 'Fitting the electronics into the shell'), 'Assembly'),
    ],
    4,
    undefined,
  ),
  columns(
    '50-50',
    [
      heading('Modeling'),
      para('Taking Monklap from rough sketches to 3D models in Rhino taught me that the more specific a plan is, the less time I lose troubleshooting changes later. I now understand not only how to model objects for real-world use, but also how to plan a project so each stage flows into the next with less friction.'),
      heading('3D printing'),
      para('I printed the parts from my Rhino models on a Bambu Lab A1 using Bambu Studio. Printing itself went smoothly, but some edges warped, so I had to sand those surfaces flat.'),
    ],
    [
      heading('Soldering'),
      para('I troubleshot shorts caused by broken cords, cold solder joints and tangled stripped wires. Each time, I reopened the board, resoldered the joints and added hot glue so the same problem wouldn’t happen again.'),
      heading('Assembly'),
      para('Using the joint structures I designed during modeling, I fitted the sensors, display and atomizer in order. My plans for the circuits and wick didn’t always match reality, so it took a lot of trial and error. After four rounds of printing and fitting, I arrived at the current Monklap.'),
    ],
  ),

  textBox('Monklap, awake.', [
    h2('Monklap, awake.'),
    para('The finished Monklap: live OLED eyes, ultrasonic sensors in the nostrils and an atomizer in the mouth, all running on an ESP32.'),
  ]),
  {
    _type: 'projectPhotoCollage',
    _key: key(),
    portraitSide: 'left',
    portrait: await image('final-mist.jpg', 'A clap triggers a pulse of mist'),
    strips: [
      await image('final-front.jpg', 'Monklap front, awake'),
      await image('final-three-quarter.jpg', 'Monklap three-quarter view'),
    ],
    caption: 'Clap → pulse of mist · Front — awake · Three-quarter view',
  },
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
