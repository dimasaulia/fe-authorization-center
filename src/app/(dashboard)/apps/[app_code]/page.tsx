import { AppDetailV1 } from "@/features/authorization-center/pages/AppDetailV1";

type AppDetailPageProps = {
  params: Promise<{ app_code: string }>;
};

export default async function AppDetailPage({ params }: AppDetailPageProps) {
  const { app_code } = await params;

  return <AppDetailV1 appId={app_code} />;
}
