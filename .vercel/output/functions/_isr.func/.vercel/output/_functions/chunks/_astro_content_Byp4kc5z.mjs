import { Traverse } from 'neotraverse/modern';
import pLimit from 'p-limit';
import { r as removeBase, i as isRemotePath, V as VALID_INPUT_FORMATS, A as AstroError, U as UnknownContentCollectionError, p as prependForwardSlash } from './astro/assets-service_BBnKZ-nv.mjs';
import { a as createComponent, h as renderUniqueStylesheet, i as renderScriptElement, j as createHeadAndContent, r as renderTemplate, e as renderComponent, u as unescapeHTML } from './astro/server_Dvg4Mqde.mjs';
import 'kleur/colors';
import * as devalue from 'devalue';

const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";

function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1);
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}

class DataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import('./_astro_data-layer-content_BcEe_9wP.mjs');
      if (data.default instanceof Map) {
        return DataStore.fromMap(data.default);
      }
      const map = devalue.unflatten(data.default);
      return DataStore.fromMap(map);
    } catch {
    }
    return new DataStore();
  }
  static async fromMap(data) {
    const store = new DataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = DataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://www.serp-secrets.com", "SSR": true};
function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1) continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport,
  cacheEntriesByCollection
}) {
  return async function getCollection(collection, filter) {
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import('./_astro_asset-imports_D9aVaOQr.mjs');
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        const entry = {
          ...rawEntry,
          data,
          collection
        };
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Ensure a collection directory with this name exists.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign(__vite_import_meta_env__, { _: process.env._ })?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = cacheEntriesByCollection.get(collection);
    } else {
      const limit = pLimit(10);
      entries = await Promise.all(
        lazyImports.map(
          (lazyImport) => limit(async () => {
            const entry = await lazyImport();
            return type === "content" ? {
              id: entry.id,
              slug: entry.slug,
              body: entry.body,
              collection: entry.collection,
              data: entry.data,
              async render() {
                return render({
                  collection: entry.collection,
                  id: entry.id,
                  renderEntryImport: await getRenderEntryImport(collection, entry.slug)
                });
              }
            } : {
              id: entry.id,
              collection: entry.collection,
              data: entry.data
            };
          })
        )
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (hasFilter) {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  };
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new Traverse(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        ctx.update(imported);
      } else {
        ctx.update(src);
      }
    }
  });
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const contentDir = '/src/content/';

const contentEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/adapting-to-googles-helpful-content-era.md": () => import('./adapting-to-googles-helpful-content-era_CTozbFc0.mjs'),"/src/content/blog/advanced-strategies-for-schema-markup-optimization.md": () => import('./advanced-strategies-for-schema-markup-optimization_CbZ17yNK.mjs'),"/src/content/blog/ai-and-ml-what-are-the-differences.md": () => import('./ai-and-ml-what-are-the-differences_BjDgBmtY.mjs'),"/src/content/blog/essential-tools-for-seo-optimizing.md": () => import('./essential-tools-for-seo-optimizing_u_PVo6mE.mjs'),"/src/content/blog/exploring-how-google-lamda-language-model-work.md": () => import('./exploring-how-google-lamda-language-model-work_AikeS0Xc.mjs'),"/src/content/blog/generative-ai-and-predictive-ai.md": () => import('./generative-ai-and-predictive-ai__BExGhH9.mjs'),"/src/content/blog/geo-the-future-of-digital-optimization.md": () => import('./geo-the-future-of-digital-optimization_dvQOdnoH.mjs'),"/src/content/blog/how-to-create-helpful-content-after-hcu.md": () => import('./how-to-create-helpful-content-after-hcu_CmFioEsn.mjs'),"/src/content/blog/how-to-use-ai-in-seo-forecasting.md": () => import('./how-to-use-ai-in-seo-forecasting_8IslwcXi.mjs'),"/src/content/blog/how-to-use-lsi-keywords-in-seo.md": () => import('./how-to-use-lsi-keywords-in-seo_BwRKwKdM.mjs'),"/src/content/blog/in-depth-analysis-of-googles-march-2024-updates.md": () => import('./in-depth-analysis-of-googles-march-2024-updates_B06fbWuo.mjs'),"/src/content/blog/mastering-bert-in-seo-for-better-semantic-insight.md": () => import('./mastering-bert-in-seo-for-better-semantic-insight_R4eAxrF9.mjs'),"/src/content/blog/optimizing-content-for-google-search-generative-experience.md": () => import('./optimizing-content-for-google-search-generative-experience_C2l_ih6C.mjs'),"/src/content/blog/seo-2025-upcoming-changes-and-how-to-adapt.md": () => import('./seo-2025-upcoming-changes-and-how-to-adapt_hSrSvzvy.mjs'),"/src/content/blog/seo-in-2024-trends-tips-strategies-guide.md": () => import('./seo-in-2024-trends-tips-strategies-guide_BPrru-hl.mjs'),"/src/content/blog/the-future-of-seo-if-chatgpt-kills-search-engines.md": () => import('./the-future-of-seo-if-chatgpt-kills-search-engines_DGSwTI3-.mjs'),"/src/content/blog/the-future-of-seo-navigating-a-world-where-chatgpt-reigns-supreme.md": () => import('./the-future-of-seo-navigating-a-world-where-chatgpt-reigns-supreme_BRM-JGf4.mjs'),"/src/content/blog/training-search-engines-the-next-evolution-of-seo.md": () => import('./training-search-engines-the-next-evolution-of-seo_DMXUxRnd.mjs'),"/src/content/blog/understanding-shadow-dom-for-a-optimized-indexing.md": () => import('./understanding-shadow-dom-for-a-optimized-indexing_D3OXT72j.mjs'),"/src/content/blog/what-is-googles-search-generative-experience.md": () => import('./what-is-googles-search-generative-experience_DCK1zvwk.mjs'),"/src/content/blog/will-artificial-intelligence-replace-humans.md": () => import('./will-artificial-intelligence-replace-humans_Dc9N5JPC.mjs'),"/src/content/blog/will-chatgpt-end-googles-search-dominance.md": () => import('./will-chatgpt-end-googles-search-dominance_DyOu8fcZ.mjs'),"/src/content/pages/about.md": () => import('./about_B-YwS59v.mjs'),"/src/content/pages/contact.md": () => import('./contact_ffblTnKO.mjs'),"/src/content/pages/cookie-policy.md": () => import('./cookie-policy_CJUet2BJ.mjs'),"/src/content/pages/privacy-policy.md": () => import('./privacy-policy_v3i3ZeI5.mjs')});
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = /* #__PURE__ */ Object.assign({});
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {"blog":{"type":"content","entries":{"advanced-strategies-for-schema-markup-optimization":"/src/content/blog/advanced-strategies-for-schema-markup-optimization.md","ai-and-ml-what-are-the-differences":"/src/content/blog/ai-and-ml-what-are-the-differences.md","essential-tools-for-seo-optimizing":"/src/content/blog/essential-tools-for-seo-optimizing.md","adapting-to-googles-helpful-content-era":"/src/content/blog/adapting-to-googles-helpful-content-era.md","geo-the-future-of-digital-optimization":"/src/content/blog/geo-the-future-of-digital-optimization.md","exploring-how-google-lamda-language-model-work":"/src/content/blog/exploring-how-google-lamda-language-model-work.md","generative-ai-and-predictive-ai":"/src/content/blog/generative-ai-and-predictive-ai.md","how-to-create-helpful-content-after-hcu":"/src/content/blog/how-to-create-helpful-content-after-hcu.md","how-to-use-lsi-keywords-in-seo":"/src/content/blog/how-to-use-lsi-keywords-in-seo.md","how-to-use-ai-in-seo-forecasting":"/src/content/blog/how-to-use-ai-in-seo-forecasting.md","mastering-bert-in-seo-for-better-semantic-insight":"/src/content/blog/mastering-bert-in-seo-for-better-semantic-insight.md","optimizing-content-for-google-search-generative-experience":"/src/content/blog/optimizing-content-for-google-search-generative-experience.md","in-depth-analysis-of-googles-march-2024-updates":"/src/content/blog/in-depth-analysis-of-googles-march-2024-updates.md","seo-2025-upcoming-changes-and-how-to-adapt":"/src/content/blog/seo-2025-upcoming-changes-and-how-to-adapt.md","training-search-engines-the-next-evolution-of-seo":"/src/content/blog/training-search-engines-the-next-evolution-of-seo.md","the-future-of-seo-if-chatgpt-kills-search-engines":"/src/content/blog/the-future-of-seo-if-chatgpt-kills-search-engines.md","the-future-of-seo-navigating-a-world-where-chatgpt-reigns-supreme":"/src/content/blog/the-future-of-seo-navigating-a-world-where-chatgpt-reigns-supreme.md","seo-in-2024-trends-tips-strategies-guide":"/src/content/blog/seo-in-2024-trends-tips-strategies-guide.md","understanding-shadow-dom-for-a-optimized-indexing":"/src/content/blog/understanding-shadow-dom-for-a-optimized-indexing.md","what-is-googles-search-generative-experience":"/src/content/blog/what-is-googles-search-generative-experience.md","will-chatgpt-end-googles-search-dominance":"/src/content/blog/will-chatgpt-end-googles-search-dominance.md","will-artificial-intelligence-replace-humans":"/src/content/blog/will-artificial-intelligence-replace-humans.md"}},"pages":{"type":"content","entries":{"about":"/src/content/pages/about.md","contact":"/src/content/pages/contact.md","cookie-policy":"/src/content/pages/cookie-policy.md","privacy-policy":"/src/content/pages/privacy-policy.md"}}};

