# Figma mirror of the live site

File: https://www.figma.com/design/UOt6eTILl5Vo2tXEzMtKRO (Starter plan, 3 pages)

- **Site**: Home, About (Contact redirects to About)
- **More**: More, Archive, Behind the scenes, Photography
- **Projects**: the 9 live projects, in Work-grid order

Every frame is the live page at 1440 wide: editable text in Geist / Space Grotesk / Playfair (as the site renders them),
rectangles for cards and bars, real images. Layer names are the site's element selectors (`h1.text-5xl`, `p.m-0`, `img.object-cover`).
Videos are grey placeholders named `video.absolute (video)`.

## How the sync works

A frame comes from one of two places:

- **Brief** (Cursor, Figma MCP): `npm run publish:figma -- <slug>` writes `inbox/<slug>/out/figma/build.js` (= the brief as
  `D` + `brief-build.js`), `stamp.js` and `diff.js`. The agent runs `build.js` with `use_figma`, asks `upload_assets` for one URL
  per returned image id (same order, `scaleMode: FILL`), saves the response as `out/figma/uploads.json`, runs
  `npm run publish:figma -- <slug> --upload`, then `use_figma(stamp.js)`. Layer names are the brief's fields (`title`, `lead`,
  `chapter`, `p`, `caption`, `img images/…`), and the text is exactly what `publish:project` wrote to Sanity.
- **Capture** (Claude, built-in browser): `capture.js` runs in the live page and flattens it into layers; `build.js` (stored in
  the file as `sharedPluginData('andy','build')`) draws the frame; images go straight from the browser to Figma. `build.js` uses
  `figma.create*`, which the Cursor MCP does not expose (`$fig` only), so this path stays with the Claude connector.

Then, for either kind of frame:

2. **Stamp**: `stamp.js` (`'andy','stamp'`) saves every layer's state as the baseline = "what the live site shows".
3. **Edit in Figma**: change text, swap images, move or restyle things, add layers.
4. **Diff**: `diff.js` (`'andy','diff'`) lists what changed since the baseline, per frame. In Cursor: `use_figma` with
   `const ARGS = {frames: [...]}` + `snap.js` + `diff.js` (brief frames have this ready in `out/figma/diff.js`).
   Without the MCP (Starter plan: 20 read calls a month): `npm run figma:diff -- <Frame>` reads the frame over the REST API
   with `FIGMA_TOKEN` from `.env.local` and prints the same list; `--stamp` keeps a local baseline in `baselines/`.
5. **Apply** (Claude `/portfolio sync figma`, or the agent in Cursor):
   - text → `npm run apply:text-edits -- edits.json` → Sanity **drafts** (test: Studio Presentation / draft preview)
   - images → exported from Figma, uploaded to the Sanity doc → draft
   - layout / type / colour → code change on a branch → Vercel **preview** URL (test)
   - Andy publishes the drafts in Studio and merges the branch = **live** site. Then re-stamp.

`snap.js` is shared by stamp and diff; the stored versions are `snap.js + stamp.js` and `snap.js + diff.js`.
