// src/pages/sitemap.xml.ts
import { type APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import siteConfig from '../data/site-config';

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Site URL not configured', { status: 500 });
  }

  try {
    const paths = new Set<string>();
    
    // Add header links (excluding blog and dynamic pages)
    siteConfig.headerNavLinks?.forEach(link => {
      if (link.href !== '/blog/' && !link.href.includes(':')) {
        paths.add(link.href);
      }
    });

    // Add static category pages
    Object.keys(siteConfig.tagDescriptions).forEach(tag => {
      paths.add(`/categories/${tag}/`);
    });

    // Get blog posts
    const posts = await getCollection('blog');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site}</loc>
  </url>
${Array.from(paths).map(path => `  <url>
    <loc>${new URL(path.replace(/^\//, ''), site).href}</loc>
  </url>`).join('\n')}
${posts.map(post => {
  const lastmod = post.data.updatedDate || post.data.publishDate;
  return `  <url>
    <loc>${new URL(`blog/${post.slug}/`, site).href}</loc>
    ${lastmod ? `<lastmod>${lastmod.toISOString().split('T')[0]}</lastmod>` : ''}
  </url>`;
}).join('\n')}
</urlset>`;

    return new Response(xml.trim(), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
};
