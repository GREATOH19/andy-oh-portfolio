import {defineField, defineType} from 'sanity'

export const archiveBlock = defineType({
  name: 'archiveBlock',
  title: 'Archive',
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
      initialValue: 'Archive',
    }),
    defineField({
      name: 'archiveProjects',
      title: 'Archive projects',
      type: 'array',
      description:
        'Unlimited. The More page shows 3; the full list is on /more/archive (grouped by year). Use project document actions to add or remove.',
      of: [{type: 'reference', to: [{type: 'project'}]}],
    }),
  ],
  preview: {
    select: {heading: 'heading', enabled: 'enabled', count: 'archiveProjects'},
    prepare({heading, enabled, count}) {
      const n = Array.isArray(count) ? count.length : 0
      return {
        title: heading || 'Archive',
        subtitle: `${enabled === false ? 'Hidden · ' : ''}${n} project${n === 1 ? '' : 's'}`,
      }
    },
  },
})
