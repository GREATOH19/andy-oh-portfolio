import {defineField, defineType} from 'sanity'

import {CMS_FONT_OPTIONS, CMS_FONT_WEIGHT_OPTIONS} from '../fontStyle'

export const siteBrandFields = [
  defineField({
    name: 'mode',
    title: 'Mode',
    type: 'string',
    options: {
      list: [
        {title: 'Image (PNG/JPG)', value: 'image'},
        {title: 'Text', value: 'text'},
      ],
      layout: 'radio',
    },
    initialValue: 'text',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'text',
    title: 'Logo text',
    type: 'string',
    initialValue: 'Andy Oh',
  }),
  defineField({
    name: 'font',
    title: 'Logo text font',
    description: 'Used when Mode is Text. Same option list as Typography (see fontStyle.js).',
    type: 'string',
    options: {
      list: CMS_FONT_OPTIONS,
      layout: 'dropdown',
    },
    initialValue: 'serif',
  }),
  defineField({
    name: 'fontWeight',
    title: 'Logo text weight',
    description: 'Used when Mode is Text. Default in the app: Medium (500).',
    type: 'string',
    options: {
      list: CMS_FONT_WEIGHT_OPTIONS,
      layout: 'dropdown',
    },
  }),
  defineField({
    name: 'image',
    title: 'Logo image',
    type: 'image',
    options: {hotspot: true},
    description:
      'For the Work homepage banner: use Hotspot (crop tool) to set what stays visible when the image is cropped.',
  }),
  defineField({
    name: 'bannerFocus',
    title: 'Banner vertical focus',
    description:
      'Work homepage full-width banner only. “Auto” uses the image Hotspot above; otherwise picks a preset crop anchor.',
    type: 'string',
    options: {
      list: [
        {title: 'Auto (image hotspot)', value: 'auto'},
        {title: 'Keep top visible', value: 'top'},
        {title: 'Center', value: 'center'},
        {title: 'Lower in frame', value: 'lower'},
      ],
      layout: 'radio',
    },
    initialValue: 'auto',
    hidden: ({parent}) => parent?.mode !== 'image',
  }),
  defineField({
    name: 'alt',
    title: 'Image alt text',
    type: 'string',
    initialValue: 'Site logo',
  }),
]

export const siteBrand = defineType({
  name: 'siteBrand',
  title: 'Logo',
  type: 'object',
  fields: siteBrandFields,
})
