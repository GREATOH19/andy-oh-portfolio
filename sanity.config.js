import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {deskStructure} from './deskStructure'
import {schemaTypes} from './schemaTypes'
import {projectPlacement} from './sanity/plugins/projectPlacement'

export default defineConfig({
  name: 'default',
  title: 'Andy Oh Portfolio',

  projectId: 'sttir3vc',
  dataset: 'production',

  plugins: [structureTool({structure: deskStructure}), visionTool(), projectPlacement()],

  schema: {
    types: schemaTypes,
  },
})
