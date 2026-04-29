const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function generateSummary(content, title) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-7',
      max_tokens: 250,
      messages: [
        {
          role: 'user',
          content: `Create a 2-3 sentence summary (around 220-250 characters, max 280) for the article below.

Rules:
- Answer the main question or topic directly
- Use plain, factual language; prefer simple verbs (is, are, has) over "serves as", "stands as", "boasts"
- Do not use: pivotal, underscore, foster, showcase, vibrant, tapestry, delve, bolstered, garner, intricate, meticulous, enduring, crucial, landscape (abstract), testament, align with, emphasizing, fostering
- No rule-of-three lists, no "not just X but also Y" constructions
- No promotional or travel-guide tone, no puffery
- Avoid em dashes; use commas or colons instead
- Reuse the same term if it is the clearest choice; do not substitute synonyms to avoid repetition
- Self-contained: useful without reading the full article

Title: ${title}

Article content:
${content.slice(0, 4000)}

Return ONLY the summary text, nothing else.`,
        },
      ],
    }),
  });

  const data = await response.json();
  return data.content[0].text.trim();
}

async function processPost(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContent);

  // Skip if summary already exists
  if (frontmatter.summary) {
    console.log(`⏭️  Skipping (has summary): ${path.basename(filePath)}`);
    return false;
  }

  console.log(`🤖 Generating summary for: ${frontmatter.title}`);

  try {
    const summary = await generateSummary(content, frontmatter.title);

    // Add summary to frontmatter
    frontmatter.summary = summary;

    // Reconstruct the file
    const newContent = matter.stringify(content, frontmatter);
    fs.writeFileSync(filePath, newContent);

    console.log(`✅ Generated: "${summary}"`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

async function main() {
  if (!ANTHROPIC_API_KEY) {
    console.log('⚠️  ANTHROPIC_API_KEY not set, skipping summary generation');
    process.exit(0);
  }

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
  console.log(`\n📝 Found ${files.length} posts\n`);

  let generated = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const wasGenerated = await processPost(filePath);
    if (wasGenerated) {
      generated++;
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300));
    } else {
      skipped++;
    }
  }

  console.log(`\n🎉 Done! Generated: ${generated}, Skipped: ${skipped}\n`);
}

main().catch(console.error);
