import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead, e as renderComponent, u as unescapeHTML, F as Fragment, s as spreadAttributes, d as renderSlot, k as renderHead } from './astro/server_Dvg4Mqde.mjs';
import 'kleur/colors';
import 'clsx';
import { s as siteConfig } from './site-config_Df8-vGOR.mjs';
/* empty css                          */

var __freeze$4 = Object.freeze;
var __defProp$4 = Object.defineProperty;
var __template$4 = (cooked, raw) => __freeze$4(__defProp$4(cooked, "raw", { value: __freeze$4(cooked.slice()) }));
var _a$4;
const $$Astro$5 = createAstro("https://www.serp-secrets.com");
const $$BaseHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$BaseHead;
  const {
    description = "",
    image = siteConfig.image,
    pageType = "website",
    isHome = false,
    robots = "max-image-preview:large"
  } = Astro2.props;
  const title = isHome ? Astro2.props.title : [Astro2.props.title, siteConfig.title].filter(Boolean).join(" \u2014 ");
  const resolvedImage = image?.src ? {
    src: new URL(image.src, Astro2.site).toString(),
    alt: image.alt
  } : void 0;
  const canonicalURL = new URL(Astro2.request.url, Astro2.site);
  function formatCanonicalURL(url) {
    let path = url.toString();
    const hasQueryParams = path.includes("?");
    if (hasQueryParams) {
      path = path.replace(/\/$/, "");
    } else {
      path = path.endsWith("/") ? path : `${path}/`;
    }
    return path;
  }
  return renderTemplate(_a$4 || (_a$4 = __template$4(['<!-- High Priority Global Metadata --><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="robots"', '><meta name="viewport" content="width=device-width,initial-scale=1"><title>', '</title><meta name="generator"', `><!-- Google Analytics --><script type="text/plain" data-category="analytics" data-service="Google Analytics" src="https://www.googletagmanager.com/gtag/js?id=G-MBR9G1TX79" crossorigin="anonymous">
<\/script><script type="text/plain" data-category="analytics" data-service="Google Analytics">
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-MBR9G1TX79');
<\/script><!-- Cleanup script (optional) --><script type="text/plain" data-category="analytics" data-service="!Google Analytics">
    window['ga-disable-G-MBR9G1TX79'] = true;
<\/script><!-- Low Priority Global Metadata --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="sitemap" href="/sitemap-index.xml"><link rel="alternate" type="application/rss+xml" href="/rss.xml" title="RSS"><!-- Page Metadata --><link rel="canonical"`, '><meta name="description"', '><!-- Open Graph / Facebook --><meta property="og:type"', '><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', ">", "", '<!-- X/Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', ">", "", ""])), addAttribute(robots, "content"), title, addAttribute(Astro2.generator, "content"), addAttribute(formatCanonicalURL(canonicalURL), "href"), addAttribute(description, "content"), addAttribute(pageType, "content"), addAttribute(formatCanonicalURL(canonicalURL), "content"), addAttribute(title, "content"), addAttribute(description, "content"), resolvedImage?.src && renderTemplate`<meta property="og:image"${addAttribute(resolvedImage.src, "content")}>`, resolvedImage?.alt && renderTemplate`<meta property="og:image:alt"${addAttribute(resolvedImage.alt, "content")}>`, addAttribute(formatCanonicalURL(canonicalURL), "content"), addAttribute(title, "content"), addAttribute(description, "content"), resolvedImage?.src && renderTemplate`<meta property="twitter:image"${addAttribute(resolvedImage.src, "content")}>`, resolvedImage?.alt && renderTemplate`<meta name="twitter:image:alt"${addAttribute(resolvedImage?.alt, "content")}>`);
}, "/Users/filippo/Desktop/serp-secrets.com/src/components/BaseHead.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const socialIcons = {
    LinkedIn: `<svg class="social-icon" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><path d="M0 0v24h24v-24h-24zm8 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.397-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
    GitHub: `<svg class="social-icon" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
    Twitter: `<svg class="social-icon" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 512 462.799"><path fill="currentColor" d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"/></svg>`
  };
  return renderTemplate`${maybeRenderHead()}<footer class="w-full max-w-3xl mx-auto pt-12 pb-10 sm:pt-24 sm:pb-14" data-astro-cid-sz7xmlte>  <div class="flex flex-col gap-2 mb-8" data-astro-cid-sz7xmlte> <h3 class="font-sans font-medium text-sm mb-1" data-astro-cid-sz7xmlte>Legal</h3> <div class="flex flex-col gap-2" data-astro-cid-sz7xmlte> <a class="font-serif hover:underline hover:underline-offset-2" href="/privacy-policy/" data-astro-cid-sz7xmlte>Privacy</a> <a class="font-serif hover:underline hover:underline-offset-2" href="/cookie-policy/" data-astro-cid-sz7xmlte>Cookie</a> </div> </div>  <div class="border-t border-solid border-main mb-8" data-astro-cid-sz7xmlte></div>  <div class="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center" data-astro-cid-sz7xmlte>  <div class="order-first sm:order-last flex justify-center sm:justify-end gap-6" data-astro-cid-sz7xmlte> ${siteConfig.socialLinks?.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} class="text-text-main hover:text-text-muted transition-colors duration-200" target="_blank" rel="noopener noreferrer"${addAttribute(link.text, "aria-label")} data-astro-cid-sz7xmlte> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(socialIcons[link.text])}` })} </a>`)} </div>  <div class="order-last sm:order-first flex justify-between items-center w-full sm:w-auto gap-4" data-astro-cid-sz7xmlte> <span class="text-sm" data-astro-cid-sz7xmlte>&copy;${currentYear} ${siteConfig.title}</span> <button type="button" data-cc="show-preferencesModal" class="cky-banner-element inline-flex items-center justify-center px-6 py-2 font-serif text-sm leading-tight italic text-main bg-main border border-main rounded-full transition hover:bg-muted" data-astro-cid-sz7xmlte>
Cookie Settings
</button> </div> </div> </footer> `;
}, "/Users/filippo/Desktop/serp-secrets.com/src/components/Footer.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header class="w-full max-w-3xl mx-auto mb-12 sm:mb-16 border-b border-solid border-main pb-6"> ${siteConfig.logo && siteConfig.logo?.src ? renderTemplate`<a href="/"> <img${addAttribute(siteConfig.logo.src, "src")}${addAttribute(siteConfig.logo.alt || "", "alt")} class="max-h-12"> </a>` : renderTemplate`<h1 class="font-serif text-4xl leading-tight font-medium text-theme-foreground sm:text-5xl"> ${siteConfig.title} </h1>`} ${renderTemplate`<h2 class="text-s mt-1">${siteConfig.subtitle}</h2>`} </header>`;
}, "/Users/filippo/Desktop/serp-secrets.com/src/components/Header.astro", void 0);

