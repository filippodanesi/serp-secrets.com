import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'Privacy policy for serp-secrets.com',
  alternates: {
    canonical: 'https://www.serp-secrets.com/privacy/',
  },
}

export default function Privacy() {
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Privacy</h1>
      </header>

      <section className="section">
        <h2 className="section-title">Analytics</h2>
        <div className="section-content">
          <p>This site uses Vercel Analytics to collect anonymous traffic data. No cookies are used and no personal data is collected or stored.</p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Data Collection</h2>
        <div className="section-content">
          <p>The only data collected includes page views, referrer URLs, country (aggregated), device type, and browser type. This data cannot be used to identify individual users.</p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Contact</h2>
        <div className="section-content">
          <p>For any privacy-related questions, contact <a href="mailto:hello@serp-secrets.com">hello@serp-secrets.com</a></p>
        </div>
      </section>
    </>
  )
}
