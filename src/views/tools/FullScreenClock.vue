<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">全屏时钟</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
      <div class="text-center">
        <div class="text-8xl md:text-9xl font-mono font-bold text-gray-900 mb-4">
          {{ currentTime }}
        </div>
        <div class="text-2xl text-gray-500 mb-8">
          {{ currentDate }}
        </div>

        <div class="flex justify-center gap-4">
          <button
            @click="toggleFullscreen"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ isFullscreen ? '退出全屏' : '全屏显示' }}
          </button>
          <button
            @click="showSeconds = !showSeconds"
            class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {{ showSeconds ? '隐藏秒数' : '显示秒数' }}
          </button>
          <button
            @click="toggleFormat"
            class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {{ is24Hour ? '12 小时制' : '24 小时制' }}
          </button>
        </div>

        <div v-if="pomodoro" class="mt-12 p-6 bg-white rounded-xl shadow-sm">
          <h3 class="font-semibold mb-4">番茄钟</h3>
          <div class="text-6xl font-mono font-bold mb-4">{{ pomodoroTime }}</div>
          <div class="flex justify-center gap-4">
            <button
              @click="startPomodoro"
              :disabled="pomodoroRunning"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              开始
            </button>
            <button
              @click="pausePomodoro"
              :disabled="!pomodoroRunning"
              class="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
            >
              暂停
            </button>
            <button
              @click="resetPomodoro"
              class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              重置
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import { toast } from '@/utils/toast'

const now = ref(new Date())
const showSeconds = ref(true)
const is24Hour = ref(true)
const isFullscreen = ref(false)

const pomodoro = ref(false)
const pomodoroTime = ref(25 * 60)
const pomodoroRunning = ref(false)
let pomodoroInterval: number

const currentTime = computed(() => {
  const hours = is24Hour.value ? now.value.getHours() : now.value.getHours() % 12 || 12
  const minutes = now.value.getMinutes()
  const seconds = now.value.getSeconds()
  const ampm = now.value.getHours() >= 12 ? 'PM' : 'AM'

  const h = hours.toString().padStart(2, '0')
  const m = minutes.toString().padStart(2, '0')
  const s = seconds.toString().padStart(2, '0')

  return showSeconds.value
    ? `${h}:${m}:${s}${!is24Hour.value ? ' ' + ampm : ''}`
    : `${h}:${m}${!is24Hour.value ? ' ' + ampm : ''}`
})

const currentDate = computed(() => {
  return now.value.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
})

let interval: number
onMounted(() => {
  interval = setInterval(() => {
    now.value = new Date()
  }, 1000) as unknown as number
})

onUnmounted(() => {
  clearInterval(interval)
  if (pomodoroInterval) clearInterval(pomodoroInterval)
})

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const toggleFormat = () => {
  is24Hour.value = !is24Hour.value
}

const startPomodoro = () => {
  pomodoroRunning.value = true
  pomodoroInterval = setInterval(() => {
    if (pomodoroTime.value > 0) {
      pomodoroTime.value--
    } else {
      pausePomodoro()
      toast.success('番茄钟结束！', 5000)
    }
  }, 1000) as unknown as number
}

const pausePomodoro = () => {
  pomodoroRunning.value = false
  clearInterval(pomodoroInterval)
}

const resetPomodoro = () => {
  pausePomodoro()
  pomodoroTime.value = 25 * 60
}
</script>
