"use client";

/**
 * OpenSuite SDK - Auth Provider
 * 
 * Manages the full authentication and authorization lifecycle:
 * 1. Auth tokens (access + refresh) stored in httpOnly cookies via API routes
 * 2. Authorization snapshot (permissions + menus) stored in sessionStorage
 * 3. Periodic refresh of access snapshot
 * 4. Re-fetch on hard reload (sessionStorage is cleared)
 * 5. Auto-refresh of auth tokens before expiry
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getOpenSuiteConfig, initOpenSuite } from "./config";
import { DEFAULTS, INTERNAL_API_ROUTES } from "./constants";
import {
  clearAllStorage,
  getStoredAccessSnapshot,
  storeAccessSnapshot,
  storeAuthSession,
  type StoredAccessData,
} from "./storage";
import { decodeJwtPayload } from "./token-utils";
import { setAccessToken, clearTokenStore, onTokenExpired } from "./token-store";
import type {
  AccessSnapshot,
  AuthorizationState,
  AuthState,
  LoginCredentials,
  MenuEntry,
  OpenSuiteConfig,
  TokenPayload,
} from "./types";

// --- Context Types ---

interface OpenSuiteContextValue {
  /** Authentication state */
  auth: AuthState;
  /** Authorization state (permissions + menus) */
  authorization: AuthorizationState;
  /** Login with credentials */
  login: (credentials: LoginCredentials) => Promise<void>;
  /** Logout and clear all state */
  logout: () => Promise<void>;
  /** Check if user has a specific permission */
  hasPermission: (permission: string) => boolean;
  /** Check if user has any of the given permissions */
  hasAnyPermission: (permissions: string[]) => boolean;
  /** Check if user has all of the given permissions */
  hasAllPermissions: (permissions: string[]) => boolean;
  /** Get authorized menus */
  menus: MenuEntry[];
  /** Force re-fetch access snapshot */
  refreshAccess: () => Promise<void>;
  /** Current user info decoded from id_token */
  user: TokenPayload | null;
}

const OpenSuiteContext = createContext<OpenSuiteContextValue | null>(null);

// --- Provider Props ---

interface OpenSuiteProviderProps {
  children: ReactNode;
  config: OpenSuiteConfig;
}

// --- Helper functions (outside component, no hooks rules apply) ---

