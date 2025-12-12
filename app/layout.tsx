import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const siteUrl = 'https://www.serp-secrets.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SERPsecrets ~ SEO & AI Convergence',
    template: '%s ~ SERPsecrets',
  },
  description: 'Thoughts on SEO, AI, content marketing, and the future of search. Exploring how artificial intelligence is reshaping digital marketing strategies.',
  keywords: ['SEO', 'Content Marketing', 'AI', 'LLM', 'NLP', 'Technical SEO', 'GEO', 'AEO', 'SERP Secrets'],
  authors: [{ name: 'Filippo Danesi' }],
  creator: 'SERP Secrets',
  publisher: 'SERP Secrets',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'x-default': siteUrl,
      'en': siteUrl,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'SERP Secrets',
    title: 'SERP Secrets',
    description: 'Thoughts on SEO, AI, content marketing, and the future of search.',
    images: [
      {
        url: '/api/og?title=SERP%20Secrets',
        width: 1200,
        height: 630,
        alt: 'SERP Secrets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SERP Secrets',
    description: 'Thoughts on SEO, AI, content marketing, and the future of search.',
    images: ['/api/og?title=SERP%20Secrets'],
    creator: '@filippodanesi',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <link rel="alternate" type="application/rss+xml" title="SERP Secrets" href="/feed.xml" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
