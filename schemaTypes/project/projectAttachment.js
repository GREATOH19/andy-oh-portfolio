import {defineField, defineType} from 'sanity'

/** PDF (or other file) linked from the project intro, below the overview. */
export const projectAttachment = defineType({
  name: 'projectAttachment',
  title: 'File attachment',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Link label',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Shown on the site — e.g. "Process deck (PDF)".',
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      options: {
        accept: 'application/pdf',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Optional — one short line under the link.',
    }),
  ],
  preview: {
    select: {title: 'title', filename: 'file.asset.originalFilename'},
    prepare: ({title, filename}) => ({
      title: title || 'Attachment',
      subtitle: filename || 'PDF',
    }),
  },
})
