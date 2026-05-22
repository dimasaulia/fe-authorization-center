import { AppCredentialCreateV1 } from "@/features/authorization-center/pages/AppCredentialCreateV1";

type AppCredentialCreatePageProps = {
  params: Promise<{ app_code: string }>;
};

export default async function AppCredentialCreatePage({
  params,
}: AppCredentialCreatePageProps) {
  const { app_code } = await params;

  return <AppCredentialCreateV1 appId={app_code} />;
}
