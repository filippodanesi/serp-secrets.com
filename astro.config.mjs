import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import rehypeExternalLinks from 'rehype-external-links';
import { remarkReadingTime } from './remark-reading-time.mjs';

export default defineConfig({
  site: 'https://www.serp-secrets.com',
  output: 'server',
  adapter: vercel({
    isr: { expiration: 60 * 60 * 24 }
  }),
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: ['nofollow', 'noopener', 'noreferrer'],
          target: '_blank',
          test: (node) => {
            if (node.tagName !== 'a' || !node.properties || !node.properties.href) {
              return false;
            }
            
            const href = node.properties.href;
            return !(
              href.startsWith('/') || 
              href.startsWith('#') ||
              href.includes('serp-secrets.com')
            );
          }
        }
      ]
    ]
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react()
  ]
});