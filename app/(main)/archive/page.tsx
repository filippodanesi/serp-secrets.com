import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { BreadcrumbJsonLd } from '@/app/components/JsonLd';

const siteUrl = 'https://www.serp-secrets.com';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Browse all blog posts organized by year.',
  alternates: {
    canonical: `${siteUrl}/archive/`,
  },
  openGraph: {
    title: 'Archive ~ SERP Secrets',
    description: 'Browse all blog posts organized by year.',
    url: `${siteUrl}/archive/`,
    type: 'website',
    images: [
      {
        url: '/api/og?title=Archive',
        width: 1200,
        height: 630,
        alt: 'Archive ~ SERP Secrets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Archive ~ SERP Secrets',
    description: 'Browse all blog posts organized by year.',
    images: ['/api/og?title=Archive'],
  },
};

interface PostsByYear {
  [year: string]: {
    slug: string;
    title: string;
    date: string;
  }[];
}

export default function ArchivePage() {
  const posts = getAllPosts();

  // Group posts by year
  const postsByYear: PostsByYear = posts.reduce((acc, post) => {
    const year = new Date(post.frontmatter.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push({
      slug: post.slug,
      title: post.frontmatter.title,
      date: post.frontmatter.date,
    });
    return acc;
  }, {} as PostsByYear);

  const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  const breadcrumbItems = [
    { name: 'Home', url: siteUrl },
    { name: 'Archive', url: `${siteUrl}/archive/` },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <header className="page-header">
        <h1 className="page-title">Archive</h1>
        <p className="page-description">
          All posts ({posts.length} {posts.length === 1 ? 'article' : 'articles'})
        </p>
      </header>

      {years.length === 0 ? (
        <p className="archive-empty">No posts yet. Check back soon!</p>
      ) : (
        <div className="archive-list">
          {years.map((year) => (
            <div key={year} className="archive-year-group">
              <h2 className="archive-year">{year}</h2>
              <ul className="archive-posts">
                {postsByYear[year].map((post) => (
                  <li key={post.slug} className="archive-post">
                    <time dateTime={post.date} className="archive-post-date">
                      {formatDate(post.date)}
                    </time>
                    <Link href={`/blog/${post.slug}/`} className="archive-post-title">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
