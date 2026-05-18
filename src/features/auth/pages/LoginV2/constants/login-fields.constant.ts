export const loginV2Fields = [
  {
    autoComplete: "username",
    defaultValue: "dimas@idch.local",
    label: "Email or username",
    name: "identifier",
    placeholder: "name@company.local",
    type: "text",
  },
  {
    autoComplete: "current-password",
    defaultValue: "",
    label: "Password",
    name: "password",
    placeholder: "Enter password",
    type: "password",
  },
] as const;
