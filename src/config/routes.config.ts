export const routes = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  users: "/users",
  settings: "/settings",
  apps: "/apps",
  appCreate: "/apps/create",
  appDetail: (appId: string) => `/apps/${appId}`,
  appCredentials: (appId: string) => `/apps/${appId}/credentials`,
  appCredentialCreate: (appId: string) =>
    `/apps/${appId}/credentials/create`,
  appSettings: (appId: string) => `/apps/${appId}/settings`,
  teams: "/teams",
  teamCreate: "/teams/create",
  teamDetail: (teamId: string) => `/teams/${teamId}`,
  actions: "/actions",
  actionCreate: "/actions/create",
} as const;
