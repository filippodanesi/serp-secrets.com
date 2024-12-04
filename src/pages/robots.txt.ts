// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
    if (!site) {
        return new Response('Site URL not configured', { status: 500 });
    }

    const robotsTxt = `# Block AI and Scraping Bots
# AI Training Models
User-agent: Anthropic-ai
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-Web
User-agent: Cohere-ai
User-agent: GPTBot
User-agent: Google-Extended
Disallow: /

# Content Scrapers and Analytics
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
User-agent: PerplexityBot
User-agent: YouBot
Disallow: /

# Allow Search Engine Crawlers
User-agent: *
Allow: /

# Crawling Optimizations
Disallow: /_astro/
Disallow: /api/
Disallow: /search

# XML Sitemaps
Sitemap: ${new URL('sitemap.xml', site)}
Sitemap: ${new URL('news-sitemap.xml', site)}
Sitemap: ${new URL('image-sitemap.xml', site)}`;

    return new Response(robotsTxt.trim(), {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=3600'
        }
    });
};
