import { TableProps } from 'tdesign-vue-next'
import { RecordData, StudentData, TeamData } from '../types/basic-type'
import { StudentBoardData, TeamBoardData } from '../types/board-gplt'
import { Contest } from './contest'

export const tableColumns = ref<TableProps['columns']>([
  { title: '#', colKey: 'rank', align: 'center', width: 60 },
  { title: '姓名', colKey: 'name', align: 'center', width: 120 },
  { title: '1-1', colKey: '1-1', align: 'center', width: 70 },
  { title: '1-2', colKey: '1-2', align: 'center', width: 70 },
  { title: '1-3', colKey: '1-3', align: 'center', width: 70 },
  { title: '1-4', colKey: '1-4', align: 'center', width: 70 },
  { title: '1-5', colKey: '1-5', align: 'center', width: 70 },
  { title: '1-6', colKey: '1-6', align: 'center', width: 70 },
  { title: '1-7', colKey: '1-7', align: 'center', width: 70 },
  { title: '1-8', colKey: '1-8', align: 'center', width: 70 },
  { title: '2-1', colKey: '2-1', align: 'center', width: 70 },
  { title: '2-2', colKey: '2-2', align: 'center', width: 70 },
  { title: '2-3', colKey: '2-3', align: 'center', width: 70 },
  { title: '2-4', colKey: '2-4', align: 'center', width: 70 },
  { title: '3-1', colKey: '3-1', align: 'center', width: 70 },
  { title: '3-2', colKey: '3-2', align: 'center', width: 70 },
  { title: '3-3', colKey: '3-3', align: 'center', width: 70 },
  { title: '基础分', colKey: 'part1', align: 'center', width: 75 },
  { title: '进阶分', colKey: 'part2', align: 'center', width: 75 },
  { title: '登顶分', colKey: 'part3', align: 'center', width: 75 },
  { title: '总分', colKey: 'sum', align: 'center', width: 70 },
])

export function buildStudentTableData(student_data: StudentBoardData[]): TableProps['data'] {
  const res: TableProps['data'] = []
  student_data.forEach((student) => {
    let student_data = {
      member_id: student.member_id,
      rank: student.rank,
      name: student.name,
      part1: student.part1.score,
      part2: student.part2.score,
      part3: student.part3.score,
      sum: student.sum,
    }
    student.problems_score.forEach((problem_score) => {
      student_data = Object.assign(student_data, problem_score)
    })
    res.push(student_data)
  })
  return res
}

export function buildTeamBoard(contest_data: Contest, student_data: StudentData[], team_data: TeamData[], record_data: RecordData[]): TeamBoardData[] {
  const res: TeamBoardData[] = []
  const problems = contest_data.problem_list

  team_data.forEach((team) => {
    let team_board: TeamBoardData = {
      team_id: team.id,
      team_name: team.name,
      school: team.school,
      college: team.college,
      class: team.class,
      official: team.official,
      coach: team.coach,
      rank: 0,
      part1: { score: 0, ratio: 0, status: false },
      part2: { score: 0, ratio: 0, status: false },
      part3: { score: 0, ratio: 0, status: false },
      sum: 0,
    }

    let team_students = student_data.filter((student) => student.team_id === team.id)
    let team_records = record_data.filter((record) => team_students.some((student) => student.member_id === record.member_id))
    team_records.forEach((record) => {
      let problemIdx = problems.findIndex((problem) => problem.id === record.problem_id)
      if (problemIdx <= 7) team_board.part1.score += record.score
      else if (problemIdx <= 11) team_board.part2.score += record.score
      else team_board.part3.score += record.score
    })

    team_board.part1.ratio = (team_board.part1.score / 1000) * 100
    team_board.part2.ratio = (team_board.part2.score / 1000) * 100
    team_board.part3.ratio = (team_board.part3.score / 900) * 100
    team_board.sum = team_board.part1.score
    if ('standard1' in contest_data.extra && team_board.part1.score > (contest_data.extra.standard1 as number)) {
      team_board.part1.status = true
      team_board.sum = team_board.part1.score + team_board.part2.score
    } else if ('standard2' in contest_data.extra && team_board.part2.score > (contest_data.extra.standard2 as number)) {
      team_board.part1.status = true
      team_board.part2.status = true
      team_board.sum = team_board.part1.score + team_board.part2.score + team_board.part3.score
    }

    res.push(team_board)
  })

  let rank = 1
  res.sort((a, b) => b.sum - a.sum)
  res.forEach((team, idx) => {
    if (idx > 0 && team.sum === res[idx - 1].sum) {
      team.rank = res[idx - 1].rank
    } else {
      team.rank = rank
    }
    rank++
  })

  return res
}

export function buildStudentBoard(contest_data: Contest, student_data: StudentData[], record_data: RecordData[]): StudentBoardData[] {
  const res: StudentBoardData[] = []
  const problems = contest_data.problem_list

  student_data.forEach((student) => {
    let student_board: StudentBoardData = {
      member_id: student.member_id,
      team_id: student.team_id,
      name: student.name,
      school: student.school,
      college: student.college,
      class: student.class,
      official: student.official,
      rank: 0,
      part1: { score: 0, ratio: 0 },
      part2: { score: 0, ratio: 0 },
      part3: { score: 0, ratio: 0 },
      sum: 0,
      problems_score: [],
    }

    let student_records = record_data.filter((record) => record.member_id === student.member_id)
    student_records.forEach((record) => {
      let problemIdx = problems.findIndex((problem) => problem.id === record.problem_id)
      let problemLabel = problems[problemIdx].label
      if (problemIdx <= 7) student_board.part1.score += record.score
      else if (problemIdx <= 11) student_board.part2.score += record.score
      else student_board.part3.score += record.score
      student_board.problems_score.push({ [problemLabel]: record.score })
    })

    student_board.part1.ratio = (student_board.part1.score / 100) * 100
    student_board.part2.ratio = (student_board.part2.score / 100) * 100
    student_board.part3.ratio = (student_board.part3.score / 90) * 100
    student_board.sum = student_board.part1.score + student_board.part2.score + student_board.part3.score

    res.push(student_board)
  })

  let rank = 1
  res.sort((a, b) => b.sum - a.sum)
  res.forEach((student, idx) => {
    if (idx > 0 && student.sum === res[idx - 1].sum) {
      student.rank = res[idx - 1].rank
    } else {
      student.rank = rank
    }
    rank++
  })

  return res
}
