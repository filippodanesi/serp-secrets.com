import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <span className="footer-text">© 2025 SERP Secrets</span>
        <div className="footer-links">
          <Link href="/privacy/" className="footer-link">Privacy</Link>
          <span className="footer-separator">·</span>
          <Link href="/cookie/" className="footer-link">Cookie</Link>
        </div>
      </div>
    </footer>
  )
}
