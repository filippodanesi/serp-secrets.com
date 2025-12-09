#!/usr/bin/env node
/**
 * Script to fix missing markdown heading markers (##, ###) in MDX files.
 *
 * The issue: TinaCMS rich-text field sometimes saves headings as plain text
 * without the markdown ## markers. This script identifies and fixes them.
 *
 * Detection heuristics:
 * - Line is not empty and doesn't start with markdown markers (-, *, #, >, numbers)
 * - Line doesn't contain links as primary content
 * - Line is relatively short (< 100 chars typically for headings)
 * - Line is preceded and followed by empty lines
 * - Line doesn't end with punctuation typical of sentences (. , ; :)
 *
 * Usage: node scripts/fix-headings.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const DRY_RUN = process.argv.includes('--dry-run');

// Known heading patterns to detect (case insensitive partial matches)
const HEADING_PATTERNS = [
  // Common H2 patterns
  /^(the|how|why|what|when|where|which|understanding|exploring|key|best|top|final|in|a|an|so|reddit|ai|seo|google|conclusion|summary|introduction|overview|background|benefits|challenges|strategies|tips|steps|guide|future|impact|analysis|results|discussion|methodology|approach|implementation|case|example)/i,
];

// Patterns that indicate this is NOT a heading
const NOT_HEADING_PATTERNS = [
  /^[-*>]/, // List items or blockquotes
  /^#+\s/, // Already a heading
  /^\d+\.\s/, // Numbered list
  /^!\[/, // Image
  /^\[.*\]\(.*\)$/, // Link-only line
  /^```/, // Code block
  /^\|/, // Table
  /^---/, // Horizontal rule or frontmatter
  /\*{3,}/, // Bold/italic abuse
];

// Sentence-ending punctuation (headings typically don't have these at the end)
const SENTENCE_ENDINGS = /[.,;:!?]$/;

function isLikelyHeading(line, prevLine, nextLine) {
  const trimmed = line.trim();

  // Skip empty lines
  if (!trimmed) return false;

  // Skip if matches "not heading" patterns
  for (const pattern of NOT_HEADING_PATTERNS) {
    if (pattern.test(trimmed)) return false;
  }

  // Skip if line is too long (headings are usually short)
  if (trimmed.length > 120) return false;

  // Skip if ends with sentence punctuation (except ? which is valid for headings)
  if (/[.,;:]$/.test(trimmed)) return false;

  // Must be preceded by empty line (or start of content)
  if (prevLine && prevLine.trim() !== '') return false;

  // Must be followed by empty line
  if (nextLine && nextLine.trim() !== '') return false;

  // Skip lines that are primarily links
  const linkMatches = trimmed.match(/\[.*?\]\(.*?\)/g);
  if (linkMatches) {
    const totalLinkLength = linkMatches.join('').length;
    if (totalLinkLength > trimmed.length * 0.7) return false;
  }

  // Skip if it contains "Source:" or "**Source" (these are captions, not headings)
  if (/\*?\*?source:?\*?\*?/i.test(trimmed)) return false;

  // Check if it looks like a heading based on content
  // Headings often start with capital letter and are title-case
  if (!/^[A-Z"']/.test(trimmed)) return false;

  // Final check: does it look like a typical heading?
  // Short, no ending punctuation, surrounded by blank lines
  return true;
}

function determineHeadingLevel(line, context) {
  // Simple heuristic:
  // - "Conclusion", "Summary", "Introduction" etc. are usually H2
  // - Numbered items like "1. Something" within sections are H3
  // - Most standalone headings are H2

  const trimmed = line.trim();

  // Check for numbered heading style "1. Title" or "Step 1:" etc.
  if (/^\d+[\.\)]\s/.test(trimmed)) {
    return 3; // H3 for numbered sub-sections
  }

  // Default to H2
  return 2;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Find frontmatter boundaries
  let frontmatterEnd = 0;
  let inFrontmatter = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
      } else {
        frontmatterEnd = i;
        break;
      }
    }
  }

  const changes = [];

  // Process lines after frontmatter
  for (let i = frontmatterEnd + 1; i < lines.length; i++) {
    const line = lines[i];
    const prevLine = i > 0 ? lines[i - 1] : '';
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';

    if (isLikelyHeading(line, prevLine, nextLine)) {
      const level = determineHeadingLevel(line, { prevLine, nextLine });
      const marker = '#'.repeat(level);
      const newLine = `${marker} ${line.trim()}`;

      changes.push({
        lineNumber: i + 1,
        original: line,
        new: newLine,
        level
      });

      lines[i] = newLine;
    }
  }

  return {
    originalContent: content,
    newContent: lines.join('\n'),
    changes
  };
}

function main() {
  console.log(DRY_RUN ? '🔍 DRY RUN MODE - No files will be modified\n' : '✏️  LIVE MODE - Files will be modified\n');

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
  let totalChanges = 0;

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const result = processFile(filePath);

    if (result.changes.length > 0) {
      console.log(`\n📄 ${file}`);
      console.log('─'.repeat(50));

      for (const change of result.changes) {
        console.log(`  Line ${change.lineNumber}: H${change.level}`);
        console.log(`    - "${change.original.trim()}"`);
        console.log(`    + "${change.new.trim()}"`);
      }

      totalChanges += result.changes.length;

      if (!DRY_RUN) {
        fs.writeFileSync(filePath, result.newContent, 'utf8');
        console.log(`  ✅ File updated`);
      }
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`Total: ${totalChanges} headings ${DRY_RUN ? 'would be' : 'were'} fixed across ${files.length} files`);

  if (DRY_RUN && totalChanges > 0) {
    console.log('\nRun without --dry-run to apply changes.');
  }
}

main();
