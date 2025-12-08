import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCategories, getCategoryBySlug, getPostsByCategory } from '@/lib/posts';
import PostCard from '@/app/components/PostCard';
import { BreadcrumbJsonLd, CollectionPageJsonLd } from '@/app/components/JsonLd';
import Link from 'next/link';

const siteUrl = 'https://www.serp-secrets.com';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const posts = getPostsByCategory(slug);

  return {
    title: category.name,
    description: category.description,
    alternates: {
      canonical: `${siteUrl}/categories/${slug}/`,
    },
    openGraph: {
      title: `${category.name} ~ SERP Secrets`,
      description: category.description,
      url: `${siteUrl}/categories/${slug}/`,
      type: 'website',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(category.name)}`,
          width: 1200,
          height: 630,
          alt: `${category.name} ~ SERP Secrets`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} ~ SERP Secrets`,
      description: category.description,
      images: [`/api/og?title=${encodeURIComponent(category.name)}`],
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(slug);

  const breadcrumbItems = [
    { name: 'Home', url: siteUrl },
    { name: 'Categories', url: `${siteUrl}/categories/` },
    { name: category.name, url: `${siteUrl}/categories/${slug}/` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <CollectionPageJsonLd
        name={category.name}
        description={category.description}
        url={`${siteUrl}/categories/${slug}/`}
      />
      <header className="page-header">
        <nav className="breadcrumb">
          <Link href="/categories/">Categories</Link>
          <span className="separator">/</span>
          <span>{category.name}</span>
        </nav>
        <h1 className="page-title">{category.name}</h1>
        <p className="page-description">{category.description}</p>
        <p className="page-meta">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="category-empty">No articles in this category yet.</p>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