const $$Astro$4 = createAstro("https://www.serp-secrets.com");
const $$NavLink = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$NavLink;
  const { href, class: className, ...props } = Astro2.props;
  const { pathname } = Astro2.url;
  const isActive = href === pathname || href === pathname.replace(/\/$/, "");
  return renderTemplate`${maybeRenderHead()}<a${addAttribute([className, { "underline underline-offset-2 decoration-1": isActive }], "class:list")}${addAttribute(href, "href")}${spreadAttributes(props)}> ${renderSlot($$result, $$slots["default"])} </a>`;
}, "/Users/filippo/Desktop/serp-secrets.com/src/components/NavLink.astro", void 0);

const $$ThemeToggle = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<button id="theme-toggle" class="w-8 h-8 -mr-2 flex items-center justify-center" aria-label="Change color scheme"> <svg class="w-4 h-4 fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <circle cx="8" cy="8" r="8"></circle> </svg> </button> `;
}, "/Users/filippo/Desktop/serp-secrets.com/src/components/ThemeToggle.astro", void 0);

const $$Astro$3 = createAstro("https://www.serp-secrets.com");
const $$Search = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Search;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg"${addAttribute(className, "class")} viewBox="0 0 24 24" stroke="currentColor" fill="none"> <circle cx="11" cy="11" r="7" stroke-width="1.5"></circle> <line x1="16" y1="16" x2="21" y2="21" stroke-width="1.5"></line> </svg>`;
}, "/Users/filippo/Desktop/serp-secrets.com/src/icons/Search.astro", void 0);

