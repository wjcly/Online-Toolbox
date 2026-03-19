<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">时间戳转换</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 时间戳转日期 -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-4">时间戳 → 日期时间</h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">时间戳</label>
            <input
              v-model.number="timestampInput"
              type="number"
              placeholder="输入时间戳（秒或毫秒）"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex gap-2 mb-4">
            <button @click="convertToSeconds" class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">
              秒 (s)
            </button>
            <button @click="convertToMillis" class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">
              毫秒 (ms)
            </button>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">转换结果</p>
            <p class="text-lg font-mono mt-1">{{ timestampOutput || '-' }}</p>
          </div>
        </div>

        <!-- 日期转时间戳 -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-4">日期时间 → 时间戳</h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">日期时间</label>
            <input
              v-model="dateTimeInput"
              type="datetime-local"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">时间戳（秒）</p>
            <p class="text-lg font-mono mt-1">{{ dateTimeToSeconds || '-' }}</p>
            <p class="text-sm text-gray-500 mt-2">时间戳（毫秒）</p>
            <p class="text-lg font-mono mt-1">{{ dateTimeToMillis || '-' }}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 bg-white rounded-xl p-6 shadow-sm">
        <h3 class="font-semibold mb-4">当前时间</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
            <p class="text-blue-100 text-sm">当前时间戳（秒）</p>
            <p class="text-2xl font-mono font-bold mt-2">{{ currentTimestampSeconds }}</p>
          </div>
          <div class="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
            <p class="text-green-100 text-sm">当前时间戳（毫秒）</p>
            <p class="text-2xl font-mono font-bold mt-2">{{ currentTimestampMillis }}</p>
          </div>
          <div class="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
            <p class="text-purple-100 text-sm">本地时间</p>
            <p class="text-lg font-mono font-bold mt-2">{{ localTime }}</p>
          </div>
          <div class="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white">
            <p class="text-orange-100 text-sm">UTC 时间</p>
            <p class="text-lg font-mono font-bold mt-2">{{ utcTime }}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 bg-white rounded-xl p-6 shadow-sm">
        <h3 class="font-semibold mb-4">常用时区</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="tz in timezones" :key="tz.name" class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-gray-700">{{ tz.name }}</p>
            <p class="text-lg font-mono mt-1">{{ tz.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'

const timestampInput = ref<number | null>(null)
const timestampOutput = ref('')
const dateTimeInput = ref('')
const currentTime = ref(new Date())

let interval: number

const timestampUnit = ref<'seconds' | 'millis'>('millis')

const convertToSeconds = () => {
  timestampUnit.value = 'seconds'
  convert()
}

const convertToMillis = () => {
  timestampUnit.value = 'millis'
  convert()
}

const convert = () => {
  if (timestampInput.value === null) return

  let ts = timestampInput.value
  if (timestampUnit.value === 'seconds') {
    ts *= 1000
  }

  const date = new Date(ts)
  timestampOutput.value = date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const dateTimeToSeconds = computed(() => {
  if (!dateTimeInput.value) return null
  return Math.floor(new Date(dateTimeInput.value).getTime() / 1000)
})

const dateTimeToMillis = computed(() => {
  if (!dateTimeInput.value) return null
  return new Date(dateTimeInput.value).getTime()
})

const currentTimestampSeconds = computed(() =>
  Math.floor(currentTime.value.getTime() / 1000)
)

const currentTimestampMillis = computed(() =>
  currentTime.value.getTime()
)

const localTime = computed(() =>
  currentTime.value.toLocaleString('zh-CN')
)

const utcTime = computed(() =>
  currentTime.value.toUTCString()
)

const timezones = computed(() => {
  const timezones = [
    { name: '北京 (UTC+8)', offset: 8 },
    { name: '东京 (UTC+9)', offset: 9 },
    { name: '伦敦 (UTC+0)', offset: 0 },
    { name: '纽约 (UTC-5)', offset: -5 },
  ]

  return timezones.map(tz => {
    const date = new Date(currentTime.value.getTime() + tz.offset * 3600000 - currentTime.value.getTimezoneOffset() * 60000)
    return {
      name: tz.name,
      time: date.toLocaleString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    }
  })
})

onMounted(() => {
  interval = setInterval(() => {
    currentTime.value = new Date()
  }, 1000) as unknown as number
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>
