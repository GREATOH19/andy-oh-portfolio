import {defineField, defineType} from 'sanity'

export const mediaAlbum = defineType({
  name: 'mediaAlbum',
  title: 'Media album',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Album title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Shown on the site when set. Used in Studio lists.',
    }),
    defineField({
      name: 'year',
      title: 'Year (optional)',
      type: 'string',
      description: 'e.g. 2024. Groups this album under a year heading on detail pages.',
    }),
    defineField({
      name: 'images',
      title: 'Photos & videos',
      type: 'array',
      of: [{type: 'cmsMediaItem'}],
      description: 'Add as many items as needed. Each album is edited as its own document for easier management.',
    }),
  ],
  orderings: [
    {
      title: 'Year, newest',
      name: 'yearDesc',
      by: [
        {field: 'year', direction: 'desc'},
        {field: 'title', direction: 'asc'},
      ],
    },
    {
      title: 'Title A–Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', year: 'year', images: 'images'},
    prepare({title, year, images}) {
      const count = Array.isArray(images) ? images.length : 0
      const subtitle = [year, `${count} item${count === 1 ? '' : 's'}`].filter(Boolean).join(' · ')
      return {
        title: title || 'Untitled album',
        subtitle,
      }
    },
  },
})
