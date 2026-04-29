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
      setTimeout(() => setStatus('idle'), 2200);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2200);
    }
  }

  const buttonLabel =
    status === 'copied'
      ? 'Copied'
      : status === 'copying'
      ? 'Copying…'
      : status === 'error'
      ? 'Copy failed'
      : 'Copy for AI';

  return (
    <div className="copy-for-ai" role="group" aria-label="AI-friendly actions">
      <button
        type="button"
        className="copy-for-ai-button copy-button"
        onClick={handleCopy}
        data-copy-ai="true"
        aria-label={`Copy "${title}" as Markdown for AI assistants`}
        title="Copy this article as clean Markdown to paste into ChatGPT, Claude, Perplexity, etc."
      >
        <span aria-hidden="true">{status === 'copied' ? '✓' : '⎘'}</span>
        <span>{buttonLabel}</span>
      </button>
      <a
        className="copy-for-ai-link"
        href={rawHref}
        rel="alternate"
        type="text/markdown"
        title="Open the raw Markdown source of this article"
      >
        View as Markdown
      </a>
    </div>
  );
}
