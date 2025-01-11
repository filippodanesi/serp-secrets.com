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
    subtitle: 'Personal Thoughts on AI, SEO News, Strategies & Technical Solutions',
    description: 'A personal take on SEO news, strategies, and AI insights. Practical analysis to help you optimize your online presence in a changing digital world.',
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
        'technical-seo': 'Personal insights into backend SEO strategies and coding techniques that boost site performance and improve search rankings. I explore site architecture and technical optimization in detail.',
        'seo-news': 'Authoritative updates and reflections on the latest SEO trends. I dive into algorithm changes, market shifts, and emerging practices in digital marketing.',
        'seo-strategies': 'Personal insights into effective SEO tactics and winning methodologies, with a focus on keyword research, content optimization, and strategies to boost user engagement',
        'artificial-intelligence': 'Exploring how AI is transforming SEO and digital marketing. I share insights into machine learning, algorithmic analysis, and AI-driven optimization strategies.'
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
