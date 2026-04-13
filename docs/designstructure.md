A) 这套风格如何“落到前端实现”（6 条铁律 → 代码对应点）
1) 栅格严格（理工感）

实现：统一 Container + 12 栏 grid；正文最大宽度限制（字符数 60–72）

代码点：Container.astro、Prose.astro、所有 section 的 grid/col-span

2) 留白有尺度（规律呼吸）

实现：固定 spacing scale；模块之间只用 py-24/py-32 + gap-16/gap-24

代码点：Section.astro 统一 py；页面只用几档 space-y-16/24/32

3) 字体是编辑部逻辑（封面 vs 书页）

实现：标题衬线（高对比）+ 正文无衬线（高行高）；字号阶梯固定

代码点：tailwind.config fonts + tokens.css + Prose.astro

4) 线条替代阴影（层级来自 hairline border）

实现：不用 shadow；hover/分隔用 border-[color:var(--border)] + border 强度变化

代码点：Divider.astro、CoffeeCard.astro hover 状态

5) 图像统一摄影语法（不统一就崩）

实现：所有作品图固定 4:5，同光源同底色；页面只允许“抽象封面”和“产品静物”

代码点：Aspect.astro 固定比例；内容模型 heroImage

6) 动效克制且一致（只做 3 种）

实现：hover（120–180ms）、reveal（280ms）、drawer（200–260ms）统一 easing

代码点：reveal.ts + class；WeChatDrawer.astro

B) 项目目录结构（Astro + AstroPaper 改造用）

你可以把 AstroPaper 当底座，把下面这些文件/目录补齐（或替换同名组件）

src/
  components/
    layout/
      Container.astro
      Header.astro
      Footer.astro
      Section.astro
      Prose.astro
      Divider.astro
      LangSwitch.astro
    ui/
      Aspect.astro
      Pill.astro
      ButtonLink.astro
      Reveal.astro
    wechat/
      WeChatDrawer.astro
      wechat.ts
    home/
      CoverHero.astro
      ThesisTriptych.astro
      FeaturedCoffees.astro
      MethodSnapshot.astro
      OriginSnapshot.astro

    coffee/
      CoffeeCard.astro
      CoffeeGrid.astro
      CoffeeFilters.astro
      CoffeeFactsStrip.astro
      PayCta.astro

  content/
    config.ts
    coffees/
      example-ultra-light.md

  i18n/
    config.ts
    paths.ts

  pages/
    zh-hant/
      index.astro
      philosophy.astro
      method.astro
      origins.astro
      coffee/
        index.astro
        [slug].astro
      pay/
        [slug].astro
    en/
      index.astro
      philosophy.astro
      method.astro
      origins.astro
      coffee/
        index.astro
        [slug].astro
      pay/
        [slug].astro

  styles/
    tokens.css
    global.css

public/
  brand/
    logo.svg
    qr.png
  covers/
    ultra-light.jpg
    clarity.jpg
    layered.jpg
    clean.jpg

C) Tailwind + Tokens（把高级感冻结成规则）

你要的「冷白、低对比、可读性够」+「线条替代阴影」全部在这里定死。

1) tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      maxWidth: {
        container: "1120px",
        prose: "72ch",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
      keyframes: {
        reveal: { "0%": { opacity: 0, transform: "translateY(8px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
      },
      animation: {
        reveal: "reveal 280ms cubic-bezier(0.2,0.8,0.2,1) both",
      },
    },
  },
  plugins: [],
};

2) src/styles/tokens.css（设计 tokens：颜色/排版/间距）
:root {
  /* Nordic cool white */
  --bg: 247 247 245;
  --surface: 255 255 255;
  --text: 17 17 17;
  --muted: 107 107 107;

  /* hairline */
  --border: 17 17 17; /* use low alpha in Tailwind: border-border/10 etc */

  /* keep accent neutral at first */
  --accent: 17 17 17;

  /* rhythm */
  --radius: 10px;
}

3) src/styles/global.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import "./tokens.css";

@layer base {
  html { background: rgb(var(--bg)); color: rgb(var(--text)); }
  body { font-family: theme(fontFamily.sans); }
  ::selection { background: rgb(var(--text) / 0.08); }

  /* Typographic defaults */
  h1, h2, h3 { font-family: theme(fontFamily.serif); letter-spacing: -0.02em; }
  p { line-height: 1.75; }

  /* Reduce motion */
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
  }
}

D) 全局骨架组件（直接可用）
Container.astro（统一栅格与左右边距）
---
const { class: cls = "", as = "div" } = Astro.props;
const Tag = as;
---
<Tag class={`mx-auto w-full max-w-container px-4 sm:px-6 lg:px-10 ${cls}`}>
  <slot />
