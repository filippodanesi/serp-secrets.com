'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

interface SearchPost {
  slug: string
  title: string
  description: string
  tags: string[]
  date: string
}

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState<SearchPost[]>([])
  const [results, setResults] = useState<SearchPost[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load posts data
  useEffect(() => {
    if (isOpen && posts.length === 0) {
      setIsLoading(true)
      fetch('/api/search')
        .then((res) => res.json())
        .then((data) => {
          setPosts(data)
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    }
  }, [isOpen, posts.length])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Clear query when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Search logic
  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery)

      if (searchQuery.trim() === '') {
        setResults([])
        return
      }

      const lowerQuery = searchQuery.toLowerCase()
      const filtered = posts.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(lowerQuery)
        const descMatch = post.description.toLowerCase().includes(lowerQuery)
        const tagMatch = post.tags.some((tag) =>
          tag.toLowerCase().includes(lowerQuery)
        )
        return titleMatch || descMatch || tagMatch
      })

      setResults(filtered)
    },
    [posts]
  )

  if (!isOpen) return null

  return (
    <div className="search-overlay">
      <div className="search-header">
        <button className="search-close" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="search-content">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div className="search-results">
          {isLoading && <p className="search-status">Loading...</p>}

          {!isLoading && query && results.length === 0 && (
            <p className="search-status">No results found</p>
          )}

          {results.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="search-result"
              onClick={onClose}
            >
              <span className="search-result-title">{post.title}</span>
              <span className="search-result-description">
                {post.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
