import {defineField, defineType} from 'sanity'
import {CMS_FONT_OPTIONS, cmsFontField, typographyFields} from './fontStyle'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    typographyFields(),
    defineField({
      name: 'brand',
      title: 'Brand / Logo',
      type: 'object',
      fields: [
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
          title: 'Logo Text',
          type: 'string',
          initialValue: 'Andy Oh',
        }),
        defineField({
          name: 'font',
          title: 'Logo text font',
          description:
            'Used when Mode is Text. Same option list as Typography above (see fontStyle.js).',
          type: 'string',
          options: {
            list: CMS_FONT_OPTIONS,
            layout: 'dropdown',
          },
          initialValue: 'serif',
        }),
        defineField({
          name: 'image',
          title: 'Logo Image',
          type: 'image',
          options: {hotspot: true},
        }),
        defineField({
          name: 'alt',
          title: 'Image Alt Text',
          type: 'string',
          initialValue: 'Site logo',
        }),
      ],
    }),
    defineField({
      name: 'heroIntroLottie',
      title: 'Hero Intro Lottie (JSON)',
      description:
        'Lottie JSON animation played as the first-visit homepage intro. Leave empty to use the local fallback in /public/lottie/oh-logo.json.',
      type: 'file',
      options: {accept: 'application/json'},
    }),
    defineField({
      name: 'contactSection',
      title: 'Footer',
      description:
        'Site-wide footer: logo comes from Brand above; social icons use the Contact (About page) document channels.',
      type: 'object',
      fields: [
        defineField({
          name: 'footerBody',
          title: 'Text below logo',
          description: 'Optional copy shown under the footer logo and above the icon row.',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [{title: 'Normal', value: 'normal'}],
              lists: [],
            },
          ],
        }),
        defineField({
          name: 'links',
          title: 'Fallback text links',
          description:
            'Used only if the Contact document has no channels (e.g. no social row). Optional.',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'contactLink',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'href',
                  title: 'URL',
                  type: 'url',
                  validation: (Rule) =>
                    Rule.required().uri({scheme: ['http', 'https', 'mailto', 'tel']}),
                }),
              ],
              preview: {
                select: {title: 'label', subtitle: 'href'},
              },
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
