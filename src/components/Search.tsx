import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

interface Post {
  title: string;
  url: string;
  description?: string;
  body: string;
}

interface SearchProps {
  posts: Array<Post>;
}

// Clean markdown and other syntax from text
function cleanText(text: string): string {
  return text
    // Remove import statements
    .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
    // Remove export statements
    .replace(/export\s+.*?;?/g, '')
    // Remove markdown links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove image markdown
    .replace(/!\[([^\]]+)\]\([^)]+\)/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove HTML tags and components (including Astro components)
    .replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, '')
    .replace(/<[^>]+>/g, '')
    // Remove JSX expressions
    .replace(/\{.*?\}/g, '')
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/g, '')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // Remove markdown headers
    .replace(/#{1,6}\s/g, '')
    // Remove front matter
    .replace(/---[\s\S]*?---/g, '')
    // Remove multiple spaces and line breaks
    .replace(/\s+/g, ' ')
    // Trim
    .trim();
}

// Function to highlight search terms in text
function highlightText(text: string, searchQuery: string): string {
  if (!searchQuery) return text;
  
  const words = searchQuery.trim().toLowerCase().split(/\s+/);
  let highlightedText = text;
  
  words.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<span class="font-bold px-1 rounded bg-muted">$1</span>');
  });
  
  return highlightedText;
}

// Get relevant context around matched terms
function getMatchContext(text: string, searchQuery: string, contextLength: number = 150): string | null {
  if (!searchQuery || !text) return null;
  
  const cleanedText = cleanText(text);
  const words = searchQuery.trim().toLowerCase().split(/\s+/);
  
  // Find the first occurrence of any search word
  let firstIndex = -1;
  let matchedWord = '';
  
  words.forEach(word => {
    const index = cleanedText.toLowerCase().indexOf(word);
    if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
      firstIndex = index;
      matchedWord = word;
    }
  });
  
  if (firstIndex === -1) return null;
  
  const start = Math.max(0, firstIndex - contextLength);
  const end = Math.min(cleanedText.length, firstIndex + matchedWord.length + contextLength);
  
  let context = cleanedText.slice(start, end);
  
  // Add ellipsis if needed
  if (start > 0) context = '...' + context;
  if (end < cleanedText.length) context += '...';
  
  return highlightText(context, searchQuery);
}

const fuseOptions = {
  keys: [
    { 
      name: 'title', 
      weight: 1.5,
      getFn: (obj: Post) => cleanText(obj.title)
    },
    { 
      name: 'body', 
      weight: 1,
      getFn: (obj: Post) => cleanText(obj.body)
    }
  ],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 2,
  shouldSort: true,
  findAllMatches: true,
  includeMatches: true,
  distance: 100000
};

export default function Search({ posts }: SearchProps) {
  const [query, setQuery] = useState('');
  const [processedResults, setProcessedResults] = useState<Array<{
    title: string;
    url: string;
    context: string | null;
  }>>([]);
  
  const fuse = useMemo(() => new Fuse(posts, fuseOptions), [posts]);

  // Process search results
  React.useEffect(() => {
    if (!query) {
      setProcessedResults([]);
      return;
    }

    const searchResults = fuse.search(query);
    
    const processed = searchResults.map(result => {
      // Clean and highlight title
      const cleanedTitle = cleanText(result.item.title);
      const highlightedTitle = highlightText(cleanedTitle, query);
      
      // Get context from body
      let context = null;
      
      // Find best match in body
      if (result.matches) {
        const bodyMatch = result.matches.find(match => match.key === 'body');
        if (bodyMatch?.value) {
          context = getMatchContext(bodyMatch.value as string, query);
        } else {
          // Fallback to using the full body if no specific match
          context = getMatchContext(result.item.body, query);
        }
      }

      return {
        title: highlightedTitle,
        url: result.item.url,
        context: context
      };
    });

    setProcessedResults(processed);
  }, [query, fuse]);

  return (
    <div className="not-prose">
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full p-4 text-base bg-main focus:bg-muted border border-main rounded-none focus:outline-none font-serif italic placeholder-[rgb(var(--color-text-main))]"
          aria-label="Search articles"
        />
      </div>

      <div className="space-y-8">
        {query && processedResults.length === 0 ? (
          <p className="text-[rgb(var(--color-text-muted))/60] text-sm font-sans">
            No results found.
          </p>
        ) : (
          processedResults.map((result, index) => (
            <a 
              key={index}
              href={result.url}
              className="block group space-y-3"
            >
              {/* Title */}
              <h2 
                className="text-xl leading-tight font-serif font-medium group-hover:underline group-hover:decoration-solid group-hover:underline-offset-4 group-hover:decoration-1 sm:text-2xl"
                dangerouslySetInnerHTML={{ __html: result.title }}
              />
              
              {/* Context */}
              {result.context && (
                <div 
                  className="text-sm text-[rgb(var(--color-text-muted))] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: result.context }}
                />
              )}
              
              {/* Read link */}
              <div className="inline-flex items-center gap-1 font-serif italic text-sm opacity-60 group-hover:opacity-100">
                Read article
                <svg 
                  className="fill-current w-4 h-4"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z"/>
                </svg>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}