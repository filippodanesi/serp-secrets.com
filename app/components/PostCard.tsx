import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.frontmatter.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/blog/${post.slug}/`} className="post-card">
      <div className="post-card-content">
        <h2 className="post-card-title">{post.frontmatter.title}</h2>
        <p className="post-card-description">{post.frontmatter.description}</p>
      </div>
      <div className="post-card-meta">
        <time dateTime={post.frontmatter.date}>{formattedDate}</time>
        <span className="post-card-separator">·</span>
        <span>{post.readingTime}</span>
      </div>
    </Link>
  );
}
