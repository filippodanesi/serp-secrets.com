'use client';

import { useState } from 'react';

interface CopyForAIProps {
  slug: string;
  title: string;
}

type Status = 'idle' | 'copying' | 'copied' | 'error';

export default function CopyForAI({ slug, title }: CopyForAIProps) {
  const [status, setStatus] = useState<Status>('idle');
  const rawHref = `/blog/${slug}.md`;

  async function handleCopy() {
    if (status === 'copying') return;
    setStatus('copying');
    try {
      const res = await fetch(rawHref, { headers: { Accept: 'text/markdown' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const markdown = await res.text();
      await navigator.clipboard.writeText(markdown);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  }

  const label =
    status === 'copied'
      ? 'Copied'
      : status === 'copying'
      ? 'Copying…'
      : status === 'error'
      ? 'Copy failed'
      : 'Copy for AI';

  return (
    <>
      <span className="post-meta-separator" aria-hidden="true">·</span>
      <button
        type="button"
        className="post-meta-action"
        onClick={handleCopy}
        data-copy-ai="true"
        aria-label={`Copy "${title}" as Markdown for AI assistants`}
      >
        {label}
      </button>
      <span className="post-meta-separator" aria-hidden="true">·</span>
      <a
        className="post-meta-action"
        href={rawHref}
        rel="alternate"
        type="text/markdown"
      >
        Markdown
      </a>
    </>
  );
}
