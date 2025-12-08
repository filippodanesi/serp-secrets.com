import { getAllPosts } from '@/lib/posts';

const siteUrl = 'https://www.serp-secrets.com';

export async function GET() {
  const posts = getAllPosts();

  const rssItems = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.frontmatter.date).toUTCString();

      return `
    <item>
      <title><![CDATA[${post.frontmatter.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.frontmatter.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>hello@serp-secrets.com (Filippo Danesi)</author>
      ${post.frontmatter.tags?.map((tag) => `<category>${tag}</category>`).join('\n      ') || ''}
    </item>`;
    })
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>SERP Secrets</title>
    <link>${siteUrl}/blog</link>
    <description>Thoughts on SEO, AI, content marketing, and the future of search.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>hello@serp-secrets.com (Filippo Danesi)</managingEditor>
    <webMaster>hello@serp-secrets.com (Filippo Danesi)</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} SERP Secrets</copyright>
    <image>
      <url>${siteUrl}/logo.svg</url>
      <title>SERP Secrets</title>
      <link>${siteUrl}/blog</link>
    </image>${rssItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