</Tag>

Section.astro（统一留白尺度）
---
const { class: cls = "", tone = "default" } = Astro.props;
// tone could be "default" | "tight"
const pad = tone === "tight" ? "py-16 md:py-20" : "py-24 md:py-32";
---
<section class={`${pad} ${cls}`}>
  <slot />
</section>

Prose.astro（正文宽度锁死：书页感）
---
const { class: cls = "" } = Astro.props;
---
<div class={`max-w-prose text-[15px] leading-[1.85] md:text-[16px] md:leading-[1.9] ${cls}`}>
  <slot />
</div>

Divider.astro（hairline 分隔）
---
const { class: cls = "" } = Astro.props;
---
<hr class={`border-0 border-t border-border/10 ${cls}`} />

E) Header / Footer / 语言切换 / 微信抽屉（关键）
LangSwitch.astro（同构路径切换）
---
import { getAltPath } from "../../i18n/paths";
const { locale, path } = Astro.props; // locale: "zh-hant" | "en", path: current pathname
const zh = getAltPath(path, "zh-hant");
const en = getAltPath(path, "en");
---
<nav class="flex items-center gap-3 text-xs tracking-wide text-muted">
  <a class={`hover:text-text transition duration-150 ease-editorial ${locale==="zh-hant"?"text-text":""}`} href={zh}>繁中</a>
  <span class="text-border/40">/</span>
  <a class={`hover:text-text transition duration-150 ease-editorial ${locale==="en"?"text-text":""}`} href={en}>EN</a>
</nav>

Header.astro
---
import Container from "./Container.astro";
import LangSwitch from "./LangSwitch.astro";
const { locale, path } = Astro.props;
---
<header class="sticky top-0 z-50 border-b border-border/10 bg-surface/75 backdrop-blur">
  <Container class="h-[72px] flex items-center justify-between">
    <a href={locale === "en" ? "/en/" : "/zh-hant/"} class="flex items-center gap-3">
      <img src="/brand/logo.svg" alt="AMZ Sensory" class="h-5 w-auto" />
    </a>

    <div class="flex items-center gap-5">
      <LangSwitch locale={locale} path={path} />
      <button
        class="text-xs tracking-wide text-text hover:underline underline-offset-4 transition duration-150 ease-editorial"
        data-wechat-open
      >
        Join WeChat
      </button>
    </div>
  </Container>
</header>

Footer.astro
---
import Container from "./Container.astro";
---
<footer class="border-t border-border/10">
  <Container class="py-10 flex items-center justify-between text-xs text-muted">
    <div class="flex items-center gap-3">
      <img src="/brand/logo.svg" alt="AMZ Sensory" class="h-4 w-auto opacity-80" />
      <span>© {new Date().getFullYear()} AMZ Sensory</span>
    </div>
    <a class="hover:text-text transition duration-150 ease-editorial" href="mailto:hello@amzsensory.com">hello@amzsensory.com</a>
  </Container>
</footer>

微信 Drawer：WeChatDrawer.astro + wechat.ts

要点：统一 QR、统一 WeChat ID（可复制）、无表单、无支付，只做“截图发我”。

wechat.ts
export const WECHAT_ID = "AMZ_SENSORY"; // 改成你的
export const QR_SRC = "/brand/qr.png";

export function bindWeChatTriggers() {
  const dialog = document.querySelector<HTMLDialogElement>("#wechat-dialog");
  if (!dialog) return;

  document.querySelectorAll("[data-wechat-open]").forEach((el) => {
    el.addEventListener("click", () => dialog.showModal());
  });

  dialog.addEventListener("click", (e) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= (e.clientY ?? 0) &&
      (e.clientY ?? 0) <= rect.top + rect.height &&
      rect.left <= (e.clientX ?? 0) &&
      (e.clientX ?? 0) <= rect.left + rect.width;
    if (!isInDialog) dialog.close();
  });
}

WeChatDrawer.astro
---
import Container from "../layout/Container.astro";
---
<dialog id="wechat-dialog" class="backdrop:bg-text/15 p-0 w-full max-w-[420px] rounded-[var(--radius)] border border-border/15 bg-surface">
  <div class="p-6 md:p-8">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs tracking-wide text-muted">JOIN</p>
        <h3 class="font-serif text-2xl leading-tight">WeChat</h3>
      </div>
      <form method="dialog">
        <button class="text-xs text-muted hover:text-text transition duration-150 ease-editorial">Close</button>
      </form>
    </div>

    <div class="mt-6 grid gap-6">
      <div class="border border-border/10 rounded-[var(--radius)] p-4">
        <img src="/brand/qr.png" alt="WeChat QR" class="w-full h-auto" />
      </div>

      <div class="grid gap-2">
        <p class="text-xs text-muted">WeChat ID</p>
        <div class="flex items-center justify-between gap-3 border border-border/10 rounded-[var(--radius)] px-4 py-3">
          <code class="text-sm text-text">AMZ_SENSORY</code>
          <button
            class="text-xs text-text hover:underline underline-offset-4"
            data-copy-wechat
            type="button"
          >
            Copy
          </button>
        </div>
        <p class="text-xs text-muted">Screenshot this page and message us.</p>
      </div>
    </div>
  </div>
