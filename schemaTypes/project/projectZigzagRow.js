import {defineField, defineType} from 'sanity'

export const projectZigzagRow = defineType({
  name: 'projectZigzagRow',
  title: 'Zigzag row (text + media)',
  type: 'object',
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      initialValue: 'auto',
      options: {
        layout: 'radio',
        list: [
          {title: 'Auto (alternate)', value: 'auto'},
          {title: 'Text left / Media right', value: 'textLeft'},
          {title: 'Media left / Text right', value: 'textRight'},
        ],
      },
    }),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'cmsMediaItem',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {caption: 'caption'},
    prepare: ({caption}) => ({
      title: caption || 'Zigzag row',
      subtitle: 'Text + media',
    }),
  },
})

