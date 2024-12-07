import dayjs, { Dayjs } from 'dayjs'
import { BalloonData, ProblemData } from '../types/basic-type'
import { ACMContestExtraData, ContestInstance, GPLTContestExtraData } from '../types/contest'

export class Contest {
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
  extra: ACMContestExtraData | GPLTContestExtraData | {}
  balloon_color: BalloonData[]
  problem_list: ProblemData[]
  statusStr: string = ''
  contestStatus: number = 0
  progressRatio: number = 0
  constructor() {
    this.id = ''
    this.type = ''
    this.title = ''
    this.PTASession = ''
    this.Jsession = ''
    this.start_time = 0
    this.end_time = 0
    this.reg_type = 0
    this.reg_off_code = ''
    this.reg_unoff_code = ''
    this.reg_start_time = 0
    this.reg_end_time = 0
    this.extra = {}
    this.balloon_color = []
    this.problem_list = []
  }

  private getTimeDiffStr(before: Dayjs, after: Dayjs): string {
    return dayjs.duration(after.diff(before)).format('DD:HH:mm:ss')
  }

  private getProgressRatio(sum: number, pass: number): number {
    return Math.floor((pass / sum) * 100)
  }

  getLogo(): string {
    if (this.type === 'ccpc') {
      return '/ccpc.png'
    }
    return '/gplt.png'
  }

  //开始时间
  getStartTimeStr(): string {
    return dayjs.unix(this.start_time).tz().format('YYYY-MM-DD HH:mm:ss')
  }

  //持续时长
  getDurationStr(): string {
    const strTime = dayjs.unix(this.start_time).tz()
    const endTime = dayjs.unix(this.end_time).tz()
    return this.getTimeDiffStr(strTime, endTime)
  }

  getRegStartTimeDiffStr(): string {
    const now = dayjs().tz()
    const strTime = dayjs.unix(this.reg_start_time).tz()
    return this.getTimeDiffStr(now, strTime)
  }

  getRegEndTimeDiffStr(): string {
    const now = dayjs().tz()
    const endTime = dayjs.unix(this.reg_end_time).tz()
    return this.getTimeDiffStr(now, endTime)
  }

  getStartTimeDiffStr(): string {
    const now = dayjs().tz()
    const strTime = dayjs.unix(this.start_time).tz()
    return this.getTimeDiffStr(now, strTime)
  }

  getEndTimeDiffStr(): string {
    const now = dayjs().tz()
    const endTime = dayjs.unix(this.end_time).tz()
    return this.getTimeDiffStr(now, endTime)
  }

  getContestStatus(): number {
    const now = dayjs().tz()
    if (now.isBefore(dayjs.unix(this.reg_start_time).tz())) {
      return ContestStatus.BEFORE_REG
    } else if (now.isAfter(dayjs.unix(this.reg_start_time).tz()) && now.isBefore(dayjs.unix(this.reg_end_time).tz())) {
      return ContestStatus.REGISTERING
    } else if (now.isBefore(dayjs.unix(this.start_time).tz())) {
      return ContestStatus.BEFORE_CONTEST
    } else if (now.isBefore(dayjs.unix(this.end_time).tz())) {
      return ContestStatus.RUNNING
    } else {
      return ContestStatus.FINISHED
    }
  }

  updateContestStatus(): void {
    const status = this.getContestStatus()
    const nowTime = dayjs().tz()
    const regStartTime = dayjs.unix(this.reg_start_time).tz()
    const regEndTime = dayjs.unix(this.reg_end_time).tz()
    const startTime = dayjs.unix(this.start_time).tz()
    const endTime = dayjs.unix(this.end_time).tz()
    this.contestStatus = status
    if (status === ContestStatus.BEFORE_REG) {
      this.statusStr = '距离报名开始 ' + this.getRegStartTimeDiffStr()
      this.progressRatio = 100
    } else if (status === ContestStatus.REGISTERING) {
      this.statusStr = '报名中 ' + this.getRegEndTimeDiffStr()
      this.progressRatio = this.getProgressRatio(regEndTime.diff(regStartTime), nowTime.diff(regStartTime))
    } else if (status === ContestStatus.BEFORE_CONTEST) {
      this.statusStr = 'BEFORE CONTEST ' + this.getStartTimeDiffStr()
      this.progressRatio = 100
    } else if (status === ContestStatus.RUNNING) {
      this.statusStr = 'RUNNING ' + this.getEndTimeDiffStr()
      this.progressRatio = this.getProgressRatio(endTime.diff(startTime), nowTime.diff(startTime))
    } else {
      this.statusStr = 'FINISHED'
      this.progressRatio = 100
    }
  }

  getRegisterUrl(): string {
    const type = this.reg_type
    if (type === 1) {
      return '/register/team?contest_id=' + this.id
    } else {
      return '/register/single?contest_id=' + this.id
    }
  }

  getBoardUrl(): string {
    const type = this.type
    if (type === 'ccpc') {
      return '/board/acm?contest_id=' + this.id
    } else {
      return '/board/gplt?contest_id=' + this.id
    }
  }
}

export function createContest(data: ContestInstance): Contest {
  const contest = new Contest()
  contest.id = data['id'] as string
  contest.type = data['type'] as string
  contest.title = data['title'] as string
  contest.PTASession = data['PTASession'] as string
  contest.Jsession = data['Jsession'] as string
  contest.start_time = data['start_time'] as number
  contest.end_time = data['end_time'] as number
  contest.reg_type = data['reg_type'] as number
  contest.reg_off_code = data['reg_off_code'] as string
  contest.reg_unoff_code = data['reg_unoff_code'] as string
  contest.reg_start_time = data['reg_start_time'] as number
  contest.reg_end_time = data['reg_end_time'] as number
  contest.extra = data['extra'] as ACMContestExtraData | GPLTContestExtraData
  contest.balloon_color = data['balloon_color'] as BalloonData[]
  contest.problem_list = data['problem_list'] as ProblemData[]
  return contest
}

export async function getContestList(): Promise<Contest[]> {
  const resp = await get<ContestInstance[]>('/api/contest/list')
  if (resp) {
    const res = resp.map((item) => createContest(item))
    res.sort((a, b) => a.start_time - b.start_time)
    return res
  }
  return resp
}

export async function getContestNormalConfig(id: string): Promise<Contest> {
  const resp = await get<ContestInstance>('/api/contest/config?contest_id=' + id)
  if (resp) {
    return createContest(resp)
  }
  return resp
}

export async function getContestAdminConfig(id: string): Promise<Contest> {
  const resp = await get<ContestInstance>('/api/admin/contest/config?contest_id=' + id)
  if (resp) {
    return createContest(resp)
  }
  return resp
}
