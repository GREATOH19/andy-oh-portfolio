import {defineField, defineType} from 'sanity'
import {projectPortableTextMembers} from './projectPortableText'
import {projectBodyTypographyFields} from './projectBodyTypographyFields'
import {mobileStackOrderField} from './mobileStackOrderField'
import {projectStoryLayoutFields} from './projectStoryLayoutFields'
import {gridAspectRatioField, gridCropFocusField} from './gridMediaFields'

const sideTextWidth = (parent) => {
  const width = parent?.mediaWidth ?? 'full'
  return width === 'narrow' || width === 'medium'
}

export const projectGallery = defineType({
  name: 'projectGallery',
  title: 'Image grid',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images & videos',
      type: 'array',
      of: [{type: 'cmsMediaItem'}],
      description: 'Add as many items as you need — rows wrap automatically.',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      initialValue: 2,
      validation: (Rule) => Rule.min(1).max(8).integer(),
      description: 'Desktop & tablet columns (1–8). Image count is unlimited.',
    }),
    gridAspectRatioField(),
    gridCropFocusField(),
    ...projectStoryLayoutFields,
    ...projectBodyTypographyFields(),
    defineField({
      name: 'body',
      title: 'Side text',
      type: 'array',
      of: projectPortableTextMembers(),
      description:
        'Optional text beside the grid on tablet & desktop when Width is Narrow or Medium (uses the empty column space).',
    }),
    defineField({
      name: 'layout',
      title: 'Side text layout',
      type: 'string',
      initialValue: 'auto',
      options: {
        layout: 'radio',
        list: [
          {title: 'Auto (from alignment)', value: 'auto'},
          {title: 'Text left / Grid right', value: 'textLeft'},
          {title: 'Grid left / Text right', value: 'textRight'},
        ],
      },
      hidden: ({parent}) => !sideTextWidth(parent) || !parent?.body?.length,
      description:
        'Auto: left-aligned grid → text on the right; right-aligned grid → text on the left.',
    }),
    mobileStackOrderField({
      name: 'mobileStackOrder',
      title: 'Mobile stack order',
      description: 'How text and the grid stack on phones when side text is used.',
      hidden: ({parent}) => !sideTextWidth(parent) || !parent?.body?.length,
    }),
  ],
  preview: {
    select: {images: 'images', caption: 'caption', body: 'body'},
    prepare: ({images, caption, body}) => {
      const count = Array.isArray(images) ? images.length : 0
      const hasSideText = Array.isArray(body) && body.length > 0
      return {
        title: caption || `Image grid (${count})`,
        subtitle: hasSideText ? `${count} items + side text` : `${count} item${count === 1 ? '' : 's'}`,
        media: images?.[0]?.image ?? images?.[0],
      }
    },
  },
})
