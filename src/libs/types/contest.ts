import { BalloonData, ProblemData } from './basic-type'

export interface ACMContestExtraData {
  banner: string
  penalty: number
  frozen: boolean
  frozen_time: number
}

export interface GPLTContestExtraData {
  standard_1: number
  standard_2: number
}

export interface ContestInstance {
  id: string
  type: string
  title: string
  PTASession: string
  Jsession: string
  start_time: number
  end_time: number
  reg_type: number
  reg_off_code: string
  reg_unoff_code: string
  reg_start_time: number
  reg_end_time: number
  extra: ACMContestExtraData | GPLTContestExtraData
  balloon_color: BalloonData[]
  problem_list: ProblemData[]
}
