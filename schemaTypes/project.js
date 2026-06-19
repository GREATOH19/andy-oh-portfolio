import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'
import {projectPortableTextMembers} from './project/projectPortableText'
import {defaultProjectDetails} from './project/projectDetailDefaults'

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
      type: 'array',
      group: 'intro',
      of: projectPortableTextMembers(),
      description:
        'Intro copy below the hero — same editor as story text boxes (lists, headings, inline font/size). No block-level body font/size fields here.',
    }),
    defineField({
      name: 'details',
      title: 'Project details',
      type: 'array',
      group: 'intro',
      description:
        'Sidebar lines — new projects start with Type, Duration, Key skills, Size, Material. Drag to reorder, add or remove rows anytime. Empty values are hidden on the site.',
      of: [{type: 'detailLine'}],
      initialValue: defaultProjectDetails,
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
    defineField({
      name: 'attachments',
      title: 'Downloads (PDF)',
      type: 'array',
      group: 'intro',
      description:
        'Optional PDFs shown below the overview and above the story — e.g. process deck, spec sheet.',
      of: [{type: 'projectAttachment'}],
    }),

    // —— Story (scroll) ——
    defineField({
      name: 'story',
      title: 'Story',
      type: 'array',
      group: 'story',
      description:
        'Build top to bottom: chapters, text boxes, media, audio, YouTube, grids, media collages, process steps, Instagram feeds, zigzag, two columns, and quotes. Use Width/Alignment on media blocks.',
      of: [
        {type: 'projectChapter'},
        {type: 'projectTextBox'},
        {type: 'projectMedia'},
        {type: 'projectGallery'},
        {type: 'projectPhotoCollage'},
        {type: 'projectProcess'},
        {type: 'projectQuote'},
        {type: 'projectZigzagRow'},
        {type: 'projectInstagramFeed'},
        {type: 'projectColumns'},
        {type: 'projectAudio'},
        {type: 'projectYoutube'},
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
