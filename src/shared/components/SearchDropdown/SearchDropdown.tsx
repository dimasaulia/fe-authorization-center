"use client";

import { useEffect, useRef, useState } from "react";

import { usePreferences } from "@/modules/preferences";

type SearchDropdownOption = {
  id: number;
  label: string;
  sublabel?: string;
};

type SearchDropdownProps = {
  disabled?: boolean;
  onSearch: (q: string) => void;
  onSelect: (option: SearchDropdownOption) => void;
  options: SearchDropdownOption[];
  placeholder?: string;
  value: SearchDropdownOption | null;
};

export function SearchDropdown({
  disabled = false,
  onSearch,
  onSelect,
  options,
  placeholder,
  value,
}: SearchDropdownProps) {
  const { t } = usePreferences();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
    setOpen(true);
  };

  const handleSelect = (option: SearchDropdownOption) => {
    onSelect(option);
    setQuery("");
    setOpen(false);
  };

  const handleFocus = () => {
    setOpen(true);
    onSearch(query);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`flex h-11 w-full items-center gap-2 rounded-xl border bg-[var(--dashboard-field)] px-3.5 transition ${
          disabled
            ? "cursor-not-allowed opacity-60 border-[var(--dashboard-border-soft)]"
            : open
              ? "border-[var(--dashboard-accent-border)] ring-2 ring-[var(--dashboard-accent-soft)]"
              : "border-[var(--dashboard-border-soft)]"
        }`}
      >
        {value ? (
          <div className="flex flex-1 items-center justify-between gap-2">
            <span className="truncate text-sm text-[var(--dashboard-text)]">
              {value.label}
            </span>
            <button
              className="shrink-0 text-[var(--dashboard-subtle)] hover:text-[var(--dashboard-text)]"
              disabled={disabled}
              onClick={() => { onSelect({ id: 0, label: "" }); setQuery(""); }}
              type="button"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ) : (
          <input
            className="flex-1 bg-transparent text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)]"
            disabled={disabled}
            onFocus={handleFocus}
            onChange={handleInputChange}
            placeholder={placeholder ?? t("common.search")}
            type="text"
            value={query}
          />
        )}
      </div>

      {open && !disabled && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] shadow-[0_8px_24px_var(--dashboard-shadow)]">
          {options.length === 0 ? (
            <p className="px-4 py-3 text-sm text-[var(--dashboard-muted)]">
              {t("common.noResults")}
            </p>
          ) : (
            <ul className="max-h-52 overflow-y-auto">
              {options.map((opt) => (
                <li key={opt.id}>
                  <button
                    className="w-full px-4 py-2.5 text-left transition hover:bg-[var(--dashboard-panel-subtle)]"
                    onClick={() => handleSelect(opt)}
                    type="button"
                  >
                    <span className="block text-sm font-medium text-[var(--dashboard-text)]">
                      {opt.label}
                    </span>
                    {opt.sublabel && (
                      <span className="block font-mono text-xs text-[var(--dashboard-muted)]">
                        {opt.sublabel}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
