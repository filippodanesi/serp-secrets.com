# SERP Secrets

Personal blog about SEO, AI search, and digital optimization.

Live: [www.serp-secrets.com](https://www.serp-secrets.com)

## Stack

- **Next.js 16** (App Router, static rendering) · React 19 · TypeScript
- **MDX** content, authored through **Keystatic** CMS (GitHub storage)
- Plain CSS (`app/globals.css`) — no utility framework
- Deployed on **Vercel**

## Content

Posts are plain `.mdx` files in `content/posts/` — the filename is the slug, and the
repository is the source of truth (no database). Static pages live in `content/pages/`.

The Keystatic admin is mounted at `/keystatic` and writes back to this repo via the
GitHub API, so edits made in the CMS arrive as commits.

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # full pipeline, then next build
npm start            # serve the production build
```

## Build pipeline

`npm run build` runs two generators before `next build`:

1. **`scripts/generate-summaries.js`** — fills the empty `summary` frontmatter field of
   each post with a short TL;DR via the Anthropic API. Posts that already have a summary
   are skipped. No-ops when `ANTHROPIC_API_KEY` is unset.
2. **`scripts/generate-aeo-files.js`** — emits the agent-readability files
   (`llms.txt`, `llms-full.txt`, `robots.txt`, `agent-permissions.json`) into `public/`,
   with a mirrored copy at the project root for filesystem-based AEO tooling.

Other scripts are one-off utilities, not part of the build: `fix-headings.js`
(repairs headings lost in the WordPress/TinaCMS migration), `import-wordpress.js`
(original WXR import), and `export-to-linkedin.js` (see below).

## AEO / AI agent endpoints

| Endpoint | Purpose |
| --- | --- |
| `/llms.txt` | Post index grouped by category, with descriptions and token estimates |
| `/llms-full.txt` | Same index plus the full body of every post, for single-fetch ingestion |
| `/blog/<slug>.md` | Raw MDX source of one post, served as `text/markdown` |
| `/agent-permissions.json` | Declared interaction policy for automated clients |
| `/robots.txt` | Explicit allow-list for ClaudeBot, GPTBot, PerplexityBot, Google-Extended and 14 other AI crawlers |
| `/feed.xml` · `/sitemap.xml` | RSS feed and sitemap |

Post pages also expose a "Copy for AI" action and a link to their Markdown source.

## Automation

`.github/workflows/publish-to-buffer.yml` fires on any push touching `content/posts/**`:
it waits for the Vercel deploy, then queues the newest post to LinkedIn through Buffer
via `scripts/export-to-linkedin.js`.

## Environment variables

| Variable | Used by | Required |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | summary generation, LinkedIn export | No — both degrade gracefully |
| `BUFFER_API_KEY` | Buffer publishing | Only for `--push` |
| `BUFFER_CHANNEL_ID` | Buffer publishing | Only for `--push` |

## Repository conventions

See [`AGENTS.md`](./AGENTS.md) for project structure, frontmatter schema, routing and
coding conventions — it is the entry point for AI coding agents working on this repo.

## License

All rights reserved.