</dialog>

<script>
  import { bindWeChatTriggers } from "./wechat";
  bindWeChatTriggers();

  const btn = document.querySelector("[data-copy-wechat]");
  btn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("AMZ_SENSORY");
      btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = "Copy"), 900);
    } catch (e) {}
  });
</script>

F) Home 页面组件（2 列大图 + 画册节奏）
CoverHero.astro（抽象封面 + 诗性主句 + 关键词条）
---
import Container from "../layout/Container.astro";
const { locale } = Astro.props;

const copy = locale === "en"
  ? {
      h1: "Ultra Light.",
      sub: "High Clarity · Layered · Clean Finish",
      line: "We treat florals as structure — not as a gimmick.",
    }
  : {
      h1: "Ultra Light。",
      sub: "高亮度｜多層次｜乾淨收尾",
      line: "我們把花香當作結構，而不是噱頭。",
    };

const covers = [
  "/covers/ultra-light.jpg",
  "/covers/clarity.jpg",
  "/covers/layered.jpg",
  "/covers/clean.jpg",
];
---
<section class="relative overflow-hidden">
  <div class="min-h-[min(88vh,820px)]">
    <div class="absolute inset-0">
      <!-- simple: first image; later you can enhance to fade carousel -->
      <img src={covers[0]} alt="" class="h-full w-full object-cover" />
      <div class="absolute inset-0 bg-bg/35"></div>
    </div>

    <Container class="relative min-h-[min(88vh,820px)] flex items-end">
      <div class="pb-20 md:pb-24 max-w-[560px]">
        <p class="text-xs tracking-[0.18em] text-muted uppercase">AMZ Sensory</p>
        <h1 class="mt-4 font-serif text-[40px] leading-[1.05] md:text-[56px] md:leading-[1.02] tracking-[-0.02em]">
          {copy.h1}
        </h1>
        <p class="mt-4 text-xs tracking-[0.16em] text-muted uppercase">{copy.sub}</p>
        <p class="mt-6 text-[15px] leading-[1.85] text-text/90">{copy.line}</p>

        <div class="mt-10 flex items-center gap-5">
          <a href={locale === "en" ? "/en/coffee/" : "/zh-hant/coffee/"} class="text-xs text-text hover:underline underline-offset-4">
            View Library
          </a>
          <button class="text-xs text-text hover:underline underline-offset-4" data-wechat-open>
            Join WeChat
          </button>
        </div>
      </div>
    </Container>
  </div>
</section>

ThesisTriptych.astro（Why/How/Where 三栏，线条层级）
---
import Container from "../layout/Container.astro";
import Divider from "../layout/Divider.astro";
const { locale } = Astro.props;

const t = locale === "en"
  ? [
      { title: "Aesthetic First", a: "Not stronger. Clearer.", b: "Less caramel weight — more air, more light.", href: "/en/philosophy/" },
      { title: "A Roasting Method", a: "Layering through temperature bands.", b: "Every adjustment aims for a cleaner finish.", href: "/en/method/" },
      { title: "Origins & Transparency", a: "Clear provenance. Long relationships.", b: "We only claim what we can stand behind.", href: "/en/origins/" },
    ]
  : [
      { title: "審美先行", a: "不是更濃，而是更清。", b: "把多餘的糖感移開，讓花與果自己說話。", href: "/zh-hant/philosophy/" },
      { title: "烘焙方法論", a: "用溫區分層做層次。", b: "每一次調整都為了更乾淨的尾韻。", href: "/zh-hant/method/" },
      { title: "產地與透明", a: "來源清楚，關係長久。", b: "我們只講我們真正知道的。", href: "/zh-hant/origins/" },
    ];
---
<section class="py-24 md:py-32">
  <Container>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
      {t.map((x, i) => (
        <div class="group">
          <p class="text-xs tracking-[0.18em] uppercase text-muted">{String(i+1).padStart(2,"0")}</p>
          <h2 class="mt-3 font-serif text-2xl tracking-[-0.01em]">{x.title}</h2>
          <Divider class="my-5" />
          <p class="text-sm text-text/90">{x.a}</p>
          <p class="mt-3 text-sm text-muted">{x.b}</p>
          <a href={x.href} class="mt-6 inline-block text-xs text-text hover:underline underline-offset-4">
            Read
          </a>
        </div>
      ))}
    </div>
  </Container>
