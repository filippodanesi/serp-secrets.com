import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <span className="footer-text">© 2025 Filippo Danesi · <Link href="/privacy" className="footer-link">Privacy</Link></span>
        <div className="social-links">
          <a href="https://linkedin.com/in/filippodanesi" target="_blank" rel="noopener" aria-label="LinkedIn">IN</a>
          <span className="social-separator">·</span>
          <a href="https://github.com/filippodanesi" target="_blank" rel="noopener" aria-label="GitHub">GH</a>
          <span className="social-separator">·</span>
          <a href="https://x.com/filippo_danesi" target="_blank" rel="noopener" aria-label="X">X</a>
        </div>
      </div>
    </footer>
  )
}
