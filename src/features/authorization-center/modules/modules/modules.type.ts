export type AppModule = {
  id: number;
  app_id: number;
  code: string;
  name: string;
  status: "active" | "inactive";
};

export type AppModuleListResponse = {
  success: boolean;
  message: string;
  data: {
    items: AppModule[];
  };
};

export type AppModuleCreatePayload = {
  app_id: number;
  code: string;
  name: string;
  status: "active" | "inactive";
};

export type AppModuleUpdatePayload = {
  code: string;
  name: string;
  status: "active" | "inactive";
};

export type AppModuleCreateResponse = {
  success: boolean;
  message: string;
  data: AppModule;
};

export type AppModuleListParams = {
  limit?: number;
  offset?: number;
  search?: string;
};
