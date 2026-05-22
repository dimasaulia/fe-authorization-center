import { AppModuleListV1 } from "@/features/authorization-center/pages/AppModuleListV1";

type AppModulesPageProps = {
  params: Promise<{ app_code: string }>;
};

export default async function AppModulesPage({ params }: AppModulesPageProps) {
  const { app_code } = await params;

  return <AppModuleListV1 appId={app_code} />;
}
