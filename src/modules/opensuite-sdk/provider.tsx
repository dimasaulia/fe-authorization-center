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
import { AUTH_SERVER_ENDPOINTS, DEFAULTS, INTERNAL_API_ROUTES } from "./constants";
import { useAuthStore } from "./auth-store";
import { isAuthenticationFailure } from "./auth-errors";
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
  loginWithSso: (options?: { redirectTo?: string; prompt?: string }) => void;
  completeSsoLogin: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
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

async function readJsonOrNull<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/users",
  "/apps",
  "/teams",
  "/actions",
  "/roles",
  "/settings",
];

function isProtectedClientPath(pathname: string, defaultRoute?: string): boolean {
  const protectedRoutes = defaultRoute
    ? [...PROTECTED_ROUTE_PREFIXES, defaultRoute]
    : PROTECTED_ROUTE_PREFIXES;

  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

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
  const refreshPromiseRef = useRef<Promise<boolean> | null>(null);
  const hasInitializedSessionRef = useRef(false);

  const redirectToLogin = useCallback(async () => {
    clearAuth();
    try {
      await fetch(INTERNAL_API_ROUTES.LOGOUT, { method: "POST" });
    } catch {
      // Best effort cookie cleanup.
    }
    window.location.assign(config.loginRoute ?? DEFAULTS.LOGIN_ROUTE);
  }, [clearAuth, config.loginRoute]);

  // --- Refresh auth token ---
  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const refreshPromise = (async () => {
      try {
        const res = await fetch(INTERNAL_API_ROUTES.REFRESH, { method: "POST" });
        if (!res.ok) {
          // Refresh token expired → clear and redirect
          await redirectToLogin();
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
        await redirectToLogin();
        return false;
      } catch {
        await redirectToLogin();
        return false;
      }
    })();

    refreshPromiseRef.current = refreshPromise;

    try {
      return await refreshPromise;
    } finally {
      refreshPromiseRef.current = null;
    }
  }, [redirectToLogin, setTokens]);

  // --- Fetch access snapshot ---
  const fetchAccess = useCallback(async () => {
    try {
      const res = await fetch(INTERNAL_API_ROUTES.ACCESS);

      if (!res.ok) {
        const data = await readJsonOrNull<{ message?: string }>(res);

        if (res.status === 401 || isAuthenticationFailure(data?.message)) {
          // Try refresh first
          const refreshed = await refreshAuthToken();
          if (!refreshed) return;

          const retryRes = await fetch(INTERNAL_API_ROUTES.ACCESS);
          const retryData = await readJsonOrNull<{
            success?: boolean;
            message?: string;
            data?: { permissions: string[]; menus: MenuEntry[] };
          }>(retryRes);

          if (!retryRes.ok || !retryData?.success) {
            if (
              retryRes.status === 401 ||
              isAuthenticationFailure(retryData?.message)
            ) {
              await redirectToLogin();
            }
            return;
          }

          if (retryData.data) {
            setAccess({
              permissions: retryData.data.permissions,
              menus: retryData.data.menus,
            });
          }
          return;
        }
        return;
      }

      const data = await readJsonOrNull<{
        success?: boolean;
        message?: string;
        data?: { permissions: string[]; menus: MenuEntry[] };
      }>(res);

      if (data?.success && data.data) {
        setAccess({
          permissions: data.data.permissions,
          menus: data.data.menus,
        });
      } else if (isAuthenticationFailure(data?.message)) {
        await redirectToLogin();
      }
    } catch {
      // Silent fail
    }
  }, [redirectToLogin, refreshAuthToken, setAccess]);

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
    if (hasInitializedSessionRef.current) return;

    const shouldValidateSession =
      isAuthenticated ||
      isProtectedClientPath(window.location.pathname, config.defaultRoute);

    if (!shouldValidateSession) return;

    hasInitializedSessionRef.current = true;
    let cancelled = false;

    async function validateSession() {
      const refreshed = await refreshAuthToken();
      if (!refreshed || cancelled) return;

      // Always re-fetch access after session validation on mount.
      await fetchAccess();

      if (!cancelled) {
        startPeriodicRefresh();
      }
    }

    validateSession();

    return () => {
      cancelled = true;
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [
    config.defaultRoute,
    fetchAccess,
    isAuthenticated,
    refreshAuthToken,
    startPeriodicRefresh,
  ]);

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

  const loginWithSso = useCallback(
    (options?: { redirectTo?: string; prompt?: string }) => {
      const callbackPath = config.ssoCallbackRoute ?? DEFAULTS.SSO_CALLBACK_ROUTE;
      const callbackUrl = new URL(callbackPath, window.location.origin);
      const redirectTo = options?.redirectTo ?? new URLSearchParams(window.location.search).get("redirect");
      if (redirectTo) {
        callbackUrl.searchParams.set("redirect", redirectTo);
      }

      const authUrl = new URL(
        `${config.authServerUrl}${AUTH_SERVER_ENDPOINTS.KEYCLOAK_REDIRECT}`,
      );
      authUrl.searchParams.set("callback_url", callbackUrl.toString());
      if (options?.prompt) {
        authUrl.searchParams.set("prompt", options.prompt);
      }
      window.location.assign(authUrl.toString());
    },
    [config.authServerUrl, config.ssoCallbackRoute],
  );

  const completeSsoLogin = useCallback(
    async (code: string) => {
      const res = await fetch(INTERNAL_API_ROUTES.SSO_EXCHANGE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "SSO login failed");
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

      await fetchAccess();
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

  const refreshSession = useCallback(async () => {
    return refreshAuthToken();
  }, [refreshAuthToken]);

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
      loginWithSso,
      completeSsoLogin,
      logout,
      refreshSession,
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
      loginWithSso,
      completeSsoLogin,
      logout,
      refreshSession,
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
  const {
    isAuthenticated,
    isLoading,
    user,
    login,
    loginWithSso,
    completeSsoLogin,
    logout,
    refreshSession,
  } = useOpenSuite();
  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    loginWithSso,
    completeSsoLogin,
    logout,
    refreshSession,
  };
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
