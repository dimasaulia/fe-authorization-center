"use client";

import { usePreferences, type Language } from "@/modules/preferences";

const languageOptions: Array<{ label: string; value: Language }> = [
  { label: "ID", value: "id" },
  { label: "EN", value: "en" },
];

export function LanguageToggle() {
  const { language, setLanguage, t } = usePreferences();

  return (
    <div
      aria-label={t("common.language")}
      className="flex h-9 rounded-full border border-[var(--auth-field-border)] bg-[var(--auth-field)] p-1"
      role="group"
    >
      {languageOptions.map((option) => (
        <button
          aria-pressed={language === option.value}
          className={[
            "h-7 rounded-full px-3 text-xs font-semibold leading-4 transition",
            language === option.value
              ? "bg-hero text-hero-foreground shadow-[0_6px_16px_var(--auth-shadow)]"
              : "text-[var(--auth-muted)] hover:text-[var(--auth-text)]",
          ].join(" ")}
          key={option.value}
          onClick={() => setLanguage(option.value)}
          title={
            option.value === "id"
              ? t("language.indonesian")
              : t("language.english")
          }
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
