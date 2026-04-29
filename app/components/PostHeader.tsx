import Link from 'next/link';
import { type PostFrontmatter, slugify } from '@/lib/posts';
import CopyForAI from './CopyForAI';

interface PostHeaderProps {
  frontmatter: PostFrontmatter;
  readingTime: string;
  slug: string;
}

export default function PostHeader({ frontmatter, readingTime, slug }: PostHeaderProps) {
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
        <CopyForAI slug={slug} title={frontmatter.title} />
      </div>
      {frontmatter.tags && frontmatter.tags.length > 0 && (
        <div className="post-tags">
          {frontmatter.tags.map((tag) => (
            <Link
              key={tag}
              href={`/categories/${slugify(tag)}/`}
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
