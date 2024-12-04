/* empty css                                  */
import { a as createComponent, r as renderTemplate, e as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_Dvg4Mqde.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BWPihJZg.mjs';
import { $ as $$Button } from '../chunks/Button_ovDbmtOV.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  const title = "404: Page Not Found";
  const description = "Sorry, we couldn't find the page you're looking for. Let's get you back on track.";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "showHeader": false }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col items-center justify-center py-16 md:py-24 text-center"> <div class="space-y-8"> <div class="space-y-4"> <h1 class="text-3xl leading-tight font-serif sm:text-4xl italic mb-4 sm:leading-tight">
404
</h1> <p class="text-s leading-tight mt-1"> ${description} </p> </div> <div class="inline-flex flex-col gap-4 sm:flex-row sm:gap-6"> ${renderComponent($$result2, "Button", $$Button, { "href": "/" }, { "default": ($$result3) => renderTemplate`
Back to Homepage
` })} ${renderComponent($$result2, "Button", $$Button, { "href": "/blog/" }, { "default": ($$result3) => renderTemplate`
Explore Articles
` })} </div> <p class="text-sm text-muted opacity-60">
Think this is a mistake? <a href="/contact" class="underline hover:text-current transition-colors">Let us know</a> </p> </div> </div> ` })}`;
}, "/Users/filippo/Desktop/serp-secrets.com/src/pages/404.astro", void 0);

const $$file = "/Users/filippo/Desktop/serp-secrets.com/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$404,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
