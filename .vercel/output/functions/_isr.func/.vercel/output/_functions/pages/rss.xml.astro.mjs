import rss from '@astrojs/rss';
import { g as getCollection } from '../chunks/_astro_content_Byp4kc5z.mjs';
import { s as siteConfig } from '../chunks/site-config_Df8-vGOR.mjs';
import { s as sortItemsByDateDesc } from '../chunks/data-utils_Bdnci8_m.mjs';
export { renderers } from '../renderers.mjs';

async function GET(context) {
    const posts = (await getCollection('blog')).sort(sortItemsByDateDesc);
    return rss({
        title: siteConfig.title,
        description: siteConfig.description,
        site: context.site,
        items: posts.map((item) => ({
            title: item.data.title,
            description: item.data.excerpt,
            link: `/blog/${item.slug}/`,
            pubDate: item.data.publishDate.setUTCHours(0)
        }))
    });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
