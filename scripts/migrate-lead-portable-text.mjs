/**
 * Convert legacy plain-text project.lead → portable text blocks.
 * Run from repo root: npm run migrate:lead-pt
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})

function splitLegacyParagraphs(value) {
  return value
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
}

function legacyLeadToBlocks(value) {
  if (typeof value !== 'string' || !value.trim()) return []
  return splitLegacyParagraphs(value).map((text, index) => ({
    _type: 'block',
    _key: `legacy-lead-${index}`,
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: `legacy-lead-${index}-span`,
        text,
        marks: [],
      },
    ],
  }))
}

async function main() {
  const projects = await client.fetch(`*[_type == "project"]{_id, title, lead}`)

  let migrated = 0
  for (const doc of projects) {
    if (typeof doc.lead !== 'string') continue

    const blocks = legacyLeadToBlocks(doc.lead)
    await client.patch(doc._id).set({lead: blocks}).commit()
    console.log(`Migrated lead: ${doc.title || doc._id}`)
    migrated += 1
  }

  console.log(migrated ? `Done. Migrated ${migrated} project(s).` : 'No legacy string leads found.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
