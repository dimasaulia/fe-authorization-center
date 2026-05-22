"use client";

import { usePreferences } from "@/modules/preferences";

type ConfirmDialogProps = {
  description: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
  variant?: "danger" | "default";
};

export function ConfirmDialog({
  description,
  isLoading = false,
  onCancel,
  onConfirm,
  open,
  title,
  variant = "default",
}: ConfirmDialogProps) {
  const { t } = usePreferences();

  if (!open) return null;

  return (
    <div
      aria-labelledby="confirm-dialog-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-6 shadow-[0_8px_32px_var(--dashboard-shadow)]">
        <h2
          className="text-base font-semibold text-[var(--dashboard-text)]"
          id="confirm-dialog-title"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--dashboard-muted)]">
          {description}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-4 text-sm font-semibold text-[var(--dashboard-muted-strong)] transition hover:bg-[var(--dashboard-panel-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            onClick={onCancel}
            type="button"
          >
            {t("authz.form.cancel")}
          </button>
          <button
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              variant === "danger"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "border border-hero-border bg-hero text-white hover:bg-hero-hover"
            }`}
            disabled={isLoading}
            onClick={onConfirm}
            type="button"
          >
            {isLoading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {t("common.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
