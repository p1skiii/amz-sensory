import type { Locale } from "@/data/locales";

export const STATIC_PAGE_KEYS = [
  "philosophy",
  "method",
  "origins",
  "responsibility",
  "contact",
  "faq",
  "shipping",
  "terms",
  "privacy",
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
  contact: {
    en: {
      title: "Contact",
      description: "Contact AMZ Sensory for orders, product questions, and partnerships.",
      eyebrow: "Contact",
      lead: "For order support and business inquiries, reach us through the channels below.",
      blocks: [
        {
          heading: "Email",
          body: "hello@amzsensory.com is our main support mailbox.",
        },
        {
          heading: "WeChat",
          body: "Use the WeChat / QR entry to connect with our private order channel.",
        },
        {
          heading: "Response Time",
          body: "We typically reply within 24 hours on business days.",
        },
      ],
    },
    "zh-hant": {
      title: "聯絡我們",
      description: "聯絡 AMZ Sensory：訂單、商品問題與合作洽詢。",
      eyebrow: "Contact",
      lead: "如需訂單協助或合作洽詢，請使用以下聯絡方式。",
      blocks: [
        {
          heading: "Email",
          body: "主要客服信箱：hello@amzsensory.com。",
        },
        {
          heading: "WeChat",
          body: "可透過 WeChat / QR 入口進入私域下單通道。",
        },
        {
          heading: "回覆時間",
          body: "工作日通常於 24 小時內回覆。",
        },
      ],
    },
  },
  faq: {
    en: {
      title: "FAQ",
      description: "Frequently asked questions about AMZ Sensory coffee and ordering.",
      eyebrow: "FAQ",
      lead: "Answers to common questions about roasting style, storage, and orders.",
      blocks: [
        {
          heading: "How should I brew these coffees?",
          body: "We recommend starting with filter-style recipes and adjusting by cup clarity.",
        },
        {
          heading: "How should I store bottles?",
          body: "Keep sealed bottles in a cool, dry space away from direct sunlight.",
        },
        {
          heading: "Can I order in bulk?",
          body: "Yes. Contact us with your required volume and preferred shipping schedule.",
        },
      ],
    },
    "zh-hant": {
      title: "常見問題",
      description: "AMZ Sensory 咖啡與下單流程常見問題。",
      eyebrow: "FAQ",
      lead: "整理常見的沖煮、保存與下單問題。",
      blocks: [
        {
          heading: "建議怎麼沖煮？",
          body: "建議先以手沖配方起手，再依杯中乾淨度與濃度微調。",
        },
        {
          heading: "鋁瓶如何保存？",
          body: "請置於陰涼乾燥處，避免陽光直射與高溫環境。",
        },
        {
          heading: "可否大量採購？",
          body: "可以，請來信提供需求量與預計出貨節奏。",
        },
      ],
    },
  },
  shipping: {
    en: {
      title: "Shipping",
      description: "Shipping and fulfillment information for AMZ Sensory orders.",
      eyebrow: "Shipping",
      lead: "Fulfillment is arranged in small batches to keep inventory fresh.",
      blocks: [
        {
          heading: "Processing",
          body: "Orders are typically prepared within 1-2 business days.",
        },
        {
          heading: "Regions",
          body: "We currently support domestic shipping and selected international routes.",
        },
        {
          heading: "Tracking",
          body: "Shipping updates are sent once the package is handed to the carrier.",
        },
      ],
    },
    "zh-hant": {
      title: "配送資訊",
      description: "AMZ Sensory 訂單配送與出貨說明。",
      eyebrow: "Shipping",
      lead: "我們以小批次節奏出貨，維持商品新鮮與穩定。",
      blocks: [
        {
          heading: "出貨時程",
          body: "一般下單後 1-2 個工作日內安排出貨。",
        },
        {
          heading: "配送地區",
          body: "目前支援本地配送與部分國際路線。",
        },
        {
          heading: "物流通知",
          body: "交寄後會提供物流更新資訊。",
        },
      ],
    },
  },
  terms: {
    en: {
      title: "Terms & Privacy",
      description: "Terms of purchase and privacy notice for AMZ Sensory.",
      eyebrow: "Terms",
      lead: "By placing an order, you agree to our ordering and data handling practices.",
      blocks: [
        {
          heading: "Order Terms",
          body: "Submitted orders are confirmed manually before final fulfillment.",
        },
        {
          heading: "Returns",
          body: "For quality issues, contact us within 7 days with order details.",
        },
        {
          heading: "Data Use",
          body: "Contact information is used solely for order communication and support.",
        },
      ],
    },
    "zh-hant": {
      title: "條款與隱私",
      description: "AMZ Sensory 購買條款與隱私說明。",
      eyebrow: "Terms",
      lead: "提交訂單即表示你同意我們的下單流程與資料使用方式。",
      blocks: [
        {
          heading: "下單條款",
          body: "訂單會先由人工確認，再進入正式出貨流程。",
        },
        {
          heading: "退換說明",
          body: "如有品質疑慮，請於 7 日內附訂單資訊聯絡我們。",
        },
        {
          heading: "資料使用",
          body: "聯絡資訊僅用於訂單溝通與售後協助。",
        },
      ],
    },
  },
  privacy: {
    en: {
      title: "Privacy Policy",
      description: "How AMZ Sensory handles customer privacy and contact data.",
      eyebrow: "Privacy",
      lead: "We keep data collection minimal and only for operational communication.",
      blocks: [
        {
          heading: "Collected Data",
          body: "Name and contact details are collected only when you submit an order form.",
        },
        {
          heading: "Usage Scope",
          body: "Data is used for order confirmation, shipping updates, and support responses.",
        },
        {
          heading: "Retention",
          body: "Information is retained only as long as needed for order service records.",
        },
      ],
    },
    "zh-hant": {
      title: "隱私政策",
      description: "AMZ Sensory 客戶隱私與資料處理政策。",
      eyebrow: "Privacy",
      lead: "我們以最小化蒐集原則處理資料，僅用於必要的訂單溝通。",
      blocks: [
        {
          heading: "蒐集資料",
          body: "僅在你提交訂單資訊時蒐集姓名與聯絡方式。",
        },
        {
          heading: "使用範圍",
          body: "僅用於訂單確認、物流通知與客服回覆。",
        },
        {
          heading: "保存期間",
          body: "資料僅保留於必要的訂單服務紀錄期間。",
        },
      ],
    },
  },
};
