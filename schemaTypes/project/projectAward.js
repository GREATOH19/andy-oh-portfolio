import {defineField, defineType} from 'sanity'

export const projectAward = defineType({
  name: 'projectAward',
  title: 'Award',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Badge image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alternative text'})],
    }),
    defineField({
      name: 'label',
      title: 'Caption',
      type: 'string',
      description: 'e.g. Core77 Design Awards 2024 Winner',
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'url',
    }),
  ],
  preview: {
    select: {title: 'label', media: 'image'},
    prepare: ({title, media}) => ({title: title || 'Award', media}),
  },
})
