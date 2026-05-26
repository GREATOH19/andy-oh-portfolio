import {defineField, defineType} from 'sanity'

export const projectChapter = defineType({
  name: 'projectChapter',
  title: 'Chapter',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      description: 'Short chapter title — e.g. Context, Approach, Outcome',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({
      title: title || 'Chapter (draft)',
      subtitle: 'Text',
    }),
  },
})
