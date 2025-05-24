// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Site URL not configured', { status: 500 });
  }

  const robotsTxt = `# ===================================
# Robot Access Policy
# Last updated: ${new Date().toISOString().split('T')[0]}
# ===================================

# Default: Allow all legitimate crawlers
User-agent: *
Allow: /

# ===================================
# ALLOWED BOTS
# ===================================

# Social Media Preview Bots
User-agent: facebookexternalhit
Allow: /

# AI Search & Answer Engines
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

# AI-Assisted Browsing (Agentic AI)
User-agent: ChatGPT-User
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Perplexity-User
Allow: /

# ===================================
# BLOCKED BOTS
# ===================================

# AI Scrapers & Non-Transparent Bots
User-agent: Amazonbot
User-agent: Anthropic-ai
User-agent: AwarioRssBot
User-agent: AwarioSmartBot
User-agent: Bytespider
User-agent: CCBot
User-agent: Claude-Web
User-agent: ClaudeBot
User-agent: Cohere-ai
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

# ===================================
# RESTRICTED PATHS
# ===================================

# Block access to system and API endpoints
Disallow: /api/
Disallow: /cdn-cgi/

# ===================================
# SITEMAPS
# ===================================

Sitemap: ${new URL('sitemap.xml', site)}
Sitemap: ${new URL('news-sitemap.xml', site)}`;

  return new Response(robotsTxt.trim(), {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};