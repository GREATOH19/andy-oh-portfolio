import {defineField, defineType} from 'sanity'

export const projectPhotoCollagePair = defineType({
  name: 'projectPhotoCollagePair',
  title: 'Two-up (vertical pair)',
  type: 'object',
  fields: [
    defineField({
      name: 'swap',
      title: 'Swap left/right',
      type: 'boolean',
      initialValue: false,
      description: 'Quickly flip which media appears on the left vs right.',
    }),
    defineField({
      name: 'left',
      title: 'Left',
      type: 'cmsMediaItem',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'right',
      title: 'Right',
      type: 'cmsMediaItem',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {swap: 'swap', left: 'left', right: 'right'},
    prepare: ({swap, left, right}) => ({
      title: 'Two-up (vertical pair)',
      subtitle: `${swap ? 'Swapped' : 'Left→Right'} · ${left?.mediaType ?? 'media'} + ${right?.mediaType ?? 'media'}`,
      media:
        left?.mediaType === 'image'
          ? left.image
          : left?.mediaType === 'video'
            ? left.video
            : undefined,
    }),
  },
})

