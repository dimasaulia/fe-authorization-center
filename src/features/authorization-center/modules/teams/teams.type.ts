export type Team = {
  id: number;
  organization_id: number;
  code: string;
  name: string;
  status: "active" | "inactive";
  created_at: string;
};

export type TeamListResponse = {
  success: boolean;
  message: string;
  data: {
    items: Team[];
  };
};

export type TeamCreatePayload = {
  code: string;
  name: string;
  organization_id: number;
  status: "active" | "inactive";
};

export type TeamCreateResponse = {
  success: boolean;
  message: string;
  data: Team;
};

export type TeamListParams = {
  search?: string;
};
