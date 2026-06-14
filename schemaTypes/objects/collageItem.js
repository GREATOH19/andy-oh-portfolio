import {defineField, defineType} from 'sanity'
import {BENTO_TILE_OPTIONS} from '../../collage/bentoPack.js'

export const collageItem = defineType({
  name: 'collageItem',
  title: 'Collage tile',
  type: 'object',
  fields: [
    defineField({
      name: 'media',
      title: 'Media',
      type: 'cmsMediaItem',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tileSize',
      title: 'Tile size',
      type: 'string',
      initialValue: 'square',
      options: {layout: 'dropdown', list: BENTO_TILE_OPTIONS},
      description: 'Snaps to the 12-column bento grid. Reorder items above to change layout.',
    }),
  ],
  preview: {
    select: {tileSize: 'tileSize', mediaType: 'media.mediaType', image: 'media.image', alt: 'media.alt'},
    prepare({tileSize, mediaType, image, alt}) {
      const sizeLabel = BENTO_TILE_OPTIONS.find((o) => o.value === tileSize)?.title ?? tileSize
      return {
        title: alt || (mediaType === 'video' ? 'Video' : 'Image'),
        subtitle: sizeLabel,
        media: image,
      }
    },
  },
})
