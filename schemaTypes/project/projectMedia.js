import {defineField, defineType} from 'sanity'

export const projectMedia = defineType({
  name: 'projectMedia',
  title: 'Full-width image or video',
  type: 'object',
  fields: [
    defineField({
      name: 'media',
      title: 'Media',
      type: 'cmsMediaItem',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {caption: 'caption', media: 'media'},
    prepare: ({caption, media}) => {
      const m =
        media?.mediaType === 'video'
          ? media.video
          : media?.mediaType === 'image'
            ? media.image
            : media
      return {
        title: caption || 'Full-width media',
        subtitle: 'Image or video',
        media: m,
      }
    },
  },
})
