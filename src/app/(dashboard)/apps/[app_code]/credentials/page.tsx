import { AppCredentialsV1 } from "@/features/authorization-center/pages/AppCredentialsV1";

type AppCredentialsPageProps = {
  params: Promise<{ app_code: string }>;
};

export default async function AppCredentialsPage({
  params,
}: AppCredentialsPageProps) {
  const { app_code } = await params;

  return <AppCredentialsV1 appId={app_code} />;
}
