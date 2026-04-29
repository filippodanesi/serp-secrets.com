import { getPostBySlug } from '@/lib/posts';
import { siteUrl } from '@/lib/config';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const { getAllPosts } = await import('@/lib/posts');
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new Response('Not found', { status: 404 });
  }

  const { frontmatter, content } = post;
  const url = `${siteUrl}/blog/${slug}/`;
  const isoDate =
    frontmatter.date instanceof Date
      ? frontmatter.date.toISOString().slice(0, 10)
      : new Date(frontmatter.date).toISOString().slice(0, 10);

  const header = [
    '---',
    `title: ${JSON.stringify(frontmatter.title)}`,
    `date: ${isoDate}`,
    `description: ${JSON.stringify(frontmatter.description)}`,
    frontmatter.tags?.length ? `tags: [${frontmatter.tags.map((t) => JSON.stringify(t)).join(', ')}]` : null,
    `canonical: ${url}`,
    '---',
    '',
  ]
    .filter((line): line is string => line !== null)
    .join('\n');

  const body = `${header}# ${frontmatter.title}\n\n${content.trim()}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Canonical-URL': url,
    },
  });
}
