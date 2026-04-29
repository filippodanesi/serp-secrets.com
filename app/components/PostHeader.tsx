import Link from 'next/link';
import { type PostFrontmatter, slugify, categories } from '@/lib/posts';
import { siteUrl } from '@/lib/config';
import CopyForAI from './CopyForAI';
import CopyURL from './CopyURL';

interface PostHeaderProps {
  frontmatter: PostFrontmatter;
  readingTime: string;
  slug: string;
}

function getCategory(tags?: string[]) {
  if (!tags?.length) return null;
  const firstTag = tags[0];
  const slug = slugify(firstTag);
  const match = categories.find((c) => c.slug === slug);
  return {
    label: (match?.name ?? firstTag).toUpperCase(),
    href: `/categories/${slug}/`,
  };
}

export default function PostHeader({ frontmatter, readingTime, slug }: PostHeaderProps) {
  const formattedDate = new Date(frontmatter.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const category = getCategory(frontmatter.tags);
  const postUrl = `${siteUrl}/blog/${slug}/`;
  const linkedInShareHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;

  return (
    <header className="post-header">
      <Link href="/" className="post-back">
        &larr; Back to blog
      </Link>
      {category && (
        <Link href={category.href} className="post-category">
          {category.label}
        </Link>
      )}
      <h1 className="post-title">{frontmatter.title}</h1>
      <div className="post-author">
        <div className="post-author-name">Filippo Danesi</div>
        <div className="post-author-role">SEO &amp; AI Search Strategist (AEO/GEO)</div>
      </div>
      <div className="post-meta">
        <time dateTime={new Date(frontmatter.date).toISOString()}>{formattedDate}</time>
        <span className="post-meta-separator" aria-hidden="true">·</span>
        <span>{readingTime}</span>
        <CopyForAI slug={slug} title={frontmatter.title} />
        <span className="post-meta-separator" aria-hidden="true">·</span>
        <CopyURL url={postUrl} />
        <span className="post-meta-separator" aria-hidden="true">·</span>
        <a
          className="post-meta-action"
          href={linkedInShareHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share this article on LinkedIn"
        >
          LinkedIn
        </a>
      </div>
    </header>
  );
}
