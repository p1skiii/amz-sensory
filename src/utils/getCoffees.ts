import { getCollection } from "astro:content";
import type { Locale } from "@/data/locales";

type LocalizedText = Record<Locale, string>;
type LocalizedList = Record<Locale, string[]>;

type CoffeeStatus = "draft" | "published";

export type CoffeeData = {
  stable_key: string;
  slug: string;
  legacy_slugs: string[];
  status: CoffeeStatus;
  order: number;
  title: LocalizedText;
  origin: LocalizedText;
  process: LocalizedText;
  priceHkd: number;
  tasting: LocalizedList;
  notes: LocalizedText;
  story: LocalizedText;
  cover: string;
};

export type CoffeeEntry = {
  id: string;
  source: "local" | "notion";
  data: CoffeeData;
};

type NotionDatabaseQueryResponse = {
  results: NotionPage[];
  has_more: boolean;
  next_cursor: string | null;
};

type NotionPage = {
  id: string;
  properties: Record<string, NotionProperty>;
};

type NotionProperty = {
  type?: string;
  [key: string]: unknown;
};

type NotionOverride = Partial<CoffeeData> & { stable_key: string };
const NOTION_REQUEST_TIMEOUT_MS = 8000;

function normalizeText(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeCoverUrl(url?: string): string | undefined {
  const normalized = normalizeText(url);
  if (!normalized) return undefined;

  if (normalized.startsWith("/")) return normalized;
  try {
    const parsed = new URL(normalized);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function pickProperty(
  properties: Record<string, NotionProperty>,
  names: string[]
): NotionProperty | undefined {
  for (const name of names) {
    if (properties[name]) return properties[name];
  }
  return undefined;
}

function richTextToString(value: unknown): string | undefined {
  if (!Array.isArray(value)) return undefined;
  const text = value
    .map(item => {
      if (typeof item !== "object" || item === null) return "";
      const plain = (item as { plain_text?: unknown }).plain_text;
      return typeof plain === "string" ? plain : "";
    })
    .join("")
    .trim();
  return text.length > 0 ? text : undefined;
}

function propertyToText(property?: NotionProperty): string | undefined {
  if (!property) return undefined;
  const type = property.type;
  if (type === "title") return richTextToString(property.title);
  if (type === "rich_text") return richTextToString(property.rich_text);
  if (type === "url") {
    return typeof property.url === "string" ? property.url.trim() : undefined;
  }
  if (type === "select") {
    const select = property.select as { name?: unknown } | null | undefined;
    return typeof select?.name === "string" ? select.name.trim() : undefined;
  }
  if (typeof property.name === "string") return property.name.trim();
  return undefined;
}

function propertyToNumber(property?: NotionProperty): number | undefined {
  if (!property) return undefined;
  if (property.type === "number") {
    const numberValue = property.number;
    return typeof numberValue === "number" && Number.isFinite(numberValue)
      ? numberValue
      : undefined;
  }
  const text = propertyToText(property);
  if (!text) return undefined;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function propertyToStatus(property?: NotionProperty): CoffeeStatus | undefined {
  if (!property) return undefined;
  if (property.type === "status") {
    const status = property.status as { name?: unknown } | null | undefined;
    const name =
      typeof status?.name === "string"
        ? status.name.toLowerCase()
        : undefined;
    if (name === "published") return "published";
    if (name === "draft") return "draft";
  }
  const text = propertyToText(property)?.toLowerCase();
  if (text === "published" || text === "draft") return text;
  return undefined;
}

function propertyToStringList(property?: NotionProperty): string[] | undefined {
  if (!property) return undefined;

  if (property.type === "multi_select") {
    const list = Array.isArray(property.multi_select)
      ? property.multi_select
      : [];
    const names = list
      .map(item => {
        if (typeof item !== "object" || item === null) return undefined;
        const name = (item as { name?: unknown }).name;
        return typeof name === "string" ? name.trim() : undefined;
      })
      .filter((item): item is string => Boolean(item));
    return names.length > 0 ? names : undefined;
  }

  const text = propertyToText(property);
  if (!text) return undefined;

  const list = text
    .split(/[,|·\n]/g)
    .map(item => item.trim())
    .filter(Boolean);

  return list.length > 0 ? list : undefined;
}

function propertyToFileUrl(property?: NotionProperty): string | undefined {
  if (!property) return undefined;
  if (property.type !== "files") return undefined;
  const files = Array.isArray(property.files) ? property.files : [];
  const first = files[0] as
    | {
        type?: string;
        external?: { url?: string };
        file?: { url?: string };
      }
    | undefined;
  if (!first) return undefined;
  if (first.type === "external") return normalizeCoverUrl(first.external?.url);
  if (first.type === "file") return normalizeCoverUrl(first.file?.url);
  return undefined;
}

function mergeLocalizedText(
  base: LocalizedText,
  override?: Partial<LocalizedText>
): LocalizedText {
  return {
    en: normalizeText(override?.en) ?? base.en,
    "zh-hant": normalizeText(override?.["zh-hant"]) ?? base["zh-hant"],
  };
}

function mergeLocalizedList(
  base: LocalizedList,
  override?: Partial<LocalizedList>
): LocalizedList {
  const en = override?.en?.filter(Boolean) ?? base.en;
  const zh = override?.["zh-hant"]?.filter(Boolean) ?? base["zh-hant"];
  return {
    en: en.length > 0 ? en : base.en,
    "zh-hant": zh.length > 0 ? zh : base["zh-hant"],
  };
}

function mergeWithOverride(base: CoffeeData, override: NotionOverride): CoffeeData {
  return {
    ...base,
    stable_key: override.stable_key,
    slug: normalizeText(override.slug) ?? base.slug,
    legacy_slugs: override.legacy_slugs ?? base.legacy_slugs,
    status: override.status ?? base.status,
    order: typeof override.order === "number" ? override.order : base.order,
    title: mergeLocalizedText(base.title, override.title),
    origin: mergeLocalizedText(base.origin, override.origin),
    process: mergeLocalizedText(base.process, override.process),
    priceHkd:
      typeof override.priceHkd === "number" ? override.priceHkd : base.priceHkd,
    tasting: mergeLocalizedList(base.tasting, override.tasting),
    notes: mergeLocalizedText(base.notes, override.notes),
    story: mergeLocalizedText(base.story, override.story),
    cover: normalizeCoverUrl(override.cover) ?? base.cover,
  };
}

function completeNotionRecord(record: NotionOverride): CoffeeData | undefined {
  if (!record.stable_key) return undefined;
  if (record.status === "draft") return undefined;

  const slug = normalizeText(record.slug) ?? record.stable_key;
  const titleEn = normalizeText(record.title?.en);
  const titleZh = normalizeText(record.title?.["zh-hant"]);
  const originEn = normalizeText(record.origin?.en);
  const originZh = normalizeText(record.origin?.["zh-hant"]);
  const processEn = normalizeText(record.process?.en);
  const processZh = normalizeText(record.process?.["zh-hant"]);
  const notesEn = normalizeText(record.notes?.en);
  const notesZh = normalizeText(record.notes?.["zh-hant"]);
  const storyEn = normalizeText(record.story?.en);
  const storyZh = normalizeText(record.story?.["zh-hant"]);
  const cover = normalizeCoverUrl(record.cover);

  if (
    !titleEn ||
    !titleZh ||
    !originEn ||
    !originZh ||
    !processEn ||
    !processZh ||
    typeof record.priceHkd !== "number" ||
    !notesEn ||
    !notesZh ||
    !storyEn ||
    !storyZh ||
    !cover
  ) {
    return undefined;
  }

  const tastingEn = record.tasting?.en?.filter(Boolean) ?? [];
  const tastingZh = record.tasting?.["zh-hant"]?.filter(Boolean) ?? [];
  if (tastingEn.length === 0 || tastingZh.length === 0) return undefined;

  return {
    stable_key: record.stable_key,
    slug,
    legacy_slugs: record.legacy_slugs ?? [],
    status: "published",
    order: typeof record.order === "number" ? record.order : 999,
    title: { en: titleEn, "zh-hant": titleZh },
    origin: { en: originEn, "zh-hant": originZh },
    process: { en: processEn, "zh-hant": processZh },
    priceHkd: record.priceHkd,
    tasting: { en: tastingEn, "zh-hant": tastingZh },
    notes: { en: notesEn, "zh-hant": notesZh },
    story: { en: storyEn, "zh-hant": storyZh },
    cover,
  };
}

async function getLocalSampleCoffees(): Promise<CoffeeEntry[]> {
  const entries = await getCollection("coffees");
  return entries
    .map(entry => ({
      id: entry.id,
      source: "local" as const,
      data: {
        stable_key: entry.data.stable_key,
        slug: entry.data.slug,
        legacy_slugs: entry.data.legacy_slugs ?? [],
        status: entry.data.status,
        order: entry.data.order,
        title: entry.data.title,
        origin: entry.data.origin,
        process: entry.data.process,
        priceHkd: entry.data.priceHkd,
        tasting: entry.data.tasting,
        notes: entry.data.notes,
        story: entry.data.story,
        cover: entry.data.cover,
      },
    }))
    .filter(entry => entry.data.status === "published")
    .toSorted((a, b) => a.data.order - b.data.order);
}

function notionEnabled(): boolean {
  return (import.meta.env.NOTION_ENABLED ?? "").toLowerCase() === "true";
}

function notionHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  };
}

async function queryNotionPages(
  token: string,
  databaseId: string
): Promise<NotionPage[]> {
  const pages: NotionPage[] = [];
  let cursor: string | null = null;

  do {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), NOTION_REQUEST_TIMEOUT_MS);
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: notionHeaders(token),
        signal: controller.signal,
        body: JSON.stringify(
          cursor
            ? {
                start_cursor: cursor,
              }
            : {}
        ),
      }
    ).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      throw new Error(`Notion query failed (${response.status})`);
    }

    const payload = (await response.json()) as NotionDatabaseQueryResponse;
    pages.push(...payload.results);
    cursor = payload.has_more ? payload.next_cursor : null;
  } while (cursor);

  return pages;
}

