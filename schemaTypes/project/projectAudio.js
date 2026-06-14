import {defineField, defineType} from 'sanity'

export const projectAudio = defineType({
  name: 'projectAudio',
  title: 'Audio',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional — track or piece name shown above the player.',
    }),
    defineField({
      name: 'audio',
      title: 'Audio file',
      type: 'file',
      options: {
        accept: 'audio/*',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Album cover',
      type: 'image',
      options: {hotspot: true},
      description: 'Optional — square artwork shown beside the player.',
      fields: [defineField({name: 'alt', type: 'string', title: 'Alternative text'})],
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional — credits, source, or context below the player.',
    }),
    defineField({
      name: 'loop',
      title: 'Loop',
      type: 'boolean',
      initialValue: false,
      description: 'Repeat the track when it ends.',
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay in view',
      type: 'boolean',
      initialValue: false,
      description:
        'Start playing when this block scrolls into view. Keeps playing if you scroll away. Pauses only while another video on the page is playing with sound.',
    }),
    defineField({
      name: 'mediaWidth',
      title: 'Width',
      type: 'string',
      initialValue: 'medium',
      options: {
        layout: 'radio',
        list: [
          {title: 'Narrow (readable)', value: 'narrow'},
          {title: 'Medium', value: 'medium'},
          {title: 'Full column', value: 'full'},
        ],
      },
    }),
    defineField({
      name: 'mediaAlign',
      title: 'Alignment',
      type: 'string',
      initialValue: 'left',
      options: {
        layout: 'radio',
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      filename: 'audio.asset.originalFilename',
      cover: 'cover',
    },
    prepare({title, filename, cover}) {
      return {
        title: title?.trim() || 'Audio',
        subtitle: filename || 'Upload an audio file',
        media: cover,
      }
    },
  },
})
