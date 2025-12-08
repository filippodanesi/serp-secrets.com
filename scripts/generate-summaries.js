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
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: `You are an expert at creating concise, informative summaries optimized for AI search engines and featured snippets.

Create a 2-3 sentence summary (max 200 characters) for this article that:
- Directly answers the main question/topic of the article
- Uses clear, factual language
- Is self-contained and useful without reading the full article
- Avoids fluff words and marketing speak

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
