import {defineField, defineType} from 'sanity'
import {BentoGridInput} from '../../sanity/components/BentoGridInput.jsx'
import {projectStoryLayoutFields} from './projectStoryLayoutFields'

export const projectCollage = defineType({
  name: 'projectCollage',
  title: 'Bento collage',
  type: 'object',
  components: {
    input: BentoGridInput,
  },
  fields: [
    defineField({
      name: 'items',
      title: 'Tiles',
      type: 'array',
      of: [{type: 'collageItem'}],
      description: 'Pick a tile size per item. Order controls packing (top → bottom, left → right).',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    ...projectStoryLayoutFields,
  ],
  preview: {
    select: {items: 'items', caption: 'caption'},
    prepare: ({items, caption}) => {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: caption || `Bento collage (${count})`,
        subtitle: count ? `${count} tile${count === 1 ? '' : 's'}` : 'No tiles',
        media: items?.[0]?.media?.image,
      }
    },
  },
})
