import Link from 'next/link';
import type { PostFrontmatter } from '@/lib/posts';

interface PostHeaderProps {
  frontmatter: PostFrontmatter;
  readingTime: string;
}

function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

export default function PostHeader({ frontmatter, readingTime }: PostHeaderProps) {
  const formattedDate = new Date(frontmatter.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="post-header">
      <Link href="/" className="post-back">
        &larr; Back to blog
      </Link>
      <h1 className="post-title">{frontmatter.title}</h1>
      <div className="post-meta">
        <time dateTime={frontmatter.date}>{formattedDate}</time>
        <span className="post-meta-separator">·</span>
        <span>{readingTime}</span>
      </div>
      {frontmatter.tags && frontmatter.tags.length > 0 && (
        <div className="post-tags">
          {frontmatter.tags.map((tag) => (
            <Link
              key={tag}
              href={`/categories/${tagToSlug(tag)}/`}
              className="post-tag"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
