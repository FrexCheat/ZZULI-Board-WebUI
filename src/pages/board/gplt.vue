<script setup lang="ts">
import { MessagePlugin, TableProps } from 'tdesign-vue-next'
import { Contest, getContestNormalConfig, getRecordList, getStudentList, getTeamList } from '../../libs/core/contest'
import { RecordData, StudentData, TeamData } from '../../libs/types/basic-type'
import { buildStudentBoard, buildStudentTableData, buildTeamBoard, exportSingle, exportTeam, tableColumns } from '../../libs/core/board-gplt'
import { StudentBoardData, TeamBoardData } from '../../libs/types/board-gplt'
const route = useRoute()
const interval = ref<number>()
const boardLoading = ref(true)
const currentView = ref(0)
const openModal = ref(false)
const modalTitle = ref('')

const teamList = ref([] as TeamData[])
const studentList = ref([] as StudentData[])
const recordList = ref([] as RecordData[])
const contestData = ref<Contest>()
const boardTeamData = ref([] as TeamBoardData[])
const boardStudentData = ref([] as StudentBoardData[])
const tableData = ref([] as TableProps['data'])
const getContestData = async () => {
  const contestId = route.query.contest_id as string
  if (!contestId) {
    MessagePlugin.error('比赛 ID 为空!')
  } else {
    // get contest data
    contestData.value = await getContestNormalConfig(contestId)
    if (contestData.value) {
      teamList.value = await getTeamList(contestId)
      studentList.value = await getStudentList(contestId)
      recordList.value = await getRecordList(contestId)
      // build board data
      boardTeamData.value = buildTeamBoard(contestData.value, studentList.value, teamList.value, recordList.value)
      boardStudentData.value = buildStudentBoard(contestData.value, studentList.value, recordList.value)
      // update contest status
      useTitle(`${contestData.value!.title} | ZZULI GPLT Board`)
      contestData.value.updateContestStatus()
      interval.value = setInterval(() => {
        contestData.value!.updateContestStatus()
      }, 1000)
    }
  }
  boardLoading.value = false
}
const onChangeMode = (mode: number) => {
  currentView.value = mode
}
const onTeamRowClick = (team_id: number) => {
  const team = teamList.value.find((item) => item.id === team_id)
  modalTitle.value = `${team?.name} ————— ${team?.college} ————— ${team?.class}`
  const students = boardStudentData.value.filter((item) => item.team_id === team_id)
  tableData.value = buildStudentTableData(students)
  openModal.value = true
}
const onStudentRowClick = (member_id: string) => {
  const student = boardStudentData.value.filter((item) => item.member_id === member_id)
  modalTitle.value = `${student[0].name} ————— ${student[0].college} ————— ${student[0].class}`
  tableData.value = buildStudentTableData(student)
  openModal.value = true
}
onMounted(async () => {
  await getContestData()
})
onUnmounted(() => {
  clearInterval(interval.value)
})
</script>

