/**
 * OpenSuite SDK
 * 
 * A complete authentication and authorization SDK for OpenSuite ecosystem apps.
 * 
 * Setup:
 * ```tsx
 * // In your root layout or app wrapper:
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
 * // Component-level permission check
 * <Can permission="app.users.create">
 *   <CreateButton />
 * </Can>
 * 
 * // Hook-level permission check
 * const canEdit = usePermission("app.users.update");
 * 
 * // Get authorized menus
 * const menus = useMenus();
 * ```
 * 
 * Usage - Route Protection:
 * ```tsx
 * import { RouteGuard } from "@/modules/opensuite-sdk";
 * 
 * <RouteGuard permission="app.users.read">
 *   <UserListPage />
 * </RouteGuard>
 * ```
 * 
 * Usage - Auth:
 * ```tsx
 * import { useAuth } from "@/modules/opensuite-sdk";
 * 
 * const { login, logout, isAuthenticated, user } = useAuth();
 * await login({ username: "admin", password: "pass" });
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
  apiRefreshToken,
  apiFetchAccessSnapshot,
  apiFetchAccessToken,
  apiFetchJWKS,
} from "./api";

// --- Storage (for advanced usage) ---
export {
  storeAccessSnapshot,
  getStoredAccessSnapshot,
  clearAccessStorage,
  clearAllStorage,
} from "./storage";

// --- Token Store (in-memory, for apiClient) ---
export {
  getAccessToken,
  setAccessToken,
  clearTokenStore,
  handleTokenExpired,
  onTokenExpired,
} from "./token-store";

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
} from "./types";
