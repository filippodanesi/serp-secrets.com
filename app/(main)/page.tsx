import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import PostCard from '@/app/components/PostCard';
import { BlogJsonLd } from '@/app/components/JsonLd';

export default function Home() {
  const allPosts = getAllPosts();
  const posts = allPosts.slice(0, 10);
  const hasMorePosts = allPosts.length > 10;

  return (
    <>
      <BlogJsonLd />
      <header className="page-header">
        <h1 className="page-title">SERP Secrets</h1>
        <p className="page-description">
          Thoughts on SEO, AI, content marketing, and the future of search.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="blog-empty">No posts yet. Check back soon!</p>
      ) : (
        <>
          <div className="posts-list">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          {hasMorePosts && (
            <div className="view-archive">
              <Link href="/archive/" className="view-archive-link">
                View all posts →
              </Link>
            </div>
          )}
        </>
      )}
    </>
  );
}
