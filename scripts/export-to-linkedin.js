#!/usr/bin/env node

/**
 * Keystatic → Buffer (LinkedIn) publisher
 * Uses Buffer's GraphQL API: https://developers.buffer.com
 *
 * Modes:
 *   node scripts/export-to-linkedin.js                 → export linkedin-posts.csv only
 *   node scripts/export-to-linkedin.js --push          → push to Buffer queue
 *   node scripts/export-to-linkedin.js --list-channels → list Buffer channels + IDs
 *
 * Setup:
 *   1. Create a Buffer account at https://buffer.com/signup
 *   2. Connect your LinkedIn profile in Buffer
 *   3. Get your API key at https://publish.buffer.com/settings/api
 *   4. Find your LinkedIn channel ID:
 *        BUFFER_API_KEY=xxx node scripts/export-to-linkedin.js --list-channels
 *   5. Dry run to verify schedule:
 *        BUFFER_DRY_RUN=true BUFFER_API_KEY=xxx BUFFER_CHANNEL_ID=yyy node scripts/export-to-linkedin.js --push
 *   6. Push all posts:
 *        BUFFER_API_KEY=xxx BUFFER_CHANNEL_ID=yyy node scripts/export-to-linkedin.js --push
 *
 * Required env vars for post generation:
 *   ANTHROPIC_API_KEY      Claude API key (get from console.anthropic.com)
 *
 * Optional env vars:
 *   BUFFER_DRY_RUN         set to "true" to log without posting
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const POSTS_DIR   = path.join(process.cwd(), 'content/posts');
const OUTPUT_FILE = path.join(process.cwd(), 'linkedin-posts.csv');
const SITE_URL    = 'https://serp-secrets.com';

const TAG_HASHTAGS = {
  'Artificial Intelligence': '#ArtificialIntelligence #AI #LLM',
  'SEO News':                '#SEO #SearchEngineOptimization #DigitalMarketing',
  'SEO Strategies':          '#SEO #ContentStrategy #DigitalMarketing',
  'Technical SEO':           '#TechnicalSEO #SEO #WebDevelopment',
};

// ── MDX helpers ───────────────────────────────────────────────────────────────

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  const lines = match[1].split('\n');
  let inTags = false;
  for (const line of lines) {
    if (line.startsWith('tags:')) { inTags = true; fm.tags = []; continue; }
    if (inTags) {
      const tm = line.match(/^\s+-\s+["']?(.+?)["']?\s*$/);
      if (tm) { fm.tags.push(tm[1]); continue; }
      inTags = false;
    }
    const kv = line.match(/^(\w+):\s*["']?(.*?)["']?\s*$/);
    if (kv) fm[kv[1]] = kv[2];
  }
  return fm;
}

function extractBody(raw) {
  return raw.replace(/^---[\s\S]*?---\n/, '').trim();
}

function mdxToPlainText(mdx) {
  return mdx
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function generateLinkedInPost(fm, body, slug) {
  const title    = fm.title || '';
  const url      = `${SITE_URL}/blog/${slug}/`;
  const tags     = fm.tags || [];
  const hashtags = [...new Set(
    tags.flatMap(t => (TAG_HASHTAGS[t] || '').split(' '))
  )].filter(Boolean).join(' ');

  const plain = mdxToPlainText(body).slice(0, 3000);

  const prompt = `You are writing a LinkedIn post for Filippo Danesi, an SEO and AI strategist.

Article title: ${title}
Article URL: ${url}
Article content:
${plain}

Write a LinkedIn post following this exact structure:
1. One-line hook — a short, punchy statement (no emoji, no hashtags)
2. One blank line
3. 2-3 sentences of setup: reference a specific insight or data point from the article
4. One blank line
5. A short intro line ending with a colon (e.g. "3 things that stuck with me:")
6. 3 bullet points using → arrows (no dash, no asterisk), each on its own line, concise
7. One blank line
8. One closing line — a direct takeaway or call to action
9. One blank line
10. The article URL: ${url}
11. One blank line
12. Hashtags: ${hashtags}

Rules:
- English only
- No emoji
- Telegraphic style — short sentences, no filler words
- Assertive, direct tone
- Do not mention Filippo by name
- No em dashes (—)
- No "not just X, but Y" or "not X, but Y" constructions
- No rule of three (avoid listing exactly three parallel items)
- No AI vocabulary: pivotal, underscore, foster, showcase, vibrant, tapestry, delve, crucial, highlight, emphasize, bolster, garner, intricate, enduring, enhance, fostering, align with, landscape (abstract), testament
- No promotional or advertisement-like tone
- No superficial participial-clause analysis (avoid ending sentences with ", highlighting/reflecting/contributing to..." phrases)
- Output ONLY the post text, nothing else
- Never use &nbsp; or HTML entities — use only plain newlines for spacing`;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const payload = JSON.stringify({
    model: 'claude-sonnet-4-6',

    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const text = json.content?.[0]?.text || '';
          resolve(text.trim());
        } catch { reject(new Error('Failed to parse Claude response')) }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function buildOgImageUrl(title) {
  return `${SITE_URL}/api/og?title=${encodeURIComponent(title)}`;
}

function escapeCSV(str) {
  return `"${String(str).replace(/"/g, '""')}"`;
}

// ── Buffer GraphQL client ─────────────────────────────────────────────────────

function graphql(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const apiKey  = process.env.BUFFER_API_KEY;
    const payload = JSON.stringify({ query, variables });
    const options = {
      hostname: 'api.buffer.com',
      path:     '/',
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'Authorization':  `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(payload),
      },
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve({ error: data }); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ── Commands ──────────────────────────────────────────────────────────────────

async function listChannels() {
  // Step 1: fetch organizations
  const orgRes = await graphql(`
    query GetOrganizations {
      account {
        organizations {
          id
          name
        }
      }
    }
  `);
  if (orgRes.errors) { console.error('Error fetching organizations:', orgRes.errors); process.exit(1); }

  const orgs = orgRes.data?.account?.organizations || [];
  if (!orgs.length) { console.log('\nNo organizations found.\n'); return; }

  // Step 2: fetch channels for each org
  for (const org of orgs) {
    console.log(`\nOrganization: ${org.name} (${org.id})\n`);

    const chRes = await graphql(`
      query GetChannels($orgId: OrganizationId!) {
        channels(input: { organizationId: $orgId, filter: { isLocked: false } }) {
          id
          name
          displayName
          service
          isQueuePaused
        }
      }
    `, { orgId: org.id });

    if (chRes.errors) { console.error('  Error fetching channels:', chRes.errors); continue; }

    const channels = chRes.data?.channels || [];
    if (!channels.length) { console.log('  No active channels.\n'); continue; }

    for (const c of channels) {
      console.log(`  id:      ${c.id}`);
      console.log(`  name:    ${c.displayName || c.name}`);
      console.log(`  service: ${c.service}\n`);
    }
  }
}

// Correct mutation per Buffer GraphQL API docs
const CREATE_POST_MUTATION = `
  mutation CreatePost(
    $channelId: ChannelId!,
    $text: String!,
    $dueAt: DateTime
  ) {
    createPost(input: {
      channelId: $channelId,
      text: $text,
      schedulingType: automatic,
      mode: customScheduled,
      dueAt: $dueAt
    }) {
      ... on PostActionSuccess {
        post {
          id
          text
        }
      }
      ... on MutationError {
        message
      }
    }
  }
`;

async function pushToBuffer(posts) {
  const apiKey    = process.env.BUFFER_API_KEY;
  const channelId = process.env.BUFFER_CHANNEL_ID;
  const dryRun    = process.env.BUFFER_DRY_RUN === 'true';
  const interval  = parseInt(process.env.BUFFER_INTERVAL_DAYS || '3', 10);

  if (!apiKey || !channelId) {
    console.error('\nMissing BUFFER_API_KEY or BUFFER_CHANNEL_ID.\n');
    process.exit(1);
  }

  const now = new Date();

  // Next Wednesday at 10:00 Zurich (UTC+1 winter / UTC+2 summer)
  function nextWednesday() {
    const d = new Date(now);
    const day = d.getUTCDay(); // 0=Sun, 3=Wed
    const daysUntil = ((3 - day) + 7) % 7 || 7; // always strictly future
    d.setUTCDate(d.getUTCDate() + daysUntil);
    d.setUTCHours(0, 0, 0, 0);
    // Detect Zurich DST: between last Sun of March and last Sun of October = CEST UTC+2
    const month = d.getUTCMonth() + 1;
    const isSummer = month > 3 && month < 10;
    d.setUTCHours(isSummer ? 8 : 9, 0, 0, 0); // 10:00 local
    return d;
  }

  const useNextWednesday = process.env.BUFFER_NEXT_WEDNESDAY === 'true';
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(9, 0, 0, 0);
  let nextSlot = new Date(tomorrow);

  console.log(`\nPushing ${posts.length} posts to Buffer (channel: ${channelId})`);
  if (dryRun) console.log('DRY RUN — no actual requests will be made\n');

  for (let i = 0; i < posts.length; i++) {
    const post   = posts[i];
    const parsedDate = new Date(post.date + 'T09:00:00.000Z');
    if (isNaN(parsedDate.getTime())) {
      console.warn(`  Skipping "${post.title}" — invalid date: "${post.date}"`);
      continue;
    }
    let dueAt;
    if (useNextWednesday) {
      dueAt = nextWednesday().toISOString();
      // Advance base for next iteration: add 7 days
      now.setUTCDate(now.getUTCDate() + 7);
    } else if (parsedDate > now) {
      dueAt = parsedDate.toISOString();
    } else {
      dueAt = nextSlot.toISOString();
      nextSlot = new Date(nextSlot);
      nextSlot.setUTCDate(nextSlot.getUTCDate() + interval);
    }

    console.log(`  [${i + 1}/${posts.length}] "${post.title}"  → ${dueAt}`);

    if (!dryRun) {
      const res = await graphql(CREATE_POST_MUTATION, { channelId, text: post.post, dueAt });

      if (res.errors) {
        console.error(`    ✗ GraphQL error:`, res.errors);
      } else {
        const payload = res.data?.createPost;
        if (payload?.post) {
          console.log(`    ✓ queued (id: ${payload.post.id})`);
        } else if (payload?.message) {
          console.error(`    ✗ user error: ${payload.message}`);
        }
      }

      // 100 req / 15 min → ~1 req/9s to stay safe
      await new Promise(r => setTimeout(r, 1200));
    }
  }

  console.log('\nDone.');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  const args = process.argv.slice(2);

  if (args.includes('--list-channels')) {
    await listChannels();
    return;
  }

  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`Posts directory not found: ${POSTS_DIR}`);
    process.exit(1);
  }

  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : null;

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
  console.log(`Found ${files.length} posts`);

  const allMeta = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const fm  = parseFrontmatter(raw);
    if (fm.draft === 'true') { console.log(`  Skipping draft: ${file}`); continue; }
    allMeta.push({ file, fm, raw });
  }
  allMeta.sort((a, b) => (a.fm.date || '').localeCompare(b.fm.date || ''));
  const selectedMeta = limit ? allMeta.slice(-limit) : allMeta;
  if (limit) console.log(`Limiting to last ${limit} posts by date.`);

  const rows = [];
  for (const { file, fm, raw } of selectedMeta) {
    const body = extractBody(raw);
    const title = fm.title || '';
    const slug = file.replace(/\.mdx$/, '');
    process.stdout.write(`  Generating post for: ${title}...`);
    const post = await generateLinkedInPost(fm, body, slug);
    process.stdout.write(' done\n');
    rows.push({ date: fm.date || '', title, post, imageUrl: buildOgImageUrl(title) });
  }

  const filteredRows = rows;

  const lines = [
    ['Date', 'Title', 'LinkedIn Post'].map(escapeCSV).join(','),
    ...filteredRows.map(r => [escapeCSV(r.date), escapeCSV(r.title), escapeCSV(r.post)].join(',')),
  ];
  fs.writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf-8');
  console.log(`\n✓ Exported ${filteredRows.length} posts → ${OUTPUT_FILE}`);

  if (args.includes('--push')) {
    await pushToBuffer(filteredRows);
  } else {
    console.log(`
To list your Buffer channel IDs:
  BUFFER_API_KEY=xxx node scripts/export-to-linkedin.js --list-channels

Dry run (verify schedule without posting):
  BUFFER_DRY_RUN=true BUFFER_API_KEY=xxx BUFFER_CHANNEL_ID=yyy node scripts/export-to-linkedin.js --push

Push all posts:
  BUFFER_API_KEY=xxx BUFFER_CHANNEL_ID=yyy node scripts/export-to-linkedin.js --push

Optional:
  BUFFER_INTERVAL_DAYS=3          (default: 3)
  BUFFER_START_DATE=2026-04-01    (default: tomorrow at 10:00 UTC)
`);
  }
}

run().catch(err => { console.error(err); process.exit(1); });