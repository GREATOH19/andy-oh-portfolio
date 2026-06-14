import {defineField, defineType} from 'sanity'

export const cmsMediaItem = defineType({
  name: 'cmsMediaItem',
  title: 'Photo, video, or YouTube',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video (upload)', value: 'video'},
          {title: 'YouTube', value: 'youtube'},
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
      description:
        'Drag the crop frame or hotspot to control what stays visible when this image sits in a uniform grid crop.',
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
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Watch, share, embed, or Shorts link.',
      hidden: ({parent}) => parent?.mediaType !== 'youtube',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent?.mediaType !== 'youtube') return true
          return value ? true : 'YouTube URL is required'
        }),
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
      hidden: ({parent}) => parent?.mediaType !== 'youtube',
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
      name: 'loopDissolve',
      type: 'boolean',
      title: 'Dissolve loop',
      description: 'Crossfade from the end back to the start (requires Loop video).',
      hidden: ({parent}) => parent?.mediaType !== 'video' || !parent?.loop,
      initialValue: false,
    }),
    defineField({
      name: 'loopPreview',
      title: 'Loop preview (lightweight)',
      type: 'file',
      options: {accept: 'video/*'},
      description:
        'Optional smaller file for muted inline loop playback. The full video above plays in fullscreen when clicked.',
      hidden: ({parent}) => parent?.mediaType !== 'video' || !parent?.loop,
    }),
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Description',
      description: 'Short label for accessibility.',
    }),
  ],
  preview: {
    select: {
      mediaType: 'mediaType',
      image: 'image',
      video: 'video',
      youtubeUrl: 'youtubeUrl',
      alt: 'alt',
    },
    prepare({mediaType, image, video, youtubeUrl, alt}) {
      const typeLabel =
        mediaType === 'youtube' ? 'YouTube' : mediaType === 'video' ? 'Video' : 'Image'
      return {
        title: alt || typeLabel,
        subtitle: mediaType === 'youtube' ? youtubeUrl : undefined,
        media: mediaType === 'video' ? video : mediaType === 'image' ? image : undefined,
      }
    },
  },
})
