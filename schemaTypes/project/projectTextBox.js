import {defineField, defineType} from 'sanity'
import {projectPortableTextMembers} from './projectPortableText'
import {projectBodyTypographyFields} from './projectBodyTypographyFields'

function portableTextPreviewText(body) {
  if (!Array.isArray(body)) return null
  for (const block of body) {
    if (block?._type === 'projectInlineMedia') return 'Text + inline media'
    if (block?._type !== 'block') continue
    const text = (block.children ?? [])
      .filter((child) => child?._type === 'span' && typeof child.text === 'string')
      .map((child) => child.text)
      .join('')
      .trim()
    if (text) return text.length > 72 ? `${text.slice(0, 72)}…` : text
  }
  return null
}

export const projectTextBox = defineType({
  name: 'projectTextBox',
  title: 'Text box',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Studio label',
      type: 'string',
      description: 'Optional. For your reference in Studio only — not shown on the site.',
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
    ...projectBodyTypographyFields(),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'array',
      of: projectPortableTextMembers(),
      validation: (Rule) =>
        Rule.custom((body) => {
          if (!Array.isArray(body) || body.length === 0) {
            return 'Add text or remove this block'
          }
          const hasContent = body.some((block) => {
            if (block?._type === 'projectInlineMedia') return true
            if (block?._type !== 'block') return false
            return (block.children ?? []).some(
              (child) =>
                child?._type === 'span' &&
                typeof child.text === 'string' &&
                child.text.trim() !== '',
            )
          })
          return hasContent ? true : 'Add text or remove this block'
        }),
    }),
  ],
  preview: {
    select: {label: 'label', body: 'body'},
    prepare: ({label, body}) => {
      const excerpt = portableTextPreviewText(body)
      return {
        title: label?.trim() || 'Text box',
        subtitle: excerpt || 'Add text',
      }
    },
  },
})
