import type { MetadataRoute } from 'next'
import { getAllPosts, getAllCategories } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.serp-secrets.com'

  const posts = getAllPosts()
  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const categories = getAllCategories()
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/archive/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...categoryUrls,
    ...blogUrls,
    {
      url: `${baseUrl}/privacy/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
