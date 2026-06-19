import {defineField, defineType} from 'sanity'

export const behindTheScenesBlock = defineType({
  name: 'behindTheScenesBlock',
  title: 'Behind the scene',
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
      initialValue: 'Behind the scene',
    }),
    defineField({
      name: 'albums',
      title: 'Albums',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'mediaAlbum'}]}],
      description:
        'Link media albums (create under More → Media albums). Each album can hold 100+ photos or videos.',
    }),
  ],
  preview: {
    select: {heading: 'heading', enabled: 'enabled', albums: 'albums'},
    prepare({heading, enabled, albums}) {
      const count = Array.isArray(albums) ? albums.length : 0
      return {
        title: heading || 'Behind the scene',
        subtitle: `${enabled === false ? 'Hidden · ' : ''}${count} album${count === 1 ? '' : 's'}`,
      }
    },
  },
})
