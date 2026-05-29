export type UserStatus = "active" | "invited" | "inactive";
export type UserType = "internal" | "external";

export type User = {
  id: number;
  organization_id: number;
  username: string;
  email: string;
  display_name: string;
  type: UserType;
  status: UserStatus;
  email_verified_at?: string;
  must_change_password?: boolean;
  created_at: string;
  updated_at: string;
};

export type UserProvisioning = {
  keycloak: boolean;
  freeipa: boolean;
};

export type UserCreateResponse = {
  success: boolean;
  message: string;
  data: User & {
    must_change_password?: boolean;
    provisioning: UserProvisioning;
    role_ids?: number[];
    team_ids?: number[];
  };
};

export type UserListResponse = {
  success: boolean;
  message: string;
  data: {
    items: User[];
  };
};

export type UserListParams = {
  limit?: number;
  offset?: number;
  search?: string;
};

export type UserCreatePayload = {
  organization_id: number;
  username: string;
  email: string;
  display_name: string;
  type: UserType;
  status: UserStatus;
  password?: string;
  must_change_password?: boolean;
  send_invitation?: boolean;
  role_ids?: number[];
  team_ids?: number[];
};

export type UserSignupPayload = {
  organization_id: number;
  username: string;
  email: string;
  display_name: string;
  password: string;
};

export type UserSignupResponse = {
  success: boolean;
  message: string;
  data: User & {
    provisioning: UserProvisioning;
  };
};

export type VerifyEmailResponse = {
  success: boolean;
  message: string;
  data: null;
};
