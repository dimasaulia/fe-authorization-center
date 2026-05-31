"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuth, useAuthorization } from "@/modules/opensuite-sdk";
import { isAuthenticationFailure } from "@/modules/opensuite-sdk/auth-errors";
import { DEFAULTS, INTERNAL_API_ROUTES } from "@/modules/opensuite-sdk/constants";
import type {
  UserProfileData,
  UserProfileResponse,
} from "@/modules/opensuite-sdk/types";
import { usePreferences } from "@/modules/preferences";

type GreetingPeriod = "morning" | "afternoon" | "evening" | "night";

export type DashboardAccessSummary = {
  appAccessCount: number;
  apps: UserProfileData["apps"];
  primaryProvider: string;
  providerCount: number;
  providers: UserProfileData["providers"];
  totalPermissions: number;
  user: UserProfileData["user"] | null;
};

function getGreetingPeriod(date: Date): GreetingPeriod {
  const hour = date.getHours();

  if (hour >= 4 && hour < 11) return "morning";
  if (hour >= 11 && hour < 15) return "afternoon";
  if (hour >= 15 && hour < 18) return "evening";

  return "night";
}

function getGreetingText(period: GreetingPeriod, language: string) {
  if (language === "id") {
    return {
      morning: "Selamat pagi",
      afternoon: "Selamat siang",
      evening: "Selamat sore",
      night: "Selamat malam",
    }[period];
  }

  return {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    night: "Good evening",
  }[period];
}

function getLocale(language: string) {
  return language === "id" ? "id-ID" : "en-US";
}

function formatCurrentDateTime(date: Date, language: string) {
  return new Intl.DateTimeFormat(getLocale(language), {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

export function useDashboardHomeController() {
  const { language } = usePreferences();
  const { logout, refreshSession } = useAuth();
  const { refreshAccess } = useAuthorization();
  const [now, setNow] = useState(() => new Date());
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProfile() {
      setIsProfileLoading(true);
      setProfileError(null);

      try {
        const refreshed = await refreshSession();
        if (!refreshed) {
          return;
        }

        await refreshAccess();

        const response = await fetch(INTERNAL_API_ROUTES.ME, {
          credentials: "include",
          signal: controller.signal,
        });
        const result = (await response.json()) as UserProfileResponse;

        if (!response.ok || !result.success) {
          if (
            response.status === 401 ||
            isAuthenticationFailure(result.message)
          ) {
            await logout();
            window.location.assign(DEFAULTS.LOGIN_ROUTE);
            return;
          }

          throw new Error(result.message);
        }

        setProfile(result.data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setProfileError(
          error instanceof Error ? error.message : "Failed to load profile",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsProfileLoading(false);
        }
      }
    }

    fetchProfile();

    return () => controller.abort();
  }, [logout, refreshAccess, refreshSession]);

  const greeting = useMemo(() => {
    const displayName =
      profile?.user.display_name || profile?.user.username || "OpenSuite User";
    const period = getGreetingPeriod(now);

    return {
      dateTime: formatCurrentDateTime(now, language),
      text: `${getGreetingText(period, language)}, ${displayName}`,
    };
  }, [language, now, profile]);

  const accessSummary = useMemo<DashboardAccessSummary>(() => {
    const totalPermissions =
      profile?.apps.reduce((total, app) => total + app.permission_count, 0) ?? 0;
    const primaryProvider =
      profile?.providers.find((provider) => provider.is_primary)?.provider ??
      profile?.providers[0]?.provider ??
      "-";

    return {
      appAccessCount: profile?.app_access_count ?? 0,
      apps: profile?.apps ?? [],
      primaryProvider,
      providerCount: profile?.providers.length ?? 0,
      providers: profile?.providers ?? [],
      totalPermissions,
      user: profile?.user ?? null,
    };
  }, [profile]);

  return {
    accessSummary,
    greeting,
    isProfileLoading,
    profileError,
  };
}
