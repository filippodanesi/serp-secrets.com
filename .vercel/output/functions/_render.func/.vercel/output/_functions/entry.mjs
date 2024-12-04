import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_vnmQTJwj.mjs';
import { manifest } from './manifest_DcdfD0ZT.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/blog/_slug_.astro.mjs');
const _page3 = () => import('./pages/blog/_---page_.astro.mjs');
const _page4 = () => import('./pages/categories/_slug_/_---page_.astro.mjs');
const _page5 = () => import('./pages/categories.astro.mjs');
const _page6 = () => import('./pages/image-sitemap.xml.astro.mjs');
const _page7 = () => import('./pages/robots.txt.astro.mjs');
const _page8 = () => import('./pages/rss.xml.astro.mjs');
const _page9 = () => import('./pages/search.astro.mjs');
const _page10 = () => import('./pages/sitemap.xml.astro.mjs');
const _page11 = () => import('./pages/index.astro.mjs');
const _page12 = () => import('./pages/_---slug_.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/blog/[slug].astro", _page2],
    ["src/pages/blog/[...page].astro", _page3],
    ["src/pages/categories/[slug]/[...page].astro", _page4],
    ["src/pages/categories/index.astro", _page5],
    ["src/pages/image-sitemap.xml.ts", _page6],
    ["src/pages/robots.txt.ts", _page7],
    ["src/pages/rss.xml.js", _page8],
    ["src/pages/search.astro", _page9],
    ["src/pages/sitemap.xml.ts", _page10],
    ["src/pages/index.astro", _page11],
    ["src/pages/[...slug].astro", _page12]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "fbaf12c0-378d-44d5-ada6-cee036aa1148",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
