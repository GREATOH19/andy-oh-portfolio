import fs from 'node:fs'
import path from 'node:path'
import {pathToFileURL} from 'node:url'
import {chromium} from 'playwright-core'
import {FONT_CSS, HERO_FADE_CSS, WASH_CSS, WASH_HTML, colors, fonts} from './brand.mjs'

const W = 1080
const H = 1350
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]))

const page = (body, extra = '') => `<!doctype html><meta charset="utf-8"><style>
${FONT_CSS}${WASH_CSS}${HERO_FADE_CSS}
*{box-sizing:border-box}
html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;position:relative;font-family:${fonts.sans};color:${colors.ink};-webkit-font-smoothing:antialiased}
${extra}
</style>${body}`

export function coverHtml({img, title, subtitle}) {
  return page(
    `<img src="${img}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
     <div class="hero-fade"></div>
     <h1 class="card-shadow" style="position:absolute;left:72px;right:72px;bottom:${subtitle ? 190 : 120}px;margin:0;font-weight:600;font-size:112px;line-height:1.02;letter-spacing:-.03em;color:#fff">${esc(title)}</h1>
     ${subtitle ? `<p class="card-shadow" style="position:absolute;left:72px;right:72px;bottom:104px;margin:0;font-size:38px;line-height:1.3;color:#fff">${esc(subtitle)}</p>` : ''}`,
  )
}

export function photoHtml({img, label}) {
  return page(
    `${WASH_HTML}
     <img src="${img}" style="position:absolute;left:48px;top:48px;width:${W - 96}px;height:${H - 168}px;object-fit:contain">
     <p style="position:absolute;left:72px;bottom:48px;margin:0;font-size:26px;font-weight:500;color:${colors.muted}">${esc(label)}</p>`,
  )
}

export function closingHtml({title, year, handle}) {
  return page(
    `${WASH_HTML}
     <div style="position:absolute;left:72px;right:72px;top:50%;transform:translateY(-62%)">
       <h1 style="margin:0;font-weight:600;font-size:132px;line-height:1;letter-spacing:-.03em;color:${colors.titleTone}">${esc(title)}</h1>
       <div style="width:120px;height:8px;margin-top:48px;background:${colors.highlight}"></div>
       <p style="margin:36px 0 0;font-size:34px;font-weight:500;color:${colors.muted}">${esc([year, handle].filter(Boolean).join('  ·  '))}</p>
     </div>`,
  )
}

/** Render [{html}] to JPEG buffers via headless Chromium at 1080x1350. */
export async function renderSlides(htmls, workDir) {
  fs.mkdirSync(workDir, {recursive: true})
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || findChromium(),
    args: ['--allow-file-access-from-files'],
  })
  try {
    const ctx = await browser.newContext({viewport: {width: W, height: H}, deviceScaleFactor: 1})
    const out = []
    for (const [i, html] of htmls.entries()) {
      const file = path.join(workDir, `slide-${i + 1}.html`)
      fs.writeFileSync(file, html)
      const p = await ctx.newPage()
      await p.goto(pathToFileURL(file).href)
      await p.evaluate(() => document.fonts.ready)
      await p.waitForLoadState('load')
      out.push(await p.screenshot({type: 'jpeg', quality: 92}))
      await p.close()
    }
    return out
  } finally {
    await browser.close()
  }
}

function findChromium() {
  const roots = ['/opt/pw-browsers', path.join(process.env.HOME || '', '.cache/ms-playwright'), path.join(process.env.HOME || '', 'Library/Caches/ms-playwright')]
  for (const r of roots) {
    if (!fs.existsSync(r)) continue
    for (const d of fs.readdirSync(r).sort().reverse()) {
      if (!d.startsWith('chromium')) continue
      for (const rel of ['chrome-linux/chrome', 'chrome-linux/headless_shell', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium', 'chrome-headless-shell-linux64/chrome-headless-shell', 'chrome-headless-shell-mac-arm64/chrome-headless-shell']) {
        const p = path.join(r, d, rel)
        if (fs.existsSync(p)) return p
      }
    }
  }
  throw new Error('Chromium not found. Run `npx playwright-core install chromium` or set PLAYWRIGHT_CHROMIUM_PATH.')
}
