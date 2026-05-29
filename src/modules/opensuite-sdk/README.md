# OpenSuite SDK

Authentication and authorization SDK for OpenSuite ecosystem apps (Next.js frontend).

## Dependencies

```json
{
  "zustand": "5.0.5",
  "@tanstack/react-query": "5.80.3",
  "next": ">=15",
  "react": ">=19"
}
```

## Architecture

```
Token Strategy:
- Access token  → zustand store (persisted in sessionStorage, survives hard reload)
- Refresh token → httpOnly cookie (server-side only, managed via Next.js API routes)
- Permissions   → zustand store (re-fetched on every mount/hard reload)

Flow:
  Login → API route stores refresh in cookie, returns access_token to client
  → Zustand stores access_token in sessionStorage
  → apiClient reads token synchronously from zustand
  → Periodic refresh keeps token fresh (every 4 min)
  → If refresh fails → redirect to /login
```

## Required Environment Variables

```env
NEXT_PUBLIC_AUTHORIZATION_CENTER_URL=http://localhost:8080
NEXT_PUBLIC_APP_CODE=authorization-center
```

## Required API Routes

The SDK requires these Next.js API routes to be present in `src/app/api/auth/`:

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/login` | POST | Login, store tokens in cookies, return access_token |
| `/api/auth/logout` | POST | Invalidate refresh token, clear cookies |
| `/api/auth/refresh` | POST | Refresh tokens using cookie, return new access_token |
| `/api/auth/session` | GET | Check if auth cookie exists |
| `/api/auth/access` | GET | Proxy access snapshot fetch (uses cookie for auth) |
| `/api/auth/me` | GET | Proxy user profile fetch (uses cookie for auth) |

These routes are already implemented in this project under `src/app/api/auth/`.

## Setup

### 1. Wrap your app with the provider

```tsx
// src/app/layout.tsx
import { OpenSuiteClientProvider } from "@/modules/opensuite-sdk/OpenSuiteClientProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <OpenSuiteClientProvider>
          {children}
        </OpenSuiteClientProvider>
      </body>
    </html>
  );
}
```

The `OpenSuiteClientProvider` reads config from `envConfig` and `appConfig`:

```tsx
// src/modules/opensuite-sdk/OpenSuiteClientProvider.tsx
<OpenSuiteProvider config={{
  appCode: appConfig.appCode,
  authServerUrl: envConfig.authorizationCenterUrl,
  loginRoute: "/login",
  defaultRoute: "/dashboard",
  accessTokenRefreshInterval: 4 * 60 * 1000, // 4 minutes
}}>
```

### 2. Configure app code

```ts
// src/config/app.config.ts
export const appConfig = {
  appCode: process.env.NEXT_PUBLIC_APP_CODE ?? "authorization-center",
};
```

## Usage

### Authentication (Login/Logout)

```tsx
"use client";
import { useAuth } from "@/modules/opensuite-sdk";

function LoginForm() {
  const { login, logout, isAuthenticated, user } = useAuth();

  const handleLogin = async () => {
    await login({ username: "admin", password: "pass" });
    // Redirect after login
    window.location.assign("/dashboard");
  };

  const handleLogout = async () => {
    await logout();
    window.location.assign("/login");
  };
}
```

### Permission-based Rendering (Can component)

```tsx
import { Can } from "@/modules/opensuite-sdk";

// Single permission
<Can permission="authorization-center.users.write">
  <CreateUserButton />
</Can>

// Any of these permissions
<Can anyPermission={["app.users.update", "app.users.write"]}>
  <EditForm />
</Can>

// All permissions required
<Can allPermissions={["app.users.read", "app.users.update"]}>
  <AdminPanel />
</Can>

// With fallback
<Can permission="app.users.delete" fallback={<span>No access</span>}>
  <DeleteButton />
</Can>
```

### Permission Hook

```tsx
"use client";
import { usePermission, useAnyPermission, useAllPermissions } from "@/modules/opensuite-sdk";

function MyComponent() {
  const canCreate = usePermission("authorization-center.users.write");
  const canManage = useAnyPermission(["app.users.update", "app.users.delete"]);
  const isAdmin = useAllPermissions(["app.admin.read", "app.admin.write"]);

  if (!canCreate) return null;
  return <CreateButton />;
}
```

### Dynamic Menus

```tsx
"use client";
import { useMenus } from "@/modules/opensuite-sdk";

