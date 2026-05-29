/**
 * OpenSuite SDK - Auth Store (Zustand)
 * 
 * Global auth state persisted to sessionStorage.
 * Access token survives hard reload — no need to wait for refresh.
 * 
 * Architecture:
 * - access_token: stored in sessionStorage via zustand persist
 * - refresh: handled via httpOnly cookie (server-side) + internal API route
 * - On hard reload: token is immediately available from sessionStorage
 * - Periodic refresh keeps token fresh before expiry
 * - If refresh fails (refresh_token expired) → redirect to login
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MenuEntry, TokenPayload } from "./types";

export interface AuthStoreState {
  // --- Auth ---
  accessToken: string | null;
  expiresAt: number | null;
  sessionState: string | null;
  user: TokenPayload | null;
  isAuthenticated: boolean;

  // --- Authorization ---
  permissions: string[];
  menus: MenuEntry[];
  isAccessLoaded: boolean;

  // --- Actions ---
  setTokens: (data: {
    accessToken: string;
    expiresIn: number;
    sessionState: string;
    user?: TokenPayload | null;
  }) => void;
  setAccess: (data: { permissions: string[]; menus: MenuEntry[] }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      // Initial state
      accessToken: null,
      expiresAt: null,
      sessionState: null,
      user: null,
      isAuthenticated: false,
      permissions: [],
      menus: [],
      isAccessLoaded: false,

      // Actions
      setTokens: ({ accessToken, expiresIn, sessionState, user }) =>
        set({
          accessToken,
          expiresAt: Date.now() + expiresIn * 1000,
          sessionState,
          user: user ?? null,
          isAuthenticated: true,
        }),

      setAccess: ({ permissions, menus }) =>
        set({
          permissions,
          menus,
          isAccessLoaded: true,
        }),

      clearAuth: () =>
        set({
          accessToken: null,
          expiresAt: null,
          sessionState: null,
          user: null,
          isAuthenticated: false,
          permissions: [],
          menus: [],
          isAccessLoaded: false,
        }),
    }),
    {
      name: "opensuite-auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? sessionStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        },
      ),
      // Only persist these fields
      partialize: (state) => ({
        accessToken: state.accessToken,
        expiresAt: state.expiresAt,
        sessionState: state.sessionState,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
        menus: state.menus,
        isAccessLoaded: state.isAccessLoaded,
      }),
    },
  ),
);

/**
 * Get access token synchronously (for apiClient).
 * Works outside React components.
 */
export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

/**
 * Check if token is about to expire (within buffer seconds).
 */
export function isTokenExpiring(bufferMs = 60_000): boolean {
  const { expiresAt } = useAuthStore.getState();
  if (!expiresAt) return true;
  return Date.now() >= expiresAt - bufferMs;
}
