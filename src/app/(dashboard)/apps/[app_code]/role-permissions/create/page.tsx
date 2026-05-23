import { AppRolePermissionCreateV1 } from "@/features/authorization-center/pages/AppRolePermissionCreateV1";

type AppRolePermissionCreatePageProps = {
  params: Promise<{ app_code: string }>;
};

export default async function AppRolePermissionCreatePage({ params }: AppRolePermissionCreatePageProps) {
  const { app_code } = await params;

  return <AppRolePermissionCreateV1 appId={app_code} />;
}
