import { AppRolePermissionEditV1 } from "@/features/authorization-center/pages/AppRolePermissionEditV1";

type AppRolePermissionEditPageProps = {
  params: Promise<{ app_code: string; role_code: string }>;
};

export default async function AppRolePermissionEditPage({ params }: AppRolePermissionEditPageProps) {
  const { app_code, role_code } = await params;

  return <AppRolePermissionEditV1 appId={app_code} roleId={role_code} />;
}
