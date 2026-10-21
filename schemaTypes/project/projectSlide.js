import {defineField, defineType} from 'sanity'
import {projectPortableTextMembers} from './projectPortableText'

/** One deck slide rebuilt as a native section: eyebrow, two-tone headline, lead, media and numbered items. */
export const projectSlide = defineType({
  name: 'projectSlide',
  title: 'Slide',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small mono label above the headline — e.g. "02 — Overview".',
    }),
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleAccent',
      title: 'Headline accent',
      type: 'string',
      description: 'Second part of the headline, in brown — e.g. "on cue" after "Scent,".',
    }),
    defineField({
      name: 'tocTitle',
      title: 'TOC label',
      type: 'string',
      description: 'Optional. Defaults to the headline.',
    }),
    defineField({
      name: 'body',
      title: 'Lead',
      type: 'array',
      of: projectPortableTextMembers(),
    }),
    defineField({
      name: 'mediaSide',
      title: 'Media placement',
      type: 'string',
      initialValue: 'right',
      options: {
        layout: 'radio',
        list: [
          {title: 'Right of the text', value: 'right'},
          {title: 'Left of the text', value: 'left'},
          {title: 'Row below the headline', value: 'below'},
        ],
      },
    }),
    defineField({
      name: 'images',
      title: 'Images & videos',
      type: 'array',
      of: [{type: 'cmsMediaItem'}],
      description: 'The Description of each item is shown as its caption.',
    }),
    defineField({
      name: 'itemsStyle',
      title: 'Items style',
      type: 'string',
      initialValue: 'columns',
      options: {
        layout: 'radio',
        list: [
          {title: 'Columns under a rule', value: 'columns'},
          {title: 'Tinted cards', value: 'cards'},
          {title: 'Numbered list', value: 'list'},
          {title: 'Label + text rows', value: 'table'},
        ],
      },
      hidden: ({parent}) => !parent?.slideItems?.length,
    }),
    defineField({
      name: 'slideItems',
      title: 'Items',
      type: 'array',
      description: 'Numbered 01, 02, … in order.',
      of: [
        {
          type: 'object',
          name: 'slideItem',
          title: 'Item',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
            defineField({
              name: 'tags',
              title: 'Tags',
              type: 'array',
              of: [{type: 'string'}],
              options: {layout: 'tags'},
            }),
            defineField({name: 'media', title: 'Image or video', type: 'cmsMediaItem'}),
          ],
          preview: {
            select: {title: 'title', text: 'text', media: 'media'},
            prepare: ({title, text, media}) => ({title, subtitle: text, media: media?.image ?? media}),
          },
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title', titleAccent: 'titleAccent', eyebrow: 'eyebrow', images: 'images', slideItems: 'slideItems'},
    prepare: ({title, titleAccent, eyebrow, images, slideItems}) => {
      const parts = ['Slide']
      if (Array.isArray(images) && images.length) parts.push(`${images.length} media`)
      if (Array.isArray(slideItems) && slideItems.length) parts.push(`${slideItems.length} items`)
      return {
        title: [title, titleAccent].filter(Boolean).join(' '),
        subtitle: [eyebrow, parts.join(' · ')].filter(Boolean).join(' — '),
        media: images?.[0]?.image ?? images?.[0],
      }
    },
  },
})
