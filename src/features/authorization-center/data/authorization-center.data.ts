export type AppStatus = "active" | "inactive" | "revoked" | "suspended";

export type AuthorizationApp = {
  id: string;
  name: string;
  code: string;
  type: "internal" | "client_facing" | "public" | "system";
  status: AppStatus;
  environmentCount: number;
  ownerTeam: string;
  credentialCount: number;
  createdAt: string;
  updatedAt: string;
  description: string;
};

export type AppCredential = {
  id: string;
  appId: string;
  name: string;
  clientId: string;
  environment: "development" | "staging" | "production";
  scopes: string[];
  status: AppStatus;
  lastUsedAt: string;
  createdAt: string;
};

export type Team = {
  id: string;
  name: string;
  code: string;
  organization: string;
  status: AppStatus;
  memberCount: number;
  createdAt: string;
};

export type AuthorizationAction = {
  id: string;
  name: string;
  code: string;
  type: "read" | "write" | "approval" | "export" | "admin" | "system";
  riskLevel: "low" | "medium" | "high" | "critical";
  status: AppStatus;
  isSystem: boolean;
  createdAt: string;
};

export const authorizationApps: AuthorizationApp[] = [
  {
    id: "finance",
    name: "Finance",
    code: "finance",
    type: "internal",
    status: "active",
    environmentCount: 3,
    ownerTeam: "Finance Team",
    credentialCount: 2,
    createdAt: "2026-04-11",
    updatedAt: "2026-05-12",
    description: "Permission boundary for finance workflows and approvals.",
  },
  {
    id: "asset-management",
    name: "Asset Management",
    code: "asset-management",
    type: "client_facing",
    status: "active",
    environmentCount: 2,
    ownerTeam: "Platform Team",
    credentialCount: 1,
    createdAt: "2026-04-18",
    updatedAt: "2026-05-10",
    description: "Authorization surface for assets, inventory, and exports.",
  },
  {
    id: "notification-service",
    name: "Notification Service",
    code: "notification-service",
    type: "system",
    status: "inactive",
    environmentCount: 1,
    ownerTeam: "Core Services",
    credentialCount: 0,
    createdAt: "2026-03-29",
    updatedAt: "2026-05-02",
    description: "System app for notification permission checks.",
  },
];

export const appCredentials: AppCredential[] = [
  {
    id: "cred-finance-prod",
    appId: "finance",
    name: "finance-api-production",
    clientId: "finance-api-production",
    environment: "production",
    scopes: ["authz:permissions:read", "authz:authorize", "authz:menu:read"],
    status: "active",
    lastUsedAt: "2026-05-18 09:14",
    createdAt: "2026-04-12",
  },
  {
    id: "cred-finance-staging",
    appId: "finance",
    name: "finance-api-staging",
    clientId: "finance-api-staging",
    environment: "staging",
    scopes: ["authz:authorize", "authz:manifest:sync"],
    status: "active",
    lastUsedAt: "2026-05-17 16:42",
    createdAt: "2026-04-13",
  },
  {
    id: "cred-assets-dev",
    appId: "asset-management",
    name: "asset-api-development",
    clientId: "asset-management-api-development",
    environment: "development",
    scopes: ["authz:permissions:read", "authz:audit:write"],
    status: "suspended",
    lastUsedAt: "2026-05-09 11:08",
    createdAt: "2026-04-20",
  },
];

export const teams: Team[] = [
  {
    id: "finance-team",
    name: "Finance Team",
    code: "finance-team",
    organization: "Internal Organization",
    status: "active",
    memberCount: 18,
    createdAt: "2026-03-21",
  },
  {
    id: "platform-team",
    name: "Platform Team",
    code: "platform-team",
    organization: "Internal Organization",
    status: "active",
    memberCount: 12,
    createdAt: "2026-02-14",
  },
  {
    id: "audit-team",
    name: "Audit Team",
    code: "audit-team",
    organization: "Internal Organization",
    status: "inactive",
    memberCount: 5,
    createdAt: "2026-01-08",
  },
];

export const authorizationActions: AuthorizationAction[] = [
  "view",
  "create",
  "update",
  "delete",
  "approve",
  "reject",
  "export",
  "import",
  "manage",
  "archive",
  "restore",
].map((code, index) => ({
  id: code,
  name: code.charAt(0).toUpperCase() + code.slice(1),
  code,
  type:
    code === "view"
      ? "read"
      : code === "approve" || code === "reject"
        ? "approval"
        : code === "export"
          ? "export"
          : code === "manage"
            ? "admin"
            : "write",
  riskLevel:
    code === "delete" || code === "manage"
      ? "critical"
      : code === "approve" || code === "reject"
        ? "high"
        : code === "export" || code === "import"
          ? "medium"
          : "low",
  status: "active",
  isSystem: index < 11,
  createdAt: "2026-04-01",
}));

export const appTypes = ["internal", "client_facing", "public", "system"];
export const statuses = ["active", "inactive"];
export const environments = ["development", "staging", "production"];
export const credentialScopes = [
  "authz:permissions:read",
  "authz:authorize",
  "authz:menu:read",
  "authz:audit:write",
  "authz:manifest:sync",
];

export function getAuthorizationApp(appId: string) {
  return authorizationApps.find((app) => app.id === appId) ?? authorizationApps[0];
}

export function getAppCredentials(appId: string) {
  return appCredentials.filter((credential) => credential.appId === appId);
}
