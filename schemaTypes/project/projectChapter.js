import {defineField, defineType} from 'sanity'
import {CMS_FONT_OPTIONS} from '../fontStyle'

export const projectChapter = defineType({
  name: 'projectChapter',
  title: 'Chapter',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      description: 'Short chapter title — e.g. Context, Approach, Outcome',
    }),
    defineField({
      name: 'tocTitle',
      title: 'TOC label',
      type: 'string',
      description: 'Short navigation label for the table of contents.',
    }),
    defineField({
      name: 'titleFont',
      title: 'Heading font',
      type: 'string',
      options: {list: CMS_FONT_OPTIONS, layout: 'dropdown'},
    }),
    defineField({
      name: 'titleSize',
      title: 'Heading size',
      type: 'string',
      initialValue: 'md',
      options: {
        layout: 'radio',
        list: [
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
          {title: 'XL', value: 'xl'},
        ],
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Paragraph', value: 'normal'},
            {title: 'Paragraph — Small', value: 'sizeSm'},
            {title: 'Paragraph — Large', value: 'sizeLg'},
            {title: 'Paragraph — XL', value: 'sizeXl'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 2 — Small', value: 'h2Sm'},
            {title: 'Heading 2 — Large', value: 'h2Lg'},
            {title: 'Heading 2 — XL', value: 'h2Xl'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Heading 3 — Small', value: 'h3Sm'},
            {title: 'Heading 3 — Large', value: 'h3Lg'},
            {title: 'Heading 3 — XL', value: 'h3Xl'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              {
                name: 'font',
                title: 'Font',
                type: 'object',
                fields: [
                  defineField({
                    name: 'font',
                    title: 'Font',
                    type: 'string',
                    options: {list: CMS_FONT_OPTIONS, layout: 'dropdown'},
                  }),
                ],
              },
            ],
          },
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({
      title: title || 'Chapter (draft)',
      subtitle: 'Text',
    }),
  },
})
