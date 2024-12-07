import { TeamRegisterData } from '../types/register'

export async function registerTeam(cid: string, data: TeamRegisterData) {
  const resp = await post<TeamRegisterData>('/api/register/team?contest_id=' + cid, data)
  return resp
}
