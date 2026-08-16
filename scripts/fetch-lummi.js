#!/usr/bin/env node

/**
 * Lummi → local image fetcher
 * Uses the Lummi REST API: https://www.lummi.ai/developers/api-reference
 *
 * Downloads an image into public/images/content/<slug>/ and prints the
 * ready-to-paste MDX snippet with the attribution line Lummi's terms
 * require (clickable author + image links).
 *
 * Usage:
 *   LUMMI_API_KEY=xxx node scripts/fetch-lummi.js <image> --slug <post-slug>
 *
 *   <image> can be:
 *     - a bare image ID:        90a47d1f-ef46-49e5-bfa0-140c320ffa14
 *     - a photo page URL:       https://www.lummi.ai/photo/...
 *     - an api/render URL:      https://www.lummi.ai/api/render/image/<id>?token=...
 *
 * Options:
 *   --slug <slug>     Destination post slug (required) → public/images/content/<slug>/
 *   --name <name>     Output filename without extension (default: lummi-<id prefix>)
 *   --width <px>      Longest-edge width requested from the CDN (default: 1600)
 *   --format <fmt>    jpg | png | webp | avif (default: webp)
 *   --force           Overwrite an existing file
 *
 * The API key is read from LUMMI_API_KEY only (never argv).
 * Rate limit is 10 requests/minute on unapproved keys; this script makes 2.
 */

const fs = require('fs');
const path = require('path');

const API_BASE = 'https://api.lummi.ai/v1';
const ROOT = path.resolve(__dirname, '..');
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function parseArgs(argv) {
  const args = { width: 1600, format: 'webp', force: false };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--slug') args.slug = argv[++i];
    else if (a === '--name') args.name = argv[++i];
    else if (a === '--width') args.width = parseInt(argv[++i], 10);
    else if (a === '--format') args.format = argv[++i];
    else if (a === '--force') args.force = true;
    else positional.push(a);
  }
  args.image = positional[0];
  return args;
}

function extractId(input) {
  const m = String(input || '').match(UUID_RE);
  return m ? m[0].toLowerCase() : null;
}

async function main() {
  const apiKey = process.env.LUMMI_API_KEY;
  const args = parseArgs(process.argv.slice(2));

  if (!apiKey) {
    console.error('❌ LUMMI_API_KEY is not set. Export it first (never pass keys on argv).');
    process.exit(1);
  }
  if (!args.image || !args.slug) {
    console.error('Usage: LUMMI_API_KEY=xxx node scripts/fetch-lummi.js <image-id-or-url> --slug <post-slug>');
    process.exit(1);
  }
  if (!['jpg', 'png', 'webp', 'avif'].includes(args.format)) {
    console.error(`❌ Unsupported format "${args.format}" (jpg | png | webp | avif).`);
    process.exit(1);
  }

  const id = extractId(args.image);
  if (!id) {
    console.error(`❌ Could not find an image ID in "${args.image}".`);
    process.exit(1);
  }

  // 1. Metadata + attribution
  console.log(`🔎 Fetching metadata for ${id}...`);
  const metaRes = await fetch(`${API_BASE}/images/${id}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (metaRes.status === 404) {
    console.error('❌ Image not found via GET /images/{id}. Check the ID, or the endpoint shape may have changed.');
    process.exit(1);
  }
  if (metaRes.status === 401) {
    console.error('❌ API key rejected (401).');
    process.exit(1);
  }
  if (metaRes.status === 429) {
    console.error('❌ Rate limited (10 req/min on unapproved keys). Wait a minute and retry.');
    process.exit(1);
  }
  if (!metaRes.ok) {
    console.error(`❌ Lummi API returned ${metaRes.status}: ${(await metaRes.text()).slice(0, 200)}`);
    process.exit(1);
  }
  const image = await metaRes.json();

  const cdn = image.url;
  const author = image.author || {};
  if (!cdn) {
    console.error('❌ Response carries no `url` field; cannot download.');
    process.exit(1);
  }

  // 2. Build the transformation URL: requested width, chosen format
  const dl = new URL(cdn);
  dl.searchParams.set('w', String(args.width));
  dl.searchParams.delete('h');
  dl.searchParams.delete('auto');
  dl.searchParams.set('fm', args.format);

  // 3. Download
  const dir = path.join(ROOT, 'public', 'images', 'content', args.slug);
  const base = args.name || `lummi-${id.slice(0, 8)}`;
  const outPath = path.join(dir, `${base}.${args.format}`);
  if (fs.existsSync(outPath) && !args.force) {
    console.error(`❌ ${path.relative(ROOT, outPath)} already exists (use --force to overwrite).`);
    process.exit(1);
  }

  console.log(`⬇️  Downloading ${dl.toString()}`);
  const imgRes = await fetch(dl.toString());
  if (!imgRes.ok) {
    console.error(`❌ CDN returned ${imgRes.status} for the transformed URL.`);
    process.exit(1);
  }
  const buf = Buffer.from(await imgRes.arrayBuffer());
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outPath, buf);
  console.log(`✅ Saved ${path.relative(ROOT, outPath)} (${(buf.length / 1024).toFixed(0)} KB)`);

  // 4. Ready-to-paste MDX (attribution links are REQUIRED by Lummi's terms)
  const alt = (image.description || image.name || 'Illustration from Lummi')
    .replace(/\s+/g, ' ')
    .trim();
  const publicPath = `/images/content/${args.slug}/${base}.${args.format}`;
  const authorName = author.name || author.username || 'the author';
  const authorUrl = author.attributionUrl || 'https://www.lummi.ai';
  const imageUrl = image.attributionUrl || 'https://www.lummi.ai';

  console.log('\n📋 Paste into the post:\n');
  console.log(`![${alt}](${publicPath})`);
  console.log(`*Photo by [${authorName}](${authorUrl}) on [Lummi](${imageUrl})*`);
  console.log('\n(hotlink alternative, no download needed:');
  console.log(`  ${dl.toString()} — same attribution still required)`);
}

main().catch((err) => {
  console.error(`❌ ${err.message}`);
  process.exit(1);
});
