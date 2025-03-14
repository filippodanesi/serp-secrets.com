import { defineCollection, z } from 'astro:content';

// Common schema for images
const imageSchema = z.object({
    src: z.string(),
    alt: z.string().optional().default('')
});

// SEO schema with improved support for images
const seoSchema = z.object({
    title: z.string().min(5).max(120).optional(),
    description: z.string().min(15).max(160).optional(),
    image: imageSchema.optional(),
    pageType: z.enum(['website', 'article']).default('website')
});

const blog = defineCollection({
    schema: z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        publishDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        isFeatured: z.boolean().default(false),
        // Added support for the main image of the post
        image: imageSchema.optional(),
        tags: z.array(z.string()).default([]),
        seo: seoSchema.optional()
    })
});

const pages = defineCollection({
    schema: z.object({
        title: z.string(),
        image: imageSchema.optional(), // Added support for images in pages
        seo: seoSchema.optional()
    })
});

export const collections = { blog, pages };
