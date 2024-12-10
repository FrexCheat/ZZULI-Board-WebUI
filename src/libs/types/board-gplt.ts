export interface ProblemList {
  '1-1': number
  '1-2': number
  '1-3': number
  '1-4': number
  '1-5': number
  '1-6': number
  '1-7': number
  '1-8': number
  '2-1': number
  '2-2': number
  '2-3': number
  '2-4': number
  '3-1': number
  '3-2': number
  '3-3': number
}

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
  problems_score: ProblemList
  part1: { score: number; ratio: number }
  part2: { score: number; ratio: number }
  part3: { score: number; ratio: number }
  sum: number
}
