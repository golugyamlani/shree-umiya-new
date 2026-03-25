import { getTeamMembers } from "@/app/actions/team";
import TeamClient from "./TeamClient";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const members = await getTeamMembers();
  return <TeamClient initialMembers={members} />;
}
