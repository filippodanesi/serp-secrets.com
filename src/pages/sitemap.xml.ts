import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import siteConfig from '../data/site-config';
import type { SiteConfig } from '../data/site-config';

const removeTrailingSlash = (str: string) => str.replace(/\/$/, '');
const addTrailingSlash = (str: string) => str.endsWith('/') ? str : `${str}/`;
const normalizeUrl = (url: string) => addTrailingSlash(url.replace(/^\/+/, ''));

const generateStaticUrls = (config: SiteConfig, site: URL): string[] => {
  const urls = new Set<string>();
  
  // Add homepage
  urls.add(site.href);
  
  // Add header navigation links
  config.headerNavLinks?.forEach(link => {
    if (!link.href.includes(':') && link.href !== '/blog/') {
      const fullUrl = new URL(normalizeUrl(link.href), site).href;
      urls.add(fullUrl);
    }
  });
  
  // Add category pages
  if (config.tagDescriptions) {
    Object.keys(config.tagDescriptions).forEach(tag => {
      const categoryUrl = new URL(`categories/${tag}/`, site).href;
      urls.add(categoryUrl);
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
    const posts = await getCollection('blog');
    const sortedPosts = posts.sort((a, b) => {
      const dateA = a.data.updatedDate || a.data.publishDate;
      const dateB = b.data.updatedDate || b.data.publishDate;
      return dateB.valueOf() - dateA.valueOf();
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map(url => `  <url>
    <loc>${removeTrailingSlash(url)}</loc>
  </url>`).join('\n')}
${sortedPosts.map(post => {
  const lastmod = post.data.updatedDate || post.data.publishDate;
  const postUrl = new URL(`blog/${post.slug}/`, baseUrl).href;
  return `  <url>
    <loc>${removeTrailingSlash(postUrl)}</loc>${lastmod ? `
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