import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import { ReactNode } from 'react';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getTextContent(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(getTextContent).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return getTextContent((children as { props: { children: ReactNode } }).props.children);
  }
  return '';
}

const components: MDXComponents = {
  h1: ({ children }) => <h1 className="mdx-h1">{children}</h1>,
  h2: ({ children }) => {
    const text = getTextContent(children);
    const id = slugify(text);
    return <h2 id={id} className="mdx-h2">{children}</h2>;
  },
  h3: ({ children }) => {
    const text = getTextContent(children);
    const id = slugify(text);
    return <h3 id={id} className="mdx-h3">{children}</h3>;
  },
  h4: ({ children }) => <h4 className="mdx-h4">{children}</h4>,
  p: ({ children }) => <p className="mdx-p">{children}</p>,
  ul: ({ children }) => <ul className="mdx-ul">{children}</ul>,
  ol: ({ children }) => <ol className="mdx-ol">{children}</ol>,
  li: ({ children }) => <li className="mdx-li">{children}</li>,
  blockquote: ({ children }) => <blockquote className="mdx-blockquote">{children}</blockquote>,
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return <code className="mdx-code-inline">{children}</code>;
    }
    return <code className={`mdx-code-block ${className || ''}`}>{children}</code>;
  },
  pre: ({ children }) => <pre className="mdx-pre">{children}</pre>,
  a: ({ href, children }) => {
    const isInternal = href?.startsWith('/') ||
      href?.includes('serp-secrets.com');

    if (isInternal) {
      // Convert absolute URLs to relative paths
      const internalHref = href?.replace(/^https?:\/\/(www\.)?serp-secrets\.com/, '') || '/';
      return (
        <Link href={internalHref} className="mdx-link">
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mdx-link"
      >
        {children}
      </a>
    );
  },
  hr: () => <hr className="mdx-hr" />,
  table: ({ children }) => (
    <div className="mdx-table-wrapper">
      <table className="mdx-table">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="mdx-thead">{children}</thead>,
  tbody: ({ children }) => <tbody className="mdx-tbody">{children}</tbody>,
  tr: ({ children }) => <tr className="mdx-tr">{children}</tr>,
  th: ({ children }) => <th className="mdx-th">{children}</th>,
  td: ({ children }) => <td className="mdx-td">{children}</td>,
  img: ({ src, alt }) => (
    <img src={src} alt={alt || ''} className="mdx-img" />
  ),
  Figure: ({ image, alt, caption }: { image: string; alt: string; caption?: string }) => (
    <figure className="mdx-figure">
      <img src={image} alt={alt} className="mdx-figure-img" />
      {caption && <figcaption className="mdx-figcaption">{caption}</figcaption>}
    </figure>
  ),
};

export default components;
