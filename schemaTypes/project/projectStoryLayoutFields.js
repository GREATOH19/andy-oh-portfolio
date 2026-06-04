import {defineField} from 'sanity'

/** Shared layout controls for story media blocks */
export const projectStoryLayoutFields = [
  defineField({
    name: 'mediaWidth',
    title: 'Width',
    type: 'string',
    initialValue: 'full',
    options: {
      layout: 'radio',
      list: [
        {title: 'Narrow (readable)', value: 'narrow'},
        {title: 'Medium', value: 'medium'},
        {title: 'Full column', value: 'full'},
        {title: 'Edge-to-edge', value: 'bleed'},
      ],
    },
  }),
  defineField({
    name: 'mediaAlign',
    title: 'Alignment',
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
  defineField({
    name: 'mobileCarousel',
    title: 'Mobile layout (2+ items)',
    type: 'string',
    initialValue: 'carousel',
    options: {
      layout: 'radio',
      list: [
        {title: 'Swipe carousel', value: 'carousel'},
        {title: 'Stacked (no carousel)', value: 'stack'},
      ],
    },
    description:
      'On phones, multiple images/videos in this block use a carousel by default. Choose Stacked to show them in a vertical list instead (useful for full-bleed sequences).',
  }),
]
