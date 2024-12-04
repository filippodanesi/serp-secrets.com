import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, s as spreadAttributes, d as renderSlot } from './astro/server_Dvg4Mqde.mjs';
import 'clsx';

const $$Astro = createAstro("https://www.serp-secrets.com");
const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Button;
  const {
    href,
    class: className,
    "data-url": dataUrl,
    "data-tooltip-default": tooltipDefault,
    "data-tooltip-success": tooltipSuccess,
    ...rest
  } = Astro2.props;
  const buttonClasses = "inline-flex items-center justify-center px-6 py-2 font-serif text-sm leading-tight italic text-main bg-main border border-main rounded-full transition hover:bg-muted";
  return renderTemplate`${href ? renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute([buttonClasses, className], "class:list")}${spreadAttributes(rest)}>${renderSlot($$result, $$slots["default"])}</a>` : renderTemplate`<button${addAttribute([buttonClasses, className], "class:list")}${addAttribute(dataUrl, "data-url")}${addAttribute(tooltipDefault, "data-tooltip-default")}${addAttribute(tooltipSuccess, "data-tooltip-success")} type="button"${spreadAttributes(rest)}>${renderSlot($$result, $$slots["default"])}</button>`}`;
}, "/Users/filippo/Desktop/serp-secrets.com/src/components/Button.astro", void 0);

export { $$Button as $ };
