import { TeamDetailV1 } from "@/features/authorization-center/pages/TeamDetailV1";

type TeamDetailPageProps = {
  params: Promise<{ team_id: string }>;
};

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { team_id } = await params;

  return <TeamDetailV1 teamId={team_id} />;
}
