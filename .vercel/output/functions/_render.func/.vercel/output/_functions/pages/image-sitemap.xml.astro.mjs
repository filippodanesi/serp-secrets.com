import { g as getCollection } from '../chunks/_astro_content_Byp4kc5z.mjs';
import path from 'path';
import fs from 'fs/promises';
export { renderers } from '../renderers.mjs';

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
const GET = async ({ site }) => {
  if (!site) {
    return new Response("Site URL not configured", { status: 500 });
  }
  try {
    const posts = await getCollection("blog");
    const extractImagesFromMarkdown = (content) => {
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      const matches = Array.from(content.matchAll(imageRegex));
      return matches.map((match) => match[2]);
    };
    const postImages = posts.flatMap((post) => {
      const images = extractImagesFromMarkdown(post.body);
      return images.map((img) => ({
        loc: new URL(img, site).href,
        title: post.data.title
      }));
    });
    const publicDir = path.join(process.cwd(), "public");
    const publicImages = [];
    async function scanDir(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else if (IMAGE_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
          const relativePath = path.relative(publicDir, fullPath);
          publicImages.push({
            loc: new URL(relativePath.replace(/\\/g, "/"), site).href,
            title: path.basename(entry.name, path.extname(entry.name)).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
          });
        }
      }
    }
    await scanDir(publicDir);
    const allImages = [...postImages, ...publicImages];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allImages.map((img) => `
  <url>
    <loc>${img.loc}</loc>
    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${img.title}</image:title>
    </image:image>
  </url>`).join("")}
</urlset>`;
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    console.error("Error generating image sitemap:", error);
    return new Response("Error generating image sitemap", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
