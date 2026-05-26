import {defineField, defineType} from 'sanity'

export const projectGallery = defineType({
  name: 'projectGallery',
  title: 'Image grid',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images & videos',
      type: 'array',
      of: [{type: 'cmsMediaItem'}],
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
      validation: (Rule) => Rule.min(1).max(3),
      description: 'Desktop column count (1–3).',
    }),
  ],
  preview: {
    select: {images: 'images', caption: 'caption'},
    prepare: ({images, caption}) => {
      const count = Array.isArray(images) ? images.length : 0
      return {
        title: caption || `Image grid (${count})`,
        subtitle: `${count} item${count === 1 ? '' : 's'}`,
        media: images?.[0]?.image ?? images?.[0],
      }
    },
  },
})
