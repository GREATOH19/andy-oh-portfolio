import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [
    {name: 'listing', title: 'Card & listing', default: true},
    {name: 'cover', title: 'Cover'},
    {name: 'intro', title: 'Intro'},
    {name: 'story', title: 'Story'},
  ],
  fields: [
    orderRankField({type: 'project'}),

    // —— Card & listing ——
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'listing',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'listing',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'listing',
      description:
        'One line under the title on cards and the hero — e.g. "autonomous data collection for precision farming".',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'listing',
      description: 'Shown on cards and intro — e.g. 2024 or 2022 ~ 2024.',
    }),
    defineField({
      name: 'role',
      title: 'Your role',
      type: 'string',
      group: 'listing',
      description: 'e.g. Industrial design · CMF · Prototyping',
    }),
    defineField({
      name: 'coverImage',
      title: 'Card thumbnail',
      type: 'image',
      group: 'listing',
      options: {hotspot: true},
      description: 'Image for the Work grid.',
      fields: [defineField({name: 'alt', type: 'string', title: 'Alternative text'})],
    }),
    defineField({
      name: 'cardOverlayScrim',
      title: 'Dark card overlay',
      type: 'boolean',
      group: 'listing',
      initialValue: false,
      description: 'Turn on when the cover is dark so hover titles stay readable.',
    }),

    // —— Cover ——
    defineField({
      name: 'heroImage',
      title: 'Hero image or video',
      type: 'cmsMediaItem',
      group: 'cover',
      description:
        'Full-bleed cover at the top of the project page. Falls back to the card thumbnail if empty.',
    }),

    // —— Intro (below hero) ——
    defineField({
      name: 'lead',
      title: 'Lead',
      type: 'text',
      rows: 8,
      group: 'intro',
      description:
        '2–3 short paragraphs for the intro block. Separate paragraphs with a blank line.',
    }),
    defineField({
      name: 'details',
      title: 'Project details',
      type: 'array',
      group: 'intro',
      description: 'Sidebar lines — Client, Duration, Team, etc.',
      of: [{type: 'detailLine'}],
    }),
    defineField({
      name: 'highlights',
      title: 'What you did',
      type: 'array',
      group: 'intro',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Your contributions — e.g. Form development, CMF, Prototyping.',
    }),
    defineField({
      name: 'partners',
      title: 'Collaborators',
      type: 'array',
      group: 'intro',
      of: [{type: 'partner'}],
    }),
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'array',
      group: 'intro',
      validation: (Rule) => Rule.max(3),
      of: [{type: 'projectAward'}],
    }),
    defineField({
      name: 'articleUrl',
      title: 'Article link',
      type: 'url',
      group: 'intro',
      description: 'Optional — Medium or case study URL.',
    }),

    // —— Story (scroll) ——
    defineField({
      name: 'story',
      title: 'Story',
      type: 'array',
      group: 'story',
      description:
        'Build the case study top to bottom: chapters for text, full-width media for hero moments, grids for process shots, pull quotes for emphasis.',
      of: [
        {type: 'projectChapter'},
        {type: 'projectMedia'},
        {type: 'projectGallery'},
        {type: 'projectQuote'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      media: 'coverImage',
    },
    prepare({title, year, media}) {
      return {
        title,
        subtitle: year || undefined,
        media,
      }
    },
  },
})