const $$Nav = createComponent(($$result, $$props, $$slots) => {
  const navLinks = (siteConfig.headerNavLinks ?? []).filter((link) => link.href !== "/search");
  return renderTemplate`${maybeRenderHead()}<nav class="min-h-10 pt-4 pb-12 relative sm:min-h-14 sm:pb-24 md:pt-8" data-astro-cid-dmqpwcec> <!-- Mobile Navigation --> <div class="md:hidden w-full max-w-3xl mx-auto relative" data-astro-cid-dmqpwcec> <div class="flex justify-between items-center" data-astro-cid-dmqpwcec> <a href="/" class="flex items-center hover:opacity-80" aria-label="Go to homepage" data-astro-cid-dmqpwcec> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 192 192" class="w-7 h-7" data-astro-cid-dmqpwcec> <path d="M99.6 23.1h-7v144.3h7V23.1zM168.8 91.8H23.4v7h145.4v-7zM47.2 41.7l-5 5L145 148.8l5-5zM145 41.7L42.2 143.8l5 4.9L150 46.7zM30.1 64.8l-2.6 6.5l134.6 54.5l2.7-6.5zM120.3 27.1L65.4 160.8l6.5 2.6l54.9-133.7zM162.3 65l-134.9 54l2.6 6.5l134.9-54zM72.2 27l-6.5 2.6l54.2 134l6.5-2.6z" data-astro-cid-dmqpwcec></path> <style>
                        path { fill: rgb(var(--color-text-main)); }
                    </style> </svg> </a> <div class="flex items-center gap-4" data-astro-cid-dmqpwcec> <a href="/search/" class="flex items-center hover:opacity-80" aria-label="Search" data-astro-cid-dmqpwcec> ${renderComponent($$result, "SearchIcon", $$Search, { "class": "w-5 h-5", "data-astro-cid-dmqpwcec": true })} </a> ${renderComponent($$result, "ThemeToggle", $$ThemeToggle, { "data-astro-cid-dmqpwcec": true })} ${navLinks.length > 0 && renderTemplate`<button class="menu-toggle w-8 h-8 flex items-center justify-center relative z-30" aria-label="Open Menu" aria-expanded="false" aria-controls="menu-items" data-astro-cid-dmqpwcec> <span class="menu-toggle-icon w-6 h-px relative bg-current" data-astro-cid-dmqpwcec></span> </button>`} </div> </div> ${navLinks.length > 0 && renderTemplate`<ul id="menu-items" class="menu flex gap-6" data-astro-cid-dmqpwcec> ${navLinks.map((link) => renderTemplate`<li class="py-1" data-astro-cid-dmqpwcec> ${renderComponent($$result, "NavLink", $$NavLink, { "class": "text-xl font-serif text-main hover:underline hover:underline-offset-2 hover:decoration-1 md:text-base", "href": link.href, "data-astro-cid-dmqpwcec": true }, { "default": ($$result2) => renderTemplate`${link.text}` })} </li>`)} </ul>`} </div> <!-- Desktop Navigation --> <div class="hidden md:block" data-astro-cid-dmqpwcec> <!-- Logo --> <a href="/" class="absolute left-0 top-8 hover:opacity-80" aria-label="Go to homepage" data-astro-cid-dmqpwcec> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 192 192" class="w-7 h-7" data-astro-cid-dmqpwcec> <path d="M99.6 23.1h-7v144.3h7V23.1zM168.8 91.8H23.4v7h145.4v-7zM47.2 41.7l-5 5L145 148.8l5-5zM145 41.7L42.2 143.8l5 4.9L150 46.7zM30.1 64.8l-2.6 6.5l134.6 54.5l2.7-6.5zM120.3 27.1L65.4 160.8l6.5 2.6l54.9-133.7zM162.3 65l-134.9 54l2.6 6.5l134.9-54zM72.2 27l-6.5 2.6l54.2 134l6.5-2.6z" data-astro-cid-dmqpwcec></path> <style>
                    path { fill: rgb(var(--color-text-main)); }
                </style> </svg> </a> <!-- Search and Theme Toggle --> <div class="absolute right-0 top-8 z-10 flex items-center gap-4" data-astro-cid-dmqpwcec> <a href="/search/" class="flex items-center hover:opacity-80" aria-label="Search" data-astro-cid-dmqpwcec> ${renderComponent($$result, "SearchIcon", $$Search, { "class": "w-5 h-5", "data-astro-cid-dmqpwcec": true })} </a> ${renderComponent($$result, "ThemeToggle", $$ThemeToggle, { "data-astro-cid-dmqpwcec": true })} </div> <!-- Menu --> ${navLinks.length > 0 && renderTemplate`<div class="max-w-3xl mx-auto" data-astro-cid-dmqpwcec> <ul class="flex gap-6 items-center justify-center" data-astro-cid-dmqpwcec> ${navLinks.map((link) => renderTemplate`<li class="py-1" data-astro-cid-dmqpwcec> ${renderComponent($$result, "NavLink", $$NavLink, { "class": "text-xl font-serif text-main hover:underline hover:underline-offset-2 hover:decoration-1 md:text-base", "href": link.href, "data-astro-cid-dmqpwcec": true }, { "default": ($$result2) => renderTemplate`${link.text}` })} </li>`)} </ul> </div>`} </div> </nav>  `;
}, "/Users/filippo/Desktop/serp-secrets.com/src/components/Nav.astro", void 0);