function parseNotionPage(page: NotionPage): NotionOverride | undefined {
  const props = page.properties;

  const stableKey = normalizeText(
    propertyToText(pickProperty(props, ["stable_key", "Stable Key", "stableKey"]))
  );
  if (!stableKey) return undefined;

  const status =
    propertyToStatus(pickProperty(props, ["status", "Status"])) ?? "published";

  const cover =
    propertyToFileUrl(pickProperty(props, ["cover", "Cover"])) ??
    normalizeCoverUrl(propertyToText(pickProperty(props, ["cover_url", "coverUrl"])));

  const slug = normalizeText(
    propertyToText(pickProperty(props, ["slug", "Slug"]))
  );

  const legacyRaw = propertyToStringList(
    pickProperty(props, ["legacy_slugs", "legacySlugs", "Legacy Slugs"])
  );

  const tastingEn = propertyToStringList(
    pickProperty(props, ["tasting_en", "Tasting EN"])
  );
  const tastingZh = propertyToStringList(
    pickProperty(props, ["tasting_zh_hant", "Tasting ZH"])
  );

  const notionRecord: NotionOverride = {
    stable_key: stableKey,
    status,
    slug,
    legacy_slugs: legacyRaw,
    order: propertyToNumber(pickProperty(props, ["order", "Order"])),
    priceHkd: propertyToNumber(pickProperty(props, ["price_hkd", "Price HKD"])),
    title: {
      en: propertyToText(pickProperty(props, ["title_en", "Title EN"])) ?? "",
      "zh-hant":
        propertyToText(pickProperty(props, ["title_zh_hant", "Title ZH"])) ?? "",
    },
    origin: {
      en: propertyToText(pickProperty(props, ["origin_en", "Origin EN"])) ?? "",
      "zh-hant":
        propertyToText(pickProperty(props, ["origin_zh_hant", "Origin ZH"])) ??
        "",
    },
    process: {
      en: propertyToText(pickProperty(props, ["process_en", "Process EN"])) ?? "",
      "zh-hant":
        propertyToText(pickProperty(props, ["process_zh_hant", "Process ZH"])) ??
        "",
    },
    tasting: {
      en: tastingEn ?? [],
      "zh-hant": tastingZh ?? [],
    },
    notes: {
      en: propertyToText(pickProperty(props, ["notes_en", "Notes EN"])) ?? "",
      "zh-hant":
        propertyToText(pickProperty(props, ["notes_zh_hant", "Notes ZH"])) ?? "",
    },
    story: {
      en: propertyToText(pickProperty(props, ["story_en", "Story EN"])) ?? "",
      "zh-hant":
        propertyToText(pickProperty(props, ["story_zh_hant", "Story ZH"])) ?? "",
    },
    cover,
  };

  return notionRecord;
}

