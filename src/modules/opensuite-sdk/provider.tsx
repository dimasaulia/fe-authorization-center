"use client";

/**
 * OpenSuite SDK - Auth Provider
 * 
 * Simplified provider using zustand for state + periodic token refresh.
 * 
 * Key behaviors:
 * - Access token persisted in sessionStorage (survives hard reload)
 * - Periodic refresh keeps token fresh (runs every N seconds before expiry)
 * - If refresh fails → redirect to login
 * - On mount: always re-fetch access snapshot for fresh permissions/menus
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initOpenSuite } from "./config";
import { DEFAULTS, INTERNAL_API_ROUTES } from "./constants";
import { useAuthStore } from "./auth-store";
import { decodeJwtPayload } from "./token-utils";
import type {
  LoginCredentials,
  MenuEntry,
  OpenSuiteConfig,
  TokenPayload,
} from "./types";

// --- Context Types ---

interface OpenSuiteContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: TokenPayload | null;
  permissions: string[];
  menus: MenuEntry[];
  isAccessLoaded: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  refreshAccess: () => Promise<void>;
}

const OpenSuiteContext = createContext<OpenSuiteContextValue | null>(null);

// --- QueryClient singleton ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

// --- Provider Props ---

interface OpenSuiteProviderProps {
  children: ReactNode;
  config: OpenSuiteConfig;
}

// --- Provider Component ---

export function OpenSuiteProvider({ children, config }: OpenSuiteProviderProps) {
  // Initialize SDK config (sync, runs once)
  useMemo(() => {
    initOpenSuite(config);
  }, [config]);

  const {
    accessToken,
    isAuthenticated,
    user,
    permissions,
    menus,
    isAccessLoaded,
    setTokens,
    setAccess,
    clearAuth,
  } = useAuthStore();

  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRefreshingRef = useRef(false);

  // --- Refresh auth token ---
  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) return true;
    isRefreshingRef.current = true;

    try {
      const res = await fetch(INTERNAL_API_ROUTES.REFRESH, { method: "POST" });
      if (!res.ok) {
        // Refresh token expired → clear and redirect
        clearAuth();
        window.location.assign(config.loginRoute ?? DEFAULTS.LOGIN_ROUTE);
        return false;
      }
      const data = await res.json();
      if (data.success && data.data.access_token) {
        const user = data.data.id_token
          ? decodeJwtPayload(data.data.id_token)
          : undefined;
        setTokens({
          accessToken: data.data.access_token,
          expiresIn: data.data.expires_in,
          sessionState: data.data.session_state,
          user,
        });
        return true;
      }
      // Refresh failed
      clearAuth();
      window.location.assign(config.loginRoute ?? DEFAULTS.LOGIN_ROUTE);
      return false;
    } catch {
      clearAuth();
      window.location.assign(config.loginRoute ?? DEFAULTS.LOGIN_ROUTE);
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [clearAuth, setTokens, config.loginRoute]);

  // --- Fetch access snapshot ---
  const fetchAccess = useCallback(async () => {
    try {
      const res = await fetch(INTERNAL_API_ROUTES.ACCESS);
      if (!res.ok) {
        if (res.status === 401) {
          // Try refresh first
          const refreshed = await refreshAuthToken();
          if (!refreshed) return;
          const retryRes = await fetch(INTERNAL_API_ROUTES.ACCESS);
          if (!retryRes.ok) return;
          const retryData = await retryRes.json();
          if (retryData.success) {
            setAccess({
              permissions: retryData.data.permissions,
              menus: retryData.data.menus,
            });
          }
          return;
        }
        return;
      }
      const data = await res.json();
      if (data.success) {
        setAccess({
          permissions: data.data.permissions,
          menus: data.data.menus,
        });
      }
    } catch {
      // Silent fail
    }
  }, [refreshAuthToken, setAccess]);

  // --- Start periodic refresh ---
  const startPeriodicRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    // Refresh token every 80% of the token lifetime (or every 4 min as fallback)
    const interval = config.accessTokenRefreshInterval ?? DEFAULTS.ACCESS_REFRESH_INTERVAL_MS;
    refreshIntervalRef.current = setInterval(() => {
      refreshAuthToken();
    }, interval);
  }, [refreshAuthToken, config.accessTokenRefreshInterval]);

  // --- Initialization on mount ---
  useEffect(() => {
    if (!isAuthenticated) return;

    // Always re-fetch access on mount (hard reload gets fresh permissions/menus)
    fetchAccess();

    // Start periodic token refresh
    startPeriodicRefresh();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, fetchAccess, startPeriodicRefresh]);

  // --- Public: Login ---
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const res = await fetch(INTERNAL_API_ROUTES.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      const decodedUser = data.data.id_token
        ? decodeJwtPayload(data.data.id_token)
        : null;

      setTokens({
        accessToken: data.data.access_token,
        expiresIn: data.data.expires_in,
        sessionState: data.data.session_state,
        user: decodedUser,
      });

      // Fetch access snapshot immediately
      await fetchAccess();

      // Start periodic refresh
      startPeriodicRefresh();
    },
    [setTokens, fetchAccess, startPeriodicRefresh],
  );

  // --- Public: Logout ---
  const logout = useCallback(async () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    clearAuth();
    try {
      await fetch(INTERNAL_API_ROUTES.LOGOUT, { method: "POST" });
    } catch {
      // Best effort
    }
  }, [clearAuth]);

  // --- Public: Permission checks ---
  const hasPermission = useCallback(
    (permission: string): boolean => permissions.includes(permission),
    [permissions],
  );

  const hasAnyPermission = useCallback(
    (perms: string[]): boolean => perms.some((p) => permissions.includes(p)),
    [permissions],
  );

  const hasAllPermissions = useCallback(
    (perms: string[]): boolean => perms.every((p) => permissions.includes(p)),
    [permissions],
  );

  // --- Public: Force refresh access ---
  const refreshAccess = useCallback(async () => {
    await fetchAccess();
  }, [fetchAccess]);

  // --- Context value ---
  const value = useMemo<OpenSuiteContextValue>(
    () => ({
      isAuthenticated,
      isLoading: false, // Token is in sessionStorage, no loading state needed
      user,
      permissions,
      menus,
      isAccessLoaded,
      login,
      logout,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      refreshAccess,
    }),
    [
      isAuthenticated,
      user,
      permissions,
      menus,
      isAccessLoaded,
      login,
      logout,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      refreshAccess,
    ],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <OpenSuiteContext.Provider value={value}>
        {children}
      </OpenSuiteContext.Provider>
    </QueryClientProvider>
  );
}

// --- Hooks ---

export function useOpenSuite(): OpenSuiteContextValue {
  const context = useContext(OpenSuiteContext);
  if (!context) {
    throw new Error(
      "[OpenSuite SDK] useOpenSuite must be used within an OpenSuiteProvider.",
    );
  }
  return context;
}

export function useAuth() {
  const { isAuthenticated, isLoading, user, login, logout } = useOpenSuite();
  return { isAuthenticated, isLoading, user, login, logout };
}

export function useAuthorization() {
  const {
    permissions,
    menus,
    isAccessLoaded,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshAccess,
  } = useOpenSuite();
  return {
    permissions,
    menus,
    isLoaded: isAccessLoaded,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshAccess,
  };
}
