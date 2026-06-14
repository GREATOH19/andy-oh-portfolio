import {defineField, defineType} from 'sanity'
import {gridAspectRatioField, gridCropFocusField} from './gridMediaFields'

export const projectInstagramFeed = defineType({
  name: 'projectInstagramFeed',
  title: 'Instagram feed',
  type: 'object',
  fields: [
    defineField({
      name: 'handle',
      title: 'Instagram username',
      type: 'string',
      description:
        'Without @ — e.g. hl.hoops. Requires Instagram Graph API env vars (see web/.env.example).',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          const handle = typeof value === 'string' ? value.replace(/^@/, '').trim() : ''
          if (!handle) return 'Enter a username'
          if (!/^[a-zA-Z0-9._]{1,30}$/.test(handle)) return 'Invalid Instagram username'
          return true
        }),
    }),
    defineField({
      name: 'maxPosts',
      title: 'Number of posts',
      type: 'number',
      initialValue: 9,
      validation: (Rule) => Rule.required().min(3).max(24).integer(),
    }),
    defineField({
      name: 'columns',
      title: 'Columns (desktop)',
      type: 'number',
      initialValue: 3,
      validation: (Rule) => Rule.min(2).max(4),
    }),
    gridAspectRatioField(),
    gridCropFocusField({
      description: 'Focal point for cropped tiles (Instagram images have no per-image hotspot).',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional line below the grid.',
    }),
  ],
  preview: {
    select: {handle: 'handle', maxPosts: 'maxPosts'},
    prepare: ({handle, maxPosts}) => ({
      title: handle ? `@${String(handle).replace(/^@/, '')}` : 'Instagram feed',
      subtitle: maxPosts ? `Up to ${maxPosts} posts` : 'Instagram grid',
    }),
  },
})
