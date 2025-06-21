import rss from '@astrojs/rss';
import { getAllUnifiedPosts, isWordPressPost } from '../utils/content-utils';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export async function GET(context) {
  const blog = await getAllUnifiedPosts();
  return rss({
    title: 'Serp Secrets',
    description: 'SEO insights and strategies for better search engine rankings',
    site: context.site,
    items: blog.map((post) => {
      let content;
      
      if (isWordPressPost(post)) {
        // WordPress posts already have HTML content
        content = sanitizeHtml(post.body, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt']
          }
        });
      } else {
        // Astro posts need markdown processing
        const cleanContent = post.body.replace(/import.*?from.*?;/g, '')
          .replace(/<Image.*?\/>/g, '') // Remove Image components
          .replace(/<figure>.*?<\/figure>/gs, ''); // Remove figure elements
        
        content = sanitizeHtml(parser.render(cleanContent), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt']
          }
        });
      }

      return {
        title: post.data.title,
        pubDate: post.data.publishDate,
        description: post.data.excerpt || post.data.description,
        link: `/blog/${post.slug}/`,
        content,
      };
    }),
    customData: `<language>en-us</language>`,
  });
} 