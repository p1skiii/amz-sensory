import type { Locale } from "@/data/locales";

export const STATIC_PAGE_KEYS = [
  "philosophy",
  "method",
  "origins",
  "responsibility",
] as const;

export type StaticPageKey = (typeof STATIC_PAGE_KEYS)[number];

export function isStaticPageKey(value: string | undefined): value is StaticPageKey {
  if (!value) return false;
  return (STATIC_PAGE_KEYS as readonly string[]).includes(value);
}

type NavItem = { label: string; href: string };

export const NAV_ITEMS: Record<Locale, NavItem[]> = {
  en: [
    { label: "Coffee", href: "/en/coffee/" },
    { label: "Method", href: "/en/method/" },
    { label: "Origins", href: "/en/origins/" },
    { label: "Responsibility", href: "/en/responsibility/" },
    { label: "Philosophy", href: "/en/philosophy/" },
  ],
  "zh-hant": [
    { label: "Coffee", href: "/zh-hant/coffee/" },
    { label: "方法", href: "/zh-hant/method/" },
    { label: "產地", href: "/zh-hant/origins/" },
    { label: "責任", href: "/zh-hant/responsibility/" },
    { label: "理念", href: "/zh-hant/philosophy/" },
  ],
};

type ContentBlock = {
  heading: string;
  body: string;
};

type StaticPageContent = {
  title: string;
  description: string;
  eyebrow: string;
  lead: string;
  blocks: ContentBlock[];
};

export const STATIC_PAGE_CONTENT: Record<
  StaticPageKey,
  Record<Locale, StaticPageContent>
> = {
  philosophy: {
    en: {
      title: "Philosophy",
      description:
        "AMZ Sensory philosophy: floral-first structure, restraint, and clarity.",
      eyebrow: "Why",
      lead: "Not stronger. Clearer. We treat aroma as structure, not decoration.",
      blocks: [
        {
          heading: "Aesthetic First",
          body: "Flavor should stand on its own without heavy sweetness or roast weight.",
        },
        {
          heading: "Proof Over Claims",
          body: "We keep claims verifiable through lot-level sourcing and transparent cupping notes.",
        },
        {
          heading: "Restraint",
          body: "Sustainability is executed through concrete choices, not broad slogans.",
        },
      ],
    },
    "zh-hant": {
      title: "理念",
      description: "AMZ Sensory 的核心理念：花香優先、結構清晰、節制而可驗證。",
      eyebrow: "Why",
      lead: "不是更濃，而是更清。我們把香氣當作結構，而不是裝飾。",
      blocks: [
        {
          heading: "審美先行",
          body: "風味要自己站得住，不靠厚重糖感與烘焙重量。",
        },
        {
          heading: "證據優先",
          body: "每個批次都對應可追溯來源與杯測記錄，描述可被驗證。",
        },
        {
          heading: "節制",
          body: "可持續是具體選擇，不是抽象口號。",
        },
      ],
    },
  },
  method: {
    en: {
      title: "Method",
      description:
        "How AMZ Sensory roasts: temperature bands, controlled development, and clean finish.",
      eyebrow: "How",
      lead: "A method is not a recipe. It is a structure that keeps aromatic clarity.",
      blocks: [
        {
          heading: "Temperature Bands",
          body: "Layer profile decisions across bands instead of stacking heat in one stage.",
        },
        {
          heading: "Development Control",
          body: "Extend only enough to stabilize sweetness while preserving floral lift.",
        },
        {
          heading: "Extraction Readiness",
          body: "Roast targets are validated by solubility and cleanliness in the cup.",
        },
      ],
    },
    "zh-hant": {
      title: "方法",
      description: "AMZ Sensory 的烘焙方法：溫區分層、受控發展、乾淨收尾。",
      eyebrow: "How",
      lead: "方法不是配方，而是一個能保留香氣結構的系統。",
      blocks: [
        {
          heading: "Temperature Bands",
          body: "用溫區分層做判斷，而不是把火力集中在單一階段。",
        },
        {
          heading: "Development",
          body: "只延伸到能穩定甜感的位置，避免香氣骨架被壓平。",
        },
        {
          heading: "Extraction Readiness",
          body: "以可萃性與杯中乾淨度回驗烘焙目標。",
        },
      ],
    },
  },
  origins: {
    en: {
      title: "Origins",
      description:
        "Traceable origins and long-term relationships behind AMZ Sensory coffees.",
      eyebrow: "Where / Who",
      lead: "Terroir gives context. Relationships make that context reliable.",
      blocks: [
        {
          heading: "Traceability",
          body: "Each lot is documented by producer, process, and shipment-level records.",
        },
        {
          heading: "Long-Term Relationships",
          body: "We prioritize repeat producers to improve consistency and communication.",
        },
        {
          heading: "Verifiable Language",
          body: "Origin stories are kept short and factual so descriptors stay honest.",
        },
      ],
    },
    "zh-hant": {
      title: "產地",
      description: "AMZ Sensory 的產地與關係：可追溯來源、長期合作、可驗證描述。",
      eyebrow: "Where / Who",
      lead: "風土給出背景，關係讓背景變得可信。",
      blocks: [
        {
          heading: "Traceability",
          body: "每個批次都保留生產者、處理法與到貨紀錄。",
        },
        {
          heading: "Long-Term Relationships",
          body: "優先與長期合作對象往來，提升穩定度與溝通品質。",
        },
        {
          heading: "Verifiable Language",
          body: "產地敘事保持短而可驗證，避免誇飾性描述。",
        },
      ],
    },
  },
  responsibility: {
    en: {
      title: "Responsibility",
      description:
        "How AMZ Sensory handles packaging, sourcing discipline, and waste reduction.",
      eyebrow: "Responsibility",
      lead: "Responsibility is operational: packaging, buying discipline, and waste control.",
      blocks: [
        {
          heading: "Packaging",
          body: "Aluminum bottles are used for barrier stability and reduced outer packaging.",
        },
        {
          heading: "Buying",
          body: "We buy only lots we can explain clearly in sourcing and sensory terms.",
        },
        {
          heading: "Waste",
          body: "Production and cupping schedules are tuned to reduce over-roasting and stale stock.",
        },
      ],
    },
    "zh-hant": {
      title: "責任",
      description: "AMZ Sensory 的責任實踐：包裝、採購紀律與減廢。",
      eyebrow: "Responsibility",
      lead: "責任是可執行的流程：包裝、採購紀律、減廢控制。",
      blocks: [
        {
          heading: "Packaging",
          body: "採用鋁瓶密封，提高阻氧穩定性並減少額外包材。",
        },
        {
          heading: "Buying",
          body: "只採購我們能清楚解釋來源與風味邏輯的批次。",
        },
        {
          heading: "Waste",
          body: "以排程與杯測節奏降低過度烘焙與庫存陳化。",
        },
      ],
    },
  },
};
