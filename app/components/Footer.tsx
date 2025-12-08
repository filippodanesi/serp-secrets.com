'use client'

import { useTheme } from './ThemeProvider'

export default function Footer() {
  const { theme, toggleTheme } = useTheme()

  return (
    <footer>
      <div className="footer-content">
        <span className="footer-text">
          © 2025{' '}
          <a
            href="https://www.filippodanesi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Filippo Danesi
          </a>
        </span>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </footer>
  )
}
