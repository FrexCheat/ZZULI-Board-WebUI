export interface StudentData {
  team_id: number
  room_id: number
  member_id: string
  name: string
  school: string
  college: string
  class: string
  official: boolean
}

export interface TeamData {
  id: number
  name: string
  coach: string
  school: string
  college: string
  class: string
  official: boolean
}

export interface RecordData {
  record_id: string
  member_id: string
  problem_id: string
  status: string
  score: number
  language: string
  submit_time: number
  balloon: boolean
}
