/**
 * inbox/<name> → Instagram carousel (1080x1350, 4:5).
 * Without --post: renders slides + caption.txt to inbox/<name>/_out for review.
 * With --post: uploads slides to Sanity CDN (public URLs) and publishes via Instagram Graph API.
 */
import fs from 'node:fs'
import path from 'node:path'
import {pathToFileURL} from 'node:url'
import {createClient} from '@sanity/client'
import {closingHtml, coverHtml, photoHtml, renderSlides} from '../tools/slides.mjs'
import {buildCaption, collectImages, loadEnv, readBrief} from '../tools/inbox.mjs'

loadEnv()
const args = process.argv.slice(2)
const dir = args.find((a) => !a.startsWith('--'))
const post = args.includes('--post')
if (!dir) throw new Error('Usage: npm run publish:instagram -- inbox/<name> [--post]')

const {meta, paragraphs} = readBrief(dir)
const files = collectImages(dir)
const max = Math.min(10, Number(meta.instagramMax || 10))
const body = files.slice(0, Math.max(1, max - 2))

const out = path.join(dir, '_out')
fs.rmSync(out, {recursive: true, force: true})
fs.mkdirSync(out, {recursive: true})

const url = (f) => pathToFileURL(path.resolve(f)).href
const coverSrc = files[Math.max(0, Number(meta.cover || 1) - 1)]
const htmls = [
  coverHtml({img: url(coverSrc), title: meta.title, subtitle: meta.subtitle}),
  ...body.map((f) => photoHtml({img: url(f), label: meta.title})),
  closingHtml({title: meta.title, year: meta.year, handle: process.env.INSTAGRAM_HANDLE ? '@' + process.env.INSTAGRAM_HANDLE.replace(/^@/, '') : ''}),
].slice(0, 10)

const buffers = await renderSlides(htmls, path.join(out, '_html'))
fs.rmSync(path.join(out, '_html'), {recursive: true, force: true})
const paths = buffers.map((buf, i) => {
  const p = path.join(out, `slide-${String(i + 1).padStart(2, '0')}.jpg`)
  fs.writeFileSync(p, buf)
  return p
})
const caption = buildCaption(meta, paragraphs)
fs.writeFileSync(path.join(out, 'caption.txt'), caption)
console.log(`Rendered ${paths.length} slides + caption.txt → ${out}`)

if (!post) {
  console.log('Review them, then re-run with --post to publish.')
  process.exit(0)
}

const token = process.env.INSTAGRAM_ACCESS_TOKEN
const userId = process.env.INSTAGRAM_USER_ID
if (!token || !userId || !process.env.SANITY_WRITE_TOKEN)
  throw new Error('--post needs INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID, SANITY_WRITE_TOKEN')

const sanity = createClient({
  projectId: 'sttir3vc', dataset: 'production', apiVersion: '2025-01-01',
  token: process.env.SANITY_WRITE_TOKEN, useCdn: false,
})
const urls = []
for (const p of paths) urls.push((await sanity.assets.upload('image', fs.createReadStream(p), {filename: path.basename(p)})).url)

const G = 'https://graph.facebook.com/v21.0'
async function graph(endpoint, params) {
  const res = await fetch(`${G}/${endpoint}`, {
    method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({...params, access_token: token}),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`Instagram API: ${JSON.stringify(json.error ?? json)}`)
  return json
}
const children = []
for (const u of urls) children.push((await graph(`${userId}/media`, {image_url: u, is_carousel_item: 'true'})).id)
const container = await graph(`${userId}/media`, {media_type: 'CAROUSEL', children: children.join(','), caption})
// containers can take a moment to finish processing
for (let i = 0; i < 20; i++) {
  const s = await (await fetch(`${G}/${container.id}?fields=status_code&access_token=${token}`)).json()
  if (s.status_code === 'FINISHED') break
  if (s.status_code === 'ERROR') throw new Error('Instagram container failed processing')
  await new Promise((r) => setTimeout(r, 3000))
}
const published = await graph(`${userId}/media_publish`, {creation_id: container.id})
console.log('Posted to Instagram, media id:', published.id)
