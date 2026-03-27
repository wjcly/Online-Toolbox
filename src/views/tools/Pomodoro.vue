<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">番茄钟</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-8 shadow-sm mb-6 text-center">
        <div class="mb-6">
          <div class="flex justify-center gap-2 mb-4">
            <button
              @click="setMode('work')"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                mode === 'work'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              工作模式
            </button>
            <button
              @click="setMode('shortBreak')"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                mode === 'shortBreak'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              短休息
            </button>
            <button
              @click="setMode('longBreak')"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                mode === 'longBreak'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              长休息
            </button>
          </div>
        </div>

        <div class="mb-8">
          <div class="text-8xl font-bold font-mono mb-4" :class="timerColor">
            {{ formattedTime }}
          </div>
          <p class="text-gray-500">{{ modeLabel }}</p>
        </div>

        <div class="flex justify-center gap-4">
          <button
            @click="toggleTimer"
            :class="[
              'px-8 py-3 rounded-lg font-medium text-white transition-colors',
              isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'
            ]"
          >
            {{ isRunning ? '暂停' : isPaused ? '继续' : '开始' }}
          </button>
          <button
            @click="resetTimer"
            class="px-8 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            重置
          </button>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex justify-center items-center gap-4">
            <label class="text-sm text-gray-600">工作时长:</label>
            <input
              v-model.number="workDuration"
              type="number"
              min="1"
              max="60"
              class="w-20 px-2 py-1 border border-gray-300 rounded text-center"
            />
            <span class="text-sm text-gray-600">分钟</span>
          </div>
          <div class="flex justify-center items-center gap-4 mt-2">
            <label class="text-sm text-gray-600">短休息:</label>
            <input
              v-model.number="shortBreakDuration"
              type="number"
              min="1"
              max="30"
              class="w-20 px-2 py-1 border border-gray-300 rounded text-center"
            />
            <span class="text-sm text-gray-600">分钟</span>
          </div>
          <div class="flex justify-center items-center gap-4 mt-2">
            <label class="text-sm text-gray-600">长休息:</label>
            <input
              v-model.number="longBreakDuration"
              type="number"
              min="1"
              max="30"
              class="w-20 px-2 py-1 border border-gray-300 rounded text-center"
            />
            <span class="text-sm text-gray-600">分钟</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm">
        <h3 class="font-semibold mb-4">番茄钟统计</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-3xl font-bold text-red-600">{{ completedPomodoros }}</p>
            <p class="text-sm text-gray-500">已完成番茄钟</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-blue-600">{{ totalWorkMinutes }}</p>
            <p class="text-sm text-gray-500">专注总时长 (分钟)</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-green-600">{{ currentStreak }}</p>
            <p class="text-sm text-gray-500">当前连续数</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'

const mode = ref<'work' | 'shortBreak' | 'longBreak'>('work')
const workDuration = ref(25)
const shortBreakDuration = ref(5)
const longBreakDuration = ref(15)

const timeLeft = ref(workDuration.value * 60)
const isRunning = ref(false)
const isPaused = ref(false)
const completedPomodoros = ref(0)
const totalWorkMinutes = ref(0)
const currentStreak = ref(0)

let timerInterval: NodeJS.Timeout | null = null

const modeLabel = computed(() => {
  switch (mode.value) {
    case 'work': return '专注工作时间'
    case 'shortBreak': return '短暂休息一下'
    case 'longBreak': return '好好休息一下吧'
  }
})

const timerColor = computed(() => {
  switch (mode.value) {
    case 'work': return 'text-red-600'
    case 'shortBreak': return 'text-green-600'
    case 'longBreak': return 'text-blue-600'
  }
})

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const setMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
  mode.value = newMode
  stopTimer()
  updateDuration()
}

const updateDuration = () => {
  switch (mode.value) {
    case 'work':
      timeLeft.value = workDuration.value * 60
      break
    case 'shortBreak':
      timeLeft.value = shortBreakDuration.value * 60
      break
    case 'longBreak':
      timeLeft.value = longBreakDuration.value * 60
      break
  }
  isPaused.value = false
}

const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

const startTimer = () => {
  if (timerInterval) return
  isRunning.value = true
  isPaused.value = false
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      completeTimer()
    }
  }, 1000)
}

const pauseTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  isRunning.value = false
  isPaused.value = true
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  isRunning.value = false
  isPaused.value = false
}

const resetTimer = () => {
  stopTimer()
  updateDuration()
}

const completeTimer = () => {
  stopTimer()

  // Play notification sound (if supported)
  try {
    const audio = new AudioContext()
    const oscillator = audio.createOscillator()
    const gainNode = audio.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audio.destination)
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.3, audio.currentTime)
    oscillator.start(audio.currentTime)
    oscillator.stop(audio.currentTime + 0.5)
  } catch {
    // Audio not supported
  }

  if (mode.value === 'work') {
    completedPomodoros.value++
    totalWorkMinutes.value += workDuration.value
    currentStreak.value++

    // Auto switch to break
    if (completedPomodoros.value % 4 === 0) {
      setMode('longBreak')
    } else {
      setMode('shortBreak')
    }
  } else {
    // Break completed, switch to work
    setMode('work')
  }

  // Show notification
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification('番茄钟', { body: modeLabel.value })
  }
}

// Request notification permission
if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
  Notification.requestPermission()
}

onUnmounted(() => {
  stopTimer()
})
</script>
