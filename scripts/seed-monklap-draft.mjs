/**
 * Creates a Sanity DRAFT project "Monklap (draft)" from the Monklap portfolio slides.
 * Reuses image/video assets that already exist in the dataset; uploads nothing.
 * Touches only drafts.project-monklap-draft (createOrReplace, safe to re-run).
 * Run from repo root: npm run seed:monklap-draft
 * Then open Studio → Project → "Monklap (draft)" and publish when ready.
 */
import {randomUUID} from 'node:crypto'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})

const DOC_ID = 'drafts.project-monklap-draft'

const A = {
  assembly: 'image-4b30ee1c1416ac9564cc61d0e052ae978cf005e4-1500x2000-jpg',
  faceSmile: 'image-5380d7b39358416d153e782610e5331d1f7103aa-518x242-jpg',
  facePulse: 'image-6e4c2cdc44c087fa824ffb17aad123915d786abe-520x271-jpg',
  rhino: 'image-7bb74e4f24d6fbbfd0fb22e56c8878f605c6e002-906x554-jpg',
  printing: 'image-9c4080b2d25078ed7fb806a0f76a7789cdd70ea1-1500x2000-jpg',
  finalMist: 'image-b6e441319679df13be8053a6ccd23e010b9047a6-1100x1955-jpg',
  finalFront: 'image-c5b2d12ad8526799313dae61c13e6fdcbb082384-1886x2000-jpg',
  finalBlue: 'image-ce12439c66a1f973d58f481f073c3a1281e733fb-900x1111-jpg',
  finalThreeQuarter: 'image-d70722f693413001a24841785bdbcd7463f7e9d7-900x1111-jpg',
  sketchConcept: 'image-d96f82c0735f172244a9240f15da6aae4689803d-1120x1400-jpg',
  wireframe: 'image-daa8e67cfa98ee0748841223b99fcd707f9026c0-3256x1562-jpg',
  exploded: 'image-db2370eaace63b2e65843d5fc00ad0a7189789a8-2000x1827-jpg',
  faceWake: 'image-edef21899af28ea51c4b84d6d60500d780433642-520x264-jpg',
  sketchForm: 'image-ef7645fd0f4c33d8125e7f9fd486a8a06cd8450b-593x977-jpg',
  soldering: 'image-fa594d3896d5db8b2107e632f10caf5bfcbd417e-681x908-jpg',
  faceRest: 'image-ffd793bd1a1daaf079553cab90de3ee639ca48d7-520x295-jpg',
  demoVideo: 'file-084a8e8907de582220fd0ad3ee01a79f6cb6661f-mp4',
}

const key = () => randomUUID().slice(0, 12)

const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [{_type: 'span', _key: key(), text, marks: []}],
})

const bullet = (text) => ({...block(text), listItem: 'bullet', level: 1})

const imageField = (ref, alt) => ({
  _type: 'image',
  asset: {_type: 'reference', _ref: ref},
  ...(alt ? {alt} : {}),
})

const media = (ref, alt) => ({
  _type: 'cmsMediaItem',
  _key: key(),
  mediaType: 'image',
  image: imageField(ref, alt),
  alt,
})

const videoMedia = (ref, alt) => ({
  _type: 'cmsMediaItem',
  _key: key(),
  mediaType: 'video',
  video: {_type: 'file', asset: {_type: 'reference', _ref: ref}},
  alt,
})

const chapter = (title, body) => ({
  _type: 'projectChapter',
  _key: key(),
  title,
  tocTitle: title,
  body,
})

const gallery = (items, columns, caption) => ({
  _type: 'projectGallery',
  _key: key(),
  columns,
  images: items,
  ...(caption ? {caption} : {}),
})

const processBlock = (steps, columns) => ({
  _type: 'projectProcess',
  _key: key(),
  columns,
  steps: steps.map(([ref, caption]) => ({
    _type: 'processStep',
    _key: key(),
    media: media(ref, caption),
    caption,
  })),
})

