"use client";

import { ThemeProvider } from "next-themes";
import { createContext, useContext, useMemo, useState } from "react";
import { labels, type Locale } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof labels)[Locale];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ua");
  const value = useMemo(() => ({ locale, setLocale, t: labels[locale] }), [locale]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
    </ThemeProvider>
  );
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useLocale must be used inside Providers");
  }
  return value;
}
