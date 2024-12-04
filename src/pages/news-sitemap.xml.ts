// src/pages/news-sitemap.xml.ts
import { type APIRoute } from 'astro';
import { getCollection } from 'astro:content';

function isWithinLastTwoDays(date: Date): boolean {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  return date >= twoDaysAgo;
}

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Site URL not configured', { status: 500 });
  }

  try {
    // Get blog posts
    const posts = await getCollection('blog');
    
    // Filter posts from last 2 days
    const recentPosts = posts.filter(post => 
      post.data.publishDate && isWithinLastTwoDays(post.data.publishDate)
    );

    // Generate empty sitemap if no recent posts
    if (recentPosts.length === 0) {
      const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`;

      return new Response(emptyXml.trim(), {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recentPosts.map(post => `  <url>
    <loc>${new URL(`blog/${post.slug}/`, site).href}</loc>
    <news:news>
      <news:publication>
        <news:name>SERPsecrets</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${post.data.publishDate.toISOString()}</news:publication_date>
      <news:title>${post.data.title}</news:title>
    </news:news>
  </url>`).join('\n')}
</urlset>`;

    return new Response(xml.trim(), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating news sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
};