import {defineField, defineType} from 'sanity'
import {projectStoryLayoutFields} from './projectStoryLayoutFields'

export const projectYoutube = defineType({
  name: 'projectYoutube',
  title: 'YouTube video',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      description: 'Paste a watch, share, embed, or Shorts link.',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https'],
          allowRelative: false,
        }),
    }),
    defineField({
      name: 'title',
      title: 'Video title (accessibility)',
      type: 'string',
      description: 'Short label for screen readers. Optional — defaults to “YouTube video”.',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'videoAspect',
      title: 'Aspect ratio',
      type: 'string',
      initialValue: 'auto',
      options: {
        layout: 'radio',
        list: [
          {title: 'Auto (Shorts → vertical)', value: 'auto'},
          {title: 'Vertical (9:16)', value: 'portrait'},
          {title: 'Horizontal (16:9)', value: 'landscape'},
        ],
      },
      description:
        'Use Vertical for portrait uploads (non-Shorts). Auto detects YouTube Shorts links.',
    }),
    ...projectStoryLayoutFields.filter((field) => field.name !== 'mobileCarousel'),
  ],
  preview: {
    select: {url: 'url', title: 'title', caption: 'caption'},
    prepare: ({url, title, caption}) => ({
      title: title || caption || 'YouTube video',
      subtitle: url || 'Add a URL',
    }),
  },
})
