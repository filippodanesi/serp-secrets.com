# AGENTS.md

Entry point for AI coding agents (Claude Code, Cursor, Cline, Aider, Copilot Chat) working on `serp-secrets.com`.

## Project overview

Personal blog of Filippo Danesi covering SEO, AI search, AEO/GEO, and the future of search. Built as a static-rendered Next.js site with MDX content authored through Keystatic CMS.

- Live site: https://www.serp-secrets.com
- Stack: Next.js 16 (App Router) · React 19 · TypeScript · MDX · Keystatic
- Deployment: Vercel (`vercel.json`)
- Content: Markdown source of truth in `content/` (no database)

## Project structure

```
.
├── app/
│   ├── (main)/             # Public-facing routes (home, archive, blog, categories, pages)
│   │   ├── blog/[slug]/    # Individual post page (MDX rendered via next-mdx-remote)
│   │   ├── archive/        # Full post archive
│   │   ├── categories/     # Category index + per-category listings
│   │   ├── about/  contact/  privacy/  cookie/
│   │   ├── layout.tsx
│   │   └── page.tsx        # Home page
│   ├── api/
│   │   ├── keystatic/      # Keystatic CMS API handlers
│   │   ├── og/             # Dynamic OG image generation
│   │   └── search/         # Search index endpoint
│   ├── components/         # Shared React components (Header, Footer, MDX, JsonLd, …)
│   ├── feed.xml/           # RSS feed route
│   ├── keystatic/          # Keystatic admin UI mount point
│   ├── globals.css
│   ├── layout.tsx          # Root layout
│   ├── robots.ts           # Dynamic robots.txt (Next.js MetadataRoute)
│   └── sitemap.ts          # Dynamic sitemap.xml
├── content/
│   ├── pages/              # Static MDX pages (about.mdx, …)
│   └── posts/              # Blog posts as .mdx with YAML frontmatter
├── lib/
│   ├── config.ts           # `siteUrl` constant
│   └── posts.ts            # Post loading, categories, TOC extraction
├── public/                 # Static assets (images, logo, resume)
├── scripts/                # Build-time and one-off Node scripts
│   ├── generate-summaries.js   # Runs in `npm run build` before next build
│   ├── fix-headings.js
│   ├── import-wordpress.js
│   └── export-to-linkedin.js
├── keystatic.config.ts     # Keystatic schema (post fields, collections)
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Key files

- `lib/posts.ts` — single source of truth for post loading. Expose `getAllPosts`, `getPostBySlug`, `getPostsByCategory`, `extractHeadings`, `slugify`. Frontmatter type `PostFrontmatter` lives here.
- `lib/config.ts` — `siteUrl` (use this, never hardcode the domain).
- `app/components/JsonLd.tsx` — schema.org components: `PersonJsonLd`, `WebSiteJsonLd`, `BlogJsonLd`, `BlogPostingJsonLd`, `BreadcrumbJsonLd`, `CollectionPageJsonLd`. Reuse these instead of inlining JSON-LD.
- `app/components/MDXComponents.tsx` — overrides for MDX-rendered elements (links, headings, images).
- `app/(main)/blog/[slug]/page.tsx` — post page; uses `MDXRemote` with `remark-gfm` and `rehype-pretty-code`.
- `keystatic.config.ts` — if you change post frontmatter, update both this and the `PostFrontmatter` interface in `lib/posts.ts`.

## Content conventions

- Posts live in `content/posts/<slug>.mdx`; the filename **is** the slug.
- Frontmatter (YAML):
  ```yaml
  ---
  title: "..."
  date: 2026-03-08          # ISO date; used for ordering and sitemap lastmod
  description: "..."        # Used for meta description and OG
  tags: ["SEO Strategies"]  # Tag strings; category mapping is by slugified tag
  draft: false              # Drafts are filtered out of getAllPosts()
  image: "..."              # Optional; falls back to dynamic /api/og
  summary: "..."            # Optional; renders as TL;DR aside
  ---
  ```
- Categories are not free-form: they are defined in `lib/posts.ts` (`categories` array). A post belongs to a category when one of its tags slugifies to the category slug.
- Use H2/H3 only inside post bodies — H1 is rendered from frontmatter.title by `PostHeader`.
- All headings are auto-id'd via `slugify()` and exposed in the table of contents.

## Routing

- All public pages live under the `(main)` route group with a shared layout.
- `/blog/[slug]/` for posts (trailing slash, see sitemap).
- `/categories/[slug]/` for category indexes.
- `/sitemap.xml` is generated dynamically from `app/sitemap.ts`.
- `/robots.txt` is generated dynamically from `app/robots.ts` (with a static mirror in `public/robots.txt` produced at build time for tooling).
- `/llms.txt` and `/llms-full.txt` are static files generated at build time by `scripts/generate-aeo-files.js` and emitted to `public/`.
- `/blog/[slug].md` returns the raw MDX source for AI ingestion (rewrite to `app/api/posts/[slug]/route.ts`).

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # runs scripts/generate-summaries.js then next build
npm start            # serve the production build
```

Keystatic admin: `http://localhost:3000/keystatic` (auth required in production).

## Coding conventions

- TypeScript everywhere; prefer typed exports.
- Use the `@/` path alias (configured in `tsconfig.json`) — no relative `../../` chains.
- Import the `siteUrl` from `lib/config`; do not hardcode `https://www.serp-secrets.com`.
- Posts are loaded synchronously at build time via Node `fs` — never inside client components.
- Server components by default. Add `'use client'` only when truly needed (clipboard, search overlay, theme toggle).
- Schema.org markup: extend `app/components/JsonLd.tsx` rather than inlining `<script type="application/ld+json">`.
- Static export friendly: avoid runtime-only Next features that break ISR / SSG.

## Constraints

- Node.js >= 18.
- No client-side data fetching for content — everything is statically rendered from `content/`.
- Do not commit drafts with `draft: false`.
- Posts must have a non-empty `description` (used in OG and meta).

## AI / agent endpoints

- `GET /robots.txt` — explicitly allows ClaudeBot, GPTBot, PerplexityBot, Google-Extended, Amazonbot, ChatGPT-User.
- `GET /llms.txt` — structured index of posts grouped by category, with descriptions.
- `GET /llms-full.txt` — same index plus the full body of every post (single-fetch ingestion).
- `GET /blog/<slug>.md` — raw MDX of an individual post, served as `text/markdown`.
- `GET /agent-permissions.json` — declared interaction policy for automated clients.
- Each post page exposes a "Copy for AI" button (`data-copy-ai`) and a "View as Markdown" link.

## Useful documentation links

- README: `README.md`
- Keystatic schema: `keystatic.config.ts`
- Post utilities: `lib/posts.ts`
- Sitemap: `app/sitemap.ts`
- Robots: `app/robots.ts`
- AEO/agent file generator: `scripts/generate-aeo-files.js`
- AEO audit snapshot: `serp-secrets-aeo.json` (in user home)
