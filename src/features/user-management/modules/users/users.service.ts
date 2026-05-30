import {
  createUser,
  deleteUser,
  fetchUserDetail,
  fetchUsers,
  resendUserInvitation,
  setupUserPassword,
  signupUser,
  updateUser,
  verifyEmail,
} from "./users.repository";
import { getSetupPasswordUrl } from "./setup-password-url";
import type {
  PasswordSetupPayload,
  UserCreatePayload,
  UserListParams,
  UserSignupPayload,
  UserUpdatePayload,
} from "./users.type";

export async function getUsers(
  params: UserListParams = {},
  language?: string,
) {
  const response = await fetchUsers(params, language);

  return response.data.items;
}

export async function getUserDetail(
  id: number,
  language?: string,
) {
  const response = await fetchUserDetail(id, language);

  return response.data;
}

export async function createNewUser(
  payload: UserCreatePayload,
  language?: string,
) {
  const nextPayload: UserCreatePayload = {
    ...payload,
    setup_password_url: payload.send_invitation ? getSetupPasswordUrl() : "",
  };
  const response = await createUser(nextPayload, language);

  return response.data;
}

export async function updateExistingUser(
  id: number,
  payload: UserUpdatePayload,
  language?: string,
) {
  const response = await updateUser(id, payload, language);

  return response.data;
}

export async function deleteExistingUser(
  id: number,
  language?: string,
) {
  return deleteUser(id, language);
}

export async function resendInvitation(
  id: number,
  language?: string,
) {
  return resendUserInvitation(
    id,
    getSetupPasswordUrl(),
    language,
  );
}

export async function setupPassword(
  payload: PasswordSetupPayload,
  language?: string,
) {
  return setupUserPassword(payload, language);
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
