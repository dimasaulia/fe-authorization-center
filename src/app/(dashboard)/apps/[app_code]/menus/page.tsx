import { AppMenuListV1 } from "@/features/authorization-center/pages/AppMenuListV1";

type AppMenusPageProps = {
  params: Promise<{ app_code: string }>;
};

export default async function AppMenusPage({ params }: AppMenusPageProps) {
  const { app_code } = await params;

  return <AppMenuListV1 appId={app_code} />;
}