<template>
  <Loading v-if="boardLoading" />
  <t-empty v-else-if="!contestData" size="large" />
  <div v-else flex flex-col gap-3 items-center>
    <span text-3xl font-700>{{ contestData?.title }}</span>
    <div flex flex-col flex-1 gap-0.4rem w-1270px>
      <div flex flex-row justify-center items-center gap-3>
        <div class="circle" v-if="contestData?.contestStatus === 0" bg-neutral-400></div>
        <div class="circle" v-if="contestData?.contestStatus === 1" bg-sky-700></div>
        <div class="circle" v-if="contestData?.contestStatus === 2" bg-yellow-500></div>
        <div class="circle" v-if="contestData?.contestStatus === 3" bg-green-500></div>
        <div class="circle" v-if="contestData?.contestStatus === 4" bg-red-600></div>
        <strong text-18px font-800>{{ contestData?.statusStr }}</strong>
      </div>
      <div class="progress">
        <div :data-status="contestData?.contestStatus" class="progress-warrper" :style="{ width: `${contestData?.progressRatio}%` }"></div>
      </div>
    </div>
    <div grid grid-cols-2 w-1270px mt-1>
      <div flex gap-4 align-start>
        <t-button :variant="currentView === 0 ? 'outline' : 'dashed'" ghost @click="onChangeMode(0)">团队排名</t-button>
        <t-button :variant="currentView === 1 ? 'outline' : 'dashed'" ghost @click="onChangeMode(1)">个人排名</t-button>
      </div>
      <div flex gap-4 justify-end>
        <t-button :variant="currentView === 2 ? 'outline' : 'dashed'" ghost @click="onChangeMode(2)">数据导出</t-button>
      </div>
    </div>
    <div box-border w-1270px mt-5px backdrop-blur border-1 border-blue-600 border-solid rounded-md bg-gray-700 bg-op-30>
      <div v-if="currentView !== 2" mt-5 ml-20>
        <span>🤓☝️ 我们已和 Chrome、Firefox、Edge、Safari 等浏览器进行深度合作，它们允许我们按 Ctrl+F 进行全页搜索</span>
      </div>
      <div v-for="item in boardTeamData" :key="item.team_id" v-if="currentView === 0" box-border flex flex-col gap-2 w-1270px py-40px px-10px odd:bg-gray-600 odd:bg-op-30 @click="onTeamRowClick(item.team_id)">
        <div pl-210px>
          <span>{{ item.team_name }} ————— {{ item.college }} ————— {{ item.class }}</span>
        </div>
        <div box-border flex items-center w-1270px>
          <div inline-flex justify-center items-center w-160px>
            <span text-yellow font-800 italic text-3xl>{{ item.rank }}</span>
          </div>
          <div class="p-head">
            <img src="/process-zzuli.png" alt="school" size-40px my-5px mx-5px />
          </div>
          <div class="p-pipe">
            <t-tooltip placement="bottom" :content="`${item.part1.score} / 1000`">
              <img src="/process-level1.png" alt="l1" class="p-level" :style="`width:${item.part1.ratio}%`" />
              <img src="/process-level1-node.png" alt="l1-node" class="p-level-node" />
            </t-tooltip>
          </div>
          <div class="p-node"></div>
          <div class="p-pipe">
            <t-tooltip placement="bottom" :content="`${item.part2.score} / 1000`">
              <img v-if="item.part1.status" src="/process-level2.png" alt="l2" class="p-level" :style="`width:${item.part2.ratio}%`" />
              <img v-else src="/process-level0.png" alt="l2" class="p-level" :style="`width:${item.part2.ratio}%`" />
            </t-tooltip>
            <img v-if="item.part1.status" src="/process-level2-node.png" alt="l2-node" class="p-level-node" />
          </div>
          <div class="p-node"></div>
          <div class="p-pipe">
            <t-tooltip placement="bottom" :content="`${item.part3.score} / 900`">
              <img v-if="item.part2.status" src="/process-level3.png" alt="l3" class="p-level" :style="`width:${item.part3.ratio}%`" />
              <img v-else src="/process-level0.png" alt="l3" class="p-level" :style="`width:${item.part3.ratio}%`" />
            </t-tooltip>
            <img v-if="item.part2.status" src="/process-level3-node.png" alt="l3-node" class="p-level-node" />
          </div>
          <div class="p-end"></div>
          <div inline-flex justify-center items-center w-160px>
            <span text-yellow font-800 italic text-3xl>{{ item.sum }}</span>
          </div>
        </div>
      </div>
      <div v-else-if="currentView === 1" v-for="item in boardStudentData" :key="item.member_id" box-border flex flex-col gap-2 w-1270px py-40px px-10px odd:bg-gray-600 odd:bg-op-30 @click="onStudentRowClick(item.member_id)">
        <div pl-210px>
          <span>{{ item.name }} ————— {{ item.college }} ————— {{ item.class }}</span>
        </div>
        <div box-border flex items-center w-1270px>
          <div inline-flex justify-center items-center w-160px>
            <span text-yellow font-800 italic text-3xl>{{ item.rank }}</span>
          </div>
          <div class="p-head">
            <img src="/process-zzuli.png" alt="school" size-40px my-5px mx-5px />
          </div>
          <div class="p-pipe">
            <t-tooltip placement="bottom" :content="`${item.part1.score} / 100`">
              <img src="/process-level1.png" alt="l1" class="p-level" :style="`width:${item.part1.ratio}%`" />
              <img src="/process-level1-node.png" alt="l1-node" class="p-level-node" />
            </t-tooltip>
          </div>
          <div class="p-node"></div>
          <div class="p-pipe">
            <t-tooltip placement="bottom" :content="`${item.part2.score} / 100`">
              <img src="/process-level2.png" alt="l2" class="p-level" :style="`width:${item.part2.ratio}%`" />
            </t-tooltip>
            <img src="/process-level2-node.png" alt="l2-node" class="p-level-node" />
          </div>
          <div class="p-node"></div>
          <div class="p-pipe">
            <t-tooltip placement="bottom" :content="`${item.part3.score} / 90`">
              <img src="/process-level3.png" alt="l3" class="p-level" :style="`width:${item.part3.ratio}%`" />
            </t-tooltip>
            <img src="/process-level3-node.png" alt="l3-node" class="p-level-node" />
          </div>
          <div class="p-end"></div>
          <div inline-flex justify-center items-center w-160px>
            <span text-yellow font-800 italic text-3xl>{{ item.sum }}</span>
          </div>
        </div>
      </div>
      <div v-else flex gap-20 justify-center m-20>
        <t-button theme="primary" @click="exportTeam(boardTeamData, boardStudentData, contestData!.title)">
          <template #icon>
            <CloudDownloadIcon />
          </template>
          导出团队排名
        </t-button>
        <t-button theme="primary" @click="exportSingle(boardStudentData, contestData!.title)">
          <template #icon>
            <CloudDownloadIcon />
          </template>
          导出个人排名
        </t-button>
      </div>
    </div>
  </div>
  <t-dialog v-model:visible="openModal" closeOnOverlayClick :header="false" :footer="false" :closeBtn="false" width="1230" placement="top" top="50px">
    <div flex flex-col gap-3 items-center>
      <h2>{{ modalTitle }}</h2>
      <t-table row-key="member_id" :data="tableData" :columns="tableColumns" bordered> </t-table>
    </div>
  </t-dialog>
