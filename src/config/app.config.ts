export const appConfig = {
  name: "OpenSuite",
  description: "Enterprise frontend boilerplate for OpenSuite ecosystem apps.",
  /** The app code registered in the authorization center */
  appCode: process.env.NEXT_PUBLIC_APP_CODE ?? "authorization-center",
  activeAuthPage: "LoginV2",
  activeDashboardPage: "DashboardHomeV2",
} as const;
