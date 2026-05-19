import {defineField, defineType} from 'sanity'

export const photoAlbum = defineType({
  name: 'photoAlbum',
  title: 'Photo album',
  type: 'object',
  fields: [
    defineField({
      name: 'year',
      title: 'Year (optional)',
      type: 'string',
      description: 'e.g. 2024. When set, photos appear under this year on the Photography detail page.',
    }),
    defineField({
      name: 'title',
      title: 'Album title (optional)',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'cmsImage'}],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {year: 'year', title: 'title', images: 'images'},
    prepare({year, title, images}) {
      const count = Array.isArray(images) ? images.length : 0
      const label = [year, title].filter(Boolean).join(' · ') || 'Album'
      return {title: label, subtitle: `${count} image${count === 1 ? '' : 's'}`}
    },
  },
})
