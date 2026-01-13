'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'

export interface TOCHeading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: TOCHeading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Only show H2 headings for a cleaner ToC
  const h2Headings = useMemo(() => headings.filter(h => h.level === 2), [headings])

  const updateActiveHeading = useCallback(() => {
    if (h2Headings.length === 0) return

    const headingElements = h2Headings
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const offset = 100
    let currentId = ''

    for (const element of headingElements) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= offset) {
        currentId = element.id
      } else {
        break
      }
    }

    // If no heading is above the offset, use the first one if we're at the top
    if (!currentId && headingElements.length > 0) {
      const firstRect = headingElements[0].getBoundingClientRect()
      if (firstRect.top <= window.innerHeight / 2) {
        currentId = headingElements[0].id
      }
    }

    if (currentId) {
      setActiveId(currentId)
    }
  }, [h2Headings])

  useEffect(() => {
    if (h2Headings.length === 0) return

    updateActiveHeading()
    window.addEventListener('scroll', updateActiveHeading, { passive: true })

    return () => window.removeEventListener('scroll', updateActiveHeading)
  }, [h2Headings, updateActiveHeading])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })

      // Update URL hash without jumping
      window.history.pushState(null, '', `#${id}`)
      setActiveId(id)
    }
  }

  if (h2Headings.length === 0) {
    return null
  }

  return (
    <nav className="toc" aria-label="Table of contents">
      <button
        className="toc-title"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
      >
        On this page
      </button>
      {!isCollapsed && (
        <ul className="toc-list">
          {h2Headings.map(({ id, text }) => (
            <li key={id} className="toc-item">
              <a
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className={`toc-link ${activeId === id ? 'active' : ''}`}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
