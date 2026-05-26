import {defineField, defineType} from 'sanity'

export const projectQuote = defineType({
  name: 'projectQuote',
  title: 'Pull quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
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
      title: quote
        ? String(quote).slice(0, 48) + (String(quote).length > 48 ? '…' : '')
        : 'Pull quote',
      subtitle: attribution || 'Quote',
    }),
  },
})
