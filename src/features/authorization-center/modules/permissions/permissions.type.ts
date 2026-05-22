export type Permission = {
  id: number;
  app_id: number;
  module_id: number;
  action_id: number;
  code: string;
  name: string;
  description: string;
  risk_level: "low" | "medium" | "high" | "critical";
  is_system: boolean;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

export type PermissionListResponse = {
  success: boolean;
  message: string;
  data: {
    items: Permission[];
  };
};

export type PermissionListParams = {
  limit?: number;
  offset?: number;
  search?: string;
};

export type PermissionCreatePayload = {
  app_id: number;
  module_id: number;
  action_id: number;
  code: string;
  name: string;
  description: string;
  risk_level: "low" | "medium" | "high" | "critical";
  is_system: boolean;
  status: "active" | "inactive";
};

export type PermissionBulkCreateResponse = {
  success: boolean;
  message: string;
  data: Permission[];
};

export type PermissionUpdatePayload = {
  module_id: number;
  action_id: number;
  code: string;
  name: string;
  description: string;
  risk_level: "low" | "medium" | "high" | "critical";
  is_system: boolean;
  status: "active" | "inactive";
};

export type PermissionDetailResponse = {
  success: boolean;
  message: string;
  data: Permission;
};

export type PermissionUpdateResponse = {
  success: boolean;
  message: string;
  data: Permission;
};
