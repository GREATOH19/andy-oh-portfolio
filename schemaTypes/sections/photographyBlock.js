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
      of: [{type: 'reference', to: [{type: 'mediaAlbum'}]}],
      description:
        'Link media albums (create under More → Media albums). Each album can hold 100+ photos or videos, grouped by year on /more/photography.',
    }),
  ],
  preview: {
    select: {heading: 'heading', enabled: 'enabled', albums: 'albums'},
    prepare({heading, enabled, albums}) {
      const count = Array.isArray(albums) ? albums.length : 0
      return {
        title: heading || 'Photography',
        subtitle: `${enabled === false ? 'Hidden · ' : ''}${count} album${count === 1 ? '' : 's'}`,
      }
    },
  },
})
