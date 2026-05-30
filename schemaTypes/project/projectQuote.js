import {defineField, defineType} from 'sanity'
import {CMS_FONT_OPTIONS} from '../fontStyle'

export const projectQuote = defineType({
  name: 'projectQuote',
  title: 'Pull quote',
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
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      description: 'Optional — e.g. Design principle, week 2',
    }),
  ],
  preview: {
    select: {quote: 'quote', attribution: 'attribution'},
    prepare: ({quote, attribution}) => ({
      title: Array.isArray(quote) && quote.length
        ? 'Pull quote'
        : 'Pull quote',
      subtitle: attribution || 'Quote',
    }),
  },
})