</section>

G) Coffee 组件：2 列大图 Gallery（核心“像画册一样逛”）
Aspect.astro（统一 4:5）
---
const { ratio = "4/5", class: cls="" } = Astro.props;
---
<div class={`relative w-full overflow-hidden rounded-[var(--radius)] ${cls}`} style={`aspect-ratio:${ratio};`}>
  <slot />
</div>

CoffeeCard.astro（线条替代阴影：hover 出现 hairline）
---
import Aspect from "../ui/Aspect.astro";
const { item, locale } = Astro.props;

const href = locale === "en" ? `/en/coffee/${item.slug}/` : `/zh-hant/coffee/${item.slug}/`;
---
<article class="group">
  <a href={href} class="block">
    <div class="rounded-[var(--radius)] border border-transparent group-hover:border-border/15 transition duration-150 ease-editorial">
      <Aspect ratio="4/5">
        <img src={item.heroImage} alt={item.title} class="h-full w-full object-cover transition duration-300 ease-editorial group-hover:scale-[1.02]" />
      </Aspect>
    </div>

    <div class="mt-4">
      <h3 class="font-serif text-xl tracking-[-0.01em]">{item.title}</h3>
      <p class="mt-1 text-xs tracking-wide text-muted">{item.origin} · {item.process}</p>
      <p class="mt-2 text-xs text-muted opacity-0 group-hover:opacity-100 transition duration-150 ease-editorial">
        {(item.tastingWords || []).slice(0,3).join(" · ")}
      </p>
    </div>
  </a>

  <div class="mt-4 flex items-center gap-6 text-xs">
    <a href={href} class="text-text hover:underline underline-offset-4">View</a>
    <a href={(locale==="en"?`/en/pay/${item.slug}/`:`/zh-hant/pay/${item.slug}/`)} class="text-text hover:underline underline-offset-4">
      Pay
    </a>
  </div>
</article>

CoffeeGrid.astro（锁死：桌面 2 列大图）
---
const { children } = Astro.props;
---
<div class="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-16">
  <slot />
</div>

CoffeeFilters.astro（pill tags：无填充，只变线条）
---
const { active = "", locale, baseHref } = Astro.props;
// active: "ultra-light" | "clarity" | "layered" | "clean" | ""
const filters = [
  { key: "ultra-light", zh: "Ultra Light", en: "Ultra Light" },
  { key: "clarity", zh: "高亮度", en: "High Clarity" },
  { key: "layered", zh: "多層次", en: "Layered" },
  { key: "clean", zh: "乾淨", en: "Clean Finish" },
];
---
<div class="flex flex-wrap gap-2">
  <a href={baseHref} class={`px-3 py-1.5 text-xs border rounded-full transition duration-150 ease-editorial
    ${active==="" ? "border-border/25 text-text" : "border-border/10 text-muted hover:text-text hover:border-border/20"}`}>
    {locale==="en" ? "All" : "全部"}
  </a>
  {filters.map(f => {
    const href = `${baseHref}?tag=${f.key}`;
    const is = active === f.key;
    return (
      <a href={href} class={`px-3 py-1.5 text-xs border rounded-full transition duration-150 ease-editorial
        ${is ? "border-border/25 text-text" : "border-border/10 text-muted hover:text-text hover:border-border/20"}`}>
        {locale==="en" ? f.en : f.zh}
      </a>
    );
  })}
</div>

H) 页面：最终 sitemap（sections 顺序）+ 直接可用页面骨架
src/pages/zh-hant/index.astro（Home）
---
import Header from "../../components/layout/Header.astro";
import Footer from "../../components/layout/Footer.astro";
import WeChatDrawer from "../../components/wechat/WeChatDrawer.astro";
import CoverHero from "../../components/home/CoverHero.astro";
import ThesisTriptych from "../../components/home/ThesisTriptych.astro";
import Section from "../../components/layout/Section.astro";
import Container from "../../components/layout/Container.astro";
import FeaturedCoffees from "../../components/home/FeaturedCoffees.astro";
import MethodSnapshot from "../../components/home/MethodSnapshot.astro";
import OriginSnapshot from "../../components/home/OriginSnapshot.astro";
const locale = "zh-hant";
const path = Astro.url.pathname;
---
<Header locale={locale} path={path} />
<CoverHero locale={locale} />

<ThesisTriptych locale={locale} />

<Section>
  <Container>
    <FeaturedCoffees locale={locale} />
  </Container>
</Section>

<Section tone="tight">
  <Container>
    <MethodSnapshot locale={locale} />
  </Container>
