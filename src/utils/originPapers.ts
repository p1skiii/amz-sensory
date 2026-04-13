import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Locale } from "@/data/locales";

type OriginPaperSource = {
  slug: string;
  fileName: string;
  order: number;
};

export type OriginPaper = {
  slug: string;
  order: number;
  title: Record<Locale, string>;
  subtitle: string;
  summary: Record<Locale, string>;
  blocks: string[];
};

const SOURCES: OriginPaperSource[] = [
  { slug: "traceability", fileName: "origin13.md", order: 1 },
  { slug: "long-term-relationships", fileName: "origin2.md", order: 2 },
  { slug: "verifiable-language", fileName: "origin3.md", order: 3 },
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

async function parsePaper(source: OriginPaperSource): Promise<OriginPaper> {
  const filePath = path.join(process.cwd(), "paper", source.fileName);
  const raw = await readFile(filePath, "utf-8");
  const lines = raw.split(/\r?\n/);
  const nonEmptyLineIndexes = lines
    .map((line, index) => ({ line: line.trim(), index }))
    .filter(item => item.line.length > 0);

  const zhTitleRaw = nonEmptyLineIndexes[0]?.line ?? `產地文章 ${source.order}`;
  const zhTitle = stripLeadingIndex(zhTitleRaw);
  const enTitle = nonEmptyLineIndexes[1]?.line ?? "Origin Note";
  const contentStartIndex = (nonEmptyLineIndexes[1]?.index ?? -1) + 1;
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

export async function getOriginPapers(): Promise<OriginPaper[]> {
  const papers = await Promise.all(SOURCES.map(source => parsePaper(source)));
  return papers.toSorted((a, b) => a.order - b.order);
}

export async function getOriginPaperBySlug(
  slug: string
): Promise<OriginPaper | undefined> {
  const papers = await getOriginPapers();
  return papers.find(paper => paper.slug === slug);
}
