import { AppPermissionCreateV1 } from "@/features/authorization-center/pages/AppPermissionCreateV1";

type AppPermissionCreatePageProps = {
  params: Promise<{ app_code: string }>;
};

export default async function AppPermissionCreatePage({
  params,
}: AppPermissionCreatePageProps) {
  const { app_code } = await params;

  return <AppPermissionCreateV1 appId={app_code} />;
}
