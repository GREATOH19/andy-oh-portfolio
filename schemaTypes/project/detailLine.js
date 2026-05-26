import {defineField, defineType} from 'sanity'

/** One line in the intro sidebar (e.g. Client · AgriTech Lab). */
export const detailLine = defineType({
  name: 'detailLine',
  title: 'Detail line',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Optional — e.g. Client, Duration, Team',
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'Optional — leave empty while drafting; empty lines are hidden on the site.',
    }),
  ],
  preview: {
    select: {label: 'label', value: 'value'},
    prepare: ({label, value}) => ({
      title: value?.trim() || label?.trim() || 'Detail line (draft)',
      subtitle: value?.trim() && label?.trim() ? label : undefined,
    }),
  },
})