var __freeze$3 = Object.freeze;
var __defProp$3 = Object.defineProperty;
var __template$3 = (cooked, raw) => __freeze$3(__defProp$3(cooked, "raw", { value: __freeze$3(cooked.slice()) }));
var _a$3;
const $$Astro$2 = createAstro("https://www.serp-secrets.com");
const $$BreadcrumbListStructuredData = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$BreadcrumbListStructuredData;
  const { items = [], currentPageName } = Astro2.props;
  const pageUrl = new URL(Astro2.url.pathname, Astro2.site);
  const getCurrentPageName = () => {
    if (currentPageName) return currentPageName;
    const path = pageUrl.pathname.split("/").filter(Boolean);
    if (path.length === 0) return "Home";
    return path[path.length - 1].split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };
  const breadcrumbItems = [
    // Home is always first
    {
      name: "Home",
      item: Astro2.site?.toString() || "/"
    },
    // Add provided items
    ...items,
    // Add current page if not already included
    ...items.length === 0 || items[items.length - 1].item !== pageUrl.toString() ? [{
      name: getCurrentPageName(),
      item: pageUrl.toString()
    }] : []
  ].map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.item.endsWith("/") ? item.item : `${item.item}/`
  }));
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl.toString()}#breadcrumb`,
    "itemListElement": breadcrumbItems
  };
  return renderTemplate(_a$3 || (_a$3 = __template$3(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify(structuredData)));
}, "/Users/filippo/Desktop/serp-secrets.com/src/components/structured-data/BreadcrumbListStructuredData.astro", void 0);

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
const $$AboutStructuredData = createComponent(($$result, $$props, $$slots) => {
  (/* @__PURE__ */ new Date()).getFullYear();
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "url": "https://www.filippodanesi.it/about",
    "lastReviewed": (/* @__PURE__ */ new Date()).toISOString(),
    "reviewedBy": {
      "@type": "Person",
      "name": "Filippo Danesi"
    },
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "url": "https://www.filippodanesi.it/images/profile.jpg"
    },
    "mainEntity": {
      "@type": "Person",
      "@id": "https://www.filippodanesi.it/#identity",
      "name": "Filippo Danesi",
      "jobTitle": "Senior SEO Specialist",
      "url": "https://www.filippodanesi.it/",
      "email": "filippo.danesi93@gmail.com",
      "telephone": "+39 392 241 8254",
      "description": "Senior SEO Specialist with expertise in AI-driven solutions, technical SEO, and digital marketing strategies.",
      "knowsLanguage": [
        {
          "@type": "Language",
          "name": "Italian",
          "alternateName": "it",
          "additionalProperty": {
            "@type": "PropertyValue",
            "name": "Native speaker"
          }
        },
        {
          "@type": "Language",
          "name": "English",
          "alternateName": "en",
          "additionalProperty": {
            "@type": "PropertyValue",
            "name": "C1 Advanced"
          }
        }
      ],
      "alumniOf": [
        {
          "@type": "OrganizationRole",
          "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": "Fondazione Italia USA",
            "url": "https://fondazioneitaliausa.org/"
          },
          "roleName": "MASt in Global Marketing, Comunicazione e Made in Italy",
          "startDate": "2021",
          "endDate": "2022"
        },
        {
          "@type": "OrganizationRole",
          "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": "24ORE Business School",
            "url": "https://www.24orebs.com/"
          },
          "roleName": "MASt in Big Data e Business Analytics",
          "startDate": "2021"
        },
        {
          "@type": "OrganizationRole",
          "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": "IED Istituto Europeo di Design",
            "url": "https://www.ied.edu/"
          },
          "roleName": "MASt in E-Commerce: Design and Management",
          "startDate": "2020",
          "endDate": "2021"
        }
      ],
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "name": "Technical SEO Certification",
          "credentialCategory": "Professional certification",
          "dateCreated": "2024",
          "recognizedBy": {
            "@type": "Organization",
            "name": "Blue Array Academy"
          }
        },
        {
          "@type": "EducationalOccupationalCredential",
          "name": "CS50's AI with Python",
          "credentialCategory": "Professional certification",
          "dateCreated": "2024",
          "recognizedBy": {
            "@type": "Organization",
            "name": "Harvard University"
          }
        }
      ],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "SEO Specialist (Tech Lead)",
        "responsibilities": [
          "Lead and execute advanced SEO strategies",
          "Leverage AI-driven solutions",
          "Maximize online visibility and content performance",
          "Spearhead research initiatives",
          "Integrate cutting-edge AI applications"
        ],
        "skills": [
          "HTML, CSS and JavaScript",
          "On-Page optimization",
          "Off-Page optimization",
          "Keyword analysis",
          "SEO tools",
          "AI tools",
          "CMS management",
          "JavaScript framework",
          "Data visualization",
          "Mobile SEO",
          "Data analytics tools"
        ],
        "occupationLocation": {
          "@type": "City",
          "name": "Pisa"
        }
      },
      "workLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Pisa",
          "addressRegion": "Tuscany",
          "addressCountry": "IT"
        }
      }
    }
  };
  return renderTemplate(_a$2 || (_a$2 = __template$2(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify(personStructuredData)));
}, "/Users/filippo/Desktop/serp-secrets.com/src/components/structured-data/AboutStructuredData.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro$1 = createAstro("https://www.serp-secrets.com");
const $$ContactPageStructuredData = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ContactPageStructuredData;
  const contactPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "url": new URL("contact", Astro2.site).toString(),
    "name": `Contact ${siteConfig.title}`,
    "description": "Get in touch with Filippo Danesi for SEO consultancy, technical insights, and collaboration opportunities.",
    "dateModified": (/* @__PURE__ */ new Date()).toISOString(),
    "lastReviewed": (/* @__PURE__ */ new Date()).toISOString(),
    "reviewedBy": {
      "@type": "Person",
      "name": "Filippo Danesi"
    },
    "primaryImageOfPage": siteConfig.image ? {
      "@type": "ImageObject",
      "url": new URL(siteConfig.image.src, Astro2.site).toString(),
      "caption": siteConfig.image.alt
    } : void 0,
    "mainEntity": {
      "@type": "Person",
      "@id": `${Astro2.site}#identity`,
      "name": "Filippo Danesi",
      "jobTitle": "Senior SEO Specialist",
      "email": "filippo.danesi93@gmail.com",
      "telephone": "+39 392 241 8254",
      "url": Astro2.site?.toString(),
      "sameAs": siteConfig.footerNavLinks?.map((link) => link.href)
    },
    "mainContentOfPage": {
      "@type": "WebPageElement",
      "isAccessibleForFree": true
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@id": Astro2.site?.toString(),
            "name": "Home"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@id": new URL("contact", Astro2.site).toString(),
            "name": "Contact"
          }
        }
      ]
    },
    "specialty": {
      "@type": "Specialty",
      "name": "SEO Consulting",
      "description": "Technical SEO, Digital Marketing Strategy, and AI Integration"
    },
    "about": {
      "@type": "Thing",
      "name": "SEO Consulting Services",
      "description": siteConfig.description
    },
    "potentialAction": {
      "@type": "CommunicateAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "mailto:filippo.danesi93@gmail.com",
        "inLanguage": ["en", "it"]
      },
      "description": "Contact for SEO consultancy and collaboration opportunities"
    },
    "inLanguage": "en",
    "isPartOf": {
      "@type": "WebSite",
      "@id": Astro2.site?.toString()
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.title,
      "description": siteConfig.description,
      "logo": siteConfig.logo ? {
        "@type": "ImageObject",
        "url": new URL(siteConfig.logo.src, Astro2.site).toString(),
        "caption": siteConfig.logo.alt
      } : void 0
    }
  };
  return renderTemplate(_a$1 || (_a$1 = __template$1(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify(contactPageStructuredData)));
}, "/Users/filippo/Desktop/serp-secrets.com/src/components/structured-data/ContactPageStructuredData.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Analytics = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template([`<script>
    // Global initialization flag
    let initializationInProgress = false;
  
    // Function to check and handle analytics consent
    function checkAnalyticsConsent() {
      console.log('Checking analytics consent...');
      
      // Prevent concurrent initialization attempts
      if (initializationInProgress) {
        console.log('Initialization already in progress, skipping...');
        return;
      }
      
      if (document.cookie.split(';').some((item) => item.trim().startsWith('cc_cookie='))) {
        try {
          // Extract and parse the cookie value
          const cookieValue = document.cookie
            .split('; ')
            .find((row) => row.startsWith('cc_cookie='))
            .split('=')[1];
          const cookieObj = JSON.parse(decodeURIComponent(cookieValue));
          
          console.log('Cookie consent object:', cookieObj);
          
          // Check if analytics is included in the consented categories
          if (cookieObj.categories && cookieObj.categories.includes('analytics')) {
            console.log('Analytics consent granted, initializing GA...');
            
            // Prevent multiple GA initializations
            if (!window.gaInitialized && !document.querySelector('script[src*="googletagmanager"]')) {
              initializationInProgress = true;
              window['ga-disable-G-MBR9G1TX79'] = false;
              
              // Create and configure GA script
              const script = document.createElement('script');
              script.src = 'https://www.googletagmanager.com/gtag/js?id=G-MBR9G1TX79';
              script.async = true;
              
              script.onload = () => {
                console.log('GA script loaded successfully');
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;  // Make gtag globally available
                gtag('js', new Date());
                gtag('config', 'G-MBR9G1TX79', {
                  debug_mode: true
                });
                
                // Mark GA as initialized
                window.gaInitialized = true;
                initializationInProgress = false;
                
                // Send a test event to verify tracking
                gtag('event', 'page_view', {
                  page_location: window.location.href,
                  page_title: document.title
                });
                
                console.log('GA initialized with debug mode');
              };
              
              script.onerror = (error) => {
                console.error('Error loading GA script:', error);
                initializationInProgress = false;
              };
              
              document.head.appendChild(script);
            } else {
              console.log('GA already initialized or script already present');
            }
          } else {
            console.log('Analytics consent not granted');
            window['ga-disable-G-MBR9G1TX79'] = true;
          }
        } catch (e) {
          console.error('Error parsing cookie:', e);
          console.error('Cookie value:', document.cookie);
          initializationInProgress = false;
        }
      } else {
        console.log('No cookie consent found');
      }
    }
  
    // Single initialization point using a small delay to ensure DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(checkAnalyticsConsent, 100);
      });
    } else {
      setTimeout(checkAnalyticsConsent, 100);
    }
  
    // Listen for cookie consent changes
    document.addEventListener('cookie.changed', (event) => {
      console.log('Cookie changed event detected:', event);
      setTimeout(checkAnalyticsConsent, 100);
    });
  <\/script>`])));
}, "/Users/filippo/Desktop/serp-secrets.com/src/components/Analytics.astro", void 0);

const $$Astro = createAstro("https://www.serp-secrets.com");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { showHeader = true, metaTags, breadcrumb, ...head } = Astro2.props;
  const pathname = Astro2.url.pathname;
  const isAboutPage = pathname === "/about" || pathname === "/about/";
  const isContactPage = pathname === "/contact" || pathname === "/contact/";
  const headProps = {
    ...head,
    ...metaTags
  };
  return renderTemplate`<html lang="en" class="antialiased break-words"> <head>${renderComponent($$result, "BaseHead", $$BaseHead, { ...headProps })}${renderComponent($$result, "BreadcrumbListStructuredData", $$BreadcrumbListStructuredData, { ...breadcrumb })}${isAboutPage && renderTemplate`${renderComponent($$result, "AboutStructuredData", $$AboutStructuredData, {})}`}${isContactPage && renderTemplate`${renderComponent($$result, "ContactPageStructuredData", $$ContactPageStructuredData, {})}`}${renderSlot($$result, $$slots["structured-data"])}${renderHead()}</head> <body class="bg-main text-main"> <div class="flex flex-col min-h-screen px-4 md:px-8"> ${renderComponent($$result, "Nav", $$Nav, {})} ${showHeader && renderTemplate`${renderComponent($$result, "Header", $$Header, {})}`} <main class="grow w-full max-w-3xl mx-auto"> ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "Analytics", $$Analytics, {})} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </div> </body></html>`;
}, "/Users/filippo/Desktop/serp-secrets.com/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
