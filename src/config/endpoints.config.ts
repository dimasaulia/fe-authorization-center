export const endpoints = {
  auth: {
    session: "/auth/session",
    login: "/auth/login",
    logout: "/auth/logout",
  },
  authorization: {
    snapshot: "/authorization/access-snapshot",
    menus: "/authorization/menus",
  },
  user: {
    list: "/users",
    detail: (id: string) => `/users/${id}`,
  },
  apps: {
    list: { method: "GET", url: "/api/v1/apps" },
    detail: (id: number) => ({ method: "GET", url: `/api/v1/apps/${id}` }),
    create: { method: "POST", url: "/api/v1/apps" },
    update: (id: number) => ({ method: "PUT", url: `/api/v1/apps/${id}` }),
    delete: (id: number) => ({ method: "DELETE", url: `/api/v1/apps/${id}` }),
  },
  actions: {
    list: { method: "GET", url: "/api/v1/actions" },
    detail: (id: number) => ({ method: "GET", url: `/api/v1/actions/${id}` }),
    create: { method: "POST", url: "/api/v1/actions" },
    update: (id: number) => ({ method: "PUT", url: `/api/v1/actions/${id}` }),
    delete: (id: number) => ({ method: "DELETE", url: `/api/v1/actions/${id}` }),
  },
  teams: {
    list: { method: "GET", url: "/api/v1/teams" },
    detail: (id: number) => ({ method: "GET", url: `/api/v1/teams/${id}` }),
    create: { method: "POST", url: "/api/v1/teams" },
    update: (id: number) => ({ method: "PUT", url: `/api/v1/teams/${id}` }),
    delete: (id: number) => ({ method: "DELETE", url: `/api/v1/teams/${id}` }),
  },
} as const;
