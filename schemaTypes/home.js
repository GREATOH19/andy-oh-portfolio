import {defineField, defineType} from 'sanity'

export const home = defineType({
  name: 'home',
  title: 'Work homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Work homepage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured on Work (home)',
      type: 'array',
      description:
        'Up to 9 projects on the Work homepage grid. Order here is the display order. Use “Add to Work (home)” on a project document, or drag references below.',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      validation: (Rule) => Rule.max(9),
    }),
    defineField({
      name: 'welcomeIntro',
      title: 'Welcome intro (first visit)',
      description:
        'Shown above the Selected Work grid only on a visitor’s first arrival in a browser session — alongside the hero intro animation. Leave Heading and Body both empty to hide.',
      type: 'object',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          description: 'e.g., “Hello! This is Andy.”',
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'text',
          rows: 4,
          description:
            'Brief self-introduction. Plain text; line breaks are preserved.',
        }),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      description:
        'Order of blocks on the live Work page. The “Selected work” block only sets the section heading; the grid uses Featured on Work above (max 9). Site-wide fonts are in Site Settings → Typography.',
      of: [{type: 'heroSection'}, {type: 'selectedWorkSection'}, {type: 'contactCtaSection'}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})

