import {
  createUser,
  fetchUsers,
  signupUser,
  verifyEmail,
} from "./users.repository";
import type {
  UserCreatePayload,
  UserListParams,
  UserSignupPayload,
} from "./users.type";

export async function getUsers(
  params: UserListParams = {},
  language?: string,
) {
  const response = await fetchUsers(params, language);

  return response.data.items;
}

export async function createNewUser(
  payload: UserCreatePayload,
  language?: string,
) {
  const response = await createUser(payload, language);

  return response.data;
}

export async function signupNewUser(
  payload: UserSignupPayload,
  language?: string,
) {
  const response = await signupUser(payload, language);

  return response.data;
}

export async function verifyUserEmail(
  code: string,
  language?: string,
) {
  return verifyEmail(code, language);
}
