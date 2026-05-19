import {defineField, defineType} from 'sanity'

export const photographyBlock = defineType({
  name: 'photographyBlock',
  title: 'Photography',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show on site',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'defaultExpanded',
      title: 'Expanded by default',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Photography',
    }),
    defineField({
      name: 'albums',
      title: 'Albums',
      type: 'array',
      of: [{type: 'photoAlbum'}],
      description: 'Unlimited images. The More page previews 3; the full grid is on /more/photography.',
    }),
  ],
  preview: {
    select: {heading: 'heading', enabled: 'enabled', albums: 'albums'},
    prepare({heading, enabled, albums}) {
      const count = Array.isArray(albums)
        ? albums.reduce((n, a) => n + (Array.isArray(a?.images) ? a.images.length : 0), 0)
        : 0
      return {
        title: heading || 'Photography',
        subtitle: `${enabled === false ? 'Hidden · ' : ''}${count} image${count === 1 ? '' : 's'}`,
      }
    },
  },
})
