/* empty css                                  */
import { a as createComponent, r as renderTemplate, e as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_Dvg4Mqde.mjs';
import 'kleur/colors';
import { g as getCollection } from '../chunks/_astro_content_Byp4kc5z.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BWPihJZg.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import Fuse from 'fuse.js';
export { renderers } from '../renderers.mjs';

function Search({ posts }) {
  const [query, setQuery] = useState("");
  const fuse = new Fuse(posts, {
    keys: ["title", "description", "body"],
    threshold: 0.3
  });
  const results = query ? fuse.search(query) : [];
  return /* @__PURE__ */ jsxs("div", { className: "not-prose", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: query,
        onChange: (e) => setQuery(e.target.value),
        placeholder: "Search articles...",
        className: "w-full p-4 text-base bg-main focus:bg-muted border border-main rounded-none focus:outline-none font-serif italic placeholder-[rgb(var(--color-text-main))]",
        "aria-label": "Search articles"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "space-y-8", children: query && results.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-[rgb(var(--color-text-muted))/60] text-sm font-sans", children: "No results found." }) : results.map((result, index) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: result.item.url,
        className: "flex justify-between items-start gap-8 group",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "grow", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl leading-tight font-serif font-medium group-hover:underline group-hover:decoration-solid group-hover:underline-offset-4 group-hover:decoration-1 sm:text-2xl", children: result.item.title }),
            result.item.description && /* @__PURE__ */ jsx("div", { className: "mt-3 text-sm leading-normal", children: result.item.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "hidden font-serif italic opacity-0 transition group-hover:opacity-100 sm:inline-flex sm:gap-1 sm:items-center sm:shrink-0", children: [
            "Read Post",
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "fill-current w-4 h-4",
                viewBox: "0 0 16 16",
                xmlns: "http://www.w3.org/2000/svg",
                children: /* @__PURE__ */ jsx("path", { d: "M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z" })
              }
            )
          ] })
        ]
      },
      index
    )) })
  ] });
}

const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const allPosts = await getCollection("blog");
  const posts = allPosts.map((post) => ({
    title: post.data.title,
    url: `/blog/${post.slug}`,
    description: post.data.excerpt || "",
    body: post.body
  }));
  const title = "Search";
  const metaTags = {
    title,
    description: "Search through all the articles on my blog. Just start typing and you're in :)",
    robots: "noindex, nofollow"
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "showHeader": false, "metaTags": metaTags }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="mb-16 sm:mb-24"> <header class="mb-8"> <h1 class="text-3xl leading-tight font-serif sm:text-4xl italic mb-4 sm:leading-tight">${title}</h1> </header> <div class="max-w-none prose prose-dante sm:prose-lg"> ${renderComponent($$result2, "SearchComponent", Search, { "client:load": true, "posts": posts, "client:component-hydration": "load", "client:component-path": "/Users/filippo/Desktop/serp-secrets.com/src/components/Search.tsx", "client:component-export": "default" })} </div> </article> ` })}`;
}, "/Users/filippo/Desktop/serp-secrets.com/src/pages/search.astro", void 0);

const $$file = "/Users/filippo/Desktop/serp-secrets.com/src/pages/search.astro";
const $$url = "/search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
