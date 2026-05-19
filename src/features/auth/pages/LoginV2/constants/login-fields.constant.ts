import type { TranslationKey } from "@/modules/preferences";

type LoginField = {
  autoComplete: string;
  defaultValue: string;
  labelKey: TranslationKey;
  name: string;
  placeholderKey: TranslationKey;
  type: string;
};

export const loginV2Fields = [
  {
    autoComplete: "username",
    defaultValue: "dimas@idch.local",
    labelKey: "login.identifierLabel",
    name: "identifier",
    placeholderKey: "login.identifierPlaceholder",
    type: "text",
  },
  {
    autoComplete: "current-password",
    defaultValue: "",
    labelKey: "login.passwordLabel",
    name: "password",
    placeholderKey: "login.passwordPlaceholder",
    type: "password",
  },
] as const satisfies ReadonlyArray<LoginField>;