</Section>

<Section tone="tight">
  <Container>
    <OriginSnapshot locale={locale} />
  </Container>
</Section>

<Section>
  <Container>
    <div class="border border-border/10 rounded-[var(--radius)] p-8 md:p-10 bg-surface">
      <h2 class="font-serif text-2xl tracking-[-0.01em]">加入微信</h2>
      <p class="mt-3 text-sm text-muted">想下單？截圖這頁發我就好。</p>
      <button class="mt-6 text-xs text-text hover:underline underline-offset-4" data-wechat-open>
        Join WeChat
      </button>
    </div>
  </Container>
</Section>

<Footer />
<WeChatDrawer />


/en/index.astro 同构，只换 locale 与文案组件传参。

I) Coffee 内容模型（schema + frontmatter 模板）
src/content/config.ts
import { defineCollection, z } from "astro:content";

const coffees = defineCollection({
  type: "content",
  schema: z.object({
    slug: z.string(),
    title_zh: z.string(),
    title_en: z.string(),
    origin: z.string(),       // "Ethiopia · Guji"
    process: z.string(),      // "Washed"
    variety: z.string().optional(),
    profile: z.enum(["ultra-light","clarity","layered","clean"]).array().default([]),
    tastingWords: z.string().array().default([]), // ["jasmine", "white peach", "lime"]
    heroImage: z.string(),    // "/coffee/xxx.jpg"
    story_zh: z.string(),
    story_en: z.string(),
    facts: z.object({
      altitude: z.string().optional(),
      harvest: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { coffees };

src/content/coffees/example-ultra-light.md
---
slug: "ultra-light-01"
title_zh: "Ultra Light 01"
title_en: "Ultra Light 01"
origin: "Ethiopia · Guji"
process: "Washed"
variety: "Heirloom"
profile: ["ultra-light","clarity","clean"]
tastingWords: ["jasmine", "white peach", "citrus peel"]
heroImage: "/coffee/ultra-light-01.jpg"
story_zh: "這支豆像光。香氣先到，甜感克制，尾韻切得很乾淨。"
story_en: "This coffee reads like light. Aromatics first, sweetness restrained, finish clean and decisive."
facts:
  altitude: "1900–2100m"
  harvest: "Oct–Dec"
---
（可留空或放更長文章；你說半年不動，這裡越短越好）

J) i18n 路径工具（同构切换）
src/i18n/paths.ts
const LOCALES = ["zh-hant", "en"] as const;
type Locale = typeof LOCALES[number];

export function getAltPath(pathname: string, to: Locale) {
  // pathname like /zh-hant/coffee/abc/ or /en/coffee/abc/
  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0];

  let rest = parts;
  if (first === "zh-hant" || first === "en") rest = parts.slice(1);

  return "/" + [to, ...rest].join("/") + (pathname.endsWith("/") ? "/" : "");
}

K) AI 图像“摄影语法”与 12 条 prompt（前端一致性版）

你要的不是“每张都炸裂”，是“同一个摄影师同一个棚”。前端视角的统一规范如下：

统一规范（必须写进你的生成 SOP）

比例：4:5（全站一致）

光：north-window soft daylight（北窗柔光）

背景：cool white seamless

对比：low contrast

阴影：soft shadow（轻）

颗粒：subtle film grain + matte paper texture

道具：固定 1 套（白瓷杯 / 玻璃杯 / 小勺 / 铝瓶或豆袋），不要换风格

Style Lock（每条 prompt 尾部都加）

minimal nordic studio still life, cool white seamless background, north-window soft daylight, low contrast, soft shadow, subtle film grain, matte paper texture, editorial lookbook, premium minimalism, no clutter, no text, no logo, no watermark

抽象封面 4 条（Home Hero 用）

Ultra Light cover
abstract minimal cover art, ultra light theme, airy translucent gradients, vast negative space, calm modernist composition, cool white palette, subtle paper grain + Style Lock

High Clarity cover
abstract minimal cover art, high clarity theme, crisp light geometry, clean edges, quiet brightness, cool white and very light grey tones + Style Lock

Layered cover
abstract minimal cover art, layered theme, thin translucent layers overlapping, subtle depth via tonal shifts, controlled rhythm, restrained composition + Style Lock

Clean Finish cover
abstract minimal cover art, clean finish theme, decisive cut line, sharp negative space, minimal forms, quiet confidence, matte paper texture + Style Lock

产品静物 8 条（Coffee hero / cards）

Ultra Light（单杯 + 空气感）
coffee still life, single white porcelain cup, airy atmosphere, minimal tabletop, ultra light mood, lots of negative space + Style Lock

Ultra Light（稀疏豆子排列）
coffee still life, small pile of roasted beans arranged sparsely with spacing, calm macro, airy composition, ultra light mood + Style Lock

High Clarity（玻璃杯高光）
coffee still life, clear glass cup with crisp reflections, precise highlights, clean edges, high clarity mood + Style Lock

High Clarity（包装正中产品照）
minimal product photo, aluminium bottle or minimalist coffee bag centered, label area blank, catalog-ready, high clarity mood + Style Lock

Layered（双杯暗示层次）
coffee still life, two vessels side by side (glass and porcelain), subtle tonal difference implying layers, structured spacing, layered mood + Style Lock

Layered（器具网格排列）
coffee still life, cup spoon small dish arranged on a strict grid, editorial layout, layered mood through composition + Style Lock

Clean Finish（靠边构图 + 大留白）
coffee still life, single cup placed near frame edge, strong negative space, clean decisive composition, clean finish mood + Style Lock

Clean Finish（杯 + 空白纸卡）
coffee still life, white cup and a blank paper card, ultra clean composition, matte paper texture, clean finish mood + Style Lock

L) 你的四个关键词如何“体现在版式/对比/层级”（不是写出来）

这是你要求的重点，我直接把“设计对应关系”写死：

Ultra Light（轻）

版式：更大的上/下留白（Hero pb-24、section py-32）

文字：减少段落，更多短句（1–2 行）

高亮度（Clarity）

对比：文字清晰但不刺眼（text 90%、muted 65%）

线条：hairline border 做信息条（facts strip）

多层次（Layered）

层级：信息只分 3 层（Title / Meta / Microcopy），不做第四层

结构：三段式叙事（Aroma/Palate/Finish）固定出现

干净（Clean Finish）

克制：禁止阴影、禁止重渐变、禁止复杂背景

结尾：每页最后一个 CTA 都是同一种表达（Join WeChat），不花哨


2) 设计系统（Design Tokens）：把“高级感”冻结成可复用规则

下面这套 tokens 就是你网站的“审美底盘”。Codex 应该先把这些落进 global.css +（如果用 Tailwind）tailwind.config.

2.1 颜色（只用 5 个层级 + 1 个强调色）

目标：冷白、低对比、可读性够。不要大面积纯黑纯白刺眼。

--bg: #F7F7F5（主背景：冷白微灰）

--surface: #FFFFFF（浮层/卡片背景：纯白）

--text: #111111（正文黑）

--muted: #6B6B6B（次级文本）

--border: rgba(17,17,17,0.10)（发丝分隔线）

--accent: #111111（强调色默认用黑；不要彩色夺目）

Nordic 的“高级”不是靠彩色点缀，而是靠对齐+留白+字体。强调色先用黑，后续再考虑极浅的灰蓝/灰绿。

2.2 排版（Type scale + 行高 + 字距）

建议两套字体：

标题：Fraunces（或 Instrument Serif）

正文：Inter（或 IBM Plex Sans）

字号阶梯（桌面 / 移动）：

Display（Hero H1）：56/64（desktop），40/48（mobile），字距 -0.02em

H2：32/40（desktop），26/34（mobile），字距 -0.01em

H3：20/28，字距 -0.005em

Body：16/28（行高一定要大，像书页）

Small：13/20（用于 meta）

规则：

正文段落宽度：60–72 字符（超过就像“网页”，不像“书页”）。

标题永远短句；正文永远短段落（2–4 行换段）。

大写只用在小标签（如 ULTRA LIGHT），不要到处大写。

2.3 间距（Spacing scale）

固定一套间距，不许乱加：
4, 8, 12, 16, 24, 32, 48, 64, 96, 128

典型用法：

模块内：24 / 32

模块之间：64 / 96

Hero 到下一段：96 或 128（看首屏高度）

2.4 栅格（Grid）

这是“理工+审美”的关键。

Desktop：max-width: 1120px（或 1200，但别太宽）

页面左右 padding：40px（>=1280），24px（>=768），16px（<768）

12 栏栅格，栏距（gutter）24px

文本列宽控制：正文区建议只用 7–8 栏（右侧留白就是高级感来源之一）

3) 组件规格（前端真正要怎么做）