async function fetchAccessFromServer(): Promise<AccessSnapshot | null> {
  try {
    const res = await fetch(INTERNAL_API_ROUTES.ACCESS);
    if (!res.ok) {
      if (res.status === 401) {
        const refreshResult = await doRefreshAuthToken();
        if (!refreshResult.success) return null;
        const retryRes = await fetch(INTERNAL_API_ROUTES.ACCESS);
        if (!retryRes.ok) return null;
        const retryData = await retryRes.json();
        return retryData.success ? retryData.data : null;
      }
      return null;
    }
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

async function doRefreshAuthToken(): Promise<{
  success: boolean;
  expiresIn?: number;
  sessionState?: string;
  accessToken?: string;
}> {
  try {
    const res = await fetch(INTERNAL_API_ROUTES.REFRESH, { method: "POST" });
    if (!res.ok) return { success: false };
    const data = await res.json();
    if (data.success) {
      return {
        success: true,
        expiresIn: data.data.expires_in,
        sessionState: data.data.session_state,
        accessToken: data.data.access_token,
      };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
}

// --- Provider Component ---

export function OpenSuiteProvider({ children, config }: OpenSuiteProviderProps) {
  // Initialize SDK config
  useMemo(() => {
    initOpenSuite(config);
  }, [config]);

  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  const [authorization, setAuthorization] = useState<AuthorizationState>({
    permissions: [],
    menus: [],
    isLoaded: false,
  });

  // Track desired auth refresh time (seconds until expiry)
  const [authExpiresIn, setAuthExpiresIn] = useState<number | null>(null);

  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const authRefreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Internal: Load and store access data ---
  const loadAccessData = useCallback(async () => {
    const snapshot = await fetchAccessFromServer();
    if (snapshot) {
      const storedData: StoredAccessData = {
        permissions: snapshot.permissions,
        menus: snapshot.menus,
        fetchedAt: Date.now(),
      };
      storeAccessSnapshot(storedData);
      setAuthorization({
        permissions: snapshot.permissions,
        menus: snapshot.menus,
        isLoaded: true,
      });
    }
  }, []);

  // --- Internal: Perform logout ---
  const performLogout = useCallback(async () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    if (authRefreshTimeoutRef.current) {
      clearTimeout(authRefreshTimeoutRef.current);
      authRefreshTimeoutRef.current = null;
    }
    clearAllStorage();
    clearTokenStore();
    setAuth({ isAuthenticated: false, isLoading: false, user: null });
    setAuthorization({ permissions: [], menus: [], isLoaded: false });
    setAuthExpiresIn(null);

    try {
      await fetch(INTERNAL_API_ROUTES.LOGOUT, { method: "POST" });
    } catch {
      // Best effort
    }
  }, []);

  // --- Auth token refresh effect (triggered by authExpiresIn changes) ---
  useEffect(() => {
    if (authExpiresIn === null) return;

    if (authRefreshTimeoutRef.current) {
      clearTimeout(authRefreshTimeoutRef.current);
    }

    const refreshIn = Math.max(
      (authExpiresIn - DEFAULTS.AUTH_REFRESH_BUFFER_SECONDS) * 1000,
      DEFAULTS.MIN_REFRESH_TIMEOUT_MS,
    );

    authRefreshTimeoutRef.current = setTimeout(async () => {
      const result = await doRefreshAuthToken();
      if (result.success && result.expiresIn && result.sessionState) {
        // Update in-memory token
        if (result.accessToken) {
          setAccessToken(result.accessToken);
        }
        storeAuthSession({
          expiresAt: Date.now() + result.expiresIn * 1000,
          sessionState: result.sessionState,
        });
        // Trigger re-schedule by updating state
        setAuthExpiresIn(result.expiresIn);
      } else {
        // Session expired
        await performLogout();
      }
    }, refreshIn);

    return () => {
      if (authRefreshTimeoutRef.current) {
        clearTimeout(authRefreshTimeoutRef.current);
        authRefreshTimeoutRef.current = null;
      }
    };
  }, [authExpiresIn, performLogout]);

  // --- Access snapshot periodic refresh effect ---
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const interval = getOpenSuiteConfig().accessTokenRefreshInterval ?? DEFAULTS.ACCESS_REFRESH_INTERVAL_MS;
    refreshIntervalRef.current = setInterval(() => {
      loadAccessData();
    }, interval);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [auth.isAuthenticated, loadAccessData]);

  // --- Initialization: Check session on mount / hard reload ---
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const res = await fetch(INTERNAL_API_ROUTES.SESSION);
        const data = await res.json();

        if (!data.success || !data.data.authenticated) {
          if (mounted) {
            setAuth({ isAuthenticated: false, isLoading: false, user: null });
          }
          return;
        }

        // We have a session - refresh to get a fresh access token in memory
        const refreshResult = await doRefreshAuthToken();
        if (refreshResult.success && refreshResult.accessToken) {
          setAccessToken(refreshResult.accessToken);

          if (refreshResult.expiresIn && refreshResult.sessionState) {
            storeAuthSession({
              expiresAt: Date.now() + refreshResult.expiresIn * 1000,
              sessionState: refreshResult.sessionState,
            });
            if (mounted) {
              setAuthExpiresIn(refreshResult.expiresIn);
            }
          }
        }

        if (mounted) {
          setAuth({
            isAuthenticated: true,
            isLoading: false,
            user: null,
          });
        }

        // Register token expired handler
        onTokenExpired(async () => {
          const result = await doRefreshAuthToken();
          if (result.success && result.accessToken) {
            setAccessToken(result.accessToken);
            if (result.expiresIn && result.sessionState) {
              storeAuthSession({
                expiresAt: Date.now() + result.expiresIn * 1000,
                sessionState: result.sessionState,
              });
              if (mounted) {
                setAuthExpiresIn(result.expiresIn);
              }
            }
          } else {
            await performLogout();
          }
        });

        // On hard reload, always re-fetch access snapshot for fresh permissions
        const storedAccess = getStoredAccessSnapshot();
        if (!storedAccess) {
          await loadAccessData();
        } else {
          if (mounted) {
            setAuthorization({
              permissions: storedAccess.permissions,
              menus: storedAccess.menus,
              isLoaded: true,
            });
          }
        }
      } catch {
        if (mounted) {
          setAuth({ isAuthenticated: false, isLoading: false, user: null });
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [loadAccessData, performLogout]);

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

      // Store access token in memory for apiClient usage
      if (data.data.access_token) {
        setAccessToken(data.data.access_token);
      }

      const user = data.data.id_token
        ? decodeJwtPayload(data.data.id_token)
        : null;

      storeAuthSession({
        expiresAt: Date.now() + data.data.expires_in * 1000,
        sessionState: data.data.session_state,
      });

      setAuth({ isAuthenticated: true, isLoading: false, user });
      setAuthExpiresIn(data.data.expires_in);

      // Fetch access snapshot immediately after login
      await loadAccessData();
    },
    [loadAccessData],
  );

  // --- Public: Logout ---
  const logout = useCallback(async () => {
    await performLogout();
  }, [performLogout]);

  // --- Public: Permission checks ---
  const hasPermission = useCallback(
    (permission: string): boolean => {
      return authorization.permissions.includes(permission);
    },
    [authorization.permissions],
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      return permissions.some((p) => authorization.permissions.includes(p));
    },
    [authorization.permissions],
  );

  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      return permissions.every((p) => authorization.permissions.includes(p));
    },
    [authorization.permissions],
  );

  // --- Public: Force refresh access ---
  const refreshAccess = useCallback(async () => {
    await loadAccessData();
  }, [loadAccessData]);

  // --- Context value ---
  const value = useMemo<OpenSuiteContextValue>(
    () => ({
      auth,
      authorization,
      login,
      logout,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      menus: authorization.menus,
      refreshAccess,
      user: auth.user,
    }),
    [
      auth,
      authorization,
      login,
      logout,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      refreshAccess,
    ],
  );

  return (
    <OpenSuiteContext.Provider value={value}>
      {children}
    </OpenSuiteContext.Provider>
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

/**
 * Convenience hook for auth state only.
 */
export function useAuth() {
  const { auth, login, logout, user } = useOpenSuite();
  return { ...auth, login, logout, user };
}

/**
 * Convenience hook for authorization state only.
 */
export function useAuthorization() {
  const {
    authorization,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    menus,
    refreshAccess,
  } = useOpenSuite();
  return {
    ...authorization,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    menus,
    refreshAccess,
  };
}
