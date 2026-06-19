import {defineField, defineType} from 'sanity'
import {projectPortableTextMembers} from './projectPortableText'
import {projectBodyTypographyFields} from './projectBodyTypographyFields'
import {mobileStackOrderField} from './mobileStackOrderField'
import {gridAspectRatioField, gridCropFocusField} from './gridMediaFields'

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
    defineField({
      name: 'centerTextWithMedia',
      type: 'boolean',
      title: 'Center text with media (tablet & desktop)',
      description:
        'When enabled, short text aligns vertically with the center of the image on tablet and desktop (side-by-side layout). Mobile always stacks from the top.',
      initialValue: false,
    }),
    ...projectBodyTypographyFields(),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'array',
      of: projectPortableTextMembers(),
    }),
    defineField({
      name: 'bodyImages',
      title: 'Images below text',
      type: 'array',
      of: [{type: 'cmsMediaItem'}],
      description:
        'Optional small image grid under the text column (same style as Image grid blocks).',
    }),
    defineField({
      name: 'bodyImageColumns',
      title: 'Columns (below text)',
      type: 'number',
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(8).integer(),
      description: 'Desktop & tablet columns for images below text (1–8). Default 3.',
      hidden: ({parent}) => !parent?.bodyImages?.length,
    }),
    gridAspectRatioField({
      name: 'bodyGridAspectRatio',
      title: 'Crop aspect (below text)',
      hidden: ({parent}) => !parent?.bodyImages?.length,
    }),
    gridCropFocusField({
      name: 'bodyCropFocus',
      title: 'Crop focus (below text)',
      hidden: ({parent}) =>
        !parent?.bodyImages?.length || (parent?.bodyGridAspectRatio ?? 'auto') === 'auto',
    }),
    defineField({
      name: 'images',
      title: 'Images & videos',
      type: 'array',
      of: [{type: 'cmsMediaItem'}],
      description: 'Add multiple items to show a swipeable carousel in the zigzag row.',
    }),
    gridAspectRatioField({
      title: 'Crop aspect (main media)',
      hidden: ({parent}) => {
        const images = parent?.images
        return !(Array.isArray(images) && images.length > 0) && !parent?.media
      },
    }),
    gridCropFocusField({
      title: 'Crop focus (main media)',
      hidden: ({parent}) => {
        const images = parent?.images
        const hasMain =
          (Array.isArray(images) && images.length > 0) || Boolean(parent?.media)
        return !hasMain || (parent?.gridAspectRatio ?? 'auto') === 'auto'
      },
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
    select: {
      images: 'images',
      media: 'media',
      caption: 'caption',
      bodyImages: 'bodyImages',
    },
    prepare: ({images, media, caption, bodyImages}) => {
      const count = Array.isArray(images) ? images.length : media ? 1 : 0
      const bodyCount = Array.isArray(bodyImages) ? bodyImages.length : 0
      const parts = ['Text']
      if (bodyCount > 0) parts.push(`${bodyCount} below`)
      if (count > 0) parts.push(count > 1 ? `${count} slides` : 'media')
      return {
        title: caption || 'Zigzag row',
        subtitle: parts.join(' + '),
        media: images?.[0]?.image ?? images?.[0] ?? media?.image ?? media,
      }
    },
  },
})

