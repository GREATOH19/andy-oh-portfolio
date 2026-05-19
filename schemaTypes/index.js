import {project} from './project'
import {home} from './home'
import {about} from './about'
import {contact} from './contact'
import {page} from './page'
import {siteSettings} from './siteSettings'

import {cmsImage} from './objects/cmsImage'
import {photoAlbum} from './objects/photoAlbum'

import {contactCtaSection} from './sections/contactCtaSection'
import {gallerySection} from './sections/gallerySection'
import {heroSection} from './sections/heroSection'
import {imageSection} from './sections/imageSection'
import {quoteSection} from './sections/quoteSection'
import {richTextSection} from './sections/richTextSection'
import {selectedWorkSection} from './sections/selectedWorkSection'
import {twoColumnSection} from './sections/twoColumnSection'
import {archiveBlock} from './sections/archiveBlock'
import {photographyBlock} from './sections/photographyBlock'
import {behindTheScenesBlock} from './sections/behindTheScenesBlock'

export const schemaTypes = [
  about,
  contact,
  home,
  project,
  page,
  siteSettings,
  cmsImage,
  photoAlbum,
  contactCtaSection,
  gallerySection,
  heroSection,
  imageSection,
  quoteSection,
  richTextSection,
  selectedWorkSection,
  twoColumnSection,
  archiveBlock,
  photographyBlock,
  behindTheScenesBlock,
]
