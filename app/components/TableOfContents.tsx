'use client'

import { useEffect, useState, useCallback } from 'react'

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

  const updateActiveHeading = useCallback(() => {
    if (headings.length === 0) return

    const headingElements = headings
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
  }, [headings])

  useEffect(() => {
    if (headings.length === 0) return

    updateActiveHeading()
    window.addEventListener('scroll', updateActiveHeading, { passive: true })

    return () => window.removeEventListener('scroll', updateActiveHeading)
  }, [headings, updateActiveHeading])

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

  if (headings.length === 0) {
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
          {headings.map(({ id, text, level }) => (
            <li key={id} className={`toc-item toc-item-h${level}`}>
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
