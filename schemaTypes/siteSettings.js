import {defineField, defineType} from 'sanity'

import {cmsFontField, typographyFields} from './fontStyle'



export const siteSettings = defineType({

  name: 'siteSettings',

  title: 'Site Settings',

  type: 'document',

  fields: [

    typographyFields(),

    defineField({
      name: 'brand',
      title: 'Header logo',
      description: 'Top navigation bar (and site footer).',
      type: 'siteBrand',
    }),

    defineField({
      name: 'workHomeLogo',
      title: 'Work homepage logo',
      description:
        'Large logo area above the project grid on Work (/). Independent from the header logo.',
      type: 'siteBrand',
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

        'Site-wide footer: logo comes from Header logo above; social icons use the Contact (About page) document channels.',

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


