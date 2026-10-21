# Monklap draft: reference files

Reference copies of the draft page. Nothing here is served or compiled by the site
(`web/` does not import from `inbox/`).

| File | What it is |
| --- | --- |
| `../index.html` | The full single-page draft (sections, copy, styles, Clap demo). Same as `web/public/monklap/index.html`, which is what `/monklap` serves. Images are placeholders. |
| `ClapDemo.tsx` | React port of the Clap face demo (rest → wake → smile → pulse). Move it to `web/components/` to use it. |
| `../HANDOFF.md` | Deployment status and next steps. |

## Section map of the draft (copy and structure to reuse)
Hero + Clap demo · Overview (touchless / interactive / ambient) · Target users (3 groups) ·
ESP32 & sensors (2 inputs, 2 outputs, 4-step interaction logic) · Inside the face (wireframe + parts list) ·
Fill, twist, clap (3 steps) · Sketch & ideation (button → clap) · Process & lessons (modeling, printing, soldering, assembly) ·
Final prototype.

The same content, mapped to Sanity story blocks, is in `scripts/seed-monklap-draft.mjs`.

## Adding the Clap demo to the Sanity page
Sanity story blocks cannot run code. To show the demo on the CMS-driven page:
1. Add `ClapDemo.tsx` to `web/components/`.
2. Add a story block type (e.g. `projectClapDemo`, an empty object) under `schemaTypes/project/` and register it in
   `schemaTypes/index.js` and the `story` array in `schemaTypes/project.js`.
3. Render it from `web/components/ProjectSections.tsx` when `_type === "projectClapDemo"`.
4. Add the block to the seed script's `story` and re-run `npm run seed:monklap-replace`.
