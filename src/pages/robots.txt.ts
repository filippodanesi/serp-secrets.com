// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Site URL not configured', { status: 500 });
  }

  const robotsTxt = `# Allow search engine crawlers (Google, Bing, ecc.)
User-agent: *
Allow: /

# Allow AI bots that offrono visibilità controllata
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

# Allow agentic-AI users
User-agent: Claude-User
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Perplexity-User
Allow: /

# Block known AI scrapers and non-transparent bots
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

# Block system and technical URLs
Disallow: /api/
Disallow: /cdn-cgi/

# Sitemap URLs
Sitemap: ${new URL('sitemap.xml', site)}
Sitemap: ${new URL('news-sitemap.xml', site)}`;

  return new Response(robotsTxt.trim(), {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};