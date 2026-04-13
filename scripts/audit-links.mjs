import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const INSPECT_DIRS = ["en", "zh-hant"].map(dir => path.join(DIST_DIR, dir));

const IGNORE_PREFIXES = [
  "mailto:",
  "tel:",
  "#",
  "javascript:",
  "data:",
  "http://",
  "https://",
  "//",
  "/_astro/",
  "/brand/",
  "/covers/",
  "/favicon",
  "/sitemap",
  "/robots.txt",
];

function normalizeHref(href) {
  return href.split("#")[0].split("?")[0];
}

function shouldIgnore(href) {
  return IGNORE_PREFIXES.some(prefix => href.startsWith(prefix));
}

function routeExists(href) {
  const normalized = normalizeHref(href);
  if (!normalized.startsWith("/")) return true;

  const withoutLeading = normalized.replace(/^\//, "");

  if (path.extname(withoutLeading)) {
    return existsSync(path.join(DIST_DIR, withoutLeading));
  }

  if (normalized.endsWith("/")) {
    return existsSync(path.join(DIST_DIR, withoutLeading, "index.html"));
  }

  return (
    existsSync(path.join(DIST_DIR, `${withoutLeading}.html`)) ||
    existsSync(path.join(DIST_DIR, withoutLeading, "index.html"))
  );
}

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

const missing = new Set();

for (const dir of INSPECT_DIRS) {
  if (!existsSync(dir)) continue;

  const htmlFiles = await collectHtmlFiles(dir);
  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, "utf8");
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = normalizeHref(match[1]);
      if (!href || shouldIgnore(href)) continue;
      if (!href.startsWith("/")) continue;
      if (!routeExists(href)) {
        missing.add(href);
      }
    }
  }
}

if (missing.size > 0) {
  process.stderr.write("Internal link audit failed:\n\n");
  for (const href of [...missing].sort()) {
    process.stderr.write(`- ${href}\n`);
  }
  process.exit(1);
}

process.stdout.write("Internal link audit passed.\n");
