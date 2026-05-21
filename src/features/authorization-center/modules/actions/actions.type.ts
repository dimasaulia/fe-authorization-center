export type Action = {
  id: number;
  code: string;
  name: string;
};

export type ActionListResponse = {
  success: boolean;
  message: string;
  data: {
    items: Action[];
  };
};

export type ActionCreatePayload = {
  code: string;
  name: string;
};

export type ActionCreateResponse = {
  success: boolean;
  message: string;
  data: Action;
};

export type ActionListParams = {
  search?: string;
};
