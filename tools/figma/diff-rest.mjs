/**
 * diff.js without the Figma MCP: reads a frame over the Figma REST API (free on Starter, no monthly call cap)
 * and lists what changed since the baseline, in the same shape as diff.js.
 *
 *   npm run figma:diff -- <Frame name>            → changes since the baseline
 *   npm run figma:diff -- <Frame name> --stamp    → save the current state as the baseline (tools/figma/baselines/)
 *
 * Baseline: tools/figma/baselines/<Frame>.json if present, else the stamp.js data stored in the file.
 * Token: FIGMA_TOKEN in .env.local (figma.com → Settings → Security → Personal access tokens, "File content: read").
 */
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const FILE = 'UOt6eTILl5Vo2tXEzMtKRO'
try { process.loadEnvFile(new URL('../../.env.local', import.meta.url)) } catch {}
const token = process.env.FIGMA_TOKEN
if (!token) throw new Error('Set FIGMA_TOKEN in .env.local (figma.com → Settings → Security → Personal access tokens)')

const args = process.argv.slice(2)
const frameName = args.find((a) => !a.startsWith('-'))
if (!frameName) throw new Error('Usage: npm run figma:diff -- <Frame name> [--stamp]')
const baselineFile = fileURLToPath(new URL(`baselines/${frameName}.json`, import.meta.url))

const api = async (p) => {
  const r = await fetch(`https://api.figma.com/v1/files/${FILE}${p}`, {headers: {'X-Figma-Token': token}})
  if (!r.ok) throw new Error(`Figma ${r.status}: ${(await r.text()).slice(0, 200)}`)
  return r.json()
}

const index = await api('?depth=2')
let page, frame
for (const pg of index.document.children) for (const F of pg.children ?? []) if (F.type === 'FRAME' && F.name === frameName) [page, frame] = [pg, F]
if (!frame) throw new Error(`No frame "${frameName}" in the file`)
const root = (await api(`/nodes?ids=${frame.id}&plugin_data=shared`)).nodes[frame.id].document

// Same fields as snap.js, from REST data. Fonts are compared as "family size" (REST has no fontName.style).
const round3 = (c) => ({r: +c.r.toFixed(3), g: +c.g.toFixed(3), b: +c.b.toFixed(3)})
const paints = (fills) => JSON.stringify(fills.map((f) => (f.type === 'IMAGE' ? f.imageRef : f.type === 'SOLID' ? [round3(f.color), f.opacity ?? 1] : f.type)))
const snap = (n, parent) => {
  const b = n.absoluteBoundingBox, pb = parent.absoluteBoundingBox
  const s = {x: Math.round(b.x - pb.x), y: Math.round(b.y - pb.y), w: Math.round(b.width), h: Math.round(b.height), v: n.visible !== false}
  if (n.type === 'TEXT') Object.assign(s, {c: n.characters, font: `${n.style?.fontFamily} ${n.style?.fontSize}`})
  if (Array.isArray(n.fills)) s.p = paints(n.fills)
  return s
}
// stamp.js baseline (plugin API shapes) → the shape above.
const fromPlugin = (json) => {
  const o = JSON.parse(json), s = {x: o.x, y: o.y, w: o.w, h: o.h, v: o.v}
  if (o.c !== undefined) { const f = JSON.parse(o.f); Object.assign(s, {c: o.c, font: `${f[0].family} ${f[1]}`}) }
  if (o.p !== undefined) s.p = JSON.stringify(JSON.parse(o.p).map((p) => (Array.isArray(p) ? [round3(p[0]), p[1]] : p)))
  return s
}

const now = {}
const walk = (n, parent) => { if (parent && n.absoluteBoundingBox) now[n.id] = {name: n.name, type: n.type, ...snap(n, parent)}; for (const c of n.children ?? []) walk(c, n) }
walk(root, null)

if (args.includes('--stamp')) {
  fs.mkdirSync(path.dirname(baselineFile), {recursive: true})
  fs.writeFileSync(baselineFile, JSON.stringify({stamped: new Date().toISOString(), nodes: now}, null, 1))
  console.log(`${page.name} / ${frameName}: ${Object.keys(now).length} layers stamped → tools/figma/baselines/${frameName}.json`)
  process.exit(0)
}

let base
if (fs.existsSync(baselineFile)) base = JSON.parse(fs.readFileSync(baselineFile, 'utf8')).nodes
else {
  const ids = JSON.parse(root.sharedPluginData?.andy?.ids ?? '[]')
  if (!ids.length) { console.log(JSON.stringify({[frameName]: 'not stamped'})); process.exit(0) }
  base = Object.fromEntries(ids.map((id) => [id, null]))
  const pick = (n) => { const b = n.sharedPluginData?.andy?.b; if (b && n.id in base) base[n.id] = fromPlugin(b); for (const c of n.children ?? []) pick(c) }
  pick(root)
}

const changes = []
for (const [id, s] of Object.entries(now)) {
  if (!(id in base)) { changes.push({kind: 'added', id, ...s}); continue }
  const o = base[id]
  if (!o) continue
  const d = {}
  for (const k of Object.keys(s)) if (k !== 'name' && k !== 'type' && JSON.stringify(s[k]) !== JSON.stringify(o[k])) d[k] = [o[k], s[k]]
  if (Object.keys(d).length) changes.push({kind: 'changed', id, name: s.name, ...d})
}
for (const id of Object.keys(base)) if (!(id in now)) changes.push({kind: 'deleted', id, name: base[id]?.name})
console.log(JSON.stringify(changes.length ? {[`${page.name} / ${frameName}`]: changes} : {[frameName]: 'no changes'}, null, 1))
