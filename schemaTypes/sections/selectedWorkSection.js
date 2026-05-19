import {defineField, defineType} from 'sanity'

export const selectedWorkSection = defineType({
  name: 'selectedWorkSection',
  title: 'Selected work',
  type: 'object',
  description:
    'Heading for the project grid. Cards come from Work homepage → Featured on Work (max 9). Use project document actions to add or remove projects.',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Selected Work',
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Selected work'}
    },
  },
})
