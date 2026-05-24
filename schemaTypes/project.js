import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'project'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description:
        'Short tagline shown under the title on the detail page (e.g. "autonomous data collection system for precision farming"). Also used in card hover overlays later.',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description:
        'Shown on project cards, detail pages, and /more/archive (grouped by year). Single year (e.g. 2024) or a range (e.g. 2022 ~ 2024). Homepage placement uses Featured on Work, not drag order here.',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g. Industrial design, CMF, UX',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / intro body',
      type: 'text',
      rows: 6,
      description:
        'Longer description shown in the detail header (left column). Use blank lines to separate paragraphs.',
    }),
    defineField({
      name: 'metaItems',
      title: 'Meta items',
      type: 'array',
      description:
        'Right-side meta column lines (e.g. "Team: Indalecio Gaytan", "Duration: 12 weeks").',
      of: [
        {
          type: 'object',
          name: 'metaItem',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              description: 'Optional label prefix (e.g. "Team", "Duration"). Leave empty for a plain line.',
            }),
            defineField({
              name: 'value',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {label: 'label', value: 'value'},
            prepare: ({label, value}) => ({
              title: value,
              subtitle: label || undefined,
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'contributions',
      title: 'Contributions',
      type: 'array',
      description: 'Your contributions (e.g. "Ideation", "CAD", "Rendering + Animation").',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      type: 'array',
      description: 'Partners shown under "In collaboration with" with their logos.',
      of: [
        {
          type: 'object',
          name: 'collaborator',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'logo',
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({name: 'alt', type: 'string', title: 'Alternative text'}),
              ],
            }),
            defineField({
              name: 'href',
              title: 'Link (optional)',
              type: 'url',
            }),
          ],
          preview: {
            select: {title: 'name', media: 'logo'},
          },
        },
      ],
    }),
    defineField({
      name: 'mediumUrl',
      title: 'Medium article',
      type: 'url',
      description:
        'Optional link to a Medium post about this project. Shown in the detail page meta column.',
    }),
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'array',
      description: 'Award badges shown in the top of the meta column.',
      of: [
        {
          type: 'object',
          name: 'award',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              options: {hotspot: true},
              validation: (Rule) => Rule.required(),
              fields: [
                defineField({name: 'alt', type: 'string', title: 'Alternative text'}),
              ],
            }),
            defineField({
              name: 'label',
              title: 'Caption (optional)',
              type: 'string',
              description: 'e.g. "Core77 Design Awards 2024 Winner".',
            }),
            defineField({
              name: 'href',
              title: 'Link (optional)',
              type: 'url',
            }),
          ],
          preview: {
            select: {label: 'label', media: 'image'},
            prepare: ({label, media}) => ({title: label || 'Award', media}),
          },
        },
      ],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
      description: 'Thumbnail used in the Work grid.',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image or video',
      type: 'cmsMediaItem',
      description:
        'Full-bleed media shown above the project header on the detail page. Falls back to the cover image if empty.',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{type: 'cmsMediaItem'}],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        {type: 'richTextSection'},
        {type: 'imageSection'},
        {type: 'gallerySection'},
        {type: 'twoColumnSection'},
        {type: 'quoteSection'},
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
