import {defineField, defineType} from 'sanity'

export const archiveBlock = defineType({
  name: 'archiveBlock',
  title: 'Archive',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show on site',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'defaultExpanded',
      title: 'Expanded by default',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Archive',
    }),
    defineField({
      name: 'archiveProjects',
      title: 'Archive projects',
      type: 'array',
      description:
        'Grouped by year on /more/archive. Use project document actions to add or remove.',
      of: [{type: 'reference', to: [{type: 'project'}]}],
    }),
    defineField({
      name: 'archiveAlbums',
      title: 'Media albums',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'mediaAlbum'}]}],
      description:
        'Standalone photos and videos, grouped in albums (create under More → Media albums). Each album can hold 100+ items.',
    }),
  ],
  preview: {
    select: {heading: 'heading', enabled: 'enabled', projects: 'archiveProjects', albums: 'archiveAlbums'},
    prepare({heading, enabled, projects, albums}) {
      const projectCount = Array.isArray(projects) ? projects.length : 0
      const albumCount = Array.isArray(albums) ? albums.length : 0
      const parts = []
      if (projectCount > 0) parts.push(`${projectCount} project${projectCount === 1 ? '' : 's'}`)
      if (albumCount > 0) parts.push(`${albumCount} album${albumCount === 1 ? '' : 's'}`)
      const summary = parts.length > 0 ? parts.join(' · ') : 'Empty'
      return {
        title: heading || 'Archive',
        subtitle: `${enabled === false ? 'Hidden · ' : ''}${summary}`,
      }
    },
  },
})
