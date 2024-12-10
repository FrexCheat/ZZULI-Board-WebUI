<script setup lang="ts">
import { Contest, getContestList } from '../libs/core/contest'
const router = useRouter()
const interval = ref<number>()
const contestLoading = ref(true)
const searchInput = ref('')
const contestList = ref<Contest[] | []>([])
const searchList = ref<Contest[] | []>([])
const onUpdateContestStatus = () => {
  contestList.value.forEach((contest) => {
    contest.updateContestStatus()
  })
}
const openNewPage = (url: string) => {
  window.open(url)
}
watch(searchInput, (newValue) => {
  if (!newValue) {
    searchList.value = contestList.value
    return
  }
  searchList.value = contestList.value.filter((item) => item.title.includes(newValue))
})
onMounted(async () => {
  contestList.value = await getContestList()
  contestLoading.value = false
  searchList.value = contestList.value
  onUpdateContestStatus()
  interval.value = setInterval(() => {
    onUpdateContestStatus()
  }, 1000)
})
onUnmounted(() => {
  clearInterval(interval.value)
})
</script>

<template>
  <main flex justify-center lg:mt--42px>
    <div flex flex-col gap-3 w-960px>
      <t-input v-model="searchInput" clearable size="large" placeholder="搜索比赛名称"></t-input>
      <div flex flex-col gap-1rem mt-15px>
        <Loading v-if="contestLoading"></Loading>
        <t-empty v-else-if="searchList.length === 0" size="large" />
        <div v-else v-for="item in searchList" :key="item.id" flex flex-col gap-0.7rem border-b-solid border-b-slate-200
          border-b-2>
          <div flex gap-10px text-size-1.3rem items-center>
            <div>
              <img :src="item.getLogo()" alt="logo" block size-2.5rem />
            </div>
            <t-tooltip :content="item.title" placement="right">
              <span>{{ item.title }}</span>
            </t-tooltip>
          </div>
          <div flex pb-0.6rem items-end>
            <div grid grid-rows-2 gap-0.4rem float-left>
              <span>
                开始时间: <strong>{{ item.getStartTimeStr() }}<sup>GMT+8</sup></strong>
              </span>
              <span>
                持续时间: <strong>{{ item.getDurationStr() }}</strong>
              </span>
            </div>
            <div flex flex-col flex-1 gap-0.4rem items-center>
              <div flex flex-row justify-center items-center gap-3>
                <div class="circle" v-if="item.contestStatus === 0" bg-neutral-400></div>
                <div class="circle" v-if="item.contestStatus === 1" bg-sky-700></div>
                <div class="circle" v-if="item.contestStatus === 2" bg-yellow-500></div>
                <div class="circle" v-if="item.contestStatus === 3" bg-green-500></div>
                <div class="circle" v-if="item.contestStatus === 4" bg-red-600></div>
                <strong>{{ item.statusStr }}</strong>
              </div>
              <div class="progress">
                <div :data-status="item.contestStatus" class="progress-warrper"
                  :style="{ width: `${item.progressRatio}%` }"></div>
              </div>
            </div>
            <div flex flex-row float-right gap-0.4rem justify-end>
              <t-button theme="primary" shape="round" size="large" v-if="item.contestStatus === 1"
                @click="openNewPage(item.getRegisterUrl())">
                <template #icon>
                  <UserAddIcon />
                </template>
                报名
              </t-button>
              <t-button theme="primary" shape="circle" size="large" v-if="item.contestStatus >= 3"
                @click="openNewPage(item.getBoardUrl())">
                <template #icon>
                  <ArrowRightIcon />
                </template>
              </t-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
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
  width: 68%;
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
  background-image: linear-gradient(45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent);
  background-color: #006ace;
  background-size: 40px 40px;
  animation: progressbar 2s linear infinite;
  transition: all 0.5s ease;
}

.progress-warrper[data-status='0'] {
  background-image: linear-gradient(45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent);
  background-color: #3d3d3d;
}

.progress-warrper[data-status='2'] {
  background-image: linear-gradient(45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent);
  background-color: #ffa41a;
}

.progress-warrper[data-status='3'] {
  background-image: linear-gradient(45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent);
  background-color: #14cc2c;
}

.progress-warrper[data-status='4'] {
  background-image: linear-gradient(45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent);
  background-color: #cf4242;
}

sup {
  padding-left: 0.2rem;
}
</style>

<route lang="yaml">
meta:
  layout: normal-page
</route>
