/* empty css                                  */
import { c as createAstro, a as createComponent, r as renderTemplate, u as unescapeHTML, e as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_Dvg4Mqde.mjs';
import 'kleur/colors';
import { g as getCollection } from '../chunks/_astro_content_Byp4kc5z.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BWPihJZg.mjs';
import { $ as $$Button } from '../chunks/Button_ovDbmtOV.mjs';
import { $ as $$PostPreview } from '../chunks/PostPreview_DXTcj6G_.mjs';
import { s as siteConfig } from '../chunks/site-config_Df8-vGOR.mjs';
import { s as sortItemsByDateDesc } from '../chunks/data-utils_Bdnci8_m.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.serp-secrets.com");
const $$BlogStructuredData = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogStructuredData;
  const { posts } = Astro2.props;
  const personInfo = {
    "@type": "Person",
    "@id": `${Astro2.site}#identity`,
    name: "Filippo Danesi",
    url: Astro2.site?.toString(),
    sameAs: [
      "https://www.linkedin.com/in/filippodanesi/",
      "https://github.com/filippodanesi/",
      "https://x.com/filippodanesi"
    ]
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${Astro2.site}blog/`,
    name: siteConfig.title,
    description: siteConfig.description,
    url: Astro2.site?.toString(),
    inLanguage: "en",
    keywords: ["Technical Seo", "Seo News", "Seo Strategies", "Artificial Intelligence"],
    image: {
      "@type": "ImageObject",
      url: `${Astro2.site}${siteConfig.image?.src.replace("/", "")}`,
      caption: siteConfig.image?.alt,
      width: "1200",
      height: "630"
    },
    publisher: personInfo,
    author: personInfo,
    about: [
      {
        "@type": "Thing",
        name: "Technical SEO",
        description: siteConfig.tagDescriptions["technical-seo"]
      },
      {
        "@type": "Thing",
        name: "SEO News",
        description: siteConfig.tagDescriptions["seo-news"]
      },
      {
        "@type": "Thing",
        name: "SEO Strategies",
        description: siteConfig.tagDescriptions["seo-strategies"]
      },
      {
        "@type": "Thing",
        name: "Artificial Intelligence",
        description: siteConfig.tagDescriptions["artificial-intelligence"]
      }
    ],
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${Astro2.site}blog/${post.slug}#BlogPosting`,
      headline: post.data.title,
      name: post.data.title,
      description: post.data.excerpt,
      datePublished: post.data.publishDate.toISOString(),
      dateModified: (post.data.updatedDate || post.data.publishDate).toISOString(),
      url: `${Astro2.site}blog/${post.slug}`,
      inLanguage: "en",
      keywords: post.data.tags,
      articleSection: post.data.tags[0],
      isAccessibleForFree: "http://schema.org/True",
      copyrightYear: new Date(post.data.publishDate).getFullYear(),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${Astro2.site}blog/${post.slug}`
      },
      isPartOf: {
        "@type": "Blog",
        "@id": `${Astro2.site}blog/`
      },
      image: {
        "@type": "ImageObject",
        url: post.data.seo?.image?.src ? `${Astro2.site}${post.data.seo.image.src.replace("/", "")}` : `${Astro2.site}og-image.webp`,
        caption: post.data.seo?.image?.alt,
        width: "1200",
        height: "630"
      },
      author: personInfo,
      publisher: personInfo,
      copyrightHolder: {
        "@type": "Person",
        name: "Filippo Danesi"
      }
    }))
  };
  return renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify(structuredData)));
}, "/Users/filippo/Desktop/serp-secrets.com/src/components/structured-data/BlogStructuredData.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const posts = (await getCollection("blog")).sort(sortItemsByDateDesc).slice(0, 5);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "SERPsecrets \u2014 SEO Analysis, Strategies & AI Insights", "description": siteConfig.description, "image": siteConfig.image, "isHome": true }, { "default": ($$result2) => renderTemplate`  ${posts.length > 0 && renderTemplate`${maybeRenderHead()}<div class="mb-16 sm:mb-24">  ${posts.map((post) => renderTemplate`${renderComponent($$result2, "PostPreview", $$PostPreview, { "post": post, "class": "mb-10 sm:mb-12", "headingLevel": "h3" })}`)} <div class="mt-12 sm:mt-16"> ${renderComponent($$result2, "Button", $$Button, { "href": "/blog/" }, { "default": ($$result3) => renderTemplate`View All Posts` })} </div> </div>`}`, "structured-data": ($$result2) => renderTemplate`${renderComponent($$result2, "BlogStructuredData", $$BlogStructuredData, { "slot": "structured-data", "posts": posts })}` })}`;
}, "/Users/filippo/Desktop/serp-secrets.com/src/pages/index.astro", void 0);

const $$file = "/Users/filippo/Desktop/serp-secrets.com/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
