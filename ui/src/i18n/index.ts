import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zhCN from "./locales/zh-CN.json";

const LOCALE_STORAGE_KEY = "paperclip.locale";

function detectLocale(): string {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored) return stored;
  } catch {
    /* ignore storage errors */
  }
  return navigator.language?.split("-")[0] ?? "en";
}

i18n.use(initReactI18next).init({
  resources: { 
    en: { translation: en },
    "zh-CN": { translation: zhCN }
  },
  lng: detectLocale(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  debug: import.meta.env.DEV,
});

export { i18n, LOCALE_STORAGE_KEY };

/**
 * Registry of supported locales.
 * The language switcher only renders when more than one locale is registered.
 * To add a new locale:
 *   1. Create `ui/src/i18n/locales/<code>.json`
 *   2. Import and add to `resources` above
 *   3. Add an entry here
 */
export const SUPPORTED_LOCALES: Record<string, string> = {
  en: "English",
  "zh-CN": "中文",
};
