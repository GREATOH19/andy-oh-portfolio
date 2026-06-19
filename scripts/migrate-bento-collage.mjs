/**
 * Convert legacy projectCollage blocks → projectPhotoCollage.
 * Run from repo root: npm run migrate:bento-collage
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})

function collageToPhotoCollage(block) {
  const items = Array.isArray(block.items) ? block.items : []
  if (items.length === 0) return null

  const portraitSide =
    block.layoutTemplate === 'portraitRightStackLeft' ? 'right' : 'left'

  return {
    _type: 'projectPhotoCollage',
    _key: block._key,
    portraitSide,
    portrait: items[0]?.media ?? undefined,
    strips: items.slice(1).map((item) => item.media).filter(Boolean),
    caption: block.caption ?? undefined,
    mediaWidth: block.mediaWidth ?? undefined,
    mediaAlign: block.mediaAlign ?? undefined,
    mobileCarousel: block.mobileCarousel ?? undefined,
  }
}

async function migrate() {
  const projects = await client.fetch(
    `*[_type == "project" && count(story[_type == "projectCollage"]) > 0]{_id, title, story}`,
  )

  if (projects.length === 0) {
    console.log('No projectCollage blocks found.')
    return
  }

  for (const project of projects) {
    const story = Array.isArray(project.story) ? project.story : []
    let changed = false

    const nextStory = story
      .map((block) => {
        if (block._type !== 'projectCollage') return block
        const converted = collageToPhotoCollage(block)
        if (!converted) return null
        changed = true
        return converted
      })
      .filter(Boolean)

    if (!changed) continue

    await client.patch(project._id).set({story: nextStory}).commit()
    console.log(`Migrated: ${project.title ?? project._id}`)
  }

  console.log('Done.')
}

migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})
