import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { i18n, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES } from "../i18n";

type LocaleCode = string;

interface LocaleContextValue {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  supportedLocales: Record<string, string>;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(
    () => i18n.language ?? "en",
  );

  const setLocale = useCallback((nextLocale: LocaleCode) => {
    if (!SUPPORTED_LOCALES[nextLocale]) {
      console.warn(`[i18n] Unsupported locale: ${nextLocale}`);
      return;
    }
    setLocaleState(nextLocale);
  }, []);

  useEffect(() => {
    i18n.changeLanguage(locale);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore storage write failures in restricted environments.
    }
    document.documentElement.setAttribute("lang", locale);
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      supportedLocales: SUPPORTED_LOCALES,
    }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
