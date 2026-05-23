import { RoleEditV1 } from "@/features/authorization-center/pages/RoleEditV1";

type RoleEditPageProps = {
  params: Promise<{ role_id: string }>;
};

export default async function RoleEditPage({ params }: RoleEditPageProps) {
  const { role_id } = await params;

  return <RoleEditV1 roleId={role_id} />;
}
