import { TableProps } from 'tdesign-vue-next'
import { RecordData, StudentData, TeamData } from '../types/basic-type'
import { StudentBoardData, TeamBoardData } from '../types/board-gplt'
import { Contest } from './contest'
import ExcelJS from 'exceljs'

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
      part1: { score: 0, ratio: 0, status: false },
      part2: { score: 0, ratio: 0, status: false },
      part3: { score: 0, ratio: 0, status: false },
      rank: 0,
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
    if ('standard1' in contest_data.extra && team_board.part1.score >= (contest_data.extra.standard1 as number)) {
      team_board.part1.status = true
      team_board.sum = team_board.part1.score + team_board.part2.score
      if ('standard2' in contest_data.extra && team_board.part2.score >= (contest_data.extra.standard2 as number)) {
        team_board.part2.status = true
        team_board.sum = team_board.part1.score + team_board.part2.score + team_board.part3.score
      }
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
      part1: { score: 0, ratio: 0 },
      part2: { score: 0, ratio: 0 },
      part3: { score: 0, ratio: 0 },
      rank: 0,
      sum: 0,
      problems_score: {
        '1-1': 0,
        '1-2': 0,
        '1-3': 0,
        '1-4': 0,
        '1-5': 0,
        '1-6': 0,
        '1-7': 0,
        '1-8': 0,
        '2-1': 0,
        '2-2': 0,
        '2-3': 0,
        '2-4': 0,
        '3-1': 0,
        '3-2': 0,
        '3-3': 0,
      },
    }

    let student_records = record_data.filter((record) => record.member_id === student.member_id)
    student_records.forEach((record) => {
      let problemIdx = problems.findIndex((problem) => problem.id === record.problem_id)
      let problemLabel = problems[problemIdx].label as keyof typeof student_board.problems_score
      if (problemIdx <= 7) student_board.part1.score += record.score
      else if (problemIdx <= 11) student_board.part2.score += record.score
      else student_board.part3.score += record.score
      student_board.problems_score[problemLabel] = record.score
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

export const tableColumns = ref<TableProps['columns']>([
  { title: '#', colKey: 'rank', align: 'center', width: 60, fixed: 'left' },
  { title: '姓名', colKey: 'name', align: 'center', width: 120, fixed: 'left' },
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
    let student_table = {
      member_id: student.member_id,
      rank: student.rank,
      name: student.name,
      part1: student.part1.score,
      part2: student.part2.score,
      part3: student.part3.score,
      sum: student.sum,
    }
    student_table = Object.assign(student_table, student.problems_score) // merge problems_score
    res.push(student_table) // push to res
  })
  return res
}

export const exportSingle = async (data: StudentBoardData[], name: string) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('个人排名')
  /*-------------------------------------------添加表格标题行-------------------------------------------*/
  const titleRow = sheet.addRow([`${name} - 个人排名`]) // 添加标题行
  titleRow.height = 34 // 设置标题行高
  sheet.mergeCells('A1:X1') // 合并单元格
  const titleCell = titleRow.getCell(1)
  titleCell.font = { size: 16, name: 'Microsoft YaHei', bold: true } // 设置标题字体
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' } // 设置标题居中对齐
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '808080' } } // 设置标题背景颜色
  titleCell.border = {
    top: { style: 'thin', color: { argb: '000000' } },
    left: { style: 'thin', color: { argb: '000000' } },
    bottom: { style: 'thin', color: { argb: '000000' } },
    right: { style: 'thin', color: { argb: '000000' } },
  }
  /*-------------------------------------------添加表格表头行-------------------------------------------*/
  const headerRow = sheet.addRow(['排名', '姓名', '学号', '学院', '班级', '1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8', '2-1', '2-2', '2-3', '2-4', '3-1', '3-2', '3-3', '基础分', '进阶分', '登顶分', '总分'])
  for (let col = 1; col <= 24; col++) {
    const cell = sheet.getCell(2, col)
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A6A6A6' } }
  }
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' }
  headerRow.font = { bold: true, name: 'Microsoft YaHei' }
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    }
  })
  /*-------------------------------------------添加表格数据行-------------------------------------------*/
  data.forEach((item) => {
    const row = sheet.addRow([
      item.rank,
      item.name,
      item.member_id,
      item.college,
      item.class,
      item.problems_score['1-1'],
      item.problems_score['1-2'],
      item.problems_score['1-3'],
      item.problems_score['1-4'],
      item.problems_score['1-5'],
      item.problems_score['1-6'],
      item.problems_score['1-7'],
      item.problems_score['1-8'],
      item.problems_score['2-1'],
      item.problems_score['2-2'],
      item.problems_score['2-3'],
      item.problems_score['2-4'],
      item.problems_score['3-1'],
      item.problems_score['3-2'],
      item.problems_score['3-3'],
      item.part1.score,
      item.part2.score,
      item.part3.score,
      item.sum,
    ])
    row.eachCell((cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
      }
    })
  })
  /*-------------------------------------------设置表格单元格-------------------------------------------*/
  sheet.getColumn(1).width = 6
  sheet.getColumn(2).width = 9
  sheet.getColumn(3).width = 15
  sheet.getColumn(4).width = 23
  sheet.getColumn(5).width = 40
  sheet.getColumn(21).width = 7
  sheet.getColumn(22).width = 7
  sheet.getColumn(23).width = 7
  sheet.getColumn(24).width = 7
  for (let col = 6; col <= 20; col++) {
    sheet.getColumn(col).width = 6
  }

  const blob = await workbook.xlsx.writeBuffer()
  const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))

  const link = document.createElement('a')
  link.href = blobUrl
  link.download = `${name}-个人榜.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(blobUrl)
}

export const exportTeam = async (data: TeamBoardData[], s_data: StudentBoardData[], name: string) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Team Rank')
  /*-------------------------------------------添加表格标题行-------------------------------------------*/
  const titleRow = sheet.addRow([`${name} - 团队排名`]) // 添加标题行
  titleRow.height = 34 // 设置标题行高
  sheet.mergeCells('A1:R1') // 合并单元格
  const titleCell = titleRow.getCell(1)
  titleCell.font = { size: 16, name: 'Microsoft YaHei', bold: true } // 设置标题字体
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' } // 设置标题居中对齐
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '808080' } } // 设置标题背景颜色
  titleCell.border = {
    top: { style: 'thin', color: { argb: '000000' } },
    left: { style: 'thin', color: { argb: '000000' } },
    bottom: { style: 'thin', color: { argb: '000000' } },
    right: { style: 'thin', color: { argb: '000000' } },
  }
  /*-------------------------------------------添加表格表头行-------------------------------------------*/
  const headerRow = sheet.addRow(['排名', '队伍名称', '学院', '班级', '队员1', '队员2', '队员3', '队员4', '队员5', '队员6', '队员7', '队员8', '队员9', '队员10', '基础分', '进阶分', '登顶分', '总分'])
  for (let col = 1; col <= 18; col++) {
    const cell = sheet.getCell(2, col)
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A6A6A6' } }
  }
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' }
  headerRow.font = { bold: true, name: 'Microsoft YaHei' }
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    }
  })
  /*-------------------------------------------添加表格数据行-------------------------------------------*/
  data.forEach((item) => {
    const students = s_data.filter((student) => student.team_id === item.team_id)
    const row = sheet.addRow([
      item.rank,
      item.team_name,
      item.college,
      item.class,
      students[0]?.name || '',
      students[1]?.name || '',
      students[2]?.name || '',
      students[3]?.name || '',
      students[4]?.name || '',
      students[5]?.name || '',
      students[6]?.name || '',
      students[7]?.name || '',
      students[8]?.name || '',
      students[9]?.name || '',
      item.part1.score,
      item.part2.score,
      item.part3.score,
      item.sum,
    ])
    row.eachCell((cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
      }
    })
  })
  /*-------------------------------------------设置表格单元格-------------------------------------------*/
  sheet.getColumn(1).width = 6
  sheet.getColumn(2).width = 30
  sheet.getColumn(3).width = 23
  sheet.getColumn(4).width = 27
  sheet.getColumn(15).width = 7
  sheet.getColumn(16).width = 7
  sheet.getColumn(17).width = 7
  sheet.getColumn(18).width = 7
  for (let col = 5; col <= 14; col++) {
    sheet.getColumn(col).width = 9
  }

  const blob = await workbook.xlsx.writeBuffer()
  const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = `${name}-团队榜.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(blobUrl)
}