const quote = (text) => ({
  _type: 'projectQuote',
  _key: key(),
  quote: [block(text)],
  attribution: 'Monklap',
})

const story = [
  chapter('Concept', [
    block(
      'Monklap is a wall-mounted or desktop diffuser shaped like a friendly monkey. Walk up and clap, and it responds with a pulse of fragrant mist from its mouth.',
    ),
    bullet(
      'Touchless. Sound and proximity replace the spray trigger, for moments when your hands are busy, wet or full.',
    ),
    bullet('Interactive. An OLED face gives it a character and shows visible feedback for every state.'),
    bullet(
      'Ambient. A wick-fed ultrasonic atomizer releases a 1.5-second burst of mist on demand, not a constant stream.',
    ),
  ]),
  gallery(
    [
      media(A.finalBlue, 'Monklap, front view'),
      media(A.finalThreeQuarter, 'Monklap, three-quarter view'),
      media(A.finalMist, 'Monklap releasing a pulse of mist'),
    ],
    3,
  ),
  quote('No buttons, no app, nothing to touch.'),
  chapter('Who it is for', [
    block('Three groups who want scent to feel like a moment of play, not another chore.'),
    bullet(
      'Aesthetic & tech enthusiasts: Gen Z and millennials looking for desk-friendly home objects with sound-driven, physical interaction rather than another standard IoT device.',
    ),
    bullet(
      'Touchless, functional users: people who need instant, hands-free odor control while cooking, caring for pets, or whenever their hands are busy.',
    ),
    bullet(
      'Experiential commercial spaces: pop-up stores, cafés and galleries that want interactive, sensory branding at the entrance, a scent that greets visitors.',
    ),
  ]),
  chapter('From a button to a clap', [
    block(
      'Monklap began as a "Sound & Scent System": a comfort tool for public spaces that played music as people walked by, then sprayed fragrance on their wrists at the press of a button.',
    ),
    block(
      'I kept the walk-up wake, the digital face and scent as a reward. The button became a clap, and the form became a monkey.',
    ),
  ]),
  gallery(
    [
      media(A.sketchConcept, 'Initial concept: walk-by music and wrist spray'),
      media(A.sketchForm, 'Form studies: head, sensors and tank'),
    ],
    2,
  ),
  chapter('How it works', [
    block(
      'An ESP32 reads two sensors, picks a face for the OLED eyes and decides when to fire the atomizer. It runs on USB 5V.',
    ),
    bullet('Input · Sense: an ultrasonic sensor (nostrils) checks that someone is near; a sound sensor (lower left) listens for a clap or noise.'),
    bullet('Output · Respond: a 2.8″ OLED display (eyes) draws the face state; an ultrasonic atomizer (mouth) fires a 1.5 s burst of mist through a driver board.'),
  ]),
  processBlock(
    [
      [A.faceRest, '01 Rest: nobody near, or no sound'],
      [A.faceWake, '02 Wake: someone near + clap or noise'],
      [A.faceSmile, '03 Smile: smiles back at the clap'],
      [A.facePulse, '04 Pulse: 1.5 s burst of mist'],
    ],
    4,
  ),
  chapter('Inside the face', [
    block(
      "Everything lives inside the monkey's face: the OLED eyes, ultrasonic sensors in the nostrils, the atomizer in the mouth and the sound sensor at the lower left. Four snap-fit hooks hold the shell together, and a bayonet tank lid and tub print as one piece.",
    ),
    block(
      'A J-shaped wick, the widest bend that fits, draws water from the tank up to the mouth by capillary action.',
    ),
  ]),
  {
    _type: 'projectMedia',
    _key: key(),
    media: media(A.wireframe, 'Wireframe breakdown, hidden lines on, drawn from the Rhino model'),
    caption: 'Wireframe breakdown, hidden lines on, drawn from the Rhino model',
  },
  chapter('Fill, twist, clap.', [
    block('1. Fill the tank. Fill it with water and a water-soluble air freshener.'),
    block("2. Twist into the head. The lid's bayonet locks into the head. A wick carries water up to the mouth."),
    block('3. Hang it and clap. A keyhole slot on the back hangs it on a single screw. No buttons, the face does the rest.'),
  ]),
  {
    _type: 'projectMedia',
    _key: key(),
    media: media(A.exploded, 'Exploded render of the shell and tank'),
  },
  chapter('Process & result', [
    block('Four rounds of printing and fitting took Monklap from rough sketches to a working prototype.'),
    block(
      'Modeling. Taking Monklap from rough sketches to 3D models in Rhino taught me that the more specific a plan is, the less time I lose troubleshooting changes later.',
    ),
    block(
      "3D printing. I printed the parts on a Bambu Lab A1 using Bambu Studio. Printing itself went smoothly, but some edges warped, so I had to sand those surfaces flat.",
    ),
    block(
      "Soldering. I troubleshot shorts caused by broken cords, cold solder joints and tangled stripped wires. Each time, I reopened the board, resoldered the joints and added hot glue so the same problem wouldn't happen again.",
    ),
    block(
      "Assembly. Using the joint structures I designed during modeling, I fitted the sensors, display and atomizer in order. My plans for the circuits and wick didn't always match reality, so it took a lot of trial and error.",
    ),
  ]),
  processBlock(
    [
      [A.rhino, 'Modeling'],
      [A.printing, 'Printing'],
      [A.soldering, 'Soldering'],
      [A.assembly, 'Assembly'],
    ],
    2,
  ),
  chapter('Monklap, awake.', [
    block(
      'The finished Monklap: live OLED eyes, ultrasonic sensors in the nostrils and an atomizer in the mouth, all running on an ESP32.',
    ),
  ]),
  {
    _type: 'projectMedia',
    _key: key(),
    media: videoMedia(A.demoVideo, 'Monklap demo: clap, smile, pulse of mist'),
    caption: 'Clap → pulse of mist',
  },
]

