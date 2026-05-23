import { AppMenuEditV1 } from "@/features/authorization-center/pages/AppMenuEditV1";

type AppMenuEditPageProps = {
  params: Promise<{ app_code: string; menu_id: string }>;
};

export default async function AppMenuEditPage({ params }: AppMenuEditPageProps) {
  const { app_code, menu_id } = await params;

  return <AppMenuEditV1 appId={app_code} menuId={menu_id} />;
}