下面我按你 sitemap 的核心页面，给出每个 section 的组件拆分 + 尺寸/布局/交互。这才是“好前端视角”。

3.1 全局骨架
Header（固定、极简）

高度：72px

行为：sticky top:0

背景：半透明白 + 轻微 blur（可选，保持克制）

内容：

左：Logo（高度 20–24px）

中：Nav（可省略，或只放 3 个：Why/How/Where）

右：Language switch（繁/EN）+ Join WeChat 文本按钮（不是大按钮）

交互：

hover：文字下划线出现（1px），120ms

focus：清晰 focus ring（可用 1px 黑边）

Footer（像画册封底）

只留：Logo / © / Email（可选）

不要塞 sitemap 列表，破坏“画册感”。

3.2 Home（封面）——你要的“画册感”主要靠这一页
Section 01：Cover Hero（抽象封面轮播）

布局：

高度：min(88vh, 820px)

背景：抽象图（4 张轮播，间隔 6–8 秒，或手动切）

文本块位置：左下或左中（不要正中大字，像杂志更克制）

文本宽：max 520px

层级：

H1：Ultra Light.（大）

Sub：四词（小、大写可选）

1-liner：一句品牌钉子

交互：

轮播切换：淡入淡出 300ms，别做滑动炫技

首屏向下滚动提示：极细箭头/线条（opacity 0.5）

