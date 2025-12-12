import { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/app/components/JsonLd';

const siteUrl = 'https://www.serp-secrets.com';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with SERP Secrets. Reach out for collaborations, questions, or just to say hello.',
  alternates: {
    canonical: `${siteUrl}/contact/`,
  },
  openGraph: {
    title: 'Contact ~ SERP Secrets',
    description: 'Get in touch with SERP Secrets. Reach out for collaborations, questions, or just to say hello.',
    url: `${siteUrl}/contact/`,
    type: 'website',
    images: [
      {
        url: '/api/og?title=Contact',
        width: 1200,
        height: 630,
        alt: 'Contact ~ SERP Secrets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact ~ SERP Secrets',
    description: 'Get in touch with SERP Secrets. Reach out for collaborations, questions, or just to say hello.',
    images: ['/api/og?title=Contact'],
  },
};

export default function ContactPage() {
  const breadcrumbItems = [
    { name: 'Home', url: siteUrl },
    { name: 'Contact', url: `${siteUrl}/contact/` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <header className="page-header">
        <h1 className="page-title">Contact</h1>
        <p className="page-description">
          Feel free to reach out for collaborations, questions, or just to say hello.
        </p>
      </header>

      <div className="contact-list">
          <div className="contact-item">
            <span className="contact-label">Email</span>
            <a href="mailto:hello@serp-secrets.com" className="contact-value">
              hello@serp-secrets.com
            </a>
          </div>
          <div className="contact-item">
            <span className="contact-label">X (Twitter)</span>
            <a
              href="https://x.com/serikiprotocol"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-value"
            >
              @filippodanesi
            </a>
          </div>
          <div className="contact-item">
            <span className="contact-label">LinkedIn</span>
            <a
              href="https://www.linkedin.com/in/filippodanesi/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-value"
            >
              filippodanesi
            </a>
          </div>
          <div className="contact-item">
            <span className="contact-label">GitHub</span>
            <a
              href="https://github.com/filippodanesi"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-value"
            >
              filippodanesi
            </a>
          </div>
      </div>
    </>
  );
}
