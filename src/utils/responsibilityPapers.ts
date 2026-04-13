import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Locale } from "@/data/locales";

type ResponsibilityPaperSource = {
  slug: string;
  fileName: string;
  order: number;
  fallbackEnTitle: string;
};

export type ResponsibilityPaper = {
  slug: string;
  order: number;
  title: Record<Locale, string>;
  subtitle: string;
  summary: Record<Locale, string>;
  blocks: string[];
};

const SOURCES: ResponsibilityPaperSource[] = [
  {
    slug: "packaging-discipline",
    fileName: "responsibility1.md",
    order: 1,
    fallbackEnTitle: "Packaging",
  },
  {
    slug: "buying-discipline",
    fileName: "responsibility2.md",
    order: 2,
    fallbackEnTitle: "Buying",
  },
  {
    slug: "waste-control",
    fileName: "responsibility3.md",
    order: 3,
    fallbackEnTitle: "Waste",
  },
];

function stripLeadingIndex(text: string): string {
  return text.replace(/^\s*[一二三四五六七八九十0-9]+[、.．]\s*/, "").trim();
}

function splitIntoBlocks(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(Boolean);
}

function getSummary(blocks: string[]): string {
  const firstBlock = blocks[0] ?? "";
  const normalized = firstBlock.replace(/\s+/g, " ").trim();
  if (normalized.length <= 120) return normalized;
  return `${normalized.slice(0, 120).trimEnd()}…`;
}

function isShortEnglishTitle(line: string): boolean {
  const text = line.trim();
  if (!text || text.length > 80) return false;
  return /^[A-Za-z][A-Za-z0-9\s\-&/]+$/.test(text);
}

async function parsePaper(
  source: ResponsibilityPaperSource
): Promise<ResponsibilityPaper> {
  const filePath = path.join(process.cwd(), "paper", source.fileName);
  const raw = await readFile(filePath, "utf-8");
  const lines = raw.split(/\r?\n/);
  const nonEmptyLineIndexes = lines
    .map((line, index) => ({ line: line.trim(), index }))
    .filter(item => item.line.length > 0);

  const zhTitleRaw = nonEmptyLineIndexes[0]?.line ?? `責任文章 ${source.order}`;
  const zhTitle = stripLeadingIndex(zhTitleRaw);

  const possibleEn = nonEmptyLineIndexes[1]?.line ?? "";
  const enTitle = isShortEnglishTitle(possibleEn)
    ? possibleEn
    : source.fallbackEnTitle;

  const contentStartIndex = isShortEnglishTitle(possibleEn)
    ? (nonEmptyLineIndexes[1]?.index ?? 0) + 1
    : (nonEmptyLineIndexes[0]?.index ?? 0) + 1;

  const body = lines.slice(contentStartIndex).join("\n").trim();
  const blocks = splitIntoBlocks(body);
  const summary = getSummary(blocks);

  return {
    slug: source.slug,
    order: source.order,
    title: {
      en: enTitle,
      "zh-hant": zhTitle,
    },
    subtitle: enTitle,
    summary: {
      en: summary,
      "zh-hant": summary,
    },
    blocks,
  };
}

export async function getResponsibilityPapers(): Promise<ResponsibilityPaper[]> {
  const papers = await Promise.all(SOURCES.map(source => parsePaper(source)));
  return papers.toSorted((a, b) => a.order - b.order);
}

export async function getResponsibilityPaperBySlug(
  slug: string
): Promise<ResponsibilityPaper | undefined> {
  const papers = await getResponsibilityPapers();
  return papers.find(paper => paper.slug === slug);
}
