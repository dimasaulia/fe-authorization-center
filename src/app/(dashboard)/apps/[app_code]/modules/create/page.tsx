import { AppModuleCreateV1 } from "@/features/authorization-center/pages/AppModuleCreateV1";

type AppModuleCreatePageProps = {
  params: Promise<{ app_code: string }>;
};

export default async function AppModuleCreatePage({
  params,
}: AppModuleCreatePageProps) {
  const { app_code } = await params;

  return <AppModuleCreateV1 appId={app_code} />;
}
