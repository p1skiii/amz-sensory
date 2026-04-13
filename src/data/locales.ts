export const LOCALES = ["zh-hant", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh-hant";

export function isLocale(value: string | undefined): value is Locale {
  if (!value) return false;
  return (LOCALES as readonly string[]).includes(value);
}

export function localizedPath(locale: Locale, path = ""): string {
  const normalized = path.replace(/^\/+|\/+$/g, "");
  return normalized ? `/${locale}/${normalized}/` : `/${locale}/`;
}

export function pickLocale<T>(value: Record<Locale, T>, locale: Locale): T {
  return value[locale];
}