new Set(Object.keys(lookupMap));

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/adapting-to-googles-helpful-content-era.md": () => import('./adapting-to-googles-helpful-content-era_CFniecp4.mjs'),"/src/content/blog/advanced-strategies-for-schema-markup-optimization.md": () => import('./advanced-strategies-for-schema-markup-optimization_CrJ-3wfj.mjs'),"/src/content/blog/ai-and-ml-what-are-the-differences.md": () => import('./ai-and-ml-what-are-the-differences_HyPGOn1a.mjs'),"/src/content/blog/essential-tools-for-seo-optimizing.md": () => import('./essential-tools-for-seo-optimizing_B4UxKvwq.mjs'),"/src/content/blog/exploring-how-google-lamda-language-model-work.md": () => import('./exploring-how-google-lamda-language-model-work_DIYjnNih.mjs'),"/src/content/blog/generative-ai-and-predictive-ai.md": () => import('./generative-ai-and-predictive-ai_BTs63Qen.mjs'),"/src/content/blog/geo-the-future-of-digital-optimization.md": () => import('./geo-the-future-of-digital-optimization_BNAjtheM.mjs'),"/src/content/blog/how-to-create-helpful-content-after-hcu.md": () => import('./how-to-create-helpful-content-after-hcu_BhZqfYZL.mjs'),"/src/content/blog/how-to-use-ai-in-seo-forecasting.md": () => import('./how-to-use-ai-in-seo-forecasting_5yBLRxCH.mjs'),"/src/content/blog/how-to-use-lsi-keywords-in-seo.md": () => import('./how-to-use-lsi-keywords-in-seo_CKjz3nh_.mjs'),"/src/content/blog/in-depth-analysis-of-googles-march-2024-updates.md": () => import('./in-depth-analysis-of-googles-march-2024-updates_pOpfmx0r.mjs'),"/src/content/blog/mastering-bert-in-seo-for-better-semantic-insight.md": () => import('./mastering-bert-in-seo-for-better-semantic-insight_DFWYRBVg.mjs'),"/src/content/blog/optimizing-content-for-google-search-generative-experience.md": () => import('./optimizing-content-for-google-search-generative-experience_Ott3yHtG.mjs'),"/src/content/blog/seo-2025-upcoming-changes-and-how-to-adapt.md": () => import('./seo-2025-upcoming-changes-and-how-to-adapt_CaJU29CA.mjs'),"/src/content/blog/seo-in-2024-trends-tips-strategies-guide.md": () => import('./seo-in-2024-trends-tips-strategies-guide_XcmwSNyy.mjs'),"/src/content/blog/the-future-of-seo-if-chatgpt-kills-search-engines.md": () => import('./the-future-of-seo-if-chatgpt-kills-search-engines_Clf9HwER.mjs'),"/src/content/blog/the-future-of-seo-navigating-a-world-where-chatgpt-reigns-supreme.md": () => import('./the-future-of-seo-navigating-a-world-where-chatgpt-reigns-supreme_BnJeQB0_.mjs'),"/src/content/blog/training-search-engines-the-next-evolution-of-seo.md": () => import('./training-search-engines-the-next-evolution-of-seo_FAGF6G-r.mjs'),"/src/content/blog/understanding-shadow-dom-for-a-optimized-indexing.md": () => import('./understanding-shadow-dom-for-a-optimized-indexing_ChYR3n2j.mjs'),"/src/content/blog/what-is-googles-search-generative-experience.md": () => import('./what-is-googles-search-generative-experience_DXAfhNb1.mjs'),"/src/content/blog/will-artificial-intelligence-replace-humans.md": () => import('./will-artificial-intelligence-replace-humans_UMvQYEza.mjs'),"/src/content/blog/will-chatgpt-end-googles-search-dominance.md": () => import('./will-chatgpt-end-googles-search-dominance_DtswIvS7.mjs'),"/src/content/pages/about.md": () => import('./about_Cr678fOT.mjs'),"/src/content/pages/contact.md": () => import('./contact_GWBQir-T.mjs'),"/src/content/pages/cookie-policy.md": () => import('./cookie-policy_DefFt4GU.mjs'),"/src/content/pages/privacy-policy.md": () => import('./privacy-policy_Cljz0qYl.mjs')});
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const cacheEntriesByCollection = new Map();
const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
	cacheEntriesByCollection,
});

export { getCollection as g };
