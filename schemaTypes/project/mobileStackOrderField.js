import {defineField} from 'sanity'

/** Mobile-only stack order; desktop / default follows story block order in the editor. */
export const MOBILE_STACK_ORDER_OPTIONS = [
  {title: 'Same as story order', value: 'default'},
  {title: 'Photos first (mobile only)', value: 'mediaFirst'},
  {title: 'Text first (mobile only)', value: 'textFirst'},
]

export function mobileStackOrderField({name, title, description}) {
  return defineField({
    name,
    title,
    type: 'string',
    initialValue: 'default',
    options: {
      layout: 'radio',
      list: MOBILE_STACK_ORDER_OPTIONS,
    },
    description,
  })
}
