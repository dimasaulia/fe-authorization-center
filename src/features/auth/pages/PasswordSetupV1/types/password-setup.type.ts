export type PasswordSetupPayload = {
  code: string;
  password: string;
};

export type PasswordSetupResponse = {
  success: boolean;
  message: string;
  data: null;
};
