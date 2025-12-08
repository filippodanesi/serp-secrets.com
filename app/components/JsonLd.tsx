const siteUrl = 'https://www.serp-secrets.com';

export function PersonJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Filippo Danesi',
    url: siteUrl,
    image: `${siteUrl}/og-image.png`,
    sameAs: [
      'https://x.com/serikiprotocol',
    ],
    jobTitle: 'SEO & AI Search Strategist (AEO/GEO)',
    worksFor: {
      '@type': 'Organization',
      name: 'Triumph International',
      url: 'https://en.wikipedia.org/wiki/Triumph_International',
    },
    alumniOf: [],
    knowsAbout: [
      'SEO',
      'Content Marketing',
      'Technical SEO',
      'AI',
      'LLM',
      'NLP',
      'NLU',
      'GEO',
      'AEO',
      'Python',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Zurich',
      addressCountry: 'CH',
    },
    email: 'hello@serp-secrets.com',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function WebSiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SERP Secrets',
    url: siteUrl,
    description: 'Thoughts on SEO, AI, content marketing, and the future of search.',
    author: {
      '@type': 'Person',
      name: 'Filippo Danesi',
    },
    inLanguage: 'en',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface BlogPostingJsonLdProps {
  title: string;
  description: string;
  datePublished: string;
  url: string;
  image?: string;
  tags?: string[];
}

export function BlogPostingJsonLd({
  title,
  description,
  datePublished,
  url,
  image,
  tags,
}: BlogPostingJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    datePublished: datePublished,
    dateModified: datePublished,
    url: url,
    image: image || `${siteUrl}/api/og?title=${encodeURIComponent(title)}`,
    author: {
      '@type': 'Person',
      name: 'Filippo Danesi',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SERP Secrets',
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: tags?.join(', '),
    inLanguage: 'en',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function BlogJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'SERP Secrets',
    description: 'Thoughts on SEO, AI, content marketing, and the future of search.',
    url: siteUrl,
    author: {
      '@type': 'Person',
      name: 'Filippo Danesi',
      url: siteUrl,
    },
    inLanguage: 'en',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface CollectionPageJsonLdProps {
  name: string;
  description: string;
  url: string;
}

export function CollectionPageJsonLd({ name, description, url }: CollectionPageJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: name,
    description: description,
    url: url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'SERP Secrets',
      url: siteUrl,
    },
    inLanguage: 'en',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
