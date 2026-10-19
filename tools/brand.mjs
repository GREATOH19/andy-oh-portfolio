/**
 * Brand tokens for Instagram slides — mirrors web/app/globals.css (body wash, title tone,
 * hero fade, card title shadow) and web/lib/cmsFontClass.ts (typography roles).
 * Keep in sync with the "Andy Oh Portfolio" design system.
 */
import {createRequire} from 'node:module'
import path from 'node:path'
import {pathToFileURL} from 'node:url'

const require = createRequire(import.meta.url)
const fontFile = (pkg, file) =>
  pathToFileURL(path.join(path.dirname(require.resolve(`${pkg}/package.json`)), 'files', file)).href

const face = (family, weight, pkg, file) =>
  `@font-face{font-family:"${family}";font-weight:${weight};font-style:normal;src:url("${fontFile(pkg, file)}") format("woff2")}`

// Typography roles. Display default is weight 300 on the site, but Playfair ships 400–700 → renders 400.
export const FONT_CSS = [
  face('Playfair Display', 400, '@fontsource/playfair-display', 'playfair-display-latin-400-normal.woff2'),
  face('Playfair Display', 500, '@fontsource/playfair-display', 'playfair-display-latin-500-normal.woff2'),
  face('Geist', 400, '@fontsource/geist-sans', 'geist-sans-latin-400-normal.woff2'),
  face('Geist', 500, '@fontsource/geist-sans', 'geist-sans-latin-500-normal.woff2'),
  face('Geist Mono', 400, '@fontsource/geist-mono', 'geist-mono-latin-400-normal.woff2'),
].join('\n')

export const colors = {
  pageBg: '#eafcff',
  ink: '#111111',
  titleTone: '#4a5568',
  muted: '#666666',
  highlight: '#ffc72c',
}

export const fonts = {
  serif: '"Playfair Display", Georgia, "Noto Serif KR", serif',
  sans: 'Geist, system-ui, "Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
  mono: '"Geist Mono", ui-monospace, monospace',
}

/** The website body background, as three stacked layers (body, body::before, body::after). */
export const WASH_HTML = `
<div class="wash-base"></div><div class="wash-glow"></div><div class="wash-veil"></div>`

export const WASH_CSS = `
.wash-base,.wash-glow,.wash-veil{position:absolute;pointer-events:none}
.wash-base{inset:0;background-color:#eafcff;background-image:
  radial-gradient(1100px 720px at 54% 18%, rgba(86,205,255,.30), rgba(86,205,255,0) 66%),
  radial-gradient(980px 820px at 16% 56%, rgba(112,215,255,.28), rgba(112,215,255,0) 68%),
  radial-gradient(820px 520px at 68% 66%, rgba(255,255,255,.92), rgba(255,255,255,0) 72%),
  radial-gradient(760px 520px at 86% 50%, rgba(255,255,255,.48), rgba(255,255,255,0) 74%),
  radial-gradient(900px 580px at 26% 86%, rgba(255,199,44,.18), rgba(255,199,44,0) 70%),
  linear-gradient(180deg, #e6fdff 0%, #e6fdff 100%);
  background-position:center;background-repeat:no-repeat;background-size:cover}
.wash-glow{inset:-20%;filter:blur(62px);opacity:.85;background:
  radial-gradient(46% 36% at 54% 18%, rgba(86,205,255,.34), rgba(86,205,255,0) 74%),
  radial-gradient(44% 40% at 16% 56%, rgba(112,215,255,.32), rgba(112,215,255,0) 76%),
  radial-gradient(52% 34% at 68% 66%, rgba(255,255,255,.64), rgba(255,255,255,0) 76%)}
.wash-veil{inset:0;opacity:.85;background:
  radial-gradient(120% 95% at 52% 52%, rgba(255,255,255,0) 40%, rgba(255,255,255,.92) 100%),
  linear-gradient(0deg, rgba(255,255,255,.22), rgba(255,255,255,.22))}`

/** Project hero bottom fade (matte gray, soft) — carries white titles over photos. */
export const HERO_FADE_CSS = `
.hero-fade{position:absolute;left:0;right:0;bottom:0;height:62%;background-image:linear-gradient(to top,
  rgba(84,84,84,.5) 0%, rgba(84,84,84,.32) 20%, rgba(84,84,84,.17) 42%,
  rgba(84,84,84,.08) 62%, rgba(84,84,84,.03) 82%, transparent 100%)}
.card-shadow{text-shadow:0 1px 2px rgb(10 60 80/.55),0 2px 14px rgb(10 70 95/.48)}`
