import { AppSettingsV1 } from "@/features/authorization-center/pages/AppSettingsV1";

type AppSettingsPageProps = {
  params: Promise<{ app_code: string }>;
};

export default async function AppSettingsPage({ params }: AppSettingsPageProps) {
  const { app_code } = await params;

  return <AppSettingsV1 appId={app_code} />;
}
