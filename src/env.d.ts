interface Window {
  theme?: {
    themeValue: string;
    setPreference: () => void;
    reflectPreference: () => void;
    getTheme: () => string;
    setTheme: (val: string) => void;
  };
}

interface ImportMetaEnv {
  readonly NOTION_ENABLED?: string;
  readonly NOTION_TOKEN?: string;
  readonly NOTION_DATABASE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
