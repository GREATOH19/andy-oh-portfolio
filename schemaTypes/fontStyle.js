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
  {title: 'Space Grotesk', value: 'spaceGrotesk'},
]

/** Values must match `SiteFontWeight` / `cmsFontWeightClass` in the Next.js app */
export const CMS_FONT_WEIGHT_OPTIONS = [
  {title: 'Thin (100)', value: '100'},
  {title: 'Extra Light (200)', value: '200'},
  {title: 'Light (300)', value: '300'},
  {title: 'Regular (400)', value: '400'},
  {title: 'Medium (500)', value: '500'},
  {title: 'Semibold (600)', value: '600'},
  {title: 'Bold (700)', value: '700'},
  {title: 'Extra Bold (800)', value: '800'},
  {title: 'Black (900)', value: '900'},
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

/**
 * @param {string} name
 * @param {string} title
 * @param {string} [description]
 */
export function cmsFontWeightField(name, title, description) {
  return defineField({
    name,
    title,
    type: 'string',
    description:
      description ??
      'Optional. Leave empty to use the role’s built-in default weight in the web app.',
    options: {
      list: CMS_FONT_WEIGHT_OPTIONS,
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
      'Site-wide fonts and weights. Fonts: display/heading default to serif when empty. Weights: display light (300), heading/meta medium (500), body regular (400).',
    type: 'object',
    options: {collapsible: true, collapsed: false},
    fields: [
      cmsFontField(
        'display',
        'Display — font',
        'Large titles: project names, About name, Contact headline, quotes.',
      ),
      cmsFontWeightField(
        'displayWeight',
        'Display — weight',
        'Default in the app: Light (300).',
      ),
      cmsFontField(
        'heading',
        'Heading — font',
        'Section titles, skill groups, education schools, More page headings.',
      ),
      cmsFontWeightField(
        'headingWeight',
        'Heading — weight',
        'Default in the app: Medium (500).',
      ),
      cmsFontField(
        'body',
        'Body — font',
        'Paragraphs, excerpts, subtitles, biography, footer text.',
      ),
      cmsFontWeightField('bodyWeight', 'Body — weight', 'Default in the app: Regular (400).'),
      cmsFontField(
        'meta',
        'Meta / caption — font',
        'Footnotes, image captions, meta lines, project detail sidebar.',
      ),
      cmsFontWeightField(
        'metaWeight',
        'Meta / caption — weight',
        'Default in the app: Medium (500).',
      ),
    ],
  })
}
