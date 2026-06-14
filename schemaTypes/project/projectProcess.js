import {defineField, defineType} from 'sanity'
import {projectStoryLayoutFields} from './projectStoryLayoutFields'
import {gridAspectRatioField, gridCropFocusField} from './gridMediaFields'

export const projectProcess = defineType({
  name: 'projectProcess',
  title: 'Process',
  type: 'object',
  fields: [
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'processStep',
          title: 'Step',
          fields: [
            defineField({
              name: 'media',
              title: 'Image or video',
              type: 'cmsMediaItem',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Short one-line label shown below the image.',
            }),
          ],
          preview: {
            select: {caption: 'caption', media: 'media'},
            prepare: ({caption, media}) => ({
              title: caption || 'Process step',
              media: media?.image ?? media,
            }),
          },
        },
      ],
      description: 'Add as many steps as you need. Extra steps wrap to the next row.',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      initialValue: 2,
      validation: (Rule) => Rule.min(1).max(8).integer(),
      description:
        'How many steps fit in one row — same as Image grid. Extra steps wrap below.',
    }),
    gridAspectRatioField(),
    gridCropFocusField(),
    defineField({
      name: 'caption',
      title: 'Block caption',
      type: 'string',
      description: 'Optional caption below the whole process block.',
    }),
    ...projectStoryLayoutFields,
  ],
  preview: {
    select: {steps: 'steps', caption: 'caption'},
    prepare: ({steps, caption}) => {
      const count = Array.isArray(steps) ? steps.length : 0
      return {
        title: caption || `Process (${count} step${count === 1 ? '' : 's'})`,
        subtitle: count > 0 ? `${count} step${count === 1 ? '' : 's'}` : 'Add steps',
        media: steps?.[0]?.media?.image ?? steps?.[0]?.media,
      }
    },
  },
})
