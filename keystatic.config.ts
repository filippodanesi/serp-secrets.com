import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'cloud',
  },
  cloud: {
    project: 'serpsecrets/serp-secrets-com',
  },
  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({
          label: 'Date',
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          validation: { isRequired: true },
        }),
        tags: fields.multiselect({
          label: 'Tags',
          options: [
            { label: 'Artificial Intelligence', value: 'Artificial Intelligence' },
            { label: 'SEO News', value: 'SEO News' },
            { label: 'SEO Strategies', value: 'SEO Strategies' },
            { label: 'Technical SEO', value: 'Technical SEO' },
          ],
        }),
        image: fields.image({
          label: 'Featured Image',
          directory: 'public/images/posts',
          publicPath: '/images/posts/',
        }),
        draft: fields.checkbox({
          label: 'Draft',
          defaultValue: false,
        }),
        summary: fields.text({
          label: 'AI Summary (auto-generated)',
          description: 'Auto-generated summary for AEO. Leave empty to generate on build.',
          multiline: true,
        }),
        content: fields.mdx({
          label: 'Content',
        }),
      },
    }),
    pages: collection({
      label: 'Pages',
      slugField: 'title',
      path: 'content/pages/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.mdx({
          label: 'Content',
        }),
      },
    }),
  },
});
