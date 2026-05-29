"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AppIcon } from "@/shared/components/AppIcon";
import { INTERNAL_API_ROUTES } from "@/modules/opensuite-sdk/constants";
import type { UserProfileData } from "@/modules/opensuite-sdk/types";

type UserProfileMenuProps = {
  onLogout: () => void;
};

export function UserProfileMenu({ onLogout }: UserProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ bottom: number; left: number }>({ bottom: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const fetchProfile = useCallback(async () => {
    if (profile) return;
    setIsLoading(true);
    try {
      const res = await fetch(INTERNAL_API_ROUTES.ME);
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const toggle = () => {
    const next = !isOpen;
    if (next && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopupPosition({
        bottom: window.innerHeight - rect.top + 8,
        left: rect.left,
      });
      fetchProfile();
    }
    setIsOpen(next);
  };

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popupRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Trigger button */}
      <button
        aria-expanded={isOpen}
        aria-label="User menu"
        className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-panel-subtle)]"
        onClick={toggle}
        ref={triggerRef}
        type="button"
      >
        <AppIcon className="h-[17px] w-[17px]" name="user" />
      </button>

      {/* Portal-rendered popup */}
      {isOpen && typeof document !== "undefined" && createPortal(
        <>
          {/* Desktop popup */}
          <div
            className="fixed z-50 hidden w-[260px] overflow-hidden rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] shadow-[0_16px_48px_rgba(0,0,0,0.12)] lg:block"
            ref={popupRef}
            style={{
              bottom: `${popupPosition.bottom}px`,
              left: `${popupPosition.left}px`,
            }}
          >
            <ProfileContent
              isLoading={isLoading}
              onLogout={onLogout}
              profile={profile}
            />
          </div>

          {/* Mobile bottom sheet */}
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              aria-label="Close menu"
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsOpen(false)}
              onKeyDown={(e) => { if (e.key === "Escape") setIsOpen(false); }}
              role="button"
              tabIndex={-1}
            />
            <div className="absolute inset-x-0 bottom-0 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] shadow-[0_-8px_32px_rgba(0,0,0,0.12)]">
              <div className="mx-auto my-3 h-1 w-10 rounded-full bg-[var(--dashboard-border)]" />
              <ProfileContent
                isLoading={isLoading}
                onLogout={onLogout}
                profile={profile}
              />
            </div>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}

// --- Profile Content (shared between desktop popup and mobile sheet) ---

function ProfileContent({
  profile,
  isLoading,
  onLogout,
}: {
  profile: UserProfileData | null;
  isLoading: boolean;
  onLogout: () => void;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center px-4 py-6">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--dashboard-border)] border-t-[var(--dashboard-accent)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* User info */}
      {profile && (
        <div className="border-b border-[var(--dashboard-border)] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--dashboard-accent-soft)] text-sm font-bold text-[var(--dashboard-accent)]">
              {getInitials(profile.user.display_name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--dashboard-text)]">
                {profile.user.display_name}
              </p>
              <p className="truncate text-xs text-[var(--dashboard-muted)]">
                {profile.user.email}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center rounded-md bg-[var(--dashboard-field)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--dashboard-text)]">
              {profile.user.type}
            </span>
            <span className="inline-flex items-center rounded-md border border-emerald-600/30 bg-emerald-600/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400">
              {profile.user.status}
            </span>
          </div>
        </div>
      )}

      {/* Apps access */}
      {profile && profile.apps.length > 0 && (
        <div className="border-b border-[var(--dashboard-border)] px-4 py-3">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--dashboard-muted)]">
            Apps
          </p>
          <div className="flex flex-col gap-1">
            {profile.apps.map((app) => (
              <div
                className="flex items-center justify-between rounded-lg px-2 py-1.5"
                key={app.code}
              >
                <span className="text-xs font-medium text-[var(--dashboard-text)]">
                  {app.name}
                </span>
                <span className="text-[11px] text-[var(--dashboard-muted)]">
                  {app.permission_count} permissions
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-2 py-2">
        <button
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
          onClick={onLogout}
          type="button"
        >
          <AppIcon className="h-4 w-4" name="logout" />
          Logout
        </button>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
