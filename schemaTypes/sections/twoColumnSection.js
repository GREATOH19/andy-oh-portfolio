import {defineField, defineType} from 'sanity'

export const twoColumnSection = defineType({
  name: 'twoColumnSection',
  title: 'Two column',
  type: 'object',
  fields: [
    defineField({
      name: 'left',
      title: 'Left',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'right',
      title: 'Right',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Two column'}
    },
  },
})
