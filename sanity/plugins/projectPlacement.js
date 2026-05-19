import {definePlugin} from 'sanity'

const API_VERSION = '2024-01-01'
const MORE_SLUG = 'more'

function randomKey() {
  return Math.random().toString(36).slice(2, 11)
}

function refId(ref) {
  if (!ref) return null
  return ref._ref ?? ref._id ?? null
}

function hasRef(refs, projectId) {
  return (refs ?? []).some((r) => refId(r) === projectId)
}

function createPlacementAction({label, action, isDisabled}) {
  return function PlacementAction(props) {
    const disabled = isDisabled?.(props) ?? false
    return {
      label,
      disabled,
      onHandle: async () => {
        try {
          await action(props)
          props.onComplete()
        } catch (err) {
          console.error(err)
          props.onComplete({message: err?.message ?? 'Action failed'})
        }
      },
    }
  }
}

async function getHomeDoc(client) {
  return client.fetch(`*[_type == "home"][0]{_id, featuredProjects}`)
}

async function getMorePage(client) {
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{_id, blocks}`,
    {slug: MORE_SLUG},
  )
}

function findArchiveBlockIndex(blocks) {
  return (blocks ?? []).findIndex((b) => b?._type === 'archiveBlock')
}

const AddToWorkAction = createPlacementAction({
  label: 'Add to Work (home)',
  isDisabled: (props) => !props.published || !props.id,
  action: async (props) => {
    const client = props.getClient({apiVersion: API_VERSION})
    const home = await getHomeDoc(client)
    if (!home?._id) throw new Error('No Work homepage document found. Create one under Work → Work homepage.')

    const featured = home.featuredProjects ?? []
    if (hasRef(featured, props.id)) return
    if (featured.length >= 9) throw new Error('Work homepage already has 9 featured projects.')

    await client
      .patch(home._id)
      .setIfMissing({featuredProjects: []})
      .append('featuredProjects', [{_type: 'reference', _ref: props.id, _key: randomKey()}])
      .commit()
  },
})

const RemoveFromWorkAction = createPlacementAction({
  label: 'Remove from Work (home)',
  isDisabled: (props) => !props.published || !props.id,
  action: async (props) => {
    const client = props.getClient({apiVersion: API_VERSION})
    const home = await getHomeDoc(client)
    if (!home?._id) return

    const featured = home.featuredProjects ?? []
    if (!hasRef(featured, props.id)) return

    const next = featured.filter((r) => refId(r) !== props.id)
    await client.patch(home._id).set({featuredProjects: next}).commit()
  },
})

const AddToMoreArchiveAction = createPlacementAction({
  label: 'Add to More archive',
  isDisabled: (props) => !props.published || !props.id,
  action: async (props) => {
    const client = props.getClient({apiVersion: API_VERSION})
    let more = await getMorePage(client)

    if (!more?._id) {
      more = await client.create({
        _type: 'page',
        title: 'More',
        slug: {_type: 'slug', current: MORE_SLUG},
        blocks: [
          {
            _type: 'archiveBlock',
            _key: randomKey(),
            enabled: true,
            defaultExpanded: false,
            heading: 'Archive',
            archiveProjects: [{_type: 'reference', _ref: props.id, _key: randomKey()}],
          },
        ],
      })
      return
    }

    const blocks = [...(more.blocks ?? [])]
    let idx = findArchiveBlockIndex(blocks)

    if (idx === -1) {
      blocks.push({
        _type: 'archiveBlock',
        _key: randomKey(),
        enabled: true,
        defaultExpanded: false,
        heading: 'Archive',
        archiveProjects: [{_type: 'reference', _ref: props.id, _key: randomKey()}],
      })
      await client.patch(more._id).set({blocks}).commit()
      return
    }

    const archive = blocks[idx]
    const projects = archive.archiveProjects ?? []
    if (hasRef(projects, props.id)) return

    await client
      .patch(more._id)
      .insert('after', `blocks[_key=="${archive._key}"].archiveProjects[-1]`, [
        {_type: 'reference', _ref: props.id, _key: randomKey()},
      ])
      .commit()
  },
})

const RemoveFromMoreArchiveAction = createPlacementAction({
  label: 'Remove from More archive',
  isDisabled: (props) => !props.published || !props.id,
  action: async (props) => {
    const client = props.getClient({apiVersion: API_VERSION})
    const more = await getMorePage(client)
    if (!more?._id) return

    const blocks = [...(more.blocks ?? [])]
    const idx = findArchiveBlockIndex(blocks)
    if (idx === -1) return

    const archive = blocks[idx]
    const projects = archive.archiveProjects ?? []
    const nextProjects = projects.filter((r) => refId(r) !== props.id)
    if (nextProjects.length === projects.length) return

    blocks[idx] = {...archive, archiveProjects: nextProjects}
    await client.patch(more._id).set({blocks}).commit()
  },
})

export const projectPlacement = definePlugin({
  name: 'project-placement',
  document: {
    actions: (prev, {schemaType}) => {
      if (schemaType !== 'project') return prev
      return [
        ...prev,
        AddToWorkAction,
        RemoveFromWorkAction,
        AddToMoreArchiveAction,
        RemoveFromMoreArchiveAction,
      ]
    },
  },
})
