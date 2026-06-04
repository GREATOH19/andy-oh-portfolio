import {defineField, defineType} from 'sanity'
import {projectStoryLayoutFields} from './projectStoryLayoutFields'

export const projectMedia = defineType({
  name: 'projectMedia',
  title: 'Full-width image or video',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Media (multiple)',
      type: 'array',
      of: [{type: 'cmsMediaItem'}],
    }),
    defineField({
      name: 'media',
      title: 'Media (single)',
      type: 'cmsMediaItem',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    ...projectStoryLayoutFields,
  ],
  preview: {
    select: {caption: 'caption', media: 'media', items: 'items'},
    prepare: ({caption, media, items}) => {
      const primary = (Array.isArray(items) && items.length > 0 ? items[0] : null) ?? media
      const m =
        primary?.mediaType === 'video'
          ? primary.video
          : primary?.mediaType === 'image'
            ? primary.image
            : primary
      return {
        title: caption || 'Full-width media',
        subtitle: Array.isArray(items) && items.length > 1 ? `${items.length} items` : 'Image or video',
        media: m,
      }
    },
  },
})
