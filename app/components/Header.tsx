'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import SearchOverlay from './SearchOverlay'

function Logo() {
  return (
    <svg
      className="logo-icon"
      width="20"
      height="20"
      viewBox="0 0 375 375"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M 196.519531 4.851562 L 178.949219 4.851562 L 178.949219 366.363281 L 196.519531 366.363281 Z" />
      <path d="M 369.726562 176.871094 L 5.769531 176.871094 L 5.769531 194.390625 L 369.726562 194.390625 Z" />
      <path d="M 65.238281 51.628906 L 52.804688 63.988281 L 310.128906 319.609375 L 322.617188 307.242188 Z" />
      <path d="M 310.128906 51.628906 L 52.804688 307.25 L 65.238281 319.566406 L 322.617188 63.980469 Z" />
      <path d="M 22.542969 109.398438 L 15.898438 125.578125 L 352.972656 261.964844 L 359.621094 245.8125 Z" />
      <path d="M 248.296875 15.007812 L 110.96875 349.800781 L 127.273438 356.390625 L 264.601562 21.589844 Z" />
      <path d="M 353.394531 109.992188 L 15.746094 244.964844 L 22.316406 261.199219 L 359.976562 126.226562 Z" />
      <path d="M 127.839844 14.792969 L 111.535156 21.308594 L 247.367188 356.691406 L 263.671875 350.179688 Z" />
    </svg>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/' || pathname === ''
    return pathname === path || pathname === `${path}/` || pathname.startsWith(`${path}/`)
  }

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header>
      <div className="header-content">
        <Link href="/" className="logo" aria-label="SERP Secrets Home">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          <Link href="/archive/" className={isActive('/archive') ? 'active' : ''}>Archive</Link>
          <Link href="/categories/" className={isActive('/categories') ? 'active' : ''}>Categories</Link>
          <Link href="/about/" className={isActive('/about') ? 'active' : ''}>Author</Link>
          <Link href="/contact/" className={isActive('/contact') ? 'active' : ''}>Contact</Link>
          <button className="nav-icon" onClick={() => setSearchOpen(true)} aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="menu-toggle nav-icon"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile fullscreen menu */}
      <div className={`nav-mobile-overlay ${menuOpen ? 'open' : ''}`}>
        <nav className="nav-mobile-content">
          <Link href="/archive/" className={isActive('/archive') ? 'active' : ''}>Archive</Link>
          <Link href="/categories/" className={isActive('/categories') ? 'active' : ''}>Categories</Link>
          <Link href="/about/" className={isActive('/about') ? 'active' : ''}>Author</Link>
          <Link href="/contact/" className={isActive('/contact') ? 'active' : ''}>Contact</Link>
          <button
            className="nav-mobile-search"
            onClick={() => {
              setMenuOpen(false)
              setTimeout(() => setSearchOpen(true), 150)
            }}
            aria-label="Search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </nav>
      </div>

      {/* Search overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
