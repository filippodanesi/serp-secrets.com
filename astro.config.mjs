import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import tailwind from '@astrojs/tailwind';
import jopSoftwarecookieconsent from '@jop-software/astro-cookieconsent';
import react from '@astrojs/react';
import { remarkReadingTime } from './remark-reading-time.mjs';

export default defineConfig({
  site: 'https://www.serp-secrets.com',
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: false },
    isr: { expiration: 60 * 60 * 24 },
  }),
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  redirects: {
    '/seo-strategies/': '/categories/seo-strategies/',
    '/seo-news/': '/categories/seo-news/',
    '/artificial-intelligence/': '/categories/artificial-intelligence/',
    '/technical-seo/': '/categories/technical-seo/',
    '/technical-seo/advanced-strategies-for-schema-markup-optimization/': '/blog/advanced-strategies-for-schema-markup-optimization/',
    '/posts/how-to-use-ai-in-seo-forecasting/': '/blog/how-to-use-ai-in-seo-forecasting/',
    '/seo-strategies/how-to-use-ai-in-seo-forecasting/': '/blog/how-to-use-ai-in-seo-forecasting/',
    '/technical-seo/understanding-shadow-dom-for-a-optimized-indexing/': '/blog/understanding-shadow-dom-for-a-optimized-indexing/',
    '/seo-strategies/seo-in-2024-trends-tips-strategies-guide/': '/blog/seo-in-2024-trends-tips-strategies-guide/',
    '/seo-strategies/optimizing-content-for-google-search-generative-experience/': '/blog/optimizing-content-for-google-search-generative-experience/',
    '/seo-news/in-depth-analysis-of-googles-march-2024-updates/': '/blog/in-depth-analysis-of-googles-march-2024-updates/',
    '/technical-seo/mastering-bert-in-seo-for-better-semantic-insight/': '/blog/mastering-bert-in-seo-for-better-semantic-insight/',
    '/seo-strategies/training-search-engines-the-next-evolution-of-seo/': '/blog/training-search-engines-the-next-evolution-of-seo/',
    '/seo-news/seo-2025-upcoming-changes-and-how-to-adapt/': '/blog/seo-2025-upcoming-changes-and-how-to-adapt/',
    '/artificial-intelligence/the-future-of-seo-if-chatgpt-kills-search-engines/': '/blog/the-future-of-seo-if-chatgpt-kills-search-engines/',
    '/seo-news/the-future-of-seo-navigating-a-world-where-chatgpt-reigns-supreme/': '/blog/the-future-of-seo-navigating-a-world-where-chatgpt-reigns-supreme/',
    '/blog/technical-seo/advanced-strategies-for-schema-markup-optimization/': '/blog/advanced-strategies-for-schema-markup-optimization/',
    '/blog/posts/how-to-use-ai-in-seo-forecasting/': '/blog/how-to-use-ai-in-seo-forecasting/',
    '/blog/seo-strategies/how-to-use-ai-in-seo-forecasting/': '/blog/how-to-use-ai-in-seo-forecasting/',
    '/blog/technical-seo/understanding-shadow-dom-for-a-optimized-indexing/': '/blog/understanding-shadow-dom-for-a-optimized-indexing/',
    '/blog/seo-strategies/seo-in-2024-trends-tips-strategies-guide/': '/blog/seo-in-2024-trends-tips-strategies-guide/',
    '/blog/seo-strategies/optimizing-content-for-google-search-generative-experience/': '/blog/optimizing-content-for-google-search-generative-experience/',
    '/blog/seo-news/in-depth-analysis-of-googles-march-2024-updates/': '/blog/in-depth-analysis-of-googles-march-2024-updates/',
    '/blog/technical-seo/mastering-bert-in-seo-for-better-semantic-insight/': '/blog/mastering-bert-in-seo-for-better-semantic-insight/',
    '/blog/seo-strategies/training-search-engines-the-next-evolution-of-seo/': '/blog/training-search-engines-the-next-evolution-of-seo/',
    '/blog/seo-news/seo-2025-upcoming-changes-and-how-to-adapt/': '/blog/seo-2025-upcoming-changes-and-how-to-adapt/',
    '/blog/artificial-intelligence/the-future-of-seo-if-chatgpt-kills-search-engines/': '/blog/the-future-of-seo-if-chatgpt-kills-search-engines/',
    '/blog/seo-news/the-future-of-seo-navigating-a-world-where-chatgpt-reigns-supreme/': '/blog/the-future-of-seo-navigating-a-world-where-chatgpt-reigns-supreme/',
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    jopSoftwarecookieconsent({
      mode: 'opt-in',
      autoShow: true,
      revision: 1,
      disablePageInteraction: false,
      lazyHtmlGeneration: true,
      
      cookie: {
        name: 'cc_cookie',
        expiresAfterDays: acceptType => acceptType === 'all' ? 365 : 182,
        sameSite: 'Lax',
        useLocalStorage: false
      },

      guiOptions: {
        consentModal: {
          layout: "box inline",
          position: "bottom left",
          equalWeightButtons: true,
          flipButtons: false
        },
        preferencesModal: {
          layout: "cloud",
          position: "center",
          equalWeightButtons: true,
          flipButtons: false
        }
      },

      categories: {
        necessary: {
          enabled: true,
          readOnly: true
        },
        functionality: {
          enabled: false,
          readOnly: false
        },
        analytics: {
          enabled: false,
          readOnly: false,
          autoClear: {
            cookies: [
              {
                name: /^(_ga|_gid|_ga_.*)/,
                domain: 'serp-secrets.com'
              }
            ]
          }
        }
      },

      language: {
        default: "en",
        autoDetect: "browser",
        translations: {
          en: {
            consentModal: {
              title: "We use cookies!",
              description: "We use cookies to enhance your browsing experience and analyze site traffic.",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              showPreferencesBtn: "Manage preferences",
              closeIconLabel: "Close modal",
              footer: '<a href="/privacy-policy/" class="cc-link">Privacy Policy</a>\n<a href="/cookie-policy/" class="cc-link">Cookie Policy</a>'
            },
            preferencesModal: {
              title: "Cookie Preferences",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              savePreferencesBtn: "Save preferences",
              closeIconLabel: "Close modal",
              sections: [
                {
                  title: "Cookie Usage",
                  description: "We use cookies to optimize your experience on our website."
                },
                {
                  title: "Necessary Cookies",
                  description: "These cookies are essential for the website to function properly.",
                  linkedCategory: "necessary"
                },
                {
                  title: "Analytics Cookies",
                  description: "These cookies help us analyze and improve our site usage.",
                  linkedCategory: "analytics"
                },
                {
                  title: "More information",
                  description: 'For more information about how we process your data and your privacy rights, please read our <a href="/privacy-policy/" class="cc-link">Privacy Policy</a> and <a href="/cookie-policy/" class="cc-link">Cookie Policy</a>.'
                }
              ]
            }
          }
        }
      }
    })
  ],
});