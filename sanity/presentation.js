import {defineDocuments, defineLocations} from 'sanity/presentation'
import {presentationTool} from 'sanity/presentation'

const previewOrigin =
  (typeof process !== 'undefined' && process.env.SANITY_STUDIO_PREVIEW_ORIGIN) ||
  'http://localhost:3000'

export const presentation = presentationTool({
  previewUrl: {
    origin: previewOrigin,
    preview: '/',
    previewMode: {
      enable: '/api/draft-mode/enable',
    },
  },
  resolve: {
    mainDocuments: defineDocuments([
      {
        route: '/projects/:slug',
        filter: `_type == "project" && slug.current == $slug`,
      },
    ]),
    locations: {
      project: defineLocations({
        select: {title: 'title', slug: 'slug.current'},
        resolve: (doc) => ({
          locations: [
            {
              title: doc?.title || 'Project',
              href: doc?.slug ? `/projects/${doc.slug}` : '/',
            },
          ],
        }),
      }),
    },
  },
})
