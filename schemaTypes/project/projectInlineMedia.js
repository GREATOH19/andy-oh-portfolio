import {defineField, defineType} from 'sanity'
import {projectStoryLayoutFields} from './projectStoryLayoutFields'
import {gridAspectRatioField, gridCropFocusField} from './gridMediaFields'

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
    gridAspectRatioField(),
    gridCropFocusField(),
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
            : undefined
      return {
        title: caption || (media?.mediaType === 'youtube' ? 'YouTube' : 'Inline media'),
        subtitle:
          media?.mediaType === 'youtube' ? media.youtubeUrl : 'In chapter body',
        media: m,
      }
    },
  },
})
