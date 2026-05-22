import { AppModuleEditV1 } from "@/features/authorization-center/pages/AppModuleEditV1";

type AppModuleEditPageProps = {
  params: Promise<{ app_code: string; module_id: string }>;
};

export default async function AppModuleEditPage({
  params,
}: AppModuleEditPageProps) {
  const { app_code, module_id } = await params;

  return <AppModuleEditV1 appId={app_code} moduleId={module_id} />;
}
