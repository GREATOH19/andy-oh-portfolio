import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {deskStructure} from './deskStructure'
import {schemaTypes} from './schemaTypes'
import {projectPlacement} from './sanity/plugins/projectPlacement'
import {presentation} from './sanity/presentation'

// Opt-in: needs web on :3000 + SANITY_API_READ_TOKEN in web/.env.local
const usePresentation = process.env.SANITY_STUDIO_ENABLE_PRESENTATION === 'true'

export default defineConfig({
  name: 'default',
  title: 'Andy Oh Portfolio',

  projectId: 'sttir3vc',
  dataset: 'production',

  plugins: [
    structureTool({structure: deskStructure}),
    media(),
    ...(usePresentation ? [presentation] : []),
    visionTool(),
    projectPlacement(),
  ],

  schema: {
    types: schemaTypes,
  },
})
