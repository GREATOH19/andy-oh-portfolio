import {defineField, defineType} from 'sanity'

export const cmsMediaItem = defineType({
  name: 'cmsMediaItem',
  title: 'Photo or video',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.mediaType !== 'image',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {accept: 'video/*'},
      hidden: ({parent}) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'loop',
      type: 'boolean',
      title: 'Loop video',
      description: 'When enabled, the video plays on repeat (muted, inline).',
      hidden: ({parent}) => parent?.mediaType !== 'video',
      initialValue: false,
    }),
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Description',
      description: 'Short label for accessibility.',
    }),
  ],
  preview: {
    select: {mediaType: 'mediaType', image: 'image', video: 'video', alt: 'alt'},
    prepare({mediaType, image, video, alt}) {
      return {
        title: alt || (mediaType === 'video' ? 'Video' : 'Image'),
        media: mediaType === 'video' ? video : image,
      }
    },
  },
})
