import {defineField, defineType} from 'sanity'



export const contactCtaSection = defineType({

  name: 'contactCtaSection',

  title: 'Contact CTA',

  type: 'object',

  fields: [

    defineField({

      name: 'heading',

      title: 'Heading',

      type: 'string',

      initialValue: 'Let’s build something together.',

    }),

    defineField({

      name: 'email',

      title: 'Email',

      type: 'string',

    }),

    defineField({

      name: 'links',

      title: 'Links',

      type: 'array',

      of: [

        {

          type: 'object',

          name: 'contactLink',

          fields: [

            defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),

            defineField({name: 'href', title: 'URL', type: 'url', validation: (Rule) => Rule.required()}),

          ],

          preview: {

            select: {title: 'label', subtitle: 'href'},

          },

        },

      ],

    }),

  ],

  preview: {

    select: {heading: 'heading'},

    prepare({heading}) {

      return {title: heading || 'Contact CTA'}

    },

  },

})


