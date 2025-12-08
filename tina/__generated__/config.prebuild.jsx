// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  // Get these from tina.io if you want cloud features (optional)
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Blog Posts",
        path: "content/posts",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            options: [
              "Artificial Intelligence",
              "SEO News",
              "SEO Strategies",
              "Technical SEO"
            ]
          },
          {
            type: "image",
            name: "image",
            label: "Featured Image"
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft"
          },
          {
            type: "string",
            name: "summary",
            label: "AI Summary (auto-generated)",
            description: "Auto-generated summary for AEO. Leave empty to generate on build.",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ],
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.title?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") || "";
            }
          }
        }
      },
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
