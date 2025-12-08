'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'

export default function Header() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <header>
      <div className="header-content">
        <Link href="/" className="logo">Filippo Danesi</Link>
        <nav>
          <a href="https://www.serp-secrets.com" target="_blank" rel="noopener">Blog</a>
          <Link href="/about" className={pathname === '/about' ? 'active' : ''}>About</Link>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </nav>
      </div>
    </header>
  )
}
