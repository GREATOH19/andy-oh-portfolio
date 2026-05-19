import {defineField} from 'sanity'

/** Values must match `SiteBrandFont` / `cmsFontClass` in the Next.js app */
export const CMS_FONT_OPTIONS = [
  {title: 'Playfair Display (serif)', value: 'serif'},
  {title: 'Geist Sans', value: 'sans'},
  {title: 'Geist Mono', value: 'mono'},
  {title: 'DM Sans', value: 'dmSans'},
  {title: 'Instrument Serif', value: 'instrument'},
  {title: 'Pinyon Script', value: 'pinyon'},
  {title: 'Gloock', value: 'gloock'},
]

/**
 * Site-wide typography role (Site Settings → Typography).
 * @param {string} name
 * @param {string} title
 * @param {string} [description]
 */
export function cmsFontField(name, title, description) {
  return defineField({
    name,
    title,
    type: 'string',
    description:
      description ??
      'Optional. Leave empty to use the role’s built-in default in the web app.',
    options: {
      list: CMS_FONT_OPTIONS,
      layout: 'dropdown',
    },
  })
}

/** Four global typography roles — used only in Site Settings */
export function typographyFields() {
  return defineField({
    name: 'typography',
    title: 'Typography',
    description:
      'Site-wide fonts. Display and heading default to serif; body and meta inherit layout defaults when empty.',
    type: 'object',
    options: {collapsible: true, collapsed: false},
    fields: [
      cmsFontField(
        'display',
        'Display',
        'Large titles: project names, About name, Contact headline, quotes.',
      ),
      cmsFontField('heading', 'Heading', 'Section titles, skill groups, education schools, More page headings.'),
      cmsFontField('body', 'Body', 'Paragraphs, excerpts, subtitles, biography, footer text.'),
      cmsFontField('meta', 'Meta / caption', 'Footnotes, image captions, meta lines, project detail sidebar.'),
    ],
  })
}
