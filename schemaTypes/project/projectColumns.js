import {defineField, defineType} from 'sanity'
import {projectPortableTextMembers} from './projectPortableText'

export const projectColumns = defineType({
  name: 'projectColumns',
  title: 'Two columns',
  type: 'object',
  fields: [
    defineField({
      name: 'ratio',
      title: 'Column ratio',
      type: 'string',
      initialValue: '50-50',
      options: {
        layout: 'radio',
        list: [
          {title: '50 / 50', value: '50-50'},
          {title: '40 / 60', value: '40-60'},
          {title: '60 / 40', value: '60-40'},
        ],
      },
    }),
    defineField({
      name: 'left',
      title: 'Left column',
      type: 'array',
      of: projectPortableTextMembers(),
    }),
    defineField({
      name: 'right',
      title: 'Right column',
      type: 'array',
      of: projectPortableTextMembers(),
    }),
  ],
  preview: {
    select: {ratio: 'ratio'},
    prepare: ({ratio}) => ({
      title: 'Two columns',
      subtitle: ratio ?? '50 / 50',
    }),
  },
})
