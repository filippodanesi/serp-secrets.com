import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/config'

const AI_AGENTS = [
  'ClaudeBot',
  'Claude-Web',
  'ChatGPT-User',
  'GPTBot',
  'OAI-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'GoogleOther',
  'Amazonbot',
  'Applebot-Extended',
  'CCBot',
  'cohere-ai',
  'Bytespider',
  'meta-externalagent',
  'DuckAssistBot',
  'YouBot',
  'Diffbot',
] as const

const DISALLOWED_PATHS = ['/api/', '/_next/', '/keystatic/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: DISALLOWED_PATHS,
      })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
