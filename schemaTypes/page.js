import {defineField, defineType} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'More page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      description: 'URL path, e.g. `more` → /more on the site.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'blocks',
      title: 'More blocks',
      type: 'array',
      description:
        'Archive, Photography, and Behind the scene blocks (~2-row masonry preview on /more, full views on detail pages). Drag to reorder; toggle “Show on site” per block.',
      of: [
        {type: 'archiveBlock'},
        {type: 'photographyBlock'},
        {type: 'behindTheScenesBlock'},
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Legacy sections',
      type: 'array',
      description: 'Optional rich content above the blocks (legacy).',
      of: [
        {type: 'richTextSection'},
        {type: 'imageSection'},
        {type: 'gallerySection'},
        {type: 'twoColumnSection'},
        {type: 'quoteSection'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {title, subtitle: slug ? `/${slug}` : undefined}
    },
  },
})

