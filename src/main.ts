import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import duration from 'dayjs/plugin/duration'
import 'tdesign-vue-next/es/style/index.css'
import 'uno.css'
import './styles/main.css'

createApp(App).use(router).mount('#app')

dayjs.extend(duration)
dayjs.extend(isLeapYear)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('zh-cn')
dayjs.tz.setDefault('Asia/Shanghai')
