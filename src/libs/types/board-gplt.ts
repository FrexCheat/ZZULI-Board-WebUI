export interface TeamBoardData {
  team_id: number
  rank: number
  team_name: string
  coach: string
  school: string
  college: string
  class: string
  official: boolean
  part1: { score: number; ratio: number; status: boolean }
  part2: { score: number; ratio: number; status: boolean }
  part3: { score: number; ratio: number; status: boolean }
  sum: number
}

export interface StudentBoardData {
  member_id: string
  team_id: number
  rank: number
  name: string
  school: string
  college: string
  class: string
  official: boolean
  problems_score: Array<Record<string, number>>
  part1: { score: number; ratio: number }
  part2: { score: number; ratio: number }
  part3: { score: number; ratio: number }
  sum: number
}
