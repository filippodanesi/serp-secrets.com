import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

interface SearchProps {
  posts: Array<{
    title: string;
    url: string;
    description?: string;
    body: string;
  }>;
}

export default function Search({ posts }: SearchProps) {
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => new Fuse(posts, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'body', weight: 0.3 }
    ],
    threshold: 0.3,
    distance: 100,
    minMatchCharLength: 2,
    shouldSort: true,
    includeScore: true,
    includeMatches: true,
    tokenize: true,
    matchAllTokens: false,
    findAllMatches: true,
  }), [posts]);

  const results = useMemo(() => {
    if (!query) return [];
    return fuse.search(query);
  }, [fuse, query]);

  const highlightMatch = (text: string, matches: any[] = []) => {
    if (!matches.length) return text;

    const indices = matches.flatMap(match => match.indices);
    let highlighted = '';
    let lastIndex = 0;

    indices.forEach(([start, end]) => {
      highlighted += text.slice(lastIndex, start);
      highlighted += `<mark class="bg-yellow-200">${text.slice(start, end + 1)}</mark>`;
      lastIndex = end + 1;
    });

    highlighted += text.slice(lastIndex);
    return highlighted;
  };

  return (
    <div className="not-prose">
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full p-4 text-base bg-main focus:bg-muted border border-main rounded-none focus:outline-none font-serif italic placeholder-gray-500"
          aria-label="Search articles"
        />
      </div>

      <div className="space-y-8">
        {query && results.length === 0 ? (
          <p className="text-gray-500 text-sm font-sans">No results found.</p>
        ) : (
          results.map((result, index) => {
            const titleMatch = result.matches?.find(m => m.key === 'title');
            const descMatch = result.matches?.find(m => m.key === 'description');
            const bodyMatch = result.matches?.find(m => m.key === 'body');

            // Estrai un frammento contestuale dal corpo del testo
            let bodyPreview = '';
            if (bodyMatch) {
              const start = Math.max(0, bodyMatch.indices[0][0] - 50);
              const end = Math.min(result.item.body.length, bodyMatch.indices[0][1] + 50);
              bodyPreview = result.item.body.slice(start, end);
              if (start > 0) bodyPreview = '...' + bodyPreview;
              if (end < result.item.body.length) bodyPreview += '...';
            }

            return (
              <a 
                key={index}
                href={result.item.url}
                className="flex justify-between items-start gap-8 group"
              >
                <div className="grow">
                  <h2 
                    className="text-xl leading-tight font-serif font-medium group-hover:underline group-hover:decoration-solid group-hover:underline-offset-4 group-hover:decoration-1 sm:text-2xl"
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(result.item.title, titleMatch?.indices)
                    }}
                  />
                  {result.item.description && (
                    <div 
                      className="mt-3 text-sm leading-normal"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(result.item.description, descMatch?.indices)
                      }}
                    />
                  )}
                  {bodyMatch && (
                    <div 
                      className="mt-2 text-sm text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(bodyPreview, bodyMatch?.indices)
                      }}
                    />
                  )}
                </div>
                <div className="hidden font-serif italic opacity-0 transition group-hover:opacity-100 sm:inline-flex sm:gap-1 sm:items-center sm:shrink-0">
                  Read Post
                  <svg 
                    className="fill-current w-4 h-4"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z"/>
                  </svg>
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}