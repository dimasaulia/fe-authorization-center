export type App = {
  id: number;
  code: string;
  name: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

export type AppListResponse = {
  success: boolean;
  message: string;
  data: {
    items: App[];
  };
};

export type AppCreatePayload = {
  code: string;
  name: string;
  status: "active" | "inactive";
};

export type AppCreateResponse = {
  success: boolean;
  message: string;
  data: App;
};

export type AppListParams = {
  limit?: number;
  offset?: number;
  search?: string;
};
