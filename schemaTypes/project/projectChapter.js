import {defineField, defineType} from 'sanity'
import {CMS_FONT_OPTIONS} from '../fontStyle'
import {projectPortableTextMembers} from './projectPortableText'
import {projectBodyTypographyFields} from './projectBodyTypographyFields'
import {mobileStackOrderField} from './mobileStackOrderField'

function portableTextHasVisibleContent(body) {
  if (!Array.isArray(body)) return false
  return body.some((block) => {
    if (block?._type === 'projectInlineMedia') return true
    if (block?._type !== 'block') return false
    const children = block.children ?? []
    if (children.length === 0) return false
    return children.some(
      (child) =>
        child?._type === 'span' &&
        typeof child.text === 'string' &&
        child.text.trim() !== '',
    )
  })
}

function chapterHasContent(chapter) {
  if (!chapter || typeof chapter !== 'object') return false
  return (
    Boolean(chapter.title?.trim()) ||
    Boolean(chapter.tocTitle?.trim()) ||
    portableTextHasVisibleContent(chapter.body)
  )
}

export const projectChapter = defineType({
  name: 'projectChapter',
  title: 'Chapter',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      description:
        'Optional. Shown on the page as the chapter title. Leave empty to use a TOC label only (no visible heading).',
    }),
    defineField({
      name: 'tocTitle',
      title: 'TOC label',
      type: 'string',
      description:
        'Optional. Navigation label in the table of contents. Can be used without a heading — e.g. to mark a section in the TOC only.',
    }),
    defineField({
      name: 'titleFont',
      title: 'Heading font',
      type: 'string',
      initialValue: 'spaceGrotesk',
      description: 'Defaults to Space Grotesk. Pick another font here to override.',
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
      name: 'textAlign',
      title: 'Text alignment',
      type: 'string',
      initialValue: 'left',
      options: {
        layout: 'radio',
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
      },
    }),
    mobileStackOrderField({
      name: 'mobileBlockOrder',
      title: 'Mobile block order',
      description:
        'Controls how blocks under this chapter stack on phones. Default matches the story order in the editor (same as desktop).',
    }),
    ...projectBodyTypographyFields(),
    defineField({
      name: 'body',
      title: 'Body',
      description:
        'Paragraphs, headings, and inline images. Empty lines: place cursor on blank line and press Backspace.',
      type: 'array',
      of: projectPortableTextMembers(),
      validation: (Rule) =>
        Rule.custom((body, context) => {
          const chapter = context.parent
          if (!Array.isArray(body) || body.length === 0) return true
          if (portableTextHasVisibleContent(body)) return true
          if (chapterHasContent(chapter)) {
            return 'Delete empty lines in Body (cursor on blank line → Backspace), or add text.'
          }
          return true
        }),
    }),
  ],
  validation: (Rule) =>
    Rule.custom((chapter) => {
      if (chapterHasContent(chapter)) return true
      return 'Add a heading, TOC label, or body content'
    }),
  preview: {
    select: {title: 'title', tocTitle: 'tocTitle', hasBody: 'body'},
    prepare: ({title, tocTitle, hasBody}) => {
      const heading = title?.trim()
      const toc = tocTitle?.trim()
      const bodyFilled = portableTextHasVisibleContent(hasBody)
      if (heading) {
        return {
          title: heading,
          subtitle: toc && toc !== heading ? `TOC: ${toc}` : 'Chapter',
        }
      }
      if (toc) {
        return {
          title: toc,
          subtitle: bodyFilled
            ? 'TOC label · no page heading'
            : 'TOC navigation marker (no heading on page)',
        }
      }
      return {title: 'Chapter (draft)', subtitle: 'Add heading, TOC label, or body'}
    },
  },
})
