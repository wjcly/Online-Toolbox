<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">TTS 语音生成</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Panel: Input and Settings -->
        <div class="space-y-6">
          <!-- Text Input -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <FileText class="w-4 h-4" />
              文本内容
            </h3>
            <textarea
              v-model="text"
              placeholder="请输入要转换为语音的文本..."
              rows="8"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
            <div class="flex items-center justify-between mt-2 text-sm text-gray-500">
              <span>字符数：{{ text.length }}</span>
              <button @click="clearText" class="text-blue-500 hover:text-blue-600">清空</button>
            </div>
          </div>

          <!-- Voice Selection -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <User class="w-4 h-4" />
              语音选择
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">区域</label>
                <select
                  v-model="selectedLocale"
                  @change="loadVoices"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全部</option>
                  <option v-for="locale in availableLocales" :key="locale" :value="locale">
                    {{ locale }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">语音</label>
                <select
                  v-model="selectedVoice"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option v-for="voice in filteredVoices" :key="voice.name" :value="voice">
                    {{ voice.name }} ({{ voice.lang }})
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Speech Settings -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <Settings class="w-4 h-4" />
              语音设置
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  语速：<span class="text-blue-500">{{ rate }}x</span>
                </label>
                <input
                  v-model="rate"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5x</span>
                  <span>1x</span>
                  <span>2x</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  音调：<span class="text-blue-500">{{ pitch }}</span>
                </label>
                <input
                  v-model="pitch"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>低</span>
                  <span>正常</span>
                  <span>高</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  音量：<span class="text-blue-500">{{ volume }}%</span>
                </label>
                <input
                  v-model="volume"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Playback and Output -->
        <div class="space-y-6">
          <!-- Playback Controls -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <Play class="w-4 h-4" />
              播放控制
            </h3>
            <div class="flex items-center gap-4 mb-6">
              <button
                @click="toggleSpeech"
                :disabled="!text || isSpeaking"
                class="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Play v-if="!isSpeaking" class="w-5 h-5" />
                <Pause v-else class="w-5 h-5" />
                {{ isSpeaking ? '播放中...' : '播放语音' }}
              </button>
              <button
                @click="stopSpeech"
                :disabled="!isSpeaking"
                class="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Square class="w-5 h-5" />
              </button>
            </div>

            <!-- Audio Visualizer -->
            <div class="bg-gray-100 rounded-lg p-4 h-24 flex items-center justify-center">
              <div v-if="isSpeaking" class="flex items-center gap-1">
                <div
                  v-for="i in 20"
                  :key="i"
                  :style="{
                    height: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.05}s`,
                  }"
                  class="w-2 bg-blue-500 rounded-full animate-pulse"
                ></div>
              </div>
              <span v-else class="text-gray-400 text-sm">点击播放开始朗读</span>
            </div>
          </div>

          <!-- Sample Texts -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare class="w-4 h-4" />
              示例文本
            </h3>
            <div class="space-y-2">
              <button
                v-for="(sample, index) in sampleTexts"
                :key="index"
                @click="text = sample"
                class="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
              >
                {{ sample }}
              </button>
            </div>
          </div>

          <!-- Info Card -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 shadow-sm text-white">
            <h3 class="font-semibold mb-2 flex items-center gap-2">
              <Info class="w-4 h-4" />
              关于 TTS
            </h3>
            <p class="text-sm opacity-90 mb-4">
              本工具使用浏览器内置的 Web Speech API 实现文本转语音功能，无需服务器，所有处理都在本地完成。
            </p>
            <ul class="text-sm space-y-1 opacity-90">
              <li>• 支持多种语言和语音</li>
              <li>• 可调节语速、音调和音量</li>
              <li>• 完全免费，无需注册</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ArrowLeft,
  FileText,
  User,
  Settings,
  Play,
  Pause,
  Square,
  MessageSquare,
  Info,
} from 'lucide-vue-next'

const text = ref('')
const selectedVoice = ref<SpeechSynthesisVoice | null>(null)
const selectedLocale = ref('all')
const rate = ref(1)
const pitch = ref(1)
const volume = ref(100)
const isSpeaking = ref(false)

const voices = ref<SpeechSynthesisVoice[]>([])

const sampleTexts = [
  '欢迎使用 TTS 语音生成工具！',
  '今天天气真好，适合出去散步。',
  'Technology is changing the world.',
  'こんにちは、お元気ですか？',
  'Bonjour, comment allez-vous?',
]

const availableLocales = computed(() => {
  const locales = new Set(voices.value.map((v) => v.lang.split('-')[0]))
  return Array.from(locales).sort()
})

const filteredVoices = computed(() => {
  if (selectedLocale.value === 'all') {
    return voices.value
  }
  return voices.value.filter((v) => v.lang.startsWith(selectedLocale.value))
})

const loadVoices = () => {
  voices.value = window.speechSynthesis.getVoices()
  if (voices.value.length > 0 && !selectedVoice.value) {
    selectedVoice.value = voices.value[0]
  }
}

const clearText = () => {
  text.value = ''
}

const toggleSpeech = () => {
  if (isSpeaking.value) {
    window.speechSynthesis.pause()
  } else {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    } else {
      speak()
    }
  }
}

const speak = () => {
  if (!text.value) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text.value)
  utterance.rate = rate.value
  utterance.pitch = pitch.value
  utterance.volume = volume.value / 100

  if (selectedVoice.value) {
    utterance.voice = selectedVoice.value
  }

  utterance.onstart = () => {
    isSpeaking.value = true
  }

  utterance.onend = () => {
    isSpeaking.value = false
  }

  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event)
    isSpeaking.value = false
  }

  window.speechSynthesis.speak(utterance)
}

const stopSpeech = () => {
  window.speechSynthesis.cancel()
  isSpeaking.value = false
}

onMounted(() => {
  loadVoices()
  window.speechSynthesis.onvoiceschanged = loadVoices
})

onUnmounted(() => {
  window.speechSynthesis.cancel()
})
</script>

<style scoped>
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

input[type='range']::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}

@keyframes pulse {
  0%,
  100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}

.animate-pulse {
  animation: pulse 0.5s ease-in-out infinite;
}
</style>
