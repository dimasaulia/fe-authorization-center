import { AppMenuCreateV1 } from "@/features/authorization-center/pages/AppMenuCreateV1";

type AppMenuCreatePageProps = {
  params: Promise<{ app_code: string }>;
};

export default async function AppMenuCreatePage({ params }: AppMenuCreatePageProps) {
  const { app_code } = await params;

  return <AppMenuCreateV1 appId={app_code} />;
}
