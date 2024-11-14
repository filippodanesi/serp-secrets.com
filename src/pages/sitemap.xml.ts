import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import siteConfig from '../data/site-config';

export const GET: APIRoute = async ({ site }) => {
   const blog = await getCollection('blog');
   const pages = await getCollection('pages');
   const staticPaths = [
       ...siteConfig.headerNavLinks?.map(link => link.href) || [],
       ...siteConfig.footerNavLinks?.filter(link => !link.href.startsWith('http')).map(link => link.href) || []
   ];

   const uniquePaths = [...new Set([
       ...staticPaths.map(path => path.endsWith('/') ? path : `${path}/`),
       ...blog.map(post => `/blog/${post.slug}/`),
       ...pages.map(page => `/${page.slug}/`)
   ])];

   const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
           ${uniquePaths.map(path => {
               const isPost = path.startsWith('/blog/');
               const post = isPost ? blog.find(p => `/blog/${p.slug}/` === path) : null;
               const page = !isPost ? pages.find(p => `/${p.slug}/` === path) : null;
               
               return `
                   <url>
                       <loc>${site?.origin}${path}</loc>
                       <lastmod>${(post?.data.publishDate || page?.data.publishDate || new Date()).toISOString()}</lastmod>
                   </url>
               `;
           }).join('')}
       </urlset>`.trim();

   return new Response(xmlString, {
       headers: {
           'Content-Type': 'application/xml',
           'Cache-Control': 'max-age=3600'
       }
   });
}