import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export async function GET(context) {
  const blog = await getCollection('blog');
  return rss({
    title: 'Serp Secrets',
    description: 'SEO insights and strategies for better search engine rankings',
    site: context.site,
    items: blog.map((post) => {
      // Remove any Astro imports and component declarations from the content
      const cleanContent = post.body.replace(/import.*?from.*?;/g, '')
        .replace(/<Image.*?\/>/g, '') // Remove Image components
        .replace(/<figure>.*?<\/figure>/gs, ''); // Remove figure elements

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.slug}/`,
        content: sanitizeHtml(parser.render(cleanContent), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt']
          }
        }),
      };
    }),
    customData: `<language>en-us</language>`,
  });
} 