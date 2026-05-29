/**
 * OpenSuite SDK Types
 * Core type definitions for the OpenSuite authentication and authorization SDK.
 */

// --- SDK Configuration ---

export interface OpenSuiteConfig {
  /** The app code registered in the authorization center */
  appCode: string;
  /** The authorization server base URL */
  authServerUrl: string;
  /** App secret key for server-to-server auth (placeholder for future use) */
  appSecret?: string;
  /** Access token refresh interval in milliseconds (default: 4 minutes) */
  accessTokenRefreshInterval?: number;
  /** Route to redirect to when unauthenticated */
  loginRoute?: string;
  /** Route to redirect to after login */
  defaultRoute?: string;
}

// --- Auth Token Types ---

export interface AuthTokens {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  session_state: string;
  scope: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthTokens;
}

export interface RefreshRequest {
  refresh_token: string;
  set_cookie: boolean;
}

// --- Authorization / Access Types ---

export interface MenuEntry {
  code: string;
  path: string;
  required_permission: string;
}

export interface AccessSnapshot {
  app: string;
  menus: MenuEntry[];
  permissions: string[];
}

export interface AccessSnapshotResponse {
  success: boolean;
  message: string;
  data: AccessSnapshot;
}

export interface AccessTokenResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    expires_in: number;
    token_type: string;
  };
}

// --- JWKS Types ---

export interface JWK {
  kid: string;
  kty: string;
  alg: string;
  use: string;
  n: string;
  e: string;
  x5c?: string[];
  x5t?: string;
  "x5t#S256"?: string;
}

export interface JWKSResponse {
  keys: JWK[];
}

// --- Session State ---

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: TokenPayload | null;
}

export interface AuthorizationState {
  permissions: string[];
  menus: MenuEntry[];
  isLoaded: boolean;
}

export interface TokenPayload {
  sub?: string;
  email?: string;
  preferred_username?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
  [key: string]: unknown;
}
