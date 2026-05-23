export type RolePermission = {
  id: number;
  role_id: number;
  permission_id: number;
  effect: "allow" | "deny";
  created_at: string;
  permission_code: string;
  permission_name: string;
  module_id: number;
  module_code: string;
  module_name: string;
  app_id: number;
  app_code: string;
  app_name: string;
};

export type RolePermissionListResponse = {
  success: boolean;
  message: string;
  data: {
    items: RolePermission[];
  };
};

export type RoleSummary = {
  role_id: number;
  role_code: string;
  role_name: string;
  role_description: string;
  role_scope: string;
  app_id: number;
  app_code: string;
  app_name: string;
  permission_count: number;
};

export type RoleSummaryListResponse = {
  success: boolean;
  message: string;
  data: {
    items: RoleSummary[];
  };
};

export type AvailablePermission = {
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

export type AvailablePermissionModule = {
  modul_id: number;
  modul_name: string;
  modul_code: string;
  permissions: AvailablePermission[];
};

export type AvailablePermissionsResponse = {
  success: boolean;
  message: string;
  data: {
    items: AvailablePermissionModule[];
  };
};

export type RolePermissionBulkCreatePayload = {
  role_id: number;
  permission_id: number[];
}[];

export type RolePermissionBulkCreateResponse = {
  success: boolean;
  message: string;
  data: RolePermission[];
};

export type RolePermissionDetailResponse = {
  success: boolean;
  message: string;
  data: RolePermission;
};

export type RolePermissionUpdateByRolePayload = {
  permission_id: number[];
  effect: "allow" | "deny";
};

export type RolePermissionUpdateByRoleResponse = {
  success: boolean;
  message: string;
  data: RolePermission[];
};
