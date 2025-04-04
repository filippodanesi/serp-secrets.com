// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Site URL not configured', { status: 500 });
  }

  const robotsTxt = `# Allow beneficial AI bots
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# Block other AI scrapers and non-transparent bots
User-agent: Anthropic-ai
User-agent: ClaudeBot
User-agent: Claude-Web
User-agent: Cohere-ai
User-agent: Amazonbot
User-agent: AwarioRssBot
User-agent: AwarioSmartBot
User-agent: Bytespider
User-agent: CCBot
User-agent: DataForSeoBot
User-agent: FacebookBot
User-agent: ImagesiftBot
User-agent: Magpie-crawler
User-agent: Omgili
User-agent: Omgilibot
User-agent: Peer39_crawler
User-agent: Peer39_crawler/1.0
User-agent: YouBot
Disallow: /

# Allow Search Engine Crawlers (Google, Bing, ecc.)
User-agent: *
Allow: /

# Block System and Technical URLs
Disallow: /api/
Disallow: /cdn-cgi/

# Sitemaps
Sitemap: ${new URL('sitemap.xml', site)}
Sitemap: ${new URL('news-sitemap.xml', site)}`;

  return new Response(robotsTxt.trim(), {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};