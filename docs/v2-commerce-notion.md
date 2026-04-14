# AMZ Sensory v2（Commerce + Notion）

## 分支与工作树
- 线上冻结标签：`v1-live-freeze-2026-04-14`
- v2 主分支：`codex/v2-commerce-notion`
- Notion Spike：`codex/v2-notion-spike`（worktree: `/Users/wang/i/amz-sensory-notion-spike`）

## 路由契约
- 列表：`/{locale}/coffee/`
- 详情：`/{locale}/coffee/{slug}/`
- 购物车：`/{locale}/cart/`
- 支付引导：`/{locale}/pay/{slug}/`
- locale 仅：`en`、`zh-hant`

## Slug 规则
当前样板 slug：
- `ethiopia-guji-01`
- `colombia-huila-01`
- `panama-boquete-01`
- `kenya-nyeri-01`

旧 slug（`ultra-light-01` 等）会 301 到新 slug。

## Notion 替换策略（确认版）
- 优先级：`Notion(published)` > `本地样板`
- 唯一键：`stable_key`
- 覆盖：同 `stable_key` 时用 Notion 字段覆盖样板
- 新增：Notion 出现新 `stable_key` 且字段完整，则自动追加到商品列表
- 回退：Notion 报错/超时/限流/字段不完整时，自动回退本地样板
- 过滤：仅 `status=published` 参与上架

## 环境变量
在 Vercel / 本地环境中配置：
- `NOTION_ENABLED=true`
- `NOTION_TOKEN=secret_xxx`
- `NOTION_DATABASE_ID=xxxxxxxxxxxxxxxx`

> 未配置时系统只使用本地样板，不会报错。

## Notion 字段映射（兼容别名）
- `stable_key` / `Stable Key`
- `slug` / `Slug`
- `status` / `Status`（published/draft）
- `order` / `Order`
- `price_hkd` / `Price HKD`
- `title_en` / `Title EN`
- `title_zh_hant` / `Title ZH`
- `origin_en` / `Origin EN`
- `origin_zh_hant` / `Origin ZH`
- `process_en` / `Process EN`
- `process_zh_hant` / `Process ZH`
- `tasting_en` / `Tasting EN`
- `tasting_zh_hant` / `Tasting ZH`
- `notes_en` / `Notes EN`
- `notes_zh_hant` / `Notes ZH`
- `story_en` / `Story EN`
- `story_zh_hant` / `Story ZH`
- `cover` / `Cover`（files）或 `cover_url`
- `legacy_slugs` / `Legacy Slugs`

## 购物车前端契约
`localStorage` key: `amz-cart-v1`

```ts
items[{ stable_key, slug, title, price_hkd, qty, cover }]
```

## 当前支付范围
- v2 仅前端结算摘要 + WeChat QR 引导
- 不接真实支付网关，不创建后端订单
