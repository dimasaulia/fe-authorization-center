/**
 * OpenSuite SDK
 * 
 * A complete authentication and authorization SDK for OpenSuite ecosystem apps.
 * 
 * Setup:
 * ```tsx
 * import { OpenSuiteProvider } from "@/modules/opensuite-sdk";
 * 
 * <OpenSuiteProvider config={{
 *   appCode: "my-app",
 *   authServerUrl: "http://localhost:8080",
 * }}>
 *   {children}
 * </OpenSuiteProvider>
 * ```
 * 
 * Usage - Dynamic Rendering:
 * ```tsx
 * import { Can, usePermission, useMenus } from "@/modules/opensuite-sdk";
 * 
 * <Can permission="app.users.create">
 *   <CreateButton />
 * </Can>
 * ```
 * 
 * Usage - Auth:
 * ```tsx
 * import { useAuth } from "@/modules/opensuite-sdk";
 * 
 * const { login, logout, isAuthenticated, user } = useAuth();
 * ```
 */

// --- Configuration ---
export { initOpenSuite, getOpenSuiteConfig } from "./config";

// --- Constants ---
export {
  COOKIES,
  STORAGE_KEYS,
  AUTH_SERVER_ENDPOINTS,
  INTERNAL_API_ROUTES,
  DEFAULTS,
  COOKIE_OPTIONS,
} from "./constants";

// --- Provider ---
export {
  OpenSuiteProvider,
  useOpenSuite,
  useAuth,
  useAuthorization,
} from "./provider";

// --- Auth Store (Zustand) ---
export {
  useAuthStore,
  getAccessToken,
  isTokenExpiring,
} from "./auth-store";

// --- Components ---
export { Can } from "./components/Can";
export { RouteGuard } from "./components/RouteGuard";

// --- Hooks ---
export {
  usePermission,
  useAnyPermission,
  useAllPermissions,
  useMenus,
  useRouteAccess,
} from "./hooks/usePermission";

// --- API (for advanced usage / server-side) ---
export {
  apiLogin,
  buildKeycloakSsoRedirectUrl,
  apiExchangeKeycloakSsoCode,
  apiRefreshToken,
  apiFetchAccessSnapshot,
  apiFetchAccessToken,
  apiFetchJWKS,
  apiLogout,
  apiFetchUserProfile,
} from "./api";

// --- Utilities ---
export { decodeJwtPayload, isTokenExpired } from "./token-utils";

// --- Types ---
export type {
  OpenSuiteConfig,
  AuthTokens,
  LoginCredentials,
  AuthResponse,
  AccessSnapshot,
  AccessSnapshotResponse,
  AccessTokenResponse,
  MenuEntry,
  AuthState,
  AuthorizationState,
  TokenPayload,
  JWK,
  JWKSResponse,
  UserProfile,
  UserProfileData,
  UserProfileResponse,
  UserProvider,
  UserAppAccess,
} from "./types";
