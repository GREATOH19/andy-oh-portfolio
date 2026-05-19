import {defineField, defineType} from 'sanity'

export const quoteSection = defineType({
  name: 'quoteSection',
  title: 'Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
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
