import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, isValidElement } from 'react';
import { slugify } from '@/lib/posts';
import imageCredits from '@/lib/image-credits.json';

// Maintained by scripts/fetch-lummi.js: public path → required attribution.
const credits = imageCredits as Record<
  string,
  { author: string; authorUrl: string; sourceUrl: string; source: string }
>;

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
  p: ({ children }) => {
    // A credited image renders as <figure>, which cannot live inside <p>:
    // unwrap paragraphs whose only content is an image.
    const items = (Array.isArray(children) ? children : [children]).filter(
      (c) => !(typeof c === 'string' && c.trim() === ''),
    );
    if (
      items.length === 1 &&
      isValidElement(items[0]) &&
      (items[0].props as { src?: unknown }).src
    ) {
      return <>{children}</>;
    }
    return <p className="mdx-p">{children}</p>;
  },
  ul: ({ children }) => <ul className="mdx-ul">{children}</ul>,
  ol: ({ children }) => <ol className="mdx-ol">{children}</ol>,
  li: ({ children }) => <li className="mdx-li">{children}</li>,
  blockquote: ({ children }) => <blockquote className="mdx-blockquote">{children}</blockquote>,
  code: ({ children, className, style, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return <code className="mdx-code-inline">{children}</code>;
    }
    return <code className={`mdx-code-block ${className || ''}`} style={style} {...props}>{children}</code>;
  },
  pre: ({ children, style, ...props }) => (
    <pre className="mdx-pre" style={style} {...props}>{children}</pre>
  ),
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
  img: ({ src, alt }) => {
    if (!src) return null;
    const credit = src.startsWith('/') ? credits[src] : undefined;
    const picture = src.startsWith('/') ? (
      <Image
        src={src}
        alt={alt || ''}
        width={800}
        height={450}
        className={credit ? 'mdx-figure-img' : 'mdx-img'}
        sizes="(max-width: 768px) 100vw, 700px"
        style={{ width: '100%', height: 'auto' }}
      />
    ) : (
      <img src={src} alt={alt || ''} className="mdx-img" loading="lazy" />
    );
    if (!credit) return picture;
    // Attribution is required by the image license (lib/image-credits.json).
    return (
      <figure className="mdx-figure">
        {picture}
        <figcaption className="mdx-figcaption">
          Photo by{' '}
          <a href={credit.authorUrl} target="_blank" rel="noopener noreferrer">
            {credit.author}
          </a>{' '}
          on{' '}
          <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer">
            {credit.source}
          </a>
        </figcaption>
      </figure>
    );
  },
  Figure: ({ image, alt, caption }: { image: string; alt: string; caption?: string }) => (
    <figure className="mdx-figure">
      {image.startsWith('/') ? (
        <Image
          src={image}
          alt={alt}
          width={800}
          height={450}
          className="mdx-figure-img"
          sizes="(max-width: 768px) 100vw, 700px"
          style={{ width: '100%', height: 'auto' }}
        />
      ) : (
        <img src={image} alt={alt} className="mdx-figure-img" loading="lazy" />
      )}
      {caption && <figcaption className="mdx-figcaption">{caption}</figcaption>}
    </figure>
  ),
};

export default components;
