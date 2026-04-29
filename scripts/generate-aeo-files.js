#!/usr/bin/env node

/*
 * Generates static AEO/agent-readability files alongside the Next.js build.
 *
 * Outputs (written to BOTH ./public and project root):
 *   - llms.txt           Index of posts grouped by category, with descriptions.
 *   - llms-full.txt      Full corpus: same index plus each post body.
 *   - robots.txt         Mirror of app/robots.ts so AEO scanners can read it.
 *   - agent-permissions.json  Mirror of public/agent-permissions.json at root.
 *
 * `public/*` files are served at site root in production by Next.js.
 * The project-root copies are .gitignored and exist for tooling
 * (agentic-seo, llms.txt validators) that scans the filesystem.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SITE_URL = 'https://www.serp-secrets.com';
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const PUBLIC_DIR = path.join(ROOT, 'public');

const CATEGORIES = [
  {
    slug: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    description: 'Exploring AI applications in SEO and content marketing.',
  },
  {
    slug: 'seo-news',
    name: 'SEO News',
    description: 'Latest updates and news from the SEO industry.',
  },
  {
    slug: 'seo-strategies',
    name: 'SEO Strategies',
    description: 'Actionable SEO strategies and best practices.',
  },
  {
    slug: 'technical-seo',
    name: 'Technical SEO',
    description: 'Technical aspects of search engine optimization.',
  },
];

const AI_AGENTS = [
  'ClaudeBot', 'Claude-Web', 'ChatGPT-User', 'GPTBot', 'OAI-SearchBot',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'GoogleOther',
  'Amazonbot', 'Applebot-Extended', 'CCBot', 'cohere-ai', 'Bytespider',
  'meta-externalagent', 'DuckAssistBot', 'YouBot', 'Diffbot',
];

const DISALLOW = ['/api/', '/_next/', '/keystatic/'];

function toIsoDate(value) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
}

function loadPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const { data, content } = matter(raw);
      return {
        slug,
        frontmatter: { ...data, date: toIsoDate(data.date) },
        content,
      };
    })
    .filter((post) => !post.frontmatter.draft)
    .sort((a, b) =>
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
    );
}

function postsInCategory(posts, slug) {
  return posts.filter((p) =>
    p.frontmatter.tags?.some(
      (t) => t.toLowerCase().replace(/\s+/g, '-') === slug,
    ),
  );
}

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function formatTokens(n) {
  return n >= 1000 ? `~${(n / 1000).toFixed(1)}K tokens` : `~${n} tokens`;
}

function buildLlmsTxt(posts) {
  const out = [];
  out.push('# SERP Secrets');
  out.push('');
  out.push('> Personal blog by Filippo Danesi on SEO, AI search, AEO/GEO, and the future of search. Long-form analysis of how generative AI is reshaping organic traffic, search behavior, and content strategy.');
  out.push('');
  out.push([
    'Author: Filippo Danesi — SEO & AI Search Strategist (AEO/GEO).',
    `Site: ${SITE_URL}`,
    `Feed: ${SITE_URL}/feed.xml`,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Markdown for any post: append \`.md\` to the post URL (e.g. ${SITE_URL}/blog/the-great-decoupling.md).`,
    `Full corpus in a single file: ${SITE_URL}/llms-full.txt`,
  ].join('\n'));
  out.push('');

  for (const cat of CATEGORIES) {
    const items = postsInCategory(posts, cat.slug);
    if (items.length === 0) continue;
    out.push(`## ${cat.name}`);
    out.push('');
    out.push(`> ${cat.description}`);
    out.push('');
    for (const post of items) {
      const tokens = estimateTokens(post.content);
      const desc = String(post.frontmatter.description || '').replace(/\s+/g, ' ').trim();
      out.push(`- [${post.frontmatter.title}](${SITE_URL}/blog/${post.slug}/): ${desc} (${formatTokens(tokens)})`);
    }
    out.push('');
  }

  out.push('## Site pages');
  out.push('');
  out.push(`- [About](${SITE_URL}/about/): Background on Filippo Danesi and the editorial focus of the site.`);
  out.push(`- [Archive](${SITE_URL}/archive/): Complete chronological index of every post.`);
  out.push(`- [Categories](${SITE_URL}/categories/): Topic taxonomy with per-category indexes.`);
  out.push(`- [Contact](${SITE_URL}/contact/): How to reach the author.`);
  out.push('');

  out.push('## For AI agents');
  out.push('');
  out.push(`- Full corpus (single file with all post bodies): ${SITE_URL}/llms-full.txt`);
  out.push(`- Per-post raw markdown: \`${SITE_URL}/blog/<slug>.md\``);
  out.push(`- Permissions and rate guidance: ${SITE_URL}/agent-permissions.json`);
  out.push(`- Repo conventions for coding agents: AGENTS.md in source repository.`);
  out.push('');

  return out.join('\n');
}

function buildLlmsFullTxt(posts) {
  const out = [];
  out.push('# SERP Secrets — Full Corpus');
  out.push('');
  out.push('> Personal blog by Filippo Danesi on SEO, AI search, AEO/GEO, and the future of search.');
  out.push(`> Source: ${SITE_URL}`);
  out.push(`> Index version: ${SITE_URL}/llms.txt`);
  out.push('');
  out.push(`Generated on ${new Date().toISOString().slice(0, 10)}. Posts are grouped by category and presented as raw markdown with their original frontmatter.`);
  out.push('');

  for (const cat of CATEGORIES) {
    const items = postsInCategory(posts, cat.slug);
    if (items.length === 0) continue;
    out.push('---');
    out.push('');
    out.push(`# Category: ${cat.name}`);
    out.push('');
    out.push(`> ${cat.description}`);
    out.push('');
    for (const post of items) {
      const url = `${SITE_URL}/blog/${post.slug}/`;
      out.push('---');
      out.push('');
      out.push(`## ${post.frontmatter.title}`);
      out.push('');
      out.push(`- URL: ${url}`);
      out.push(`- Published: ${post.frontmatter.date}`);
      if (post.frontmatter.tags?.length) {
        out.push(`- Tags: ${post.frontmatter.tags.join(', ')}`);
      }
      out.push(`- Description: ${String(post.frontmatter.description || '').replace(/\s+/g, ' ').trim()}`);
      if (post.frontmatter.summary) {
        out.push(`- Summary: ${post.frontmatter.summary}`);
      }
      out.push('');
      out.push(post.content.trim());
      out.push('');
    }
  }

  return out.join('\n');
}

function buildRobotsTxt() {
  const lines = [];
  lines.push('# Generated by scripts/generate-aeo-files.js. Edit AI_AGENTS / DISALLOW in that file.');
  lines.push('');
  lines.push('User-agent: *');
  lines.push('Allow: /');
  for (const path of DISALLOW) lines.push(`Disallow: ${path}`);
  lines.push('');
  for (const agent of AI_AGENTS) {
    lines.push(`User-agent: ${agent}`);
    lines.push('Allow: /');
    for (const path of DISALLOW) lines.push(`Disallow: ${path}`);
    lines.push('');
  }
  lines.push(`Sitemap: ${SITE_URL}/sitemap.xml`);
  lines.push(`Host: ${SITE_URL}`);
  lines.push('');
  return lines.join('\n');
}

function writeBoth(filename, content) {
  const publicPath = path.join(PUBLIC_DIR, filename);
  const rootPath = path.join(ROOT, filename);
  fs.writeFileSync(publicPath, content, 'utf8');
  fs.writeFileSync(rootPath, content, 'utf8');
  console.log(`  ✓ ${filename} (${(content.length / 1024).toFixed(1)} KB)`);
}

function main() {
  console.log('Generating AEO/agent-readability files...');
  const posts = loadPosts();
  console.log(`  Loaded ${posts.length} posts`);

  writeBoth('llms.txt', buildLlmsTxt(posts));
  writeBoth('llms-full.txt', buildLlmsFullTxt(posts));
  writeBoth('robots.txt', buildRobotsTxt());

  // Mirror agent-permissions.json from public/ to project root for tooling.
  const permsSrc = path.join(PUBLIC_DIR, 'agent-permissions.json');
  if (fs.existsSync(permsSrc)) {
    const content = fs.readFileSync(permsSrc, 'utf8');
    fs.writeFileSync(path.join(ROOT, 'agent-permissions.json'), content, 'utf8');
    console.log('  ✓ agent-permissions.json (mirrored to root)');
  }

  console.log('Done.');
}

main();
