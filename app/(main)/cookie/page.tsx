import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie policy for serp-secrets.com',
  alternates: {
    canonical: 'https://www.serp-secrets.com/cookie/',
  },
}

export default function CookiePolicy() {
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Cookie Policy</h1>
      </header>

      <section className="section">
        <h2 className="section-title">What Are Cookies</h2>
        <div className="section-content">
          <p>Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to site owners.</p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Cookies We Use</h2>
        <div className="section-content">
          <p>This website uses minimal cookies:</p>
          <p><strong>Theme preference:</strong> A local storage item to remember your light/dark mode preference. This is not a cookie but local browser storage that never leaves your device.</p>
          <p><strong>Vercel Analytics:</strong> We use Vercel Analytics which is privacy-focused and does not use cookies to track visitors.</p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Third-Party Cookies</h2>
        <div className="section-content">
          <p>This website does not use any third-party cookies for advertising or tracking purposes.</p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Managing Cookies</h2>
        <div className="section-content">
          <p>You can control and manage cookies through your browser settings. Please note that removing or blocking cookies may impact your user experience.</p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Contact</h2>
        <div className="section-content">
          <p>For any questions about this cookie policy, contact <a href="mailto:hello@serp-secrets.com">hello@serp-secrets.com</a></p>
          <p>See also our <Link href="/privacy/">Privacy Policy</Link>.</p>
        </div>
      </section>
    </>
  )
}
