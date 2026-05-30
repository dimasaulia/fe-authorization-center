import { UserEditV1 } from "@/features/user-management/pages/UserEditV1";

type UserEditPageProps = {
  params: Promise<{ user_id: string }>;
};

export default async function UserEditPage({ params }: UserEditPageProps) {
  const { user_id: userId } = await params;

  return <UserEditV1 userId={userId} />;
}
