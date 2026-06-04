import {defineField} from 'sanity'
import {CMS_FONT_OPTIONS} from '../fontStyle'

/** Portable text block + inline media — reused in chapters and two-column blocks */
export function projectPortableTextMembers() {
  return [
    {
      type: 'block',
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
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
          {
            name: 'fontSize',
            title: 'Font size',
            type: 'object',
            fields: [
              defineField({
                name: 'size',
                title: 'Size (px)',
                type: 'number',
                validation: (Rule) => Rule.required().min(10).max(120).integer(),
              }),
            ],
          },
        ],
      },
    },
    {type: 'projectInlineMedia'},
  ]
}
