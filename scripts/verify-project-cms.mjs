import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})

const rows = await client.fetch(`*[_type == "project"]{
  title,
  "legacy": {
    "gallery": defined(gallery),
    "metaItems": defined(metaItems),
    "excerpt": defined(excerpt),
    "sections": defined(sections),
    "body": defined(body)
  },
  "intro": {
    "lead": defined(lead),
    "details": count(details),
    "story": count(story)
  }
}`)

console.log(JSON.stringify(rows, null, 2))
