import {defineField, defineType} from 'sanity'
import {projectPortableTextMembers} from './projectPortableText'
import {projectBodyTypographyFields} from './projectBodyTypographyFields'
import {mobileStackOrderField} from './mobileStackOrderField'

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
    mobileStackOrderField({
      name: 'mobileStackOrder',
      title: 'Mobile stack order',
      description:
        'How text and media stack on phones in this row. Default matches desktop reading order for this layout.',
    }),
    ...projectBodyTypographyFields(),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'array',
      of: projectPortableTextMembers(),
    }),
    defineField({
      name: 'images',
      title: 'Images & videos',
      type: 'array',
      of: [{type: 'cmsMediaItem'}],
      description: 'Add multiple items to show a swipeable carousel in the zigzag row.',
    }),
    defineField({
      name: 'media',
      title: 'Media (legacy)',
      type: 'cmsMediaItem',
      readOnly: true,
      hidden: ({value}) => !value,
      description:
        'Old single-media field. Re-add this item under Images & videos above, then remove this legacy field with the control below it.',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {images: 'images', media: 'media', caption: 'caption'},
    prepare: ({images, media, caption}) => {
      const count = Array.isArray(images) ? images.length : media ? 1 : 0
      return {
        title: caption || 'Zigzag row',
        subtitle: count > 1 ? `Text + ${count} slides` : 'Text + media',
        media: images?.[0]?.image ?? images?.[0] ?? media?.image ?? media,
      }
    },
  },
})

