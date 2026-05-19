"use client";

import { usePreferences, type Theme } from "@/modules/preferences";

const themeOptions: Array<{ label: string; value: Theme }> = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

export function ThemeToggle() {
  const { setTheme, t, theme } = usePreferences();

  return (
    <div
      aria-label={t("common.theme")}
      className="flex h-9 rounded-full border border-[var(--auth-field-border)] bg-[var(--auth-field)] p-1"
      role="group"
    >
      {themeOptions.map((option) => (
        <button
          aria-pressed={theme === option.value}
          className={[
            "h-7 rounded-full px-3 text-xs font-semibold leading-4 transition",
            theme === option.value
              ? "bg-[var(--auth-text)] text-[var(--auth-card)] shadow-[0_6px_16px_var(--auth-shadow)]"
              : "text-[var(--auth-muted)] hover:text-[var(--auth-text)]",
          ].join(" ")}
          key={option.value}
          onClick={() => setTheme(option.value)}
          title={option.value === "light" ? t("theme.light") : t("theme.dark")}
          type="button"
        >
          {option.value === "light" ? t("theme.light") : t("theme.dark")}
        </button>
      ))}
    </div>
  );
}
