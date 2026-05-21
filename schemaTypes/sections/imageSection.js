import {defineField, defineType} from 'sanity'

export const imageSection = defineType({
  name: 'imageSection',
  title: 'Image / video',
  type: 'object',
  fields: [
    defineField({
      name: 'item',
      title: 'Image or video',
      type: 'cmsMediaItem',
    }),
    defineField({
      name: 'image',
      title: 'Image (legacy)',
      type: 'image',
      options: {hotspot: true},
      readOnly: true,
      hidden: ({value}) => !value,
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {item: 'item', legacy: 'image', title: 'caption'},
    prepare({item, legacy, title}) {
      const media =
        item?.mediaType === 'video'
          ? item.video
          : item?.mediaType === 'image'
            ? item.image
            : legacy
      return {title: title || 'Image / video', media}
    },
  },
})
