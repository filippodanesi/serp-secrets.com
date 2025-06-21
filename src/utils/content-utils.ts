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

// Environment variables
const ENABLE_WORDPRESS_ENV = import.meta.env.ENABLE_WORDPRESS !== 'false';

// Cache for unified posts to avoid repeated API calls within the same request
let unifiedPostsCache: {
  data: UnifiedPost[];
  timestamp: number;
} | null = null;

const CACHE_TTL = 2 * 60 * 1000; // 2 minutes for request-level cache

/**
 * Decode HTML entities in text
 */
export function decodeHtmlEntities(text: string): string {
  if (typeof text !== 'string') return '';
  
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '=',
    '&nbsp;': ' ',
    '&ndash;': '–',
    '&mdash;': '—',
    '&hellip;': '…',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
  };

  return text.replace(/&[#\w]+;/g, (entity) => {
    return entities[entity] || entity;
  });
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
 * Get all posts from both Astro content collections and WordPress with smart caching
 */
export async function getAllUnifiedPosts(): Promise<UnifiedPost[]> {
  // Check request-level cache first
  if (unifiedPostsCache && (Date.now() - unifiedPostsCache.timestamp) < CACHE_TTL) {
    console.log('📦 Using request-level cache for unified posts');
    return unifiedPostsCache.data;
  }

  console.log('🔄 Building unified posts list...');
  const posts: UnifiedPost[] = [];

  // Get Astro posts
  try {
    const astroPosts = await getCollection('blog');
    posts.push(...astroPosts);
    console.log(`✅ Loaded ${astroPosts.length} Astro posts`);
  } catch (error) {
    console.error('Error fetching Astro posts:', error);
  }

  // Get WordPress posts if available and enabled
  try {
    if (ENABLE_WORDPRESS && await isWordPressAvailable()) {
      console.log('🔄 Fetching WordPress data...');
      
      // Fetch all data in parallel for better performance
      const [wpPosts, wpCategories, wpTags] = await Promise.all([
        wordpressAPI.getAllPosts(),
        wordpressAPI.getCategories(),
        wordpressAPI.getTags()
      ]);

      const transformedPosts = wpPosts.map(post => 
        transformWordPressPost(post, wpCategories, wpTags)
      );

      posts.push(...transformedPosts);
      console.log(`✅ Loaded ${transformedPosts.length} WordPress posts`);
    }
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
  }

  // Sort all posts by date using a unified sorting function
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.data.publishDate);
    const dateB = new Date(b.data.publishDate);
    return dateB.getTime() - dateA.getTime();
  });

  // Cache the result for this request
  unifiedPostsCache = {
    data: sortedPosts,
    timestamp: Date.now()
  };

  console.log(`✅ Unified posts ready: ${sortedPosts.length} total`);
  return sortedPosts;
}

/**
 * Get a single post by slug from either source with optimized lookup
 */
export async function getUnifiedPostBySlug(slug: string): Promise<UnifiedPost | null> {
  console.log(`🔍 Looking for post: ${slug}`);
  
  // First check Astro content collections (faster, local)
  try {
    const astroPosts = await getCollection('blog');
    const astroPost = astroPosts.find(post => post.slug === slug);
    if (astroPost) {
      console.log(`✅ Found Astro post: ${slug}`);
      return astroPost;
    }
  } catch (error) {
    console.error('Error searching Astro posts:', error);
  }

  // Then check WordPress if enabled (use direct API call for single post)
  try {
    if (ENABLE_WORDPRESS && await isWordPressAvailable()) {
      const wpPost = await wordpressAPI.getPostBySlug(slug);
      if (wpPost) {
        console.log(`✅ Found WordPress post: ${slug}`);
        
        // Fetch categories and tags in parallel for this single post
        const [wpCategories, wpTags] = await Promise.all([
          wordpressAPI.getCategories(),
          wordpressAPI.getTags()
        ]);
        
        return transformWordPressPost(wpPost, wpCategories, wpTags);
      }
    }
  } catch (error) {
    console.error('Error searching WordPress posts:', error);
  }

  console.log(`❌ Post not found: ${slug}`);
  return null;
}

/**
 * Get all posts for pagination with smart caching
 */
export async function getUnifiedPostsForPagination(page: number = 1, pageSize: number = 10) {
  const allPosts = await getAllUnifiedPosts(); // Uses cache
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
 * Get posts by tag (works with both sources) with caching
 */
export async function getUnifiedPostsByTag(tagSlug: string) {
  const allPosts = await getAllUnifiedPosts(); // Uses cache
  
  return allPosts.filter(post => {
    const tags = post.data.tags || [];
    return tags.some(tag => 
      tag && tag.toLowerCase().replace(/\s+/g, '-') === tagSlug
    );
  });
}

/**
 * Get all unique tags from both sources with caching
 */
export async function getAllUnifiedTags() {
  const allPosts = await getAllUnifiedPosts(); // Uses cache
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
 * Get posts for search (both sources) with caching
 */
export async function getPostsForSearch() {
  const allPosts = await getAllUnifiedPosts(); // Uses cache
  
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
 * Helper to get next/previous posts for navigation with caching
 */
export async function getAdjacentPosts(currentSlug: string) {
  const allPosts = await getAllUnifiedPosts(); // Uses cache
  const currentIndex = allPosts.findIndex(post => post.slug === currentSlug);
  
  if (currentIndex === -1) {
    return { nextPost: null, prevPost: null };
  }

  return {
    nextPost: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    prevPost: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  };
}

/**
 * Clear request-level cache (useful for development)
 */
export function clearUnifiedPostsCache() {
  unifiedPostsCache = null;
  console.log('🗑️ Request-level cache cleared');
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