export type Role = {
  id: number;
  organization_id: number | null;
  app_id: number | null;
  code: string;
  name: string;
  description: string;
  scope: "global" | "app";
  is_system: boolean;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

export type RoleListResponse = {
  success: boolean;
  message: string;
  data: {
    items: Role[];
  };
};

export type RoleDetailResponse = {
  success: boolean;
  message: string;
  data: Role;
};

export type RoleCreatePayload = {
  organization_id: number | null;
  app_id: number | null;
  code: string;
  name: string;
  description: string;
  scope: "global" | "app";
  is_system: boolean;
  status: "active" | "inactive";
};

export type RoleUpdatePayload = {
  code: string;
  name: string;
  description: string;
  is_system: boolean;
  status: "active" | "inactive";
};

export type RoleCreateResponse = {
  success: boolean;
  message: string;
  data: Role;
};

export type RoleListParams = {
  limit?: number;
  offset?: number;
  search?: string;
};
