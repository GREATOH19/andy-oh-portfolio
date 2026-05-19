import {defineField, defineType} from 'sanity'

export const CONTACT_ICONS = [
  {title: 'Email', value: 'email'},
  {title: 'LinkedIn', value: 'linkedin'},
  {title: 'Instagram', value: 'instagram'},
  {title: 'Twitter / X', value: 'twitter'},
  {title: 'GitHub', value: 'github'},
  {title: 'Behance', value: 'behance'},
  {title: 'Dribbble', value: 'dribbble'},
  {title: 'YouTube', value: 'youtube'},
  {title: 'Website', value: 'website'},
]

export const contact = defineType({
  name: 'contact',
  title: 'Contact (About page)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Contact',
      description: 'Shown in the About page footer block (/about#contact).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Main line (roman). e.g. Let’s build something',
    }),
    defineField({
      name: 'headlineEmphasis',
      title: 'Headline (italic)',
      type: 'string',
      description: 'Shown in italic after the main headline. e.g. together.',
    }),
    defineField({
      name: 'channels',
      title: 'Channels',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'channel',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. Email, LinkedIn, Instagram',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Display value',
              type: 'string',
              description: 'Visible text, e.g. andyoh@risd.edu or @andyoh_design',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'url',
              description: 'mailto: links and tel: links are allowed',
              validation: (Rule) =>
                Rule.required().uri({scheme: ['http', 'https', 'mailto', 'tel']}),
            }),
            defineField({
              name: 'sub',
              title: 'Sub-text',
              type: 'string',
              description: 'Short note shown below the value.',
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {list: CONTACT_ICONS, layout: 'dropdown'},
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'value', icon: 'icon'},
            prepare({title, subtitle}) {
              return {title, subtitle}
            },
          },
        },
      ],
    }),
    defineField({
      name: 'footnote',
      title: 'Footnote',
      type: 'text',
      rows: 2,
      description: 'Closing line at the bottom of the page.',
    }),
  ],
  preview: {
    select: {title: 'title', headline: 'headline', emphasis: 'headlineEmphasis'},
    prepare({title, headline, emphasis}) {
      const line = [headline, emphasis].filter(Boolean).join(' ')
      return {title: title || 'Contact', subtitle: line || undefined}
    },
  },
})
