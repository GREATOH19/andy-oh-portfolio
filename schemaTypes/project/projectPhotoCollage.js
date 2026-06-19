import {defineField, defineType} from 'sanity'
import {projectStoryLayoutFields} from './projectStoryLayoutFields'

function collagePreviewMedia(portrait) {
  if (!portrait) return undefined
  if (portrait.mediaType === 'video') return portrait.video
  if (portrait.mediaType === 'image') return portrait.image
  return portrait.image
}

export const projectPhotoCollage = defineType({
  name: 'projectPhotoCollage',
  title: 'Media collage',
  type: 'object',
  fields: [
    defineField({
      name: 'portraitSide',
      title: 'Layout',
      type: 'string',
      initialValue: 'left',
      options: {
        layout: 'radio',
        list: [
          {title: 'Vertical left · horizontal stack right', value: 'left'},
          {title: 'Horizontal stack left · vertical right', value: 'right'},
        ],
      },
    }),
    defineField({
      name: 'portrait',
      title: 'Vertical slot',
      type: 'cmsMediaItem',
      validation: (Rule) => Rule.required(),
      description: 'Image, uploaded video, or YouTube for the tall column.',
    }),
    defineField({
      name: 'strips',
      title: 'Stacked slots',
      type: 'array',
      of: [{type: 'cmsMediaItem'}, {type: 'projectPhotoCollagePair'}],
      validation: (Rule) => Rule.required().min(1),
      description: 'Images, uploaded videos, or YouTube clips stacked beside the vertical slot.',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    ...projectStoryLayoutFields,
  ],
  preview: {
    select: {
      portraitSide: 'portraitSide',
      portrait: 'portrait',
      strips: 'strips',
      caption: 'caption',
    },
    prepare: ({portraitSide, portrait, strips, caption}) => {
      const count = Array.isArray(strips) ? strips.length : 0
      const side =
        portraitSide === 'right' ? 'Stack left · vertical right' : 'Vertical left · stack right'
      const portraitType =
        portrait?.mediaType === 'video'
          ? 'Video'
          : portrait?.mediaType === 'youtube'
            ? 'YouTube'
            : 'Image'
      return {
        title: caption || `Media collage (${count + 1})`,
        subtitle: `${side} · ${portraitType} + ${count} stacked`,
        media: collagePreviewMedia(portrait),
      }
    },
  },
})
