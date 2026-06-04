import {defineField, defineType} from 'sanity'
import {projectStoryLayoutFields} from './projectStoryLayoutFields'

export const projectInlineMedia = defineType({
  name: 'projectInlineMedia',
  title: 'Image or video',
  type: 'object',
  fields: [
    defineField({
      name: 'media',
      title: 'Media',
      type: 'cmsMediaItem',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    ...projectStoryLayoutFields,
  ],
  preview: {
    select: {caption: 'caption', media: 'media'},
    prepare({caption, media}) {
      const m =
        media?.mediaType === 'video'
          ? media.video
          : media?.mediaType === 'image'
            ? media.image
            : media
      return {
        title: caption || 'Inline image',
        subtitle: 'In chapter body',
        media: m,
      }
    },
  },
})
