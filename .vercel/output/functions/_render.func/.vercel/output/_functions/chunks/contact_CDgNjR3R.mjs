import { a as createComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro/server_Dvg4Mqde.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>Thank you for reaching out! Whether you have a question, a suggestion, or just want to share your thoughts, I’m all ears. Feel free to get in touch through any of the methods below:</p>\n<p><strong><em>Email:</em></strong>\nFeel free to drop me an email at <a href=\"mailto:hello@filippodanesi.it\">hello@filippodanesi.it</a>, and I’ll do my best to respond as soon as possible.</p>\n<p><strong><em>Social Media:</em></strong>\nConnect with me on social media as well. Find me on <a href=\"https://x.com/filippodanesi\">X/Twitter</a> or <a href=\"https://www.linkedin.com/in/filippodanesi/\">LinkedIn</a>.</p>";

				const frontmatter = {"title":"Get in touch","publishDate":"2024-11-07","seo":{"title":"Contact","description":"Get in touch through email or social media! Let me know how I can help."},"minutesRead":"1 min read"};
				const file = "/Users/filippo/Desktop/serp-secrets.com/src/content/pages/contact.md";
				const url = "/contact";
				function rawContent() {
					return "\nThank you for reaching out! Whether you have a question, a suggestion, or just want to share your thoughts, I'm all ears. Feel free to get in touch through any of the methods below:\n\n**_Email:_**\nFeel free to drop me an email at [hello@filippodanesi.it](mailto:hello@filippodanesi.it), and I'll do my best to respond as soon as possible.\n\n**_Social Media:_**\nConnect with me on social media as well. Find me on [X/Twitter](https://x.com/filippodanesi) or [LinkedIn](https://www.linkedin.com/in/filippodanesi/).\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
