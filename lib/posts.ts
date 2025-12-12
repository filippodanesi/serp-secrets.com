import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  image?: string;
  draft?: boolean;
  summary?: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

export interface PostMeta {
  slug: string;
  frontmatter: PostFrontmatter;
  readingTime: string;
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx'));
}

export function getPostBySlug(slug: string): Post | null {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug: realSlug,
    frontmatter: data as PostFrontmatter,
    content,
    readingTime: stats.text,
  };
}

export function getAllPosts(): PostMeta[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug.replace(/\.mdx$/, ''));
      if (!post) return null;
      return {
        slug: post.slug,
        frontmatter: post.frontmatter,
        readingTime: post.readingTime,
      };
    })
    .filter((post): post is PostMeta => post !== null)
    .filter((post) => !post.frontmatter.draft)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date);
      const dateB = new Date(b.frontmatter.date);
      return dateB.getTime() - dateA.getTime();
    });

  return posts;
}

// Category definitions matching WordPress structure
export interface Category {
  slug: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  {
    slug: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    description: 'Exploring AI applications in SEO and content marketing.',
  },
  {
    slug: 'seo-news',
    name: 'SEO News',
    description: 'Latest updates and news from the SEO industry.',
  },
  {
    slug: 'seo-strategies',
    name: 'SEO Strategies',
    description: 'Actionable SEO strategies and best practices.',
  },
  {
    slug: 'technical-seo',
    name: 'Technical SEO',
    description: 'Technical aspects of search engine optimization.',
  },
];

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | null {
  return categories.find((cat) => cat.slug === slug) || null;
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagsSet = new Set<string>();

  posts.forEach((post) => {
    post.frontmatter.tags?.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter((post) =>
    post.frontmatter.tags?.some(
      (t) => t.toLowerCase() === tag.toLowerCase()
    )
  );
}

export function getPostsByCategory(categorySlug: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter((post) =>
    post.frontmatter.tags?.some(
      (tag) => tag.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase()
    )
  );
}

export function getCategoriesWithPostCount(): (Category & { postCount: number })[] {
  return categories.map((category) => ({
    ...category,
    postCount: getPostsByCategory(category.slug).length,
  }));
}

// Table of Contents utilities
export interface TOCHeading {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function extractHeadings(content: string): TOCHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TOCHeading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);

    headings.push({ id, text, level });
  }

  return headings;
}
