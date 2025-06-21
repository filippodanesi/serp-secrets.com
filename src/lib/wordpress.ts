interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'draft' | 'private';
  type: string;
  link: string;
  title: {
    rendered: string;
    protected: boolean;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any;
  categories: number[];
  tags: number[];
  _links: any;
  _embedded?: any;
  // Custom fields if using ACF or similar
  acf?: {
    seo_title?: string;
    seo_description?: string;
    featured_image?: {
      url: string;
      alt: string;
    };
  };
  // Yoast SEO data (requires Yoast SEO REST API plugin)
  yoast_head_json?: {
    title?: string;
    description?: string;
    og_title?: string;
    og_description?: string;
    og_image?: Array<{
      url: string;
      width: number;
      height: number;
    }>;
    twitter_card?: string;
    twitter_title?: string;
    twitter_description?: string;
    twitter_image?: string;
    canonical?: string;
    robots?: {
      index?: string;
      follow?: string;
      'max-snippet'?: string;
      'max-image-preview'?: string;
      'max-video-preview'?: string;
    };
  };
}

interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  source_url: string;
  alt_text: string;
}

// Configuration - try different environment access methods
const getWordPressUrl = () => {
  // Try import.meta.env first (Vite/Astro style)
  if (typeof globalThis !== 'undefined' && (globalThis as any).import?.meta?.env?.WORDPRESS_API_URL) {
    return (globalThis as any).import.meta.env.WORDPRESS_API_URL;
  }
  // Fall back to process.env (Node.js style)
  if (process.env.WORDPRESS_API_URL) {
    return process.env.WORDPRESS_API_URL;
  }
  // Local development fallback
  return 'http://serp-secrets.local/wp-json/wp/v2';
};

// Cache configuration
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class WordPressCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default

  set<T>(key: string, data: T, ttl = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
const wpCache = new WordPressCache();

// Cleanup expired cache entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => wpCache.cleanup(), 10 * 60 * 1000);
}

const WORDPRESS_API_URL = getWordPressUrl();
const WORDPRESS_POSTS_PER_PAGE = 100; // Max allowed by WordPress

export class WordPressAPI {
  private baseUrl: string;
  
