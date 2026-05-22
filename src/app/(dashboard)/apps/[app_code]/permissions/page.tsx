import { AppPermissionListV1 } from "@/features/authorization-center/pages/AppPermissionListV1";

type AppPermissionsPageProps = {
  params: Promise<{ app_code: string }>;
};

export default async function AppPermissionsPage({
  params,
}: AppPermissionsPageProps) {
  const { app_code } = await params;

  return <AppPermissionListV1 appId={app_code} />;
}
