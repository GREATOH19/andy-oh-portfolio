import {defineField, defineType} from 'sanity'

export const cmsImage = defineType({
  name: 'cmsImage',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
    }),
  ],
})
