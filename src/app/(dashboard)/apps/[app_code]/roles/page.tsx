import { AppRoleListV1 } from "@/features/authorization-center/pages/AppRoleListV1";

type AppRolesPageProps = {
  params: Promise<{ app_code: string }>;
};

export default async function AppRolesPage({ params }: AppRolesPageProps) {
  const { app_code } = await params;

  return <AppRoleListV1 appId={app_code} />;
}
