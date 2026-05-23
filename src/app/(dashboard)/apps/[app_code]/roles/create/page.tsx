import { AppRoleCreateV1 } from "@/features/authorization-center/pages/AppRoleCreateV1";

type AppRoleCreatePageProps = {
  params: Promise<{ app_code: string }>;
};

export default async function AppRoleCreatePage({ params }: AppRoleCreatePageProps) {
  const { app_code } = await params;

  return <AppRoleCreateV1 appId={app_code} />;
}
