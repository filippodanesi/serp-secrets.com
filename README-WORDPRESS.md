# WordPress Headless Integration with Astro

This guide explains how to integrate a headless WordPress CMS with your Astro site, supporting both **REST API** and **GraphQL** approaches.

## Table of Contents
- [Overview](#overview)
- [WordPress Setup](#wordpress-setup)
- [GraphQL Setup (Recommended)](#graphql-setup-recommended)
- [REST API Setup](#rest-api-setup)
- [Environment Configuration](#environment-configuration)
- [Usage Examples](#usage-examples)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

This implementation supports two approaches for fetching WordPress content:

1. **GraphQL** (Recommended) - More powerful, flexible queries
2. **REST API** - WordPress native, simpler setup

Both approaches allow you to:
- Mix WordPress content with Astro content collections
- Maintain full static site generation
- Handle categories, tags, featured images
- Support pagination and search
- Graceful fallbacks when WordPress is unavailable

## WordPress Setup

### Basic WordPress Configuration

1. **Install WordPress** on your hosting provider or locally
2. **Configure URLs** in WordPress Admin → Settings → General:
   - WordPress Address (URL): `https://your-domain.com`
   - Site Address (URL): `https://your-domain.com`

### Content Structure

Create sample content in WordPress:
- **Posts**: Add blog posts with categories and featured images
- **Categories**: Organize content by topics
- **Media**: Upload featured images for posts

## GraphQL Setup (Recommended)

GraphQL provides more efficient queries and better performance than REST API.

### 1. Install WPGraphQL Plugin

In your WordPress admin:
1. Go to **Plugins → Add New**
2. Search for **"WPGraphQL"**
3. **Install and Activate** the plugin

### 2. Verify GraphQL Endpoint

Test that GraphQL is working:
```bash
curl -X POST https://your-domain.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ generalSettings { title } }"}'
```

### 3. Environment Configuration

Add to your `.env.local`:
```env
WORDPRESS_GRAPHQL_URL=https://your-domain.com/graphql
```

### 4. Usage in Astro

```typescript
// Example GraphQL query
const query = `
  query GetPosts {
    posts(first: 10) {
      nodes {
        id
        title
        excerpt
        slug
        date
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;
```

## REST API Setup

The REST API is WordPress's native solution and requires no additional plugins.

### 1. Environment Configuration

Add to your `.env.local`:
```env
WORDPRESS_API_URL=https://your-domain.com/wp-json/wp/v2
```

### 2. Test REST API

```bash
curl https://your-domain.com/wp-json/wp/v2/posts?per_page=5
```

## Environment Configuration

### Local Development (with Local by Flywheel)

```env
# For Local by Flywheel - use HTTP
WORDPRESS_GRAPHQL_URL=http://your-site.local/graphql
WORDPRESS_API_URL=http://your-site.local/wp-json/wp/v2
```

### Production

```env
# For production - use HTTPS
WORDPRESS_GRAPHQL_URL=https://your-domain.com/graphql
WORDPRESS_API_URL=https://your-domain.com/wp-json/wp/v2
```

## Usage Examples

### Switch Between GraphQL and REST

In `src/utils/content-utils.ts`:
```typescript
const USE_GRAPHQL = true; // Set to false for REST API
```

### Fetch Posts with GraphQL

```typescript
import { getPostsGraphQL } from '../lib/wordpress';

const { posts, hasNextPage } = await getPostsGraphQL(1, 10);
```

### Fetch Posts with REST API

```typescript
import { getWordPressPosts } from '../lib/wordpress';

const { posts, hasNextPage } = await getWordPressPosts(1, 10);
```

## Deployment

### Vercel/Netlify

1. **Add environment variables** in your hosting dashboard
2. **Set build command**: `npm run build`
3. **Set output directory**: `dist`

### Environment Variables for Production

```env
WORDPRESS_GRAPHQL_URL=https://your-production-domain.com/graphql
WORDPRESS_API_URL=https://your-production-domain.com/wp-json/wp/v2
```

## Troubleshooting

### GraphQL Issues

**Problem**: GraphQL endpoint returns 404
**Solution**: 
- Verify WPGraphQL plugin is installed and activated
- Check that WordPress permalinks are set to "Post name"
- Test endpoint manually: `https://your-domain.com/graphql`

**Problem**: CORS errors with GraphQL
**Solution**:
- Install a CORS plugin in WordPress
- Or configure server headers to allow cross-origin requests

### REST API Issues

**Problem**: REST API returns 404
**Solution**:
- Check WordPress permalinks are enabled
- Verify URL: `https://your-domain.com/wp-json/wp/v2/posts`

**Problem**: Posts not loading
**Solution**:
- Check WordPress posts are published (not draft)
- Verify API endpoints are accessible
- Check browser console for errors

### Local Development Issues

**Problem**: `localhost:3000` redirect with Local
**Solution**:
- Use HTTP (not HTTPS) for Local sites: `http://site.local`
- Check WordPress URLs in Settings → General

### Build Issues

**Problem**: Build fails with GraphQL/REST errors
**Solution**:
- The system includes graceful fallbacks
- WordPress being unreachable during build is normal
- Check logs for specific error messages

## Best Practices

1. **Use GraphQL** when possible for better performance
2. **Cache responses** in production
3. **Handle errors gracefully** - site should work without WordPress
4. **Test both APIs** to ensure fallbacks work
5. **Monitor performance** - large GraphQL queries can be slow
6. **Keep WordPress updated** for security

## Performance Tips

### GraphQL Optimization

```typescript
// Only fetch needed fields
const query = `
  query GetPosts {
    posts(first: 10) {
      nodes {
        title        # Only what you need
        slug
        excerpt(format: RENDERED)
      }
    }
  }
`;
```

### REST API Optimization

```typescript
// Use _embed to reduce requests
const response = await fetch(
  `${WORDPRESS_API_URL}/posts?_embed&per_page=10`
);
```

## Support

For issues with this integration:

1. **Check logs** in browser console and terminal
2. **Verify WordPress** is accessible
3. **Test APIs** manually with curl
4. **Check environment variables** are correct
5. **Review error messages** for specific guidance

The integration includes comprehensive error handling and logging to help diagnose issues quickly. 