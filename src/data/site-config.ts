export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
    className?: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type TagDescription = {
    [key: string]: string;
};

export type SiteConfig = {
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
    tagDescriptions: TagDescription;
};

const siteConfig: SiteConfig = {
    title: 'SERPsecrets',
    subtitle: 'Perspectives on AI, SEO trends, news & digital strategies — no hype, just real-world clarity',
    description: 'A curated blend of SEO updates, AI reflections, and hands-on tactics. Thoughtful analysis to help you navigate the digital landscape.',
    image: {
        src: '/og-image.webp',
        alt: 'SERPsecrets - SEO Analysis, Strategies & AI Insights'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Archive',
            href: '/blog/'
        },
        {
            text: 'Categories',
            href: '/categories/'
        },
        {
            text: 'About',
            href: '/about/'
        },
        {
            text: 'Contact',
            href: '/contact/'
        }
    ],
    footerNavLinks: [
        {
            text: 'LinkedIn',
            href: 'https://www.linkedin.com/in/filippodanesi/'
        },
        {
            text: 'Github',
            href: 'https://github.com/filippodanesi/'
        },
        {
            text: 'Twitter',
            href: 'https://x.com/filippodanesi'
        }
    ],
    socialLinks: [
        {
            text: 'LinkedIn',
            href: 'https://www.linkedin.com/in/filippodanesi/'
        },
        {
            text: 'GitHub',
            href: 'https://github.com/filippodanesi/'
        },
        {
            text: 'Twitter',
            href: 'https://x.com/filippodanesi'
        }
    ],
    hero: {
        actions: []
    },
    subscribe: {
        title: 'Join the SERPsecrets Newsletter',
        text: 'One update per week. All the latest posts directly in your inbox.',
        formUrl: '#'
    },
    tagDescriptions: {
        'technical-seo': 'Backend SEO strategies and coding techniques to boost site performance and rankings. Detailed exploration of site architecture and technical optimization methods.',
        'seo-news': 'Authoritative updates on latest SEO trends. Analysis of algorithm changes, market shifts, and emerging practices in digital marketing landscape.',
        'seo-strategies': 'Effective SEO tactics and winning methodologies focused on keyword research, content optimization, and proven strategies to increase user engagement.',
        'artificial-intelligence': 'How AI transforms SEO and digital marketing. Insights into machine learning, algorithmic analysis, and implementation of AI-driven optimization strategies.'
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
