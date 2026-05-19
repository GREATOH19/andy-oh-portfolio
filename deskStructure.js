import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

/** Studio sidebar: About → Work → More (matches site header). */
export const deskStructure = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('About')
        .id('category-about')
        .child(
          S.list()
            .title('About')
            .items([
              S.documentTypeListItem('about').title('About page'),
              S.documentTypeListItem('contact').title('Contact (About page)'),
            ]),
        ),
      S.listItem()
        .title('Work')
        .id('category-work')
        .child(
          S.list()
            .title('Work')
            .items([
              S.documentTypeListItem('home').title('Work homepage'),
              orderableDocumentListDeskItem({
                type: 'project',
                title: 'Projects',
                S,
                context,
              }),
            ]),
        ),
      S.listItem()
        .title('More')
        .id('category-more')
        .child(
          S.list()
            .title('More')
            .items([
              S.documentTypeListItem('page').title('More page'),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .id('category-site-settings')
        .child(S.documentTypeList('siteSettings').title('Site settings')),
    ]);
