import { AppPermissionEditV1 } from "@/features/authorization-center/pages/AppPermissionEditV1";

type AppPermissionEditPageProps = {
  params: Promise<{ app_code: string; permission_id: string }>;
};

export default async function AppPermissionEditPage({
  params,
}: AppPermissionEditPageProps) {
  const { app_code, permission_id } = await params;

  return <AppPermissionEditV1 appId={app_code} permissionId={permission_id} />;
}
