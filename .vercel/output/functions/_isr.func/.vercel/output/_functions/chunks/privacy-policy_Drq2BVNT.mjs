import { a as createComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro/server_Dvg4Mqde.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<h5 id=\"last-updated-09-nov-2024\"><strong>Last Updated</strong>: 09-Nov-2024</h5>\n<h2 id=\"who-we-are\">Who we are</h2>\n<p>Our website address is: <a href=\"https://www.serp-secrets.com/\">https://www.serp-secrets.com/</a></p>\n<h2 id=\"what-personal-data-we-collect-and-why-we-collect-it\">What personal data we collect and why we collect it</h2>\n<h3 id=\"analytics\">Analytics</h3>\n<p>We use Google Analytics to understand how visitors interact with our website. This service collects data anonymously and helps us improve our website experience. For more information about how Google Analytics handles your data, please visit their <a href=\"https://policies.google.com/privacy\">Privacy Policy</a>.</p>\n<h3 id=\"cookies\">Cookies</h3>\n<p>We use cookies on our website. For detailed information about the cookies we use, please see our <a href=\"/cookie-policy/\">Cookie Policy</a>.</p>\n<h3 id=\"theme-preferences\">Theme Preferences</h3>\n<p>We store your theme preference (light/dark mode) locally on your device to improve your browsing experience. This information is not transmitted to our servers.</p>\n<h3 id=\"embedded-content-from-other-websites\">Embedded content from other websites</h3>\n<p>Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.</p>\n<p>These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.</p>\n<h2 id=\"your-rights\">Your rights</h2>\n<p>Under the General Data Protection Regulation (GDPR), you have several rights regarding your personal data:</p>\n<ul>\n<li>The right to be informed</li>\n<li>The right of access</li>\n<li>The right to rectification</li>\n<li>The right to erasure</li>\n<li>The right to restrict processing</li>\n<li>The right to data portability</li>\n<li>The right to object</li>\n<li>Rights in relation to automated decision making and profiling</li>\n</ul>\n<p>To exercise any of these rights, please contact us at <a href=\"mailto:privacy@filippodanesi.it\">privacy@filippodanesi.it</a>.</p>\n<h2 id=\"how-we-protect-your-data\">How we protect your data</h2>\n<p>We take appropriate measures to protect your personal information and keep it secure. We use secure protocols for communication and transferring data (such as HTTPS).</p>\n<h2 id=\"changes-to-this-privacy-policy\">Changes to this privacy policy</h2>\n<p>We may update this privacy policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. The latest version will always be available on this page.</p>\n<h2 id=\"contact-information\">Contact information</h2>\n<p>For any questions or concerns about our privacy policy or your personal data, please contact us at <a href=\"mailto:privacy@filippodanesi.it\">privacy@filippodanesi.it</a>.</p>";

				const frontmatter = {"title":"Privacy Policy","publishDate":"2024-11-09","seo":{"title":"Privacy Policy","description":"Information about how we collect and handle your data on our website."},"minutesRead":"2 min read"};
				const file = "/Users/filippo/Desktop/serp-secrets.com/src/content/pages/privacy-policy.md";
				const url = "/privacy-policy";
				function rawContent() {
					return "\n##### **Last Updated**: 09-Nov-2024\n\n## Who we are\n\nOur website address is: https://www.serp-secrets.com/\n\n## What personal data we collect and why we collect it\n\n### Analytics\n\nWe use Google Analytics to understand how visitors interact with our website. This service collects data anonymously and helps us improve our website experience. For more information about how Google Analytics handles your data, please visit their [Privacy Policy](https://policies.google.com/privacy).\n\n### Cookies\n\nWe use cookies on our website. For detailed information about the cookies we use, please see our [Cookie Policy](/cookie-policy/).\n\n### Theme Preferences\n\nWe store your theme preference (light/dark mode) locally on your device to improve your browsing experience. This information is not transmitted to our servers.\n\n### Embedded content from other websites\n\nArticles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.\n\nThese websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.\n\n## Your rights\n\nUnder the General Data Protection Regulation (GDPR), you have several rights regarding your personal data:\n\n- The right to be informed\n- The right of access\n- The right to rectification\n- The right to erasure\n- The right to restrict processing\n- The right to data portability\n- The right to object\n- Rights in relation to automated decision making and profiling\n\nTo exercise any of these rights, please contact us at [privacy@filippodanesi.it](mailto:privacy@filippodanesi.it).\n\n## How we protect your data\n\nWe take appropriate measures to protect your personal information and keep it secure. We use secure protocols for communication and transferring data (such as HTTPS).\n\n## Changes to this privacy policy\n\nWe may update this privacy policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. The latest version will always be available on this page.\n\n## Contact information\n\nFor any questions or concerns about our privacy policy or your personal data, please contact us at [privacy@filippodanesi.it](mailto:privacy@filippodanesi.it).\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":5,"slug":"last-updated-09-nov-2024","text":"Last Updated: 09-Nov-2024"},{"depth":2,"slug":"who-we-are","text":"Who we are"},{"depth":2,"slug":"what-personal-data-we-collect-and-why-we-collect-it","text":"What personal data we collect and why we collect it"},{"depth":3,"slug":"analytics","text":"Analytics"},{"depth":3,"slug":"cookies","text":"Cookies"},{"depth":3,"slug":"theme-preferences","text":"Theme Preferences"},{"depth":3,"slug":"embedded-content-from-other-websites","text":"Embedded content from other websites"},{"depth":2,"slug":"your-rights","text":"Your rights"},{"depth":2,"slug":"how-we-protect-your-data","text":"How we protect your data"},{"depth":2,"slug":"changes-to-this-privacy-policy","text":"Changes to this privacy policy"},{"depth":2,"slug":"contact-information","text":"Contact information"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