async function getNotionOverrides(): Promise<Map<string, NotionOverride>> {
  const token = import.meta.env.NOTION_TOKEN;
  const databaseId = import.meta.env.NOTION_DATABASE_ID;

  if (!notionEnabled() || !token || !databaseId) {
    return new Map();
  }

  const pages = await queryNotionPages(token, databaseId);
  const map = new Map<string, NotionOverride>();
  for (const page of pages) {
    const record = parseNotionPage(page);
    if (!record || record.status === "draft") continue;
    map.set(record.stable_key, record);
  }
  return map;
}

export async function getAllCoffees(): Promise<CoffeeEntry[]> {
  const localSamples = await getLocalSampleCoffees();
  let overrides = new Map<string, NotionOverride>();

  try {
    overrides = await getNotionOverrides();
  } catch {
    // Notion failure should never take the catalog down.
    overrides = new Map();
  }

  const merged = localSamples.map(sample => {
    const override = overrides.get(sample.data.stable_key);
    if (!override) return sample;

    overrides.delete(sample.data.stable_key);
    return {
      id: `notion-${sample.data.stable_key}`,
      source: "notion" as const,
      data: mergeWithOverride(sample.data, override),
    };
  });

  for (const [stableKey, override] of overrides) {
    const complete = completeNotionRecord(
      override.stable_key
        ? override
        : {
            ...override,
            stable_key: stableKey,
          }
    );
    if (!complete) continue;
    merged.push({
      id: `notion-${stableKey}`,
      source: "notion",
      data: complete,
    });
  }

  return merged.toSorted((a, b) => a.data.order - b.data.order);
}

export async function getCoffeeBySlug(
  slug: string
): Promise<CoffeeEntry | undefined> {
  const coffees = await getAllCoffees();
  return coffees.find(coffee => coffee.data.slug === slug);
}

export async function getCoffeeBySlugOrLegacy(
  slug: string
): Promise<{ coffee?: CoffeeEntry; matchedLegacy: boolean }> {
  const coffees = await getAllCoffees();
  const exact = coffees.find(coffee => coffee.data.slug === slug);
  if (exact) return { coffee: exact, matchedLegacy: false };

  const legacy = coffees.find(coffee =>
    (coffee.data.legacy_slugs ?? []).includes(slug)
  );
  return { coffee: legacy, matchedLegacy: Boolean(legacy) };
}
