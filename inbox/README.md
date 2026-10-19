# inbox — drop a project, publish to site + Instagram

1. Create `inbox/<project-name>/` and put PDFs / photos in it (jpg, png, webp, pdf).
   Files are used in filename order. Files starting with `_` are ignored.
2. Add `brief.md` (see `_example/brief.md`).
3. Ask Claude Code: "inbox/<project-name> 올려줘", or run:

```
npm run publish:project -- inbox/<project-name>     # site: creates a DRAFT project in Sanity
npm run publish:instagram -- inbox/<project-name>   # Instagram: renders 1080x1350 slides + caption.txt
npm run publish:instagram -- inbox/<project-name> --post   # posts the carousel (after you reviewed _out/)
```

The site draft is not live until you press **Publish** in Sanity Studio.
Instagram slides land in `inbox/<project-name>/_out/` for review; nothing is posted without `--post`.

Required env (shell or `.env.local`, never committed):
`SANITY_WRITE_TOKEN` (Editor token), and for `--post`: `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`.
Requires `pdftoppm` (poppler) for PDFs.