Section 02：Brand Thesis（三栏）

三栏卡片：不用背景块，只用标题+两行文字+细分隔线

桌面：3 列；移动：1 列堆叠，间距 32

Section 03：Featured Coffees（展品墙）

这是你“像商店一样好逛”的核心，但要做得像画册陈列。

CoffeeCard（关键组件）规格：

图片比例：4:5

卡片本体：无阴影、无圆角或极小圆角（4–8px）

卡片边界：不需要边框，靠留白；hover 时出现 1px 边框（border alpha 0.12 → 0.18）

信息层级：

默认只显示：Name（16–18）+ Origin（13 muted）

hover/聚焦时：出现 2–3 个风味词（小字）

交互：

hover：图片轻微“呼吸”缩放 1.02（可选）+ meta 渐显

时长：120–180ms，ease-out

不要大幅动画，像杂志网页那种克制

布局：

桌面：2 列或 3 列都行，但更“画册”的是 2 列大图

我建议：桌面 2 列（每张更像作品页）；移动 1 列

Section 06：Join WeChat（唯一转化）

你说不想做流程，那 CTA 就做成“编辑部旁白式”。

文案：一行（克制）

按钮：纯文字按钮（Join WeChat）

点开 Drawer（右侧抽屉）

Drawer 规格：

宽：360px（移动端全屏底部弹层更好）

内容：

QR（240–280px）

WeChat ID（可复制）

提示：截圖 / 長按 → 加微信

3.3 Coffee Library（作品库）

目标：像“作品目录”，不是电商列表。

Section：Filters（极简标签）

用 pill tags（无填充、只有 1px border）

激活态：文字变黑 + 边框更深（不要填充色块）

标签：Ultra Light / 高亮度 / 多層次 / 乾淨

Grid

桌面：2 列大图（更高级）

如果你坚持 3 列，必须加大 gutter（32）避免廉价密集

3.4 Coffee Detail（豆子详情）

这一页要像“画册内页”。

结构建议（最像编辑排版）：

Hero 大图（4:5）

右侧（桌面）或下方（移动）是文本块

Facts 用一行“细字条”呈现（像杂志 caption）

Facts strip（示例）：
Ethiopia · Washed · Heirloom · Ultra Light

Tasting 三段：

Aroma / Palate / Finish 每段 1–2 句

每段标题用小写或小型大写（small caps 质感更好）

Pay 按钮：

仍然是文字按钮（Pay / Order）

点击去 /pay/[slug]（或弹窗）

3.5 Pay（虚拟支付页）

要做得“像艺术馆结账台”，不是淘宝。

布局：

桌面：两列

左：Order Summary（咖啡名 + 1 句）

右：QR + WeChat ID

移动：先 summary 后 QR（QR 大一点）

样式：

全页留白多

QR 周围可以用 1px border 框一下（像画框）

4) 动效与交互规则（你要的“少量 Onyx”到底怎么用）

只允许三种动效，且统一曲线：

4.1 基础过渡

duration：120–180ms

easing：cubic-bezier(0.2, 0.8, 0.2, 1)（一个就够）

4.2 Scroll reveal（只用在 Origins/Home 关键块）

IntersectionObserver：进入视口 15% 时触发

只做：opacity 0 → 1，translateY 8px → 0

duration：280ms（比 hover 慢一点）

4.3 Drawer 打开关闭

从右侧：translateX 12px → 0 + opacity

背景遮罩：opacity 0 → 1（别做模糊太重）

禁止：视差、复杂滚动叙事、花哨粒子——那不是北欧画册，是炫技。

Roast Method（How）— 繁中

S01 Title

H1：方法論不是參數表。

Sub：它是一套把風味變乾淨的結構。

S02 Method Blocks（建議 4 個）
每個 Block 模板：

Block Title：高亮度（Clarity）

宣言：把香氣推到前景。

解釋：降低不必要的焦糖重量，讓花果站出來。

