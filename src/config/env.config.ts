function firstDefined(...values: Array<string | undefined>) {
  for (const value of values) {
    if (value) {
      return value;
    }
  }

  return undefined;
}

export const envConfig = {
  apiGatewayUrl:
    firstDefined(
      process.env.NEXT_PUBLIC_API_GATEWAY_URL,
      process.env.NEXT_PUBLIC_API_URL,
    ) ??
    "",
  authUrl: firstDefined(process.env.NEXT_PUBLIC_AUTH_URL) ?? "",
  authorizationUrl:
    firstDefined(process.env.NEXT_PUBLIC_AUTHORIZATION_URL) ?? "",
  authorizationCenterUrl:
    firstDefined(process.env.NEXT_PUBLIC_AUTHORIZATION_CENTER_URL) ??
    "http://localhost:8080",
  fileUrl: firstDefined(process.env.NEXT_PUBLIC_FILE_URL) ?? "",
  notificationUrl: firstDefined(process.env.NEXT_PUBLIC_NOTIFICATION_URL) ?? "",
  setupPasswordUrl: firstDefined(process.env.NEXT_PUBLIC_SETUP_PASSWORD_URL) ?? "",
} as const;
