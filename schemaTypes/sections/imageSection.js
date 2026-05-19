import {defineField, defineType} from 'sanity'

export const imageSection = defineType({
  name: 'imageSection',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {media: 'image', title: 'caption'},
    prepare({media, title}) {
      return {title: title || 'Image', media}
    },
  },
})
