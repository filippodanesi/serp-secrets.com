import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export async function GET() {
  const posts = getAllPosts();

  const searchData = posts.map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    tags: post.frontmatter.tags || [],
    date: post.frontmatter.date,
  }));

  return NextResponse.json(searchData);
}
