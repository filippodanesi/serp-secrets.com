import { Metadata } from 'next';
import Link from 'next/link';
import { getCategoriesWithPostCount } from '@/lib/posts';
import { BreadcrumbJsonLd } from '@/app/components/JsonLd';

const siteUrl = 'https://www.serp-secrets.com';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all blog categories covering SEO, AI, content marketing, and technical topics.',
  alternates: {
    canonical: `${siteUrl}/categories/`,
  },
  openGraph: {
    title: 'Categories ~ SERP Secrets',
    description: 'Browse all blog categories covering SEO, AI, content marketing, and technical topics.',
    url: `${siteUrl}/categories/`,
    type: 'website',
    images: [
      {
        url: '/api/og?title=Categories',
        width: 1200,
        height: 630,
        alt: 'Categories ~ SERP Secrets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Categories ~ SERP Secrets',
    description: 'Browse all blog categories covering SEO, AI, content marketing, and technical topics.',
    images: ['/api/og?title=Categories'],
  },
};

export default function CategoriesPage() {
  const categories = getCategoriesWithPostCount();

  const breadcrumbItems = [
    { name: 'Home', url: siteUrl },
    { name: 'Categories', url: `${siteUrl}/categories/` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <header className="page-header">
        <h1 className="page-title">Categories</h1>
        <p className="page-description">
          Browse articles by topic.
        </p>
      </header>

      <div className="categories-grid">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}/`}
            className="category-card"
          >
            <h2 className="category-name">{category.name}</h2>
            <p className="category-description">{category.description}</p>
            <span className="category-count">
              {category.postCount} {category.postCount === 1 ? 'article' : 'articles'}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
