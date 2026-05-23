import { AppRoleEditV1 } from "@/features/authorization-center/pages/AppRoleEditV1";

type AppRoleEditPageProps = {
  params: Promise<{ app_code: string; role_id: string }>;
};

export default async function AppRoleEditPage({ params }: AppRoleEditPageProps) {
  const { app_code, role_id } = await params;

  return <AppRoleEditV1 appId={app_code} roleId={role_id} />;
}
