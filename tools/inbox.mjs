import fs from 'node:fs'
import path from 'node:path'
import {execFileSync} from 'node:child_process'

const IMG = /\.(jpe?g|png|webp)$/i

export function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    if (!fs.existsSync(f)) continue
    for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
}

function parseValue(v) {
  v = v.replace(/\s+#.*$/, '').trim()
  if (v.startsWith('[') && v.endsWith(']'))
    return v.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
  return v.replace(/^["']|["']$/g, '')
}

export function readBrief(dir) {
  const file = path.join(dir, 'brief.md')
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}`)
  const raw = fs.readFileSync(file, 'utf8')
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) throw new Error('brief.md needs a --- frontmatter --- block')
  const meta = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z]+):\s*(.*)$/)
    if (kv) meta[kv[1]] = parseValue(kv[2])
  }
  if (!meta.title) throw new Error('brief.md: title is required')
  meta.slug ||= meta.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const body = m[2].trim()
  return {meta, body, paragraphs: body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)}
}

/** Returns ordered list of image file paths; PDFs are rasterised into dir/_pages. */
export function collectImages(dir) {
  const out = []
  const pages = path.join(dir, '_pages')
  for (const name of fs.readdirSync(dir).sort()) {
    if (name.startsWith('_') || name === 'brief.md') continue
    const p = path.join(dir, name)
    if (IMG.test(name)) out.push(p)
    else if (/\.pdf$/i.test(name)) {
      fs.mkdirSync(pages, {recursive: true})
      const prefix = path.join(pages, path.basename(name, '.pdf'))
      execFileSync('pdftoppm', ['-r', '150', '-jpeg', '-jpegopt', 'quality=90', p, prefix])
      for (const f of fs.readdirSync(pages).sort())
        if (f.startsWith(path.basename(name, '.pdf') + '-')) out.push(path.join(pages, f))
    }
  }
  if (!out.length) throw new Error(`No images or PDFs found in ${dir}`)
  return out
}

export function buildCaption(meta, paragraphs) {
  const tags = (meta.hashtags || []).map((t) => '#' + t.replace(/^#/, ''))
  return [meta.title + (meta.subtitle ? ' — ' + meta.subtitle : ''), '', ...paragraphs.slice(0, 2), '', tags.join(' ')]
    .join('\n').trim() + '\n'
}
