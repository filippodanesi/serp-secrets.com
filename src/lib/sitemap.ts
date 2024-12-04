// src/lib/sitemap.ts
import { type CollectionEntry, getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

type BlogEntry = CollectionEntry<'blog'>;
type PageEntry = CollectionEntry<'pages'>;
type ContentEntry = BlogEntry | PageEntry;

interface SitemapOptions {
  site: {
    url: string;
  };
  collections?: ('blog' | 'pages')[];
  additionalUrls?: string[];
  excludePaths?: string[];
  publicDir?: string;
}

export interface ImageInfo {
  loc: string;
  title?: string;
  caption?: string;
}

interface PageInfo {
  loc: string;
  lastmod?: string;
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

function getEntryDate(entry: ContentEntry): Date {
  if ('publishDate' in entry.data && entry.data.publishDate instanceof Date) {
    return entry.data.publishDate;
  }
  if ('updatedDate' in entry.data && entry.data.updatedDate instanceof Date) {
    return entry.data.updatedDate;
  }
  return new Date();
}

export async function getSortedCollectionPosts(collection: 'blog' | 'pages') {
  const entries = await getCollection(collection);
  return entries.sort((a, b) => {
    const dateA = getEntryDate(a as ContentEntry);
    const dateB = getEntryDate(b as ContentEntry);
    return dateB.getTime() - dateA.getTime();
  });
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateUrl(path: string, baseUrl: string): string {
  return new URL(path.replace(/^\//, ''), baseUrl)
    .toString()
    .replace(/\/$/, '');
}

export function extractImagesFromMarkdown(content: string): string[] {
    const imagePatterns = [
      /!\[([^\]]*)\]\(([^)]+)\)/g,                 // Markdown: ![alt](url)
      /<img[^>]+src=["']([^"']+)["'][^>]*>/g      // HTML: <img src="url">
    ];
  
    const images = new Set<string>();
    
    for (const pattern of imagePatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        // L'URL dell'immagine sarà nel gruppo 2 per Markdown e 1 per HTML
        const imageUrl = match[1] || match[2];
        if (imageUrl && !imageUrl.match(/^(webp|jpg|jpeg|png|gif|svg)$/i)) {
          images.add(imageUrl);
        }
      }
    }
  
    return Array.from(images);
  }

export function getPublicImages(publicDir: string): ImageInfo[] {
  try {
    console.log("Starting getPublicImages for directory:", publicDir);
    const images: ImageInfo[] = [];

    function scanDir(dir: string) {
      console.log("Scanning directory:", dir);
      if (!fs.existsSync(dir)) {
        console.log("Directory does not exist:", dir);
        return;
      }
      
      const files = fs.readdirSync(dir);
      console.log("Found files:", files.length);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          console.log("Found directory:", file);
          scanDir(filePath);
        } else if (IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
          console.log("Found image:", file);
          const relativePath = path.relative(publicDir, filePath);
          images.push({
            loc: `/${relativePath.replace(/\\/g, '/')}`,
            title: path.basename(file, path.extname(file))
              .replace(/-/g, ' ')
              .replace(/\b\w/g, c => c.toUpperCase())
          });
        }
      }
    }

    scanDir(publicDir);
    console.log("Total images found:", images.length);
    return images;
  } catch (error) {
    console.error('Error scanning images:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    return [];
  }
}

function generatePageSitemapXml(pages: PageInfo[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.loc}</loc>${page.lastmod ? `
    <lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`.trim();
}

function generateImageSitemapXml(images: ImageInfo[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(img => `  <url>
    <loc>${img.loc}</loc>
    <image:image>
      <image:loc>${img.loc}</image:loc>${img.title ? `
      <image:title>${img.title}</image:title>` : ''}${img.caption ? `
      <image:caption>${img.caption}</image:caption>` : ''}
    </image:image>
  </url>`).join('\n')}
</urlset>`.trim();
}