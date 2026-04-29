'use client';

import { useState } from 'react';

interface CopyURLProps {
  url: string;
}

type Status = 'idle' | 'copied' | 'error';

export default function CopyURL({ url }: CopyURLProps) {
  const [status, setStatus] = useState<Status>('idle');

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  }

  const label = status === 'copied' ? 'URL copied' : status === 'error' ? 'Copy failed' : 'Copy URL';

  return (
    <button
      type="button"
      className="post-meta-action"
      onClick={handleCopy}
      aria-label="Copy this article's URL to clipboard"
    >
      {label}
    </button>
  );
}
