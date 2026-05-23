import { AppRolePermissionListV1 } from "@/features/authorization-center/pages/AppRolePermissionListV1";

type AppRolePermissionsPageProps = {
  params: Promise<{ app_code: string }>;
};

export default async function AppRolePermissionsPage({ params }: AppRolePermissionsPageProps) {
  const { app_code } = await params;

  return <AppRolePermissionListV1 appId={app_code} />;
}
