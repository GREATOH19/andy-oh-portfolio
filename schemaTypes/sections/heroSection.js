import {defineField, defineType} from 'sanity'



export const heroSection = defineType({

  name: 'heroSection',

  title: 'Hero',

  type: 'object',

  fields: [

    defineField({

      name: 'headline',

      title: 'Headline',

      type: 'string',

      validation: (Rule) => Rule.required(),

    }),

    defineField({

      name: 'subheadline',

      title: 'Subheadline',

      type: 'string',

    }),

    defineField({

      name: 'ctaLabel',

      title: 'CTA label',

      type: 'string',

    }),

    defineField({

      name: 'ctaHref',

      title: 'CTA link',

      type: 'url',

    }),

  ],

  preview: {

    select: {headline: 'headline'},

    prepare({headline}) {

      return {title: headline || 'Hero'}

    },

  },

})


