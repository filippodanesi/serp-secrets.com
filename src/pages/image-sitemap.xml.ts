// src/pages/image-sitemap.xml.ts
import { type APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPublicImages, extractImagesFromMarkdown, generateUrl, type ImageInfo } from '../lib/sitemap';
import path from 'node:path';

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Site URL not configured', { status: 500 });
  }

  try {
    console.log("Starting image sitemap generation...");
    
    // Get public images - using absolute path
    const publicDir = path.join(process.cwd(), 'public');
    console.log("Public directory:", publicDir);
    const publicImages = getPublicImages(publicDir);
    console.log("Public images found:", publicImages.length);

    // Get blog posts
    const posts = await getCollection('blog');
    console.log("Blog posts found:", posts.length);

    // Store images with their page URLs
    type ImageEntry = {
      imageUrl: string;
      pageUrl: string;
    };
    const allImages: ImageEntry[] = [];

    // Add public images with homepage as location
    publicImages.forEach(img => {
      const fullUrl = generateUrl(img.loc, site.toString());
      console.log("Adding public image:", fullUrl);
      allImages.push({
        imageUrl: fullUrl,
        pageUrl: site.toString()
      });
    });

    // Add blog post images with their respective post URLs
    for (const post of posts) {
      console.log(`Processing post: ${post.slug}`);
      const images = extractImagesFromMarkdown(post.body);
      const postUrl = new URL(`blog/${post.slug}/`, site).toString();
      
      images.forEach(img => {
        const fullUrl = img.startsWith('http') ? img : generateUrl(img, site.toString());
        console.log("Adding post image:", fullUrl);
        allImages.push({
          imageUrl: fullUrl,
          pageUrl: postUrl
        });
      });
    }

    console.log("Total images:", allImages.length);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allImages
  .filter(entry => !entry.imageUrl.match(/^(webp|jpg|jpeg|png|gif|svg)$/i))
  .map(entry => `  <url>
    <loc>${entry.pageUrl}</loc>
    <image:image>
      <image:loc>${entry.imageUrl}</image:loc>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

    return new Response(xml.trim(), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating image sitemap:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    return new Response('Error generating sitemap', { status: 500 });
  }
};