function Sidebar() {
  const menus = useMenus();
  // menus = [{ code, path, required_permission }]

  return (
    <nav>
      {menus.map((menu) => (
        <Link href={menu.path} key={menu.code}>{menu.code}</Link>
      ))}
    </nav>
  );
}
```

### Route Protection

```tsx
import { RouteGuard } from "@/modules/opensuite-sdk";

// In a page layout
<RouteGuard permission="authorization-center.users.read">
  <UserListPage />
</RouteGuard>

// With loading state
<RouteGuard
  permission="app.admin.read"
  loading={<Spinner />}
  unauthorized={<AccessDenied />}
>
  <AdminPage />
</RouteGuard>
```

### Authenticated API Calls (apiClient)

```tsx
import { apiClient } from "@/modules/http/api-client";

// GET request (auth header injected automatically)
const users = await apiClient<UserListResponse>("/api/v1/users");

// POST request
const result = await apiClient<CreateResponse>("/api/v1/users", {
  method: "POST",
  body: JSON.stringify({ name: "John" }),
});

// With custom base URL
const data = await apiClient<Response>("/api/v1/data", {
  baseUrl: "http://other-service:3000",
});

// Public request (no auth header)
const health = await apiClient<HealthResponse>("/health", { public: true });
```

The `apiClient` automatically:
- Reads access token from zustand store (sync, no waiting)
- Injects `Authorization: Bearer <token>` header
- On 401: attempts one token refresh, retries the request
- If refresh fails: clears auth state and redirects to `/login`

### Direct Store Access (outside React)

```ts
import { useAuthStore, getAccessToken } from "@/modules/opensuite-sdk";

// Sync read (for non-React code)
const token = getAccessToken();

// Full store access
const { isAuthenticated, permissions, clearAuth } = useAuthStore.getState();
```

## File Structure

```
src/modules/opensuite-sdk/
├── index.ts                    # Barrel export
├── auth-store.ts               # Zustand store (persisted to sessionStorage)
├── api.ts                      # Authorization server API client
├── config.ts                   # SDK configuration singleton
├── constants.ts                # All static values (cookies, endpoints, defaults)
├── provider.tsx                # React context provider + periodic refresh
├── token-utils.ts              # JWT decode utilities
├── types.ts                    # TypeScript type definitions
├── OpenSuiteClientProvider.tsx # Pre-configured provider wrapper
├── components/
│   ├── Can.tsx                 # Permission-based conditional rendering
│   └── RouteGuard.tsx          # Route-level permission guard
└── hooks/
    └── usePermission.ts        # Permission check hooks
```

## Constants (Single Source of Truth)

All static values are in `src/modules/opensuite-sdk/constants.ts`:

```ts
import { COOKIES, STORAGE_KEYS, AUTH_SERVER_ENDPOINTS, INTERNAL_API_ROUTES, DEFAULTS } from "@/modules/opensuite-sdk";

COOKIES.AUTH_TOKEN          // "opensuite_auth_token"
COOKIES.REFRESH_TOKEN       // "opensuite_refresh_token"
INTERNAL_API_ROUTES.LOGIN   // "/api/auth/login"
DEFAULTS.LOGIN_ROUTE        // "/login"
DEFAULTS.DEFAULT_ROUTE      // "/dashboard"
DEFAULTS.ACCESS_REFRESH_INTERVAL_MS // 240000 (4 min)
```

## Permission Format

Permissions follow the pattern: `{app-code}.{module}.{action}`

```
authorization-center.users.read
authorization-center.users.write
authorization-center.users.update
authorization-center.users.delete
authorization-center.roles.read
authorization-center.modules.write
```

## Authorization Server Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/auth/login` | POST | Login (username + password) |
| `/api/v1/auth/refresh` | POST | Refresh token |
| `/api/v1/auth/logout` | POST | Invalidate refresh token |
| `/api/v1/auth/me` | GET | Current user profile |
| `/api/v1/auth/.well-known/jwks.json` | GET | JWKS public keys |
| `/api/v1/auth/me/apps/{appCode}/access` | GET | Access snapshot (menus + permissions) |
| `/api/v1/auth/me/apps/{appCode}/token` | GET | Access token (JWT) |
