# Repository Guidelines
Contributor guide aligned with AMZ Sensory’s design rails and CLAUDE operating principles. Keep changes small and reuse existing patterns.

## Project Structure & Module Organization
- Core code in `src/`; key folders: `components/layout` (Container, Section, Header/Footer, Prose, Divider, LangSwitch), `components/ui` (Aspect, Pill, ButtonLink, Reveal), `components/wechat` (WeChatDrawer + `wechat.ts`), `components/home`, `components/coffee`, `content/` (collections), `i18n/` (paths/config), `pages/` (routes), and `styles/` (`tokens.css`, `global.css`).
- Assets in `public/` (`brand/`, `covers/`); build output in `dist/`; Pagefind index in `public/pagefind/` (generated—do not edit).
- Use the `@/` alias for imports from `src/`; keep new files within `docs/designstructure.md`.

## Build, Test, and Development Commands
- `pnpm install` — install deps (pnpm version pinned in `package.json`).
- `pnpm dev` — run Astro dev server at `localhost:4321`.
- `pnpm build` — run `astro check`, build to `dist/`, generate Pagefind, and copy to `public/pagefind/`.
- `pnpm preview` — serve the production build locally.
- `pnpm lint` — ESLint (Astro + TS) with `no-console`; `pnpm format`/`pnpm format:check` — Prettier with Astro and Tailwind plugins.
- `pnpm sync` — regenerate Astro types after adding content collections.

## Coding Style & Naming Conventions
- Prettier enforced: 2-space indent, semicolons, double quotes, width 80, trailing commas. Tailwind classes auto-sorted; rely on `styles/tokens.css` and `styles/global.css`.
- Strict TypeScript; avoid `any`; prefer shared helpers in `src/utils/`. Components/Layout use `PascalCase.astro/tsx`; pages and content slugs use kebab-case.
- Design guardrails (`docs/designstructure.md`): 12-col grid; fixed spacing (`py-24/32`, `gap-16/24`); hairline borders, no shadows; editorial typography (serif headings, high-line-height sans body); unified 4:5 imagery via `Aspect.astro`; avoid ad-hoc colors.

## Testing Guidelines
- No dedicated automated tests yet; treat `pnpm lint` and `pnpm build` (includes `astro check`) as the minimum gate before PRs.
- For visual pages, self-validate against `docs/checklist.md`: consistent grid, controlled spacing tiers, hairline-only depth, captioned 4:5 imagery, QR modal behavior (esc/backdrop close + text fallback), restrained motion (hover/reveal/drawer timings).

## Commit & Pull Request Guidelines
- Conventional Commits (`cz.yaml`): `feat:`, `fix:`, `chore:`, `docs:`, etc.; keep scopes small (e.g., `feat: add wechat drawer`).
- Before opening a PR, run `pnpm lint` and `pnpm build`; note results and known issues. Link related issues and describe user-facing impact; include desktop + mobile screenshots for UI changes.
- Call out config/env updates (e.g., `PUBLIC_GOOGLE_SITE_VERIFICATION`); keep secrets out. Keep nav under five items and avoid new visual patterns without updating shared tokens/components first.
