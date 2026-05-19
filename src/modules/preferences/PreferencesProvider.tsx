"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import {
  dictionaries,
  type Language,
  type TranslationKey,
} from "./dictionaries";

export type Theme = "light" | "dark";

type PreferencesContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (key: TranslationKey) => string;
  theme: Theme;
};

const DEFAULT_LANGUAGE: Language = "id";
const DEFAULT_THEME: Theme = "light";
const LANGUAGE_STORAGE_KEY = "opensuite.language";
const THEME_STORAGE_KEY = "opensuite.theme";

const PreferencesContext = createContext<PreferencesContextValue | null>(null);
const listeners = new Set<() => void>();

function emitPreferenceChange() {
  listeners.forEach((listener) => listener());
}

function isLanguage(value: string | null): value is Language {
  return value === "id" || value === "en";
}

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

function getStoredLanguage() {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  return isLanguage(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE;
}

function getStoredTheme() {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  return isTheme(storedTheme) ? storedTheme : DEFAULT_THEME;
}

function subscribeToPreferences(listener: () => void) {
  listeners.add(listener);

  function handleStorageEvent(event: StorageEvent) {
    if (
      event.key === LANGUAGE_STORAGE_KEY ||
      event.key === THEME_STORAGE_KEY
    ) {
      listener();
    }
  }

  window.addEventListener("storage", handleStorageEvent);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorageEvent);
  };
}

type PreferencesProviderProps = {
  children: React.ReactNode;
};

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const language = useSyncExternalStore(
    subscribeToPreferences,
    getStoredLanguage,
    () => DEFAULT_LANGUAGE,
  );

  const theme = useSyncExternalStore(
    subscribeToPreferences,
    getStoredTheme,
    () => DEFAULT_THEME,
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
        emitPreferenceChange();
      },
      setTheme: (nextTheme) => {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        emitPreferenceChange();
      },
      t: (key) => dictionaries[language][key],
      theme,
    }),
    [language, theme],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }

  return context;
}
