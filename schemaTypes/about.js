import {defineField, defineType} from 'sanity'



export const about = defineType({

  name: 'about',

  title: 'About',

  type: 'document',

  fields: [

    defineField({

      name: 'title',

      title: 'Title',

      type: 'string',

      initialValue: 'About',

      validation: (Rule) => Rule.required(),

    }),

    defineField({

      name: 'name',

      title: 'Name',

      type: 'string',

      validation: (Rule) => Rule.required(),

    }),

    defineField({

      name: 'role',

      title: 'Role / tagline',

      type: 'string',

      description: 'e.g. Industrial Designer',

    }),

    defineField({

      name: 'meta',

      title: 'Meta lines',

      description: 'Location, class year, etc. One line per row.',

      type: 'array',

      of: [{type: 'string'}],

    }),

    defineField({

      name: 'portrait',

      title: 'Portrait',

      description: 'Optional photo shown below the name/meta in the About sidebar.',

      type: 'image',

      options: {hotspot: true},

      fields: [

        defineField({

          name: 'alt',

          title: 'Alt text',

          type: 'string',

        }),

      ],

    }),

    defineField({

      name: 'bio',

      title: 'Biography',

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

      name: 'education',

      title: 'Education',

      type: 'array',

      of: [

        {

          type: 'object',

          name: 'educationItem',

          fields: [

            defineField({

              name: 'school',

              title: 'School',

              type: 'string',

              validation: (Rule) => Rule.required(),

            }),

            defineField({

              name: 'degree',

              title: 'Degree / program',

              type: 'string',

            }),

            defineField({

              name: 'period',

              title: 'Period',

              type: 'string',

              description: 'e.g. 2021 – Present',

            }),

          ],

          preview: {

            select: {title: 'school', subtitle: 'degree'},

            prepare({title, subtitle}) {

              return {title, subtitle}

            },

          },

        },

      ],

    }),

    defineField({

      name: 'skillGroups',

      title: 'Skill groups',

      type: 'array',

      of: [

        {

          type: 'object',

          name: 'skillGroup',

          fields: [

            defineField({

              name: 'title',

              title: 'Group title',

              type: 'string',

              validation: (Rule) => Rule.required(),

            }),

            defineField({

              name: 'items',

              title: 'Items',

              type: 'array',

              of: [{type: 'string'}],

            }),

          ],

          preview: {

            select: {title: 'title'},

          },

        },

      ],

    }),

    defineField({

      name: 'resume',

      title: 'Resume (PDF)',

      type: 'file',

      options: {

        accept: 'application/pdf',

      },

    }),

  ],

  preview: {

    select: {title: 'name', subtitle: 'role'},

    prepare({title, subtitle}) {

      return {title: title || 'About', subtitle}

    },

  },

})


