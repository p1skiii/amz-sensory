import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const localizedText = z.object({
  en: z.string(),
  "zh-hant": z.string(),
});

const localizedList = z.object({
  en: z.array(z.string()).min(1),
  "zh-hant": z.array(z.string()).min(1),
});

const coffees = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/coffees" }),
  schema: z.object({
    stable_key: z.string().regex(/^[a-z0-9-]+$/),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    legacy_slugs: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
    status: z.enum(["draft", "published"]).default("published"),
    order: z.number().int().nonnegative(),
    title: localizedText,
    origin: localizedText,
    process: localizedText,
    priceHkd: z.number().int().positive(),
    tasting: localizedList,
    notes: localizedText,
    story: localizedText,
    cover: z.string().startsWith("/covers/"),
  }),
});

export const collections = { blog, coffees };
