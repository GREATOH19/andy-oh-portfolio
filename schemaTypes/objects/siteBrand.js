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
    name: 'shadowGlowEnabled',
    title: 'Enable banner shadow glow',
    type: 'boolean',
    description:
      'Work homepage banner only. When enabled (and Shadow layer image is set), the app can glow/animate the shadow layer on hover.',
    initialValue: false,
    hidden: ({parent}) => parent?.mode !== 'image',
  }),
  defineField({
    name: 'shadowImage',
    title: 'Shadow layer image (PNG)',
    type: 'image',
    options: {hotspot: false},
    description:
      'Work homepage banner only. Export ONLY the shadow/outline layer with transparency. Must match the main Logo image canvas size and alignment exactly.',
    hidden: ({parent}) => parent?.mode !== 'image',
  }),
  defineField({
    name: 'bannerHoverEffect',
    title: 'Banner hover effect (legacy)',
    type: 'string',
    description:
      'Legacy field already present in some documents. Keep this to avoid “Unknown fields” warnings. Prefer Enable banner shadow glow above.',
    options: {
      list: [{title: 'Fluoro shadow (auto)', value: 'fluoro-shadow-auto'}],
    },
    hidden: ({parent}) => parent?.mode !== 'image',
  }),
  defineField({
    name: 'bannerShadowMask',
    title: 'Banner shadow mask (legacy PNG)',
    type: 'image',
    options: {hotspot: false},
    description:
      'Legacy field already present in some documents. Shadow-only PNG with transparency; must match main Logo image canvas exactly. Prefer Shadow layer image above.',
    hidden: ({parent}) => parent?.mode !== 'image',
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
