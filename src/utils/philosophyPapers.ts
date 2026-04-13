import { readFile } from "node:fs/promises";
import path from "node:path";
import { access } from "node:fs/promises";

import type { Locale } from "@/data/locales";

type PhilosophyPaperSource = {
  slug: string;
  fileCandidates: string[];
  order: number;
  fallbackEnTitle: string;
};

export type PhilosophyPaper = {
  slug: string;
  order: number;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  summary: Record<Locale, string>;
  blocks: string[];
};

const SOURCES: PhilosophyPaperSource[] = [
  {
    slug: "aesthetic-first",
    fileCandidates: ["philosophy1.md", "favlour1.md"],
    order: 1,
    fallbackEnTitle: "Aesthetic First",
  },
  {
    slug: "proof-over-claims",
    fileCandidates: ["philosophy2.md", "favlour2.md"],
    order: 2,
    fallbackEnTitle: "Proof Over Claims",
  },
  {
    slug: "restraint",
    fileCandidates: ["philosophy3.md", "favlour3.md"],
    order: 3,
    fallbackEnTitle: "Restraint",
  },
];

async function resolvePaperPath(
  source: PhilosophyPaperSource
): Promise<string> {
  for (const fileName of source.fileCandidates) {
    const filePath = path.join(process.cwd(), "paper", fileName);
    try {
      await access(filePath);
      return filePath;
    } catch {
      continue;
    }
  }

  throw new Error(
    `Missing philosophy source file for "${source.slug}". Tried: ${source.fileCandidates.join(", ")}`
  );
}

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

function isShortChineseHeading(line: string): boolean {
  const text = line.trim();
  if (!text || text.length > 32) return false;
  return !/[。！？]/.test(text);
}

async function parsePaper(
  source: PhilosophyPaperSource
): Promise<PhilosophyPaper> {
  const filePath = await resolvePaperPath(source);
  const raw = await readFile(filePath, "utf-8");
  const lines = raw.split(/\r?\n/);
  const nonEmptyLineIndexes = lines
    .map((line, index) => ({ line: line.trim(), index }))
    .filter(item => item.line.length > 0);

  const zhTitleRaw = nonEmptyLineIndexes[0]?.line ?? `理念文章 ${source.order}`;
  const zhTitle = stripLeadingIndex(zhTitleRaw);

  const possibleZhHeading = nonEmptyLineIndexes[1]?.line ?? "";
  const zhSubtitle = isShortChineseHeading(possibleZhHeading)
    ? possibleZhHeading
    : zhTitle;
  const contentStartIndex = isShortChineseHeading(possibleZhHeading)
    ? (nonEmptyLineIndexes[1]?.index ?? 0) + 1
    : (nonEmptyLineIndexes[0]?.index ?? 0) + 1;

  const body = lines.slice(contentStartIndex).join("\n").trim();
  const blocks = splitIntoBlocks(body);
  const summary = getSummary(blocks);

  return {
    slug: source.slug,
    order: source.order,
    title: {
      en: source.fallbackEnTitle,
      "zh-hant": zhTitle,
    },
    subtitle: {
      en: source.fallbackEnTitle,
      "zh-hant": zhSubtitle,
    },
    summary: {
      en: summary,
      "zh-hant": summary,
    },
    blocks,
  };
}

export async function getPhilosophyPapers(): Promise<PhilosophyPaper[]> {
  const papers = await Promise.all(SOURCES.map(source => parsePaper(source)));
  return papers.toSorted((a, b) => a.order - b.order);
}

export async function getPhilosophyPaperBySlug(
  slug: string
): Promise<PhilosophyPaper | undefined> {
  const papers = await getPhilosophyPapers();
  return papers.find(paper => paper.slug === slug);
}
