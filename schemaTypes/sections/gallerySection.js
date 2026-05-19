import {defineField, defineType} from 'sanity'

export const gallerySection = defineType({
  name: 'gallerySection',
  title: 'Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      initialValue: 2,
      validation: (Rule) => Rule.min(1).max(4),
    }),
  ],
  preview: {
    select: {images: 'images'},
    prepare({images}) {
      const count = Array.isArray(images) ? images.length : 0
      return {title: `Gallery (${count})`}
    },
  },
})
