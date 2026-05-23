export type AppMenu = {
  id: number;
  app_id: number;
  module_id: number;
  parent_id: number | null;
  code: string;
  name: string;
  route_path: string;
  sort_order: number;
  required_permission_id: number | null;
  status: "active" | "inactive";
};

export type AppMenuListResponse = {
  success: boolean;
  message: string;
  data: {
    items: AppMenu[];
  };
};

export type AppMenuDetailResponse = {
  success: boolean;
  message: string;
  data: AppMenu;
};

export type AppMenuCreatePayload = {
  app_id: number;
  module_id: number;
  parent_id: number | null;
  code: string;
  name: string;
  route_path: string;
  sort_order: number;
  required_permission_id: number | null;
  status: "active" | "inactive";
};

export type AppMenuUpdatePayload = {
  module_id: number;
  parent_id: number | null;
  code: string;
  name: string;
  route_path: string;
  sort_order: number;
  required_permission_id: number | null;
  status: "active" | "inactive";
};

export type AppMenuBulkCreateResponse = {
  success: boolean;
  message: string;
  data: AppMenu[];
};

export type AppMenuUpdateResponse = {
  success: boolean;
  message: string;
  data: AppMenu;
};

export type AppMenuListParams = {
  limit?: number;
  offset?: number;
  search?: string;
};
