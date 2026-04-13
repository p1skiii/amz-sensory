3) 组件级视觉验收 checklist（给你“过不了就不算完工”的标准）

下面每一条都可以当作 PR 自检（能截图对比 April/La Cabra 的那种“秩序感”）。

3.1 全局（站一打开就能感到“高级”的那部分）

 栅格严格：所有页面的正文左边界一致；图片块边界也落在同一套网格上（不能今天 56px 明天 60px）。

 留白有比例：section 之间的间距只用 2–3 个固定等级（比如 40/72/120），禁止“凭感觉”。

 线条替代阴影：不出现卡片投影；层级靠 hairline border + 背景轻微对比。

 颜色数量克制：背景/正文/弱文本/边框/强调色这 5 类够了；强调色只用于链接与 CTA（不要满屏彩）。

 字体像编辑部：标题（封面感）/正文（书页感）/注释（caption 感）三套层级明确；行高稳定，不飘。

 图片“统一摄影语法”：同色温、同曝光、同颗粒/锐化方向、同裁切逻辑；否则再强排版也救不回来。

 动效克制且一致：只做 hover / drawer / modal 三类；同一套时长与缓动，不要每个组件一套。

3.2 Header / Nav（克制、但一眼高级）

 Logo 区域永远不跳动（中英文切换、暗色/亮色都不抖）。

 Nav 项不超过 5 个（你是画册站，不是门户）。

 当前页态只用“细线/浅底/小型强调色”之一，绝不使用按钮式大块高亮。

3.3 你主打的“2 列大图画册段落”（核心质感来源）

 左列文字块与右列图片块顶部对齐或基线对齐（二选一，全站统一）。

 图片比例固定（建议统一 4:5 / 3:2 这类），不要每个 section 一个比例。

 每张图都有 caption（极短：产地/器具/年份/一句话），caption 字号/间距全站一致。

 文字段落宽度受控（不要一行 120 个字符；保持“书页可读”）。

 任何“强调句”只允许两种表现：小号全大写 或 细体斜体（不要又粗又大又彩）。

3.4 Shop（假电商，但体验必须像真的）

 商品列表是“画廊”而不是“电商卡片墙”：卡片阴影=0，信息最少。

 商品详情页：大图 + 风味词 + 烘焙哲学 + 产地透明（四块顺序固定）。

 “Add to cart”只在本地存状态也没问题，但 UI 必须可信。

 “Pay/Checkout”点击后只出现一个统一 QR Modal（全站同一个二维码）。

3.5 QR Modal（你唯一的转化入口）

 Modal 打开后背景滚动锁定；Esc 关闭；点击遮罩关闭。

 二维码尺寸够大（手机扫码无需放大）；旁边必须有 1 行“引导话术”（非常短）。

 二维码图片有降级：加载失败仍显示微信号文本。

3.6 Journal / Brew Guide / Farms（信息密度高但仍“干净”）

 Journal 列表是“目录感”：日期/标题/一句摘要，且行距舒服。

 文章页：图片宽度与正文宽度策略固定（要么同宽，要么图片更宽，但全站一致）。

 Brew Guide：步骤结构统一（参数块→步骤→风味观察→微调建议），不要每篇写法不同。

 Farms：数据呈现用“表格+细线”，别用卡片拼贴。

3.7 性能 / SEO / 可访问性（你这个调性最怕“看着高级但技术烂”）

 所有图片有 alt（至少不为空）；装饰图可空 alt，但要有理由。

 首屏图片做懒加载策略（别把 10 张大图全塞首屏）。

 标题层级严格（H1 只有一个；H2/H3 不乱跳）。

 meta（标题/描述/OG）按页面差异化，不要全站同一段。

4) “从模板到完工”的改造清单（按 commit 粒度，Codex 最好干活）

你可以直接把下面当成分支任务列表（每个 commit 做完就能验收一块）。

chore: init from astro-paper v5 + pnpm（跑通 dev/build/preview）

chore: set SITE config + brand constants (AMZ Sensory, locale, nav)

style: freeze design tokens in global.css (colors/borders/radius/spacing)

style: rebuild typography.css for editorial feel (headings/body/caption)

feat: layout shell (max-width grid, header/footer, 2-col sections)

feat: QR modal component + global QR asset

feat: home page (2-col hero + philosophy blocks + featured products)

feat: philosophy page (Why) + roast methodology page (How)

feat: farms/transparency page (Where/Who + table style)

feat: shop gallery + product detail + fake checkout -> QR modal

feat: journal collection + list + post layout（文章可以先单语）

feat: brew guide section + templates

feat: i18n (key pages zh-Hant + en-GB route)

perf: image pipeline + responsive + lazyload rules

chore: deploy presets (Vercel/Cloudflare) + robots + sitemap sanity check
