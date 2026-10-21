# Pipeline

Sanity Studio at the repo root (project `sttir3vc`, dataset `production`), the site in `web/` (Next.js, Vercel from `main`).
Content for a project starts in `inbox/<slug>/` (see inbox/README.md) and fans out to two parallel targets:

```
agent ─┬─ Sanity  npm run publish:project -- <slug>   → drafts.project-<slug>
       └─ Figma   npm run publish:figma -- <slug>     → frame on the Projects page (file UOt6eTILl5Vo2tXEzMtKRO), via the Figma MCP
                → local: npm run dev (Studio :3333) + cd web && npm run dev (:3000)
                → live: Publish in Studio (content) / merge to main (code)
```

- Sanity holds the content; Figma is where Andy reviews and edits the same content as a page.
- Figma → site (tools/figma/README.md): run the frame's `diff.js`; text edits → `edits.json` → `npm run apply:text-edits`
  (Sanity draft); image edits → export from Figma, upload to the Sanity draft (or the `figma-plugin/` Sanity Sync page);
  layout / type / colour → change `web/` components, check on :3000. Re-stamp the frame once the change has landed.
- Content: when Andy asks for a change to land ("넣어 줘", "반영해"), the agent writes the Sanity draft **and publishes it**
 (createOrReplace live + delete draft, via `sanity exec --with-user-token`; CLI login = the GitHub account GREATOH19). Publishing
 changes the live site too (Vercel reads the same dataset). Code still goes live only when Andy merges to `main`.
- Design rules: DESIGN.md (tokens in tools/tokens.json). Product: PRODUCT.md.
