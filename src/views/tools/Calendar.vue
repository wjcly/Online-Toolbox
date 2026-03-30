<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">日历万年历</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Calendar -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <!-- Calendar Header -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-2">
                <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronLeft class="w-5 h-5" />
                </button>
                <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronRight class="w-5 h-5" />
                </button>
              </div>
              <div class="flex items-center gap-3">
                <select v-model="selectedYear" @change="jumpToYear" class="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option v-for="year in yearRange" :key="year" :value="year">{{ year }}年</option>
                </select>
                <h2 class="text-xl font-bold text-gray-900">
                  {{ currentYear }}年{{ currentMonth + 1 }}月
                </h2>
                <button @click="goToToday" class="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  今天
                </button>
              </div>
              <div class="w-20"></div>
            </div>

            <!-- Weekday Headers -->
            <div class="grid grid-cols-7 gap-1 mb-2">
              <div v-for="(day, index) in weekdays" :key="index" :class="['text-center text-sm font-medium py-2', day.isWeekend ? 'text-red-500' : 'text-gray-700']">
                {{ day.name }}
              </div>
            </div>

            <!-- Calendar Days -->
            <div class="grid grid-cols-7 gap-1">
              <div
                v-for="(day, index) in calendarDays"
                :key="index"
                @click="selectDate(day)"
                :class="[
                  'aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all p-1 relative',
                  day.isCurrentMonth ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 text-gray-400 hover:bg-gray-100',
                  day.isToday && day.isCurrentMonth ? 'bg-blue-500 text-white hover:bg-blue-600' : '',
                  day.isSelected && !day.isToday ? 'ring-2 ring-blue-500' : '',
                  day.isWeekend && !day.isToday ? 'text-red-500' : ''
                ]"
              >
                <span v-if="day.isWeekend || day.isHoliday" class="absolute top-1 right-1 text-[8px] text-red-500 font-medium leading-none">休</span>
                <span :class="['text-sm font-medium', day.isToday ? 'text-white' : '']">{{ day.day }}</span>
                <div class="flex flex-col items-center gap-0.5 mt-0.5">
                  <span v-if="day.isHoliday && !day.isWeekend" :title="day.holidayName" class="text-[8px] text-red-500 font-medium truncate w-full text-center">{{ day.holidayShort }}</span>
                  <span v-else-if="day.isFestival" :title="day.festivalName" class="text-[8px] text-orange-500 truncate w-full text-center">{{ day.festivalShort }}</span>
                  <span v-else-if="day.solarTerm" :title="day.solarTerm" class="text-[8px] text-emerald-600 truncate w-full text-center">{{ day.solarTerm }}</span>
                  <span v-else-if="day.lunar" class="text-[8px] text-gray-500 truncate w-full text-center">{{ day.lunar }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Full Year View -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <Calendar class="w-4 h-4" />
              {{ selectedYear }}年全年概览
            </h3>
            <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div v-for="month in fullYearCalendar" :key="month.month" @click="jumpToMonth(month.month)" class="cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
                <div class="text-center font-medium text-sm mb-2">{{ month.name }}</div>
                <div class="grid grid-cols-7 gap-0.5 text-xs">
                  <div v-for="d in ['日', '一', '二', '三', '四', '五', '六']" :key="d" class="text-center text-gray-400">{{ d }}</div>
                  <div
                    v-for="(day, idx) in month.days"
                    :key="idx"
                    :class="[
                      'text-center aspect-square flex items-center justify-center rounded text-xs',
                      typeof day === 'number' ? 'text-gray-600' : ''
                    ]"
                  >
                    {{ day }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Side Panel -->
        <div class="space-y-6">
          <!-- Selected Date Info -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4">选中日期信息</h3>
            <div v-if="selectedDate" class="space-y-3">
              <div class="p-3 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ formatDate(selectedDate.date) }}</div>
                <div class="text-sm text-blue-500 mt-1">{{ getWeekday(selectedDate.date) }}</div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-gray-50 rounded-lg">
                  <div class="text-xs text-gray-500">农历</div>
                  <div class="font-medium">{{ selectedDate.lunarFull }}</div>
                </div>
                <div class="p-3 bg-gray-50 rounded-lg">
                  <div class="text-xs text-gray-500">星座</div>
                  <div class="font-medium">{{ selectedDate.zodiac }}</div>
                </div>
              </div>
              <div v-if="selectedDate.solarTerm" class="p-3 bg-emerald-50 rounded-lg">
                <div class="text-xs text-emerald-600">节气</div>
                <div class="font-medium text-emerald-700">{{ selectedDate.solarTerm }}</div>
              </div>
              <div v-if="selectedDate.isHoliday" class="p-3 bg-red-50 rounded-lg">
                <div class="text-xs text-red-600">节假日</div>
                <div class="font-medium text-red-700">{{ selectedDate.holidayName }}</div>
              </div>
              <div v-if="selectedDate.isFestival" class="p-3 bg-orange-50 rounded-lg">
                <div class="text-xs text-orange-600">传统节日</div>
                <div class="font-medium text-orange-700">{{ selectedDate.festivalName }}</div>
              </div>
              <div class="p-3 bg-gray-50 rounded-lg">
                <div class="text-xs text-gray-500">一年中的第几天</div>
                <div class="font-medium">{{ selectedDate.dayOfYear }}</div>
              </div>
              <div class="p-3 bg-gray-50 rounded-lg">
                <div class="text-xs text-gray-500">一年中的第几周</div>
                <div class="font-medium">{{ selectedDate.weekOfYear }}</div>
              </div>
              <div class="p-3 bg-gray-50 rounded-lg">
                <div class="text-xs text-gray-500">时间戳</div>
                <div class="font-medium text-sm font-mono">{{ selectedDate.timestamp }}</div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-400">
              <Calendar class="w-12 h-12 mx-auto mb-2" />
              <p>点击日期查看详情</p>
            </div>
          </div>

          <!-- Year Overview -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4">年份信息</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">年份</span>
                <span class="font-medium">{{ currentYear }}年</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">闰年</span>
                <span :class="isLeapYear ? 'text-green-600' : 'text-gray-600'">{{ isLeapYear ? '是' : '否' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">总天数</span>
                <span class="font-medium">{{ isLeapYear ? 366 : 365 }}天</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">生肖</span>
                <span class="font-medium">{{ getChineseZodiac(currentYear) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore - lunar-calendar doesn't have TypeScript types
import LunarCalendar from 'lunar-calendar'
import { ref, computed, onMounted, nextTick } from 'vue'
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Globe } from 'lucide-vue-next'

const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth())
const selectedDate = ref<any>(null)
const selectedYear = ref(now.getFullYear())

const weekdays = [
  { name: '日', isWeekend: true },
  { name: '一', isWeekend: false },
  { name: '二', isWeekend: false },
  { name: '三', isWeekend: false },
  { name: '四', isWeekend: false },
  { name: '五', isWeekend: false },
  { name: '六', isWeekend: true },
]

const yearRange = computed(() => {
  const range = []
  const start = currentYear.value - 50
  const end = currentYear.value + 50
  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  return range
})

const isLeapYear = computed(() => {
  const year = currentYear.value
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
})

// 农历日期
const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']

const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊']

// 使用 lunar-calendar 库计算农历日期
const getLunarInfo = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return LunarCalendar.solarToLunar(year, month, day)
}

const getLunarDate = (date: Date): string => {
  const lunar = getLunarInfo(date)
  return lunar.lunarDayName
}

const getLunarFull = (date: Date): string => {
  const lunar = getLunarInfo(date)
  return `${lunar.lunarMonthName}${lunar.lunarDayName}`
}

// 使用 lunar-calendar 库计算节气
const getSolarTerm = (date: Date): string => {
  const lunar = getLunarInfo(date)
  return lunar.term || ''
}

// 农历节日 (使用 lunar-calendar 库计算)
const getLunarFestivals = (date: Date): { name: string; short: string } | null => {
  const lunar = getLunarInfo(date)
  if (lunar.lunarFestival) {
    const name = lunar.lunarFestival
    return { name, short: name.substring(0, 2) }
  }
  return null
}

// 国家法定节假日 (固定日期)
const getFixedHolidays = (year: number): Map<string, { name: string; short: string }> => {
  const holidays = new Map<string, { name: string; short: string }>()

  // 元旦
  holidays.set(`${year}-01-01`, { name: '元旦', short: '元旦' })

  // 劳动节
  holidays.set(`${year}-05-01`, { name: '劳动节', short: '劳动' })

  // 国庆节
  holidays.set(`${year}-10-01`, { name: '国庆节', short: '国庆' })
  holidays.set(`${year}-10-02`, { name: '国庆节', short: '国庆' })
  holidays.set(`${year}-10-03`, { name: '国庆节', short: '国庆' })

  // 建军节
  holidays.set(`${year}-08-01`, { name: '建军节', short: '建军' })

  // 教师节
  holidays.set(`${year}-09-10`, { name: '教师节', short: '教师' })

  // 青年节
  holidays.set(`${year}-05-04`, { name: '青年节', short: '青年' })

  // 儿童节
  holidays.set(`${year}-06-01`, { name: '儿童节', short: '儿童' })

  // 妇女节
  holidays.set(`${year}-03-08`, { name: '妇女节', short: '妇女' })

  return holidays
}

const getZodiac = (date: Date): string => {
  const day = date.getDate()
  const month = date.getMonth() + 1

  const zodiacSigns = [
    { name: '摩羯座', start: [12, 22], end: [1, 19] },
    { name: '水瓶座', start: [1, 20], end: [2, 18] },
    { name: '双鱼座', start: [2, 19], end: [3, 20] },
    { name: '白羊座', start: [3, 21], end: [4, 19] },
    { name: '金牛座', start: [4, 20], end: [5, 20] },
    { name: '双子座', start: [5, 21], end: [6, 21] },
    { name: '巨蟹座', start: [6, 22], end: [7, 22] },
    { name: '狮子座', start: [7, 23], end: [8, 22] },
    { name: '处女座', start: [8, 23], end: [9, 22] },
    { name: '天秤座', start: [9, 23], end: [10, 23] },
    { name: '天蝎座', start: [10, 24], end: [11, 21] },
    { name: '射手座', start: [11, 22], end: [12, 21] },
  ]

  for (const sign of zodiacSigns) {
    if ((month === sign.start[0] && day >= sign.start[1]) ||
        (month === sign.end[0] && day <= sign.end[1])) {
      return sign.name
    }
  }
  return '摩羯座'
}

const getChineseZodiac = (year: number): string => {
  const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
  return animals[(year - 4) % 12]
}

const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

const getWeekOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
  return Math.ceil((days + start.getDay() + 1) / 7)
}

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDay = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const prevMonthLastDay = new Date(year, month, 0).getDate()
  const fixedHolidays = getFixedHolidays(year)
  const today = new Date()

  const days = []

  // Previous month days
  for (let i = startDay - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const date = new Date(year, month - 1, day)
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const holiday = fixedHolidays.get(dateKey)
    const festival = getLunarFestivals(date)
    const solarTerm = getSolarTerm(date)
    
    days.push({
      day,
      date,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      isSelected: selectedDate.value && isSameDay(date, selectedDate.value.date),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      lunar: getLunarDate(date),
      isHoliday: !!holiday,
      holidayName: holiday?.name || '',
      holidayShort: holiday?.short || '',
      isFestival: !!festival,
      festivalName: festival?.name || '',
      festivalShort: festival?.short || '',
      solarTerm: solarTerm,
    })
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const holiday = fixedHolidays.get(dateKey)
    const festival = getLunarFestivals(date)
    const solarTerm = getSolarTerm(date)
    
    days.push({
      day,
      date,
      isCurrentMonth: true,
      isToday: isSameDay(date, today),
      isSelected: selectedDate.value && isSameDay(date, selectedDate.value.date),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      lunar: getLunarDate(date),
      isHoliday: !!holiday,
      holidayName: holiday?.name || '',
      holidayShort: holiday?.short || '',
      isFestival: !!festival,
      festivalName: festival?.name || '',
      festivalShort: festival?.short || '',
      solarTerm: solarTerm,
    })
  }

  // Next month days
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    const dateKey = `${year}-${String(month + 2).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const holiday = fixedHolidays.get(dateKey)
    const festival = getLunarFestivals(date)
    const solarTerm = getSolarTerm(date)
    
    days.push({
      day,
      date,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      isSelected: selectedDate.value && isSameDay(date, selectedDate.value.date),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      lunar: getLunarDate(date),
      isHoliday: !!holiday,
      holidayName: holiday?.name || '',
      holidayShort: holiday?.short || '',
      isFestival: !!festival,
      festivalName: festival?.name || '',
      festivalShort: festival?.short || '',
      solarTerm: solarTerm,
    })
  }

  return days
})

const fullYearCalendar = computed(() => {
  const months = []
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  const fixedHolidays = getFixedHolidays(selectedYear.value)
  
  // 构建节假日集合用于全年预览
  const holidaySet = new Set<string>()
  for (const [key] of fixedHolidays) {
    holidaySet.add(key)
  }

  for (let month = 0; month < 12; month++) {
    const firstDay = new Date(selectedYear.value, month, 1)
    const lastDay = new Date(selectedYear.value, month + 1, 0)
    const startDay = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const days = []
    for (let i = 0; i < startDay; i++) {
      days.push('')
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    months.push({
      month,
      name: monthNames[month],
      days,
      holidays: holidaySet,
    })
  }

  return months
})

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

function isWeekend(month: number, day: number): boolean {
  const date = new Date(selectedYear.value, month, day)
  const dayOfWeek = date.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function goToToday() {
  const today = new Date()
  currentYear.value = today.getFullYear()
  currentMonth.value = today.getMonth()
  const todayObj = {
    date: today,
    day: today.getDate(),
    isCurrentMonth: true,
    isToday: true,
    isSelected: true,
    isWeekend: today.getDay() === 0 || today.getDay() === 6,
    lunar: getLunarDate(today),
    isHoliday: false,
    holidayName: '',
    holidayShort: '',
    isFestival: false,
    festivalName: '',
    festivalShort: '',
    solarTerm: getSolarTerm(today),
  }
  selectDate(todayObj)
}

function changeYear(delta: number) {
  selectedYear.value += delta
  currentYear.value = selectedYear.value
}

function jumpToYear() {
  currentYear.value = selectedYear.value
}

function jumpToMonth(month: number) {
  currentMonth.value = month
  currentYear.value = selectedYear.value
}

function selectDate(day: any) {
  selectedDate.value = {
    ...day,
    lunarFull: getLunarFull(day.date),
    zodiac: getZodiac(day.date),
    dayOfYear: getDayOfYear(day.date),
    weekOfYear: getWeekOfYear(day.date),
    timestamp: day.date.getTime(),
  }
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getWeekday(date: Date): string {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekdays[date.getDay()]
}

// Initialize with today selected
onMounted(() => {
  nextTick(() => {
    goToToday()
  })
})
</script>