結果：聞起來更像香水，而不是糖漿。

Block Title：多層次（Layering）

宣言：入口到回甘都有段落。

解釋：用溫區分層去安排“出現順序”。

結果：每一口像翻頁。

Block Title：乾淨收尾（Clean Finish）

宣言：不留黏膩，不留陰影。

解釋：收尾要像剪輯，乾脆、準確。

結果：回甘短但清楚。

Block Title（可選）：Ultra Light（輕的結構）

宣言：輕，是控制。

解釋：把重量放在層次，不放在焦糖。

結果：薄？不。我們追求的是空氣感。

S03 Proof Without Noise（3 bullets）

某些日晒我們只留果香，不留發酵陰影。

某些水洗我們強化花香，但不做尖酸。

每支豆子的“明亮”都有邊界。

S04 CTA

Roast Method（How）— UK English

同結構，語氣更克制（UK）：

A method is not a recipe. It’s a structure.

Blocks: Clarity / Layering / Clean Finish / Ultra Light

Proof bullets: 3 lines.

Origins（Where）— 繁中

S01 Title

H1：產地不是標籤，是關係。

S02 Origin Chapters x3（每章模板）

Chapter Title：Country · Region · Partner/Farm

Why this origin（2 句）：

我們喜歡它的＿＿（花香/乾淨/酸質型態）。

它能承載 Ultra Light 的結構。

Facts strip（1 行）：Variety / Altitude / Process / Harvest

Relationship（1–2 句）：我們如何挑選 / 我們看重什麼

Link：對應作品：Coffee X

S03 Transparency Promise（3 條）

來源可追溯。

資訊可核對。

季節性與變化會被如實呈現。

S04 CTA

Coffee Library（作品庫）— 繁中

S01 Title + Filters

H1：作品庫

Sub：按感覺篩選：Ultra Light / 高亮度 / 多層次 / 乾淨

S02 Grid

卡片只留 2–3 行：

名稱

產區｜處理

2–3 tasting words

S03 CTA（固定 Join WeChat）

Coffee Detail — 繁中

S01 Hero：Coffee Name + 大圖
S02 Quick Facts（1 行）：Origin / Process / Variety / Profile
S03 Tasting（三段）：Aroma / Palate / Finish（每段 1–2 句）
S04 Story（4–6 句）：像畫冊內頁的短文
S05 Pay：Pay → /pay/[slug]

Pay — 繁中（統一 QR）

Title：付款（虛擬）

Summary：你正在為「Coffee Name」下單。

指引：截圖這頁 → 加微信 → 把截圖發我

QR + WeChat ID copy

小字：本網站不處理線上交易。

（英文版同結構一樣。）

Home — 繁中（/zh-hant/）

S01 Cover Hero

H1：Ultra Light.（或 Floral First.）

Sub：高亮度｜多層次｜乾淨收尾

1-liner：我們把花香當作結構，而不是噱頭。

S02 Brand Thesis（Why/How/Where 三欄）

Why（標題）：審美先行

句1：不是更濃，而是更清。

句2：把多餘的糖感移開，讓花與果自己說話。

How：烘焙方法論

句1：用溫區分層做層次，而不是靠焦糖堆厚。

句2：每一次調整都為了更乾淨的尾韻。

Where：產地與透明

句1：來源清楚，關係長久。

句2：我們只講我們真正知道的。

S03 Featured Coffees

Section title：作品選集

小字：像翻畫冊一樣選豆。

S04 Method Snapshot（3 條）

條1：高亮度：把香氣提到前景。

條2：多層次：入口到回甘都有段落。

條3：乾淨：收尾不拖泥帶水。

S05 Origin Snapshot（3 模組）

模組格式：產區名 — 一句理由（2 行內）

S06 Join WeChat

CTA：加入微信

輔句：想下單？截圖這頁發我就好。

Home — UK English（/en/）

S01 Cover Hero

H1: Ultra Light. (or Floral First.)

Sub: High Clarity · Layered · Clean Finish

1-liner: We treat florals as structure — not as a gimmick.

S02 Brand Thesis (3 columns)

Why: Aesthetic First

L1: Not stronger. Clearer.

L2: Less caramel weight — more air, more light.

How: A Roasting Method

L1: Layering through temperature bands, not through darkness.

L2: Every adjustment aims for a cleaner finish.

Where: Origins & Transparency

L1: Clear provenance. Long relationships.

L2: We only claim what we can stand behind.

S03 Featured Coffees

Title: Selected Works

Note: Browse like a lookbook.

S04 Method Snapshot

3 lines: Clarity / Layering / Clean Finish

S06 Join WeChat

CTA: Join on WeChat

Note: To order, simply screenshot this page and message us.