const doc = {
  _id: DOC_ID,
  _type: 'project',
  title: 'Monklap (draft)',
  slug: {_type: 'slug', current: 'monklap-draft'},
  subtitle: 'a touchless ambient scent system that answers a clap',
  year: '2026',
  coverImage: imageField(A.finalFront, 'Monklap, front view'),
  heroImage: media(A.finalFront, 'Monklap, front view'),
  lead: [
    block(
      'Monklap is a wall-mounted or desktop IoT diffuser shaped like a friendly monkey. Clap, and it wakes, smiles back and releases a 1.5-second pulse of mist, no buttons, no app, nothing to touch. Made for the Design Principle class in Industrial Design at RISD.',
    ),
  ],
  details: [
    {_type: 'detailLine', _key: key(), label: 'Type', value: 'Personal project · Design Principle class, RISD Industrial Design'},
    {_type: 'detailLine', _key: key(), label: 'Duration', value: 'October 2026'},
    {_type: 'detailLine', _key: key(), label: 'Key skills', value: 'Rhino 8, Bambu Studio, ESP32, soldering, 3D printing'},
    {_type: 'detailLine', _key: key(), label: 'Size', value: 'Wall-mounted / desktop object'},
    {_type: 'detailLine', _key: key(), label: 'Material', value: '3D-printed shell, ultrasonic atomizer, 2.8″ OLED'},
  ],
  highlights: [
    'Industrial design',
    'Interaction design',
    'Electronics',
    'Prototyping',
    '3D printing',
  ],
  story,
}

async function main() {
  const refs = [...new Set(Object.values(A))]
  const found = await client.fetch('*[_id in $ids]._id', {ids: refs})
  const missing = refs.filter((id) => !found.includes(id))
  if (missing.length) {
    throw new Error(`Missing assets in dataset (nothing written):\n${missing.join('\n')}`)
  }

  // createOrReplace only ever touches this one draft document.
  await client.createOrReplace(doc)
  console.log(`Draft created: ${DOC_ID}`)
  console.log('Open Studio → Project → "Monklap (draft)" to review, then Publish.')
  console.log('Preview on the site at /projects/monklap-draft once published.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
