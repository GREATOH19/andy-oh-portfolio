import {defineField} from 'sanity'
import {CMS_FONT_OPTIONS} from '../fontStyle'

/** Default body font + px size for chapter / zigzag (inline marks can override). */
export function projectBodyTypographyFields() {
  return [
    defineField({
      name: 'bodyFont',
      title: 'Body font',
      type: 'string',
      description:
        'Default font for all body text in this block. Use the Font mark on selected text to override.',
      options: {list: CMS_FONT_OPTIONS, layout: 'dropdown'},
    }),
    defineField({
      name: 'bodyFontSize',
      title: 'Body font size (px)',
      type: 'number',
      description:
        'Default text size in pixels for this block. Use the Font size mark on selected text to override.',
      validation: (Rule) => Rule.min(10).max(120).integer(),
    }),
  ]
}
