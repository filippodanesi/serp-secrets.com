import { g as getCollection } from '../chunks/_astro_content_Byp4kc5z.mjs';
export { renderers } from '../renderers.mjs';

const GET = async ({ site }) => {
  if (!site) {
    return new Response("Site URL not configured", { status: 500 });
  }
  try {
    const posts = await getCollection("blog");
    const pages = [
      "/about/",
      "/contact/",
      "/privacy-policy/",
      "/cookie-policy/",
      "/blog/",
      "/categories/"
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site}</loc>
    <lastmod>${(/* @__PURE__ */ new Date()).toISOString()}</lastmod>
  </url>
  ${pages.map((page) => `
  <url>
    <loc>${new URL(page, site).href}</loc>
    <lastmod>${(/* @__PURE__ */ new Date()).toISOString()}</lastmod>
  </url>`).join("")}
  ${posts.map((post) => `
  <url>
    <loc>${new URL(`/blog/${post.slug}/`, site).href}</loc>
    <lastmod>${post.data.updatedDate ? new Date(post.data.updatedDate).toISOString() : new Date(post.data.date).toISOString()}</lastmod>
  </url>`).join("")}
</urlset>`;
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
