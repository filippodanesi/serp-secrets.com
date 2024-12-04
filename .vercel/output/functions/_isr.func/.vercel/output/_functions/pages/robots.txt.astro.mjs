export { renderers } from '../renderers.mjs';

const getRobotsTxt = (sitemapURL, imageSitemapURL) => `
User-agent: Amazonbot
User-agent: Anthropic-ai
User-agent: Applebot-Extended
User-agent: AwarioRssBot
User-agent: AwarioSmartBot
User-agent: Bytespider
User-agent: CCBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-Web
User-agent: Cohere-ai
User-agent: DataForSeoBot
User-agent: FacebookBot
User-agent: Google-Extended
User-agent: GPTBot
User-agent: ImagesiftBot
User-agent: Magpie-crawler
User-agent: Omgili
User-agent: Omgilibot
User-agent: Peer39_crawler
User-agent: Peer39_crawler/1.0
User-agent: PerplexityBot
User-agent: YouBot
Disallow: /

User-agent: *
Disallow: /api/
Disallow: /*.json$
Disallow: /*?
Disallow: /search

User-agent: *
Allow: /

# Sitemaps
Sitemap: ${sitemapURL.href}
Sitemap: ${imageSitemapURL.href}
`;
const GET = ({ site }) => {
  if (!site) {
    return new Response("Site URL not configured", {
      status: 500,
      statusText: "Site URL not configured in astro.config.mjs"
    });
  }
  const sitemapURL = new URL("sitemap-index.xml", site);
  const imageSitemapURL = new URL("image-sitemap.xml", site);
  return new Response(getRobotsTxt(sitemapURL, imageSitemapURL), {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
