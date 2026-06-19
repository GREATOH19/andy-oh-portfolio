import {defineField} from 'sanity'

export const GRID_ASPECT_RATIO_OPTIONS = [
  {title: 'Auto (original)', value: 'auto'},
  {title: 'Square (1:1)', value: 'square'},
  {title: 'Landscape (4:3)', value: 'landscape'},
  {title: 'Photo (3:2)', value: 'photo'},
  {title: 'Classic print (5:4)', value: 'print'},
  {title: 'Wide photo (5:3)', value: 'widePhoto'},
  {title: 'Wide (16:9)', value: 'wide'},
  {title: 'Widescreen (16:10)', value: 'widescreen'},
  {title: 'Panorama (2:1)', value: 'panorama'},
  {title: 'Cinematic (21:9)', value: 'cinematic'},
  {title: 'Portrait (3:4)', value: 'portrait'},
  {title: 'Portrait (5:6)', value: 'portrait56'},
  {title: 'Tall feed (4:5)', value: 'portraitFeed'},
  {title: 'Editorial (2:3)', value: 'photoPortrait'},
  {title: 'Vertical video (9:16)', value: 'tall'},
]

export const GRID_CROP_FOCUS_OPTIONS = [
  {title: 'Auto (image hotspot)', value: 'auto'},
  {title: 'Center', value: 'center'},
  {title: 'Top', value: 'top'},
  {title: 'Bottom', value: 'bottom'},
  {title: 'Left', value: 'left'},
  {title: 'Right', value: 'right'},
]

const GRID_ASPECT_DESCRIPTION =
  'When set, every tile in the row uses the same crop shape. Open each image and drag the hotspot (or crop handles) to choose what stays visible.'

/** Uniform crop aspect for multi-column image grids. */
export function gridAspectRatioField(overrides = {}) {
  return defineField({
    name: 'gridAspectRatio',
    title: 'Crop aspect ratio',
    type: 'string',
    initialValue: 'auto',
    options: {layout: 'radio', list: GRID_ASPECT_RATIO_OPTIONS},
    description: GRID_ASPECT_DESCRIPTION,
    ...overrides,
  })
}

/** Block-level focal fallback when an image has no hotspot. */
export function gridCropFocusField(overrides = {}) {
  return defineField({
    name: 'cropFocus',
    title: 'Crop focus',
    type: 'string',
    initialValue: 'auto',
    options: {layout: 'radio', list: GRID_CROP_FOCUS_OPTIONS},
    hidden: ({parent}) => (parent?.gridAspectRatio ?? 'auto') === 'auto',
    description: 'Fallback when an image has no hotspot. Per-image hotspot always wins.',
    ...overrides,
  })
}
