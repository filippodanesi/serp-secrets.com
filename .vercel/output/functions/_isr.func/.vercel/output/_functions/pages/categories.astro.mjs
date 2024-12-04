/* empty css                                  */
import { a as createComponent, r as renderTemplate, e as renderComponent, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_Dvg4Mqde.mjs';
import 'kleur/colors';
import { g as getCollection } from '../chunks/_astro_content_Byp4kc5z.mjs';
import { $ as $$ArrowRight } from '../chunks/ArrowRight_C4hxK8O7.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BWPihJZg.mjs';
import { s as sortItemsByDateDesc, g as getAllTags, a as getPostsByTag } from '../chunks/data-utils_Bdnci8_m.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const posts = (await getCollection("blog")).sort(sortItemsByDateDesc);
  const tags = getAllTags(posts).sort((tagA, tagB) => {
    const postCountTagA = getPostsByTag(posts, tagA.slug).length;
    const postCountTagB = getPostsByTag(posts, tagB.slug).length;
    return postCountTagB - postCountTagA;
  });
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Categories", "description": "Find a wide range of topics, articles, and insights organized by tags, making it effortless to locate the content that interests you most.", "showHeader": false }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-3xl leading-tight font-serif sm:text-4xl italic mb-4 sm:leading-tight">Categories</h1> <h2 class="mb-12 sm:mb-16 text-sm sm:text-base leading-normal pb-6 border-b border-solid border-main inline-block">
Browse through all the topics I've written about. Each tag represents a collection of related posts, making it easy to explore specific areas of
        interest.
</h2> ${tags.map((tag) => {
    const postCount = getPostsByTag(posts, tag.slug).length;
    return renderTemplate`<a class="mb-10 flex justify-between items-start gap-8 group sm:mb-12"${addAttribute(`/categories/${tag.slug}/`, "href")}> <div class="grow"> <h3 class="text-xl leading-tight font-serif font-medium group-hover:underline group-hover:decoration-solid group-hover:underline-offset-4 group-hover:decoration-1 sm:text-2xl"> ${tag.name} </h3> <div class="mt-1 text-sm leading-normal"> ${postCount} ${postCount === 1 ? "post" : "posts"} </div> </div> <div class="hidden font-serif italic opacity-0 transition group-hover:opacity-100 sm:inline-flex sm:gap-1 sm:items-center sm:shrink-0">
View Category Archive ${renderComponent($$result2, "ArrowRight", $$ArrowRight, { "class": "fill-current w-4 h-4" })} </div> </a>`;
  })} ` })}`;
}, "/Users/filippo/Desktop/serp-secrets.com/src/pages/categories/index.astro", void 0);

const $$file = "/Users/filippo/Desktop/serp-secrets.com/src/pages/categories/index.astro";
const $$url = "/categories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   default: $$Index,
   file: $$file,
   url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
