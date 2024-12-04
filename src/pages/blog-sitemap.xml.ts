// src/pages/blog-sitemap.xml.ts
import { type APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Site URL not configured', { status: 500 });
  }

  try {
    // Get all blog posts
    const posts = await getCollection('blog');
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
    console.error('Error generating blog sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
};