  constructor(baseUrl: string = WORDPRESS_API_URL) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  /**
   * Fetch all posts from WordPress with caching
   */
  async getAllPosts(): Promise<WordPressPost[]> {
    const cacheKey = 'all_posts';
    const cached = wpCache.get<WordPressPost[]>(cacheKey);
    
    if (cached) {
      console.log('📦 Using cached WordPress posts');
      return cached;
    }

    console.log('🔄 Fetching WordPress posts from API...');
    const allPosts: WordPressPost[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await fetch(
          `${this.baseUrl}/posts?page=${page}&per_page=${WORDPRESS_POSTS_PER_PAGE}&status=publish&_embed=1&yoast_head_json=1`,
          {
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }
        );
        
        if (!response.ok) {
          if (response.status === 404) {
            console.warn('WordPress API not found. Skipping WordPress content.');
            return [];
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const posts: WordPressPost[] = await response.json();
        
        if (posts.length === 0) {
          hasMore = false;
        } else {
          allPosts.push(...posts);
          page++;
          hasMore = posts.length === WORDPRESS_POSTS_PER_PAGE;
        }
      } catch (error) {
        console.error(`Error fetching WordPress posts (page ${page}):`, error);
        // Return what we have so far instead of failing completely
        break;
      }
    }

    const publishedPosts = allPosts.filter(post => post.status === 'publish');
    
    // Cache for 5 minutes
    wpCache.set(cacheKey, publishedPosts, 5 * 60 * 1000);
    console.log(`✅ Cached ${publishedPosts.length} WordPress posts`);
    
    return publishedPosts;
  }

  /**
   * Fetch a single post by slug with caching
   */
  async getPostBySlug(slug: string): Promise<WordPressPost | null> {
    const cacheKey = `post_${slug}`;
    const cached = wpCache.get<WordPressPost | null>(cacheKey);
    
    if (cached !== null) {
      console.log(`📦 Using cached post: ${slug}`);
      return cached;
    }

    console.log(`🔄 Fetching post from API: ${slug}`);
    try {
      const response = await fetch(
        `${this.baseUrl}/posts?slug=${slug}&status=publish&_embed=1&yoast_head_json=1`,
        {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        }
      );
      
      if (!response.ok) {
        wpCache.set(cacheKey, null, 2 * 60 * 1000); // Cache null for 2 minutes
        return null;
      }

      const posts: WordPressPost[] = await response.json();
      const post = posts.length > 0 ? posts[0] : null;
      
      // Cache for 10 minutes (longer for individual posts)
      wpCache.set(cacheKey, post, 10 * 60 * 1000);
      console.log(`✅ Cached post: ${slug}`);
      
      return post;
    } catch (error) {
      console.error(`Error fetching WordPress post with slug ${slug}:`, error);
      wpCache.set(cacheKey, null, 1 * 60 * 1000); // Cache error for 1 minute
      return null;
    }
  }

  /**
   * Fetch categories with caching
   */
  async getCategories(): Promise<WordPressCategory[]> {
    const cacheKey = 'categories';
    const cached = wpCache.get<WordPressCategory[]>(cacheKey);
    
    if (cached) {
      console.log('📦 Using cached WordPress categories');
      return cached;
    }

    console.log('🔄 Fetching WordPress categories from API...');
    try {
      const response = await fetch(`${this.baseUrl}/categories?per_page=100`, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        console.warn(`WordPress categories endpoint returned ${response.status}`);
        return [];
      }

      const text = await response.text();
      if (!text.trim()) {
        console.warn('WordPress categories endpoint returned empty response');
        return [];
      }

      try {
        const categories = JSON.parse(text);
        // Cache for 15 minutes (categories change less frequently)
        wpCache.set(cacheKey, categories, 15 * 60 * 1000);
        console.log(`✅ Cached ${categories.length} WordPress categories`);
        return categories;
      } catch (parseError) {
        console.error('Error parsing WordPress categories JSON:', parseError);
        console.log('Response text:', text.substring(0, 200));
        return [];
      }
    } catch (error) {
      console.error('Error fetching WordPress categories:', error);
      return [];
    }
  }

  /**
   * Fetch tags with caching
   */
  async getTags(): Promise<WordPressTag[]> {
    const cacheKey = 'tags';
    const cached = wpCache.get<WordPressTag[]>(cacheKey);
    
    if (cached) {
      console.log('📦 Using cached WordPress tags');
      return cached;
    }

    console.log('🔄 Fetching WordPress tags from API...');
    try {
      const response = await fetch(`${this.baseUrl}/tags?per_page=100`, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        console.warn(`WordPress tags endpoint returned ${response.status}`);
        return [];
      }

      const text = await response.text();
      if (!text.trim()) {
        console.warn('WordPress tags endpoint returned empty response');
        return [];
      }

      try {
        const tags = JSON.parse(text);
        // Cache for 15 minutes (tags change less frequently)
        wpCache.set(cacheKey, tags, 15 * 60 * 1000);
        console.log(`✅ Cached ${tags.length} WordPress tags`);
        return tags;
      } catch (parseError) {
        console.error('Error parsing WordPress tags JSON:', parseError);
        console.log('Response text:', text.substring(0, 200));
        return [];
      }
    } catch (error) {
      console.error('Error fetching WordPress tags:', error);
      return [];
    }
  }

  /**
   * Fetch media by ID
   */
  async getMediaById(id: number): Promise<WordPressMedia | null> {
    try {
      const response = await fetch(`${this.baseUrl}/media/${id}`);
      
      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching WordPress media with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Clear all cache (useful for development or manual refresh)
   */
  clearCache(): void {
    wpCache.clear();
    console.log('🗑️ WordPress cache cleared');
  }
}

/**
 * Transform WordPress post to Astro-compatible format
 */
export function transformWordPressPost(
  wpPost: WordPressPost,
  categories: WordPressCategory[] = [],
  tags: WordPressTag[] = []
) {
  // Convert HTML content to markdown-like format for better compatibility
  const cleanContent = wpPost.content.rendered
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .trim();

  // Extract excerpt
  const excerpt = wpPost.excerpt.rendered
    ? wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').trim()
    : wpPost.yoast_head_json?.description || wpPost.acf?.seo_description || '';

  // Map categories and tags
  const postCategories = wpPost.categories
    .map(catId => categories.find(cat => cat.id === catId)?.name)
    .filter(Boolean);
  
  const postTags = wpPost.tags
    .map(tagId => tags.find(tag => tag.id === tagId)?.name)
    .filter(Boolean);

  // Combine categories and tags for the tags array (Astro format)
  const allTags = [...postCategories, ...postTags];

  // Get featured image from WordPress (from _embedded data or featured_media)
  let featuredImage;
  if (wpPost._embedded?.['wp:featuredmedia']?.[0]) {
    const media = wpPost._embedded['wp:featuredmedia'][0];
    featuredImage = {
      src: media.source_url,
      alt: media.alt_text || wpPost.title.rendered
    };
  } else if (wpPost.featured_media && wpPost.featured_media > 0) {
    // Log that we have a featured_media ID but no embedded data
    console.log(`Post ${wpPost.slug} has featured_media ID ${wpPost.featured_media} but no embedded data. Consider using &_embed=1 in API calls.`);
  }

  // Get SEO data with priority: Yoast > ACF > Fallback
  const seoTitle = wpPost.yoast_head_json?.title || wpPost.acf?.seo_title || wpPost.title.rendered;
  const seoDescription = wpPost.yoast_head_json?.description || wpPost.acf?.seo_description || excerpt;
  const seoImage = wpPost.yoast_head_json?.og_image?.[0]?.url || wpPost.acf?.featured_image?.url || featuredImage?.src;

  return {
    slug: wpPost.slug,
    data: {
      title: wpPost.title.rendered,
      excerpt: excerpt,
      publishDate: new Date(wpPost.date),
      updatedDate: wpPost.modified !== wpPost.date ? new Date(wpPost.modified) : undefined,
      tags: allTags,
      image: featuredImage, // Featured image for display in post
      seo: {
        title: seoTitle,
        description: seoDescription,
        image: seoImage ? {
          src: seoImage,
          alt: wpPost.yoast_head_json?.og_image?.[0] ? 'SEO optimized image' : wpPost.acf?.featured_image?.alt || featuredImage?.alt || wpPost.title.rendered
        } : undefined
      },
      // WordPress-specific data
      wordpress: {
        id: wpPost.id,
        link: wpPost.link,
        author: wpPost.author,
        featured_media: wpPost.featured_media,
        categories: wpPost.categories,
        wpTags: wpPost.tags,
        format: wpPost.format
      }
    },
    body: cleanContent,
    // Add render method to maintain compatibility with Astro content collections
    render: async () => ({
      Content: () => ({ 
        $$render: () => cleanContent 
      })
    })
  };
}

/**
 * Check if WordPress is available
 */
export async function isWordPressAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/posts?per_page=1`);
    return response.ok;
  } catch {
    return false;
  }
}

// Export singleton instance
export const wordpressAPI = new WordPressAPI();

// Types for compatibility
export type WordPressPostFormatted = ReturnType<typeof transformWordPressPost>;
export type { WordPressPost, WordPressCategory, WordPressTag, WordPressMedia };

// GraphQL API functions
export async function fetchGraphQL(query: string, variables: Record<string, any> = {}) {
  const GRAPHQL_URL = (globalThis as any).import?.meta?.env?.WORDPRESS_GRAPHQL_URL || process.env.WORDPRESS_GRAPHQL_URL;
  
  if (!GRAPHQL_URL) {
    console.warn('WordPress GraphQL URL not configured, skipping GraphQL fetch');
    return null;
  }

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching GraphQL data:', error);
    return null;
  }
}

export async function getPostsGraphQL(page = 1, perPage = 10) {
  const query = `
    query GetPosts($first: Int, $after: String) {
      posts(first: $first, after: $after, where: {status: PUBLISH}) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
          id
          databaseId
          title
          excerpt
          content
          slug
          date
          modified
          author {
            node {
              name
              slug
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
          tags {
            nodes {
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    first: perPage,
    after: page > 1 ? btoa(`arrayconnection:${(page - 1) * perPage - 1}`) : null,
  };

  const data = await fetchGraphQL(query, variables);
  
  if (!data?.posts) return { posts: [], hasNextPage: false };

  return {
    posts: data.posts.nodes.map(transformGraphQLPost),
    hasNextPage: data.posts.pageInfo.hasNextPage,
    totalPages: Math.ceil(data.posts.nodes.length / perPage), // Approximation
  };
}

export async function getPostBySlugGraphQL(slug: string) {
  const query = `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        databaseId
        title
        excerpt
        content
        slug
        date
        modified
        author {
          node {
            name
            slug
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query, { slug });
  
  if (!data?.post) return null;

  return transformGraphQLPost(data.post);
}

export async function getCategoriesGraphQL() {
  const query = `
    query GetCategories {
      categories(first: 100) {
        nodes {
          id
          databaseId
          name
          slug
          description
          count
        }
      }
    }
  `;

  const data = await fetchGraphQL(query);
  
  if (!data?.categories) return [];

  return data.categories.nodes.map((category: any) => ({
    id: category.databaseId,
    name: category.name,
    slug: category.slug,
    description: category.description,
    count: category.count,
  }));
}

export async function getPostsByCategoryGraphQL(categorySlug: string, page = 1, perPage = 10) {
  const query = `
    query GetPostsByCategory($categorySlug: String!, $first: Int, $after: String) {
      posts(
        first: $first, 
        after: $after,
        where: {
          status: PUBLISH,
          categoryName: $categorySlug
        }
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
          id
          databaseId
          title
          excerpt
          content
          slug
          date
          modified
          author {
            node {
              name
              slug
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
          tags {
            nodes {
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    categorySlug,
    first: perPage,
    after: page > 1 ? btoa(`arrayconnection:${(page - 1) * perPage - 1}`) : null,
  };

  const data = await fetchGraphQL(query, variables);
  
  if (!data?.posts) return { posts: [], hasNextPage: false };

  return {
    posts: data.posts.nodes.map(transformGraphQLPost),
    hasNextPage: data.posts.pageInfo.hasNextPage,
  };
}

function transformGraphQLPost(post: any): WordPressPost {
  return {
    id: post.databaseId,
    date: post.date,
    date_gmt: post.date,
    guid: { rendered: '' },
    modified: post.modified,
    modified_gmt: post.modified,
    slug: post.slug,
    status: 'publish',
    type: 'post',
    link: `/blog/${post.slug}`,
    title: { rendered: post.title, protected: false },
    content: { rendered: post.content, protected: false },
    excerpt: { rendered: post.excerpt, protected: false },
    author: 1,
    featured_media: 0,
    comment_status: 'open',
    ping_status: 'open',
    sticky: false,
    template: '',
    format: 'standard',
    meta: { footnotes: '' },
    categories: post.categories?.nodes?.map((cat: any) => cat.slug) || [],
    tags: post.tags?.nodes?.map((tag: any) => tag.slug) || [],
    _links: {},
    _embedded: {
      author: [{
        name: post.author?.node?.name || 'Unknown Author',
        slug: post.author?.node?.slug || 'unknown',
      }],
      'wp:featuredmedia': post.featuredImage?.node ? [{
        source_url: post.featuredImage.node.sourceUrl,
        alt_text: post.featuredImage.node.altText || '',
        media_details: {
          width: post.featuredImage.node.mediaDetails?.width || 1200,
          height: post.featuredImage.node.mediaDetails?.height || 630,
        },
      }] : [],
    },
  };
} 