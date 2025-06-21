![Cover Image](https://github.com/filippodanesi/serp-secrets.com/blob/main/public/36shots_so.png)

# SERP Secrets

[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-171717.svg?style=for-the-badge&logo=astro&logoColor=F2F1EC)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-171717?style=for-the-badge&logo=typescript&logoColor=F2F1EC)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-171717?style=for-the-badge&logo=tailwind-css&logoColor=F2F1EC)](https://tailwindcss.com/)
[![WordPress](https://img.shields.io/badge/WordPress-171717?style=for-the-badge&logo=wordpress&logoColor=F2F1EC)](https://wordpress.org/)

A technical publication committed to the convergence of SEO and AI, through deep data analysis and practical implementation insights for the search optimization professional.

## 🏗️ Architecture

**Headless WordPress + Astro** hybrid architecture:
- **Frontend**: Astro static site with ISR (Incremental Static Regeneration)
- **CMS**: WordPress headless backend via REST API and GraphQL
- **Deployment**: Vercel with 24-hour cache invalidation
- **Content**: Unified system supporting both Astro MDX and WordPress posts

## 📚 Stack

### Frontend
- [Astro](https://astro.build) v4.15 - Static site generation with ISR
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) v3.4 - Styling
- [React](https://react.dev/) v18.3 - Interactive components
- [Fuse.js](https://www.fusejs.io/) v7.0 - Unified search across all content

### CMS & Content
- [WordPress](https://wordpress.org/) - Headless CMS
- [WPGraphQL](https://www.wpgraphql.com/) - GraphQL API for WordPress
- [MDX](https://mdxjs.com/) v2.2 - Advanced content authoring (legacy support)

### Performance & SEO
- [Sharp](https://sharp.pixelplumbing.com/) v0.33 - Image optimization
- Dynamic sitemaps (includes WordPress content)
- Structured data for both content types
- Automatic RSS feed generation

### Deployment
- [Vercel](https://vercel.com) - Deployment with ISR and analytics

## 🚀 Development

### Prerequisites
1. Node.js 18+ 
2. WordPress installation (for CMS)
3. Environment variables configured

### Setup

```bash
# Install dependencies
npm install

# Configure environment (copy and edit)
cp .env.example .env.local

# Start development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Refresh WordPress content (production)
./refresh-posts.sh
```

### Environment Variables

```bash
# WordPress Configuration
WORDPRESS_API_URL=https://your-cms-domain.com/wp-json/wp/v2
WORDPRESS_GRAPHQL_URL=https://your-cms-domain.com/graphql

# Optional: Site Configuration
SITE_URL=https://your-domain.com
```

## 📝 Content Management

### WordPress Posts
- Create and manage posts via WordPress admin
- Automatic synchronization with frontend
- SEO metadata via Yoast SEO
- Featured images and categories support

### Legacy MDX Posts
- Existing MDX posts in `src/content/blog/` (deprecated)
- Gradually migrating to WordPress
- Unified search includes both types

### Content Refresh
```bash
# Manual content refresh (triggers ISR)
./refresh-posts.sh

# Or via Vercel webhook (recommended)
POST /api/revalidate
```

## 🔧 WordPress Setup

Detailed WordPress configuration guide available in [README-WORDPRESS.md](README-WORDPRESS.md).

### Required Plugins
- **WPGraphQL** - GraphQL API
- **Yoast SEO** - SEO metadata
- **WPGraphQL SEO Extension** - SEO data via GraphQL

### Recommended Security
- **Wordfence Security** - Protection
- **WPS Hide Login** - Hide admin URLs

## 📊 Features

### SEO & Performance
- ✅ Structured data (JSON-LD) for all content types
- ✅ Dynamic XML sitemaps with WordPress content
- ✅ RSS feeds with unified content
- ✅ Optimized images with Sharp
- ✅ ISR with 24-hour cache invalidation

### User Experience
- ✅ Unified search across all content
- ✅ Responsive design with mobile-first approach
- ✅ Fast page transitions
- ✅ Dark/light theme support
- ✅ Breadcrumb navigation

### Developer Experience
- ✅ TypeScript throughout
- ✅ Unified content types
- ✅ Automatic content synchronization
- ✅ Comprehensive error handling

## 🤝 Contributing

### Issues & Bugs
Submit technical issues through [GitHub Issues](https://github.com/filippodanesi/serp-secrets.com/issues).

### Content Collaboration
Content suggestions and collaborations via [Contact Form](https://www.serp-secrets.com/contact).

### Development
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-171717?style=for-the-badge&logoColor=F2F1EC)](https://creativecommons.org/licenses/by/4.0/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-171717?style=for-the-badge&logoColor=F2F1EC)](https://www.gnu.org/licenses/gpl-3.0)

Built with [Dante](https://justgoodui.com/), an Astro theme by JustGoodUI. Content licensed under CC BY 4.0, theme under GPL-3.0.

---

© 2025 Filippo Danesi