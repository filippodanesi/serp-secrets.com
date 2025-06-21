import { getCollection, type CollectionEntry } from 'astro:content';
import {
  transformWordPressPost,
  isWordPressAvailable,
  type WordPressPostFormatted,
  wordpressAPI
} from '../lib/wordpress';

// Configuration

// Try different environment access methods for ENABLE_WORDPRESS
const getEnableWordPress = () => {
  // Try import.meta.env first (Vite/Astro style)
  if (typeof globalThis !== 'undefined' && (globalThis as any).import?.meta?.env?.ENABLE_WORDPRESS) {
    return (globalThis as any).import.meta.env.ENABLE_WORDPRESS === 'true';
  }
  // Fall back to process.env (Node.js style)
  if (process.env.ENABLE_WORDPRESS) {
    return process.env.ENABLE_WORDPRESS === 'true';
  }
  // Local development fallback - enable if WordPress URL contains local
  return true; // Default to enabled for local development
};

const ENABLE_WORDPRESS = getEnableWordPress();
// See README-WORDPRESS.md for setup instructions

/**
 * Decode HTML entities in text
 */
export function decodeHtmlEntities(text: string): string {
  const entities = {
    '&#8217;': "'",
    '&#8216;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8211;': '–',
    '&#8212;': '—',
    '&#8230;': '…',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'",
    '&#038;': '&'
  };
  
  let decoded = text;
  for (const [entity, replacement] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), replacement);
  }
  
  return decoded;
}

// Unified post type that combines both Astro and WordPress posts
export type UnifiedPost = CollectionEntry<'blog'> | WordPressPostFormatted;

// Type guard to check if a post is from WordPress
export function isWordPressPost(post: UnifiedPost): post is WordPressPostFormatted {
  return 'wordpress' in post.data;
}

// Type guard to check if a post is from Astro content collection
export function isAstroPost(post: UnifiedPost): post is CollectionEntry<'blog'> {
  return !('wordpress' in post.data);
}

/**
 * Get all posts from both Astro content collections and WordPress
 */
export async function getAllUnifiedPosts(): Promise<UnifiedPost[]> {
  const posts: UnifiedPost[] = [];

  // Get Astro posts
  try {
    const astroPosts = await getCollection('blog');
    posts.push(...astroPosts);
  } catch (error) {
    console.error('Error fetching Astro posts:', error);
  }

  // Get WordPress posts if available and enabled
  try {
    if (ENABLE_WORDPRESS && await isWordPressAvailable()) {
      const wpPosts = await wordpressAPI.getAllPosts();
      const wpCategories = await wordpressAPI.getCategories();
      const wpTags = await wordpressAPI.getTags();

      const transformedPosts = wpPosts.map(post => 
        transformWordPressPost(post, wpCategories, wpTags)
      );

      posts.push(...transformedPosts);
    }
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
  }

  // Sort all posts by date using a unified sorting function
  return posts.sort((a, b) => {
    const dateA = new Date(a.data.publishDate);
    const dateB = new Date(b.data.publishDate);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Get a single post by slug from either source
 */
export async function getUnifiedPostBySlug(slug: string): Promise<UnifiedPost | null> {
  // First check Astro content collections
  try {
    const astroPosts = await getCollection('blog');
    const astroPost = astroPosts.find(post => post.slug === slug);
    if (astroPost) {
      return astroPost;
    }
  } catch (error) {
    console.error('Error searching Astro posts:', error);
  }

  // Then check WordPress if enabled
  try {
    if (ENABLE_WORDPRESS && await isWordPressAvailable()) {
      const wpPost = await wordpressAPI.getPostBySlug(slug);
      if (wpPost) {
        const wpCategories = await wordpressAPI.getCategories();
        const wpTags = await wordpressAPI.getTags();
        return transformWordPressPost(wpPost, wpCategories, wpTags);
      }
    }
  } catch (error) {
    console.error('Error searching WordPress posts:', error);
  }

  return null;
}

/**
 * Get all posts for pagination
 */
export async function getUnifiedPostsForPagination(page: number = 1, pageSize: number = 10) {
  const allPosts = await getAllUnifiedPosts();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    posts: allPosts.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    }
  };
}

/**
 * Get posts by tag (works with both sources)
 */
export async function getUnifiedPostsByTag(tagSlug: string) {
  const allPosts = await getAllUnifiedPosts();
  
  return allPosts.filter(post => {
    const tags = post.data.tags || [];
    return tags.some(tag => 
      tag && tag.toLowerCase().replace(/\s+/g, '-') === tagSlug
    );
  });
}

/**
 * Get all unique tags from both sources
 */
export async function getAllUnifiedTags() {
  const allPosts = await getAllUnifiedPosts();
  const tagMap = new Map<string, { name: string; slug: string; count: number }>();

  allPosts.forEach(post => {
    const tags = post.data.tags || [];
    tags.forEach(tag => {
      if (tag) {
        const slug = tag.toLowerCase().replace(/\s+/g, '-');
        const existing = tagMap.get(slug);
        
        if (existing) {
          existing.count++;
        } else {
          tagMap.set(slug, {
            name: tag,
            slug,
            count: 1
          });
        }
      }
    });
  });

  return Array.from(tagMap.values()).sort((a, b) => b.count - a.count);
}

/**
 * Get posts for search (both sources)
 */
export async function getPostsForSearch() {
  const allPosts = await getAllUnifiedPosts();
  
  return allPosts.map(post => ({
    title: post.data.title,
    url: `/blog/${post.slug}`,
    description: post.data.excerpt || '',
    body: post.body || '',
    source: isWordPressPost(post) ? 'wordpress' : 'astro'
  }));
}

/**
 * Helper to get the source of a post
 */
export function getPostSource(post: UnifiedPost): 'wordpress' | 'astro' {
  return isWordPressPost(post) ? 'wordpress' : 'astro';
}

/**
 * Helper to get next/previous posts for navigation
 */
export async function getAdjacentPosts(currentSlug: string) {
  const allPosts = await getAllUnifiedPosts();
  const currentIndex = allPosts.findIndex(post => post.slug === currentSlug);
  
  if (currentIndex === -1) {
    return { nextPost: null, prevPost: null };
  }

  return {
    nextPost: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    prevPost: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  };
}



// Note: Categories are not used in this system, only tags are used
// export async function getAllCategories() {
//   // This function is disabled as the schema only supports tags
// }

// Note: This function is disabled as categories are not supported in the current schema
// The system uses tags instead of categories, and getUnifiedPostsByTag should be used
// export async function getPostsByCategory(categorySlug: string, page?: number, limit?: number) {
//   // This function is disabled - use getUnifiedPostsByTag instead
// } 