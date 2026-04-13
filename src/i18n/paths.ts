import { LOCALES } from "@/data/locales";

export { LOCALES };

type Locale = (typeof LOCALES)[number];

export function getAltPath(pathname: string, to: Locale) {
  const target = LOCALES.includes(to) ? to : LOCALES[0];
  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0];

  let rest = parts;
  if (LOCALES.includes(first as Locale)) rest = parts.slice(1);

  return "/" + [target, ...rest].join("/") + (pathname.endsWith("/") ? "/" : "");
}
