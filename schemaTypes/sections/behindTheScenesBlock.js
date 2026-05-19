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
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'cmsImage'}],
      description:
        'Unlimited. The More page previews 3; the full grid is on /more/behind-the-scenes (drag order).',
    }),
  ],
  preview: {
    select: {heading: 'heading', enabled: 'enabled', images: 'images'},
    prepare({heading, enabled, images}) {
      const count = Array.isArray(images) ? images.length : 0
      return {
        title: heading || 'Behind the scene',
        subtitle: `${enabled === false ? 'Hidden · ' : ''}${count} image${count === 1 ? '' : 's'}`,
      }
    },
  },
})
