import type { APIRoute } from 'astro';
import { getAllUnifiedPosts } from '../utils/content-utils';
import siteConfig from '../data/site-config';
import type { SiteConfig } from '../data/site-config';

const ensureTrailingSlash = (url: string) => url.endsWith('/') ? url : `${url}/`;
const normalizeUrl = (url: string) => ensureTrailingSlash(url.replace(/^\/+/, ''));

const generateStaticUrls = (config: SiteConfig, site: URL): string[] => {
  const urls = new Set<string>();
  
  // Add homepage
  urls.add(ensureTrailingSlash(site.href));
  
  // Add header navigation links
  config.headerNavLinks?.forEach(link => {
    if (!link.href.includes(':') && link.href !== '/blog/') {
      const fullUrl = new URL(normalizeUrl(link.href), site).href;
      urls.add(ensureTrailingSlash(fullUrl));
    }
  });
  
  // Add category pages
  if (config.tagDescriptions) {
    Object.keys(config.tagDescriptions).forEach(tag => {
      const categoryUrl = new URL(`categories/${tag}/`, site).href;
      urls.add(ensureTrailingSlash(categoryUrl));
    });
  }
  
  return Array.from(urls);
};

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Site URL not configured', { status: 500 });
  }

  try {
    const baseUrl = new URL(site);
    const staticUrls = generateStaticUrls(siteConfig, baseUrl);
    
    // Get blog posts
    const posts = await getAllUnifiedPosts();
    const sortedPosts = posts.sort((a, b) => {
      const dateA = a.data.updatedDate || a.data.publishDate;
      const dateB = b.data.updatedDate || b.data.publishDate;
      return dateB.valueOf() - dateA.valueOf();
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map(url => `  <url>
    <loc>${url}</loc>
  </url>`).join('\n')}
${sortedPosts.map(post => {
  const lastmod = post.data.updatedDate || post.data.publishDate;
  const postUrl = ensureTrailingSlash(new URL(`blog/${post.slug}/`, baseUrl).href);
  return `  <url>
    <loc>${postUrl}</loc>${lastmod ? `
    <lastmod>${lastmod.toISOString().split('T')[0]}</lastmod>` : ''}
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