</template>

<style scoped>
.p-node {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 25px;
  height: 40px;
  background-image: url('/process-node1.png');
  background-repeat: no-repeat;
}

.p-level-node {
  position: absolute;
  display: inline-block;
  vertical-align: middle;
  z-index: 10;
  margin-top: -13px;
  margin-left: -24px;
}

.p-level {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  z-index: 1;
  top: 4px;
  height: 20px;
}

.p-pipe {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 260px;
  height: 28px;
  background-image: url('/process-pipe.png');
}

.p-end {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 45px;
  height: 50px;
  background-image: url('/process-end.png');
}

.p-head {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 45px;
  height: 50px;
  background-image: url('/process-head.png');
}

.circle {
  width: 0.5em;
  height: 0.5em;
  border-radius: 50%;
}

@keyframes progressbar {
  0% {
    background-position: 40px 0;
  }

  100% {
    background-position: 0 0;
  }
}

.progress {
  height: 1rem;
  background: #e4e4e4;
  position: relative;
}

.progress-warrper {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-color: #006ace;
  background-size: 40px 40px;
  animation: progressbar 2s linear infinite;
  transition: all 0.5s ease;
}

.progress-warrper[data-status='0'] {
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-color: #3d3d3d;
}

.progress-warrper[data-status='2'] {
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-color: #ffa41a;
}

.progress-warrper[data-status='3'] {
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-color: #14cc2c;
}

.progress-warrper[data-status='4'] {
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-color: #cf4242;
}
</style>

<route lang="yaml">
meta:
  layout: board-gplt
</route>
