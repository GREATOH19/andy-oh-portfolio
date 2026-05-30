import {defineField, defineType} from 'sanity'
import {CMS_FONT_OPTIONS} from '../fontStyle'



export const quoteSection = defineType({

  name: 'quoteSection',

  title: 'Quote',

  type: 'object',

  fields: [

    defineField({

      name: 'quote',

      title: 'Quote',

      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Quote — Default', value: 'normal'},
            {title: 'Quote — Small', value: 'sizeSm'},
            {title: 'Quote — Large', value: 'sizeLg'},
            {title: 'Quote — XL', value: 'sizeXl'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              {
                name: 'font',
                title: 'Font',
                type: 'object',
                fields: [
                  defineField({
                    name: 'font',
                    title: 'Font',
                    type: 'string',
                    options: {list: CMS_FONT_OPTIONS, layout: 'dropdown'},
                  }),
                ],
              },
            ],
          },
        },
      ],

      validation: (Rule) => Rule.required(),

    }),

    defineField({

      name: 'attribution',

      title: 'Attribution',

      type: 'string',

    }),

  ],

  preview: {

    select: {quote: 'quote', attribution: 'attribution'},

    prepare({quote, attribution}) {

      return {

        title: quote ? String(quote).slice(0, 40) + (String(quote).length > 40 ? '…' : '') : 'Quote',

        subtitle: attribution || undefined,

      }

    },

  },

})


