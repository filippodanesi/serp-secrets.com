const fs = require('fs');
const path = require('path');

// Read the XML file
const xmlPath = path.join(__dirname, '..', 'serpsecrets.WordPress.2025-12-08.xml');
const xml = fs.readFileSync(xmlPath, 'utf-8');

// Helper to extract CDATA content
function extractCDATA(str) {
  const match = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return match ? match[1] : str;
}

// Helper to convert HTML to MDX-friendly markdown
function htmlToMarkdown(html) {
  if (!html) return '';

  let content = html;

  // Remove embedded scripts (like Datawrapper)
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  content = content.replace(/!function\(\)[\s\S]*?\}\(\);?/g, '');

  // Remove iframes
  content = content.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
  content = content.replace(/<iframe[\s\S]*?\/>/gi, '');

  // Convert headings
  content = content.replace(/<h2>(.*?)<\/h2>/gi, '\n## $1\n');
  content = content.replace(/<h3>(.*?)<\/h3>/gi, '\n### $1\n');
  content = content.replace(/<h4>(.*?)<\/h4>/gi, '\n#### $1\n');

  // Convert paragraphs
  content = content.replace(/<p>([\s\S]*?)<\/p>/gi, '\n$1\n');

  // Convert links
  content = content.replace(/<a\s+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // Convert bold
  content = content.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  content = content.replace(/<b>(.*?)<\/b>/gi, '**$1**');

  // Convert italic (including underscores in original)
  content = content.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  content = content.replace(/<i>(.*?)<\/i>/gi, '*$1*');
  content = content.replace(/_(.*?)_/g, '*$1*');

  // Convert lists
  content = content.replace(/<ul>([\s\S]*?)<\/ul>/gi, '$1');
  content = content.replace(/<ol>([\s\S]*?)<\/ol>/gi, '$1');
  content = content.replace(/<li>([\s\S]*?)<\/li>/gi, '- $1\n');

  // Convert blockquotes
  content = content.replace(/<blockquote>([\s\S]*?)<\/blockquote>/gi, '> $1');

  // Convert code
  content = content.replace(/<code>(.*?)<\/code>/gi, '`$1`');
  content = content.replace(/<pre>([\s\S]*?)<\/pre>/gi, '```\n$1\n```');

  // Remove remaining HTML tags
  content = content.replace(/<[^>]+>/g, '');

  // Escape curly braces for MDX (these are interpreted as JSX)
  content = content.replace(/\{/g, '\\{');
  content = content.replace(/\}/g, '\\}');

  // Fix multiple newlines
  content = content.replace(/\n{3,}/g, '\n\n');

  // Decode HTML entities
  content = content.replace(/&amp;/g, '&');
  content = content.replace(/&lt;/g, '<');
  content = content.replace(/&gt;/g, '>');
  content = content.replace(/&quot;/g, '"');
  content = content.replace(/&#39;/g, "'");
  content = content.replace(/&nbsp;/g, ' ');

  return content.trim();
}

// Map category nicenames to full names
const categoryMap = {
  'artificial-intelligence': 'Artificial Intelligence',
  'seo-news': 'SEO News',
  'seo-strategies': 'SEO Strategies',
  'technical-seo': 'Technical SEO',
  'uncategorized': null // Skip uncategorized
};

// Parse posts from XML
function parsePosts(xml) {
  const posts = [];

  // Match all items
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    // Check if it's a post (not attachment, page, etc.)
    const postTypeMatch = item.match(/<wp:post_type><!\[CDATA\[(.*?)\]\]><\/wp:post_type>/);
    if (!postTypeMatch || postTypeMatch[1] !== 'post') continue;

    // Check if published
    const statusMatch = item.match(/<wp:status><!\[CDATA\[(.*?)\]\]><\/wp:status>/);
    if (!statusMatch || statusMatch[1] !== 'publish') continue;

    // Extract title
    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
    const title = titleMatch ? titleMatch[1] : '';

    // Extract slug
    const slugMatch = item.match(/<wp:post_name><!\[CDATA\[(.*?)\]\]><\/wp:post_name>/);
    const slug = slugMatch ? slugMatch[1] : '';

    // Extract date
    const dateMatch = item.match(/<wp:post_date><!\[CDATA\[(.*?)\]\]><\/wp:post_date>/);
    const dateStr = dateMatch ? dateMatch[1] : '';
    const date = dateStr.split(' ')[0]; // Get just the date part

    // Extract content
    const contentMatch = item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/);
    const htmlContent = contentMatch ? contentMatch[1] : '';

    // Extract excerpt/description
    const excerptMatch = item.match(/<excerpt:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/excerpt:encoded>/);
    const description = excerptMatch ? excerptMatch[1] : '';

    // Extract categories
    const categoryMatches = item.matchAll(/<category domain="category" nicename="([^"]+)"><!\[CDATA\[(.*?)\]\]><\/category>/g);
    const categories = [];
    for (const catMatch of categoryMatches) {
      const catName = categoryMap[catMatch[1]];
      if (catName) {
        categories.push(catName);
      }
    }

    // Skip if no content
    if (!htmlContent || !title) continue;

    posts.push({
      title,
      slug,
      date,
      description,
      content: htmlToMarkdown(htmlContent),
      tags: categories
    });
  }

  return posts;
}

// Generate MDX file content
function generateMDX(post) {
  const frontmatter = {
    title: post.title,
    date: post.date,
    description: post.description,
    tags: post.tags
  };

  const yaml = `---
title: "${frontmatter.title.replace(/"/g, '\\"')}"
date: "${frontmatter.date}"
description: "${frontmatter.description.replace(/"/g, '\\"')}"
tags: [${frontmatter.tags.map(t => `"${t}"`).join(', ')}]
---

${post.content}
`;

  return yaml;
}

// Main
const posts = parsePosts(xml);
console.log(`Found ${posts.length} posts to import`);

// Create posts directory if it doesn't exist
const postsDir = path.join(__dirname, '..', 'content', 'posts');
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

// Remove the sample post
const samplePost = path.join(postsDir, 'welcome-to-my-blog.mdx');
if (fs.existsSync(samplePost)) {
  fs.unlinkSync(samplePost);
  console.log('Removed sample post');
}

// Write each post
posts.forEach(post => {
  const filename = `${post.slug}.mdx`;
  const filepath = path.join(postsDir, filename);
  const content = generateMDX(post);

  fs.writeFileSync(filepath, content);
  console.log(`Created: ${filename}`);
});

console.log(`\nImport complete! ${posts.length} posts created.`);
