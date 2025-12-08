import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

const components: MDXComponents = {
  h1: ({ children }) => <h1 className="mdx-h1">{children}</h1>,
  h2: ({ children }) => <h2 className="mdx-h2">{children}</h2>,
  h3: ({ children }) => <h3 className="mdx-h3">{children}</h3>,
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
    const isExternal = href?.startsWith('http');
    if (isExternal) {
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
    }
    return (
      <Link href={href || '#'} className="mdx-link">
        {children}
      </Link>
    );
  },
  hr: () => <hr className="mdx-hr" />,
  table: ({ children }) => (
    <div className="mdx-table-wrapper">
      <table className="mdx-table">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="mdx-th">{children}</th>,
  td: ({ children }) => <td className="mdx-td">{children}</td>,
  img: ({ src, alt }) => (
    <figure className="mdx-figure">
      <img src={src} alt={alt || ''} className="mdx-img" />
      {alt && <figcaption className="mdx-figcaption">{alt}</figcaption>}
    </figure>
  ),
};

export default components;
