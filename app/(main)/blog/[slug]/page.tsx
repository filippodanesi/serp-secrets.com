import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getAllPosts, extractHeadings } from '@/lib/posts';
import PostHeader from '@/app/components/PostHeader';
import MDXComponents from '@/app/components/MDXComponents';
import TableOfContents from '@/app/components/TableOfContents';
import { BlogPostingJsonLd, BreadcrumbJsonLd } from '@/app/components/JsonLd';

const siteUrl = 'https://www.serp-secrets.com';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const { frontmatter } = post;
  const postUrl = `${siteUrl}/blog/${slug}`;
  const ogImageUrl = frontmatter.image || `/api/og?title=${encodeURIComponent(frontmatter.title)}`;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.tags,
    authors: [{ name: 'Filippo Danesi' }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: postUrl,
      type: 'article',
      publishedTime: frontmatter.date,
      authors: ['Filippo Danesi'],
      tags: frontmatter.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
      images: [ogImageUrl],
      creator: '@filippodanesi',
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content, readingTime } = post;
  const postUrl = `${siteUrl}/blog/${slug}`;
  const headings = extractHeadings(content);

  return (
    <>
      {headings.length > 0 && <TableOfContents headings={headings} />}
      <article className="blog-post">
        <BlogPostingJsonLd
          title={frontmatter.title}
          description={frontmatter.description}
          datePublished={frontmatter.date}
          url={postUrl}
          image={frontmatter.image}
          tags={frontmatter.tags}
        />
        <BreadcrumbJsonLd
          items={[
            { name: 'Home', url: siteUrl },
            { name: 'Blog', url: `${siteUrl}/blog` },
            { name: frontmatter.title, url: postUrl },
          ]}
        />
        <PostHeader frontmatter={frontmatter} readingTime={readingTime} />
        {frontmatter.summary && (
          <aside className="post-summary">
            <div className="post-summary-label">Summary</div>
            <p>{frontmatter.summary}</p>
          </aside>
        )}
        <div className="post-content">
          <MDXRemote source={content} components={MDXComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>
      </article>
    </>
  );
}
