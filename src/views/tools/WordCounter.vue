<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">字数统计</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 class="font-semibold">输入文本</h3>
              <div class="flex gap-2">
                <button @click="clear" class="text-sm text-gray-600 hover:text-gray-900">清空</button>
                <button @click="paste" class="text-sm text-blue-600 hover:text-blue-800">粘贴</button>
              </div>
            </div>
            <textarea
              v-model="text"
              placeholder="请输入或粘贴文本..."
              class="w-full h-96 p-4 focus:outline-none resize-none"
            ></textarea>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <p class="text-blue-100 text-sm">总字符数</p>
            <p class="text-4xl font-bold mt-2">{{ totalChars }}</p>
          </div>

          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <p class="text-green-100 text-sm">中文字符</p>
            <p class="text-4xl font-bold mt-2">{{ chineseChars }}</p>
          </div>

          <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <p class="text-purple-100 text-sm">英文字母</p>
            <p class="text-4xl font-bold mt-2">{{ englishChars }}</p>
          </div>

          <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <p class="text-orange-100 text-sm">数字</p>
            <p class="text-4xl font-bold mt-2">{{ numbers }}</p>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <p class="text-gray-500 text-sm">单词数</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ words }}</p>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <p class="text-gray-500 text-sm">句子数</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ sentences }}</p>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <p class="text-gray-500 text-sm">段落数</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ paragraphs }}</p>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <p class="text-gray-500 text-sm">行数</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ lines }}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 bg-white rounded-xl p-6 shadow-sm">
        <h3 class="font-semibold mb-4">阅读时间估算</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">中文阅读</p>
            <p class="text-lg font-semibold">{{ chineseReadingTime }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">英文阅读</p>
            <p class="text-lg font-semibold">{{ englishReadingTime }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">演讲时间</p>
            <p class="text-lg font-semibold">{{ speakingTime }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">朗读时间</p>
            <p class="text-lg font-semibold">{{ readingAloudTime }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import { toast } from '@/utils/toast'

const text = ref('')

const totalChars = computed(() => text.value.length)

const chineseChars = computed(() => {
  const chinese = text.value.match(/[\u4e00-\u9fa5]/g)
  return chinese ? chinese.length : 0
})

const englishChars = computed(() => {
  const english = text.value.match(/[a-zA-Z]/g)
  return english ? english.length : 0
})

const numbers = computed(() => {
  const nums = text.value.match(/[0-9]/g)
  return nums ? nums.length : 0
})

const words = computed(() => {
  const englishWords = text.value.match(/[a-zA-Z]+/g)
  return (englishWords ? englishWords.length : 0) + chineseChars.value
})

const sentences = computed(() => {
  const s = text.value.split(/[.!?。！？]/).filter(s => s.trim())
  return s.length
})

const paragraphs = computed(() => {
  const p = text.value.split(/\n\s*\n/).filter(p => p.trim())
  return p.length
})

const lines = computed(() => {
  return text.value.split(/\n/).length
})

const chineseReadingTime = computed(() => {
  const minutes = Math.ceil(chineseChars.value / 500)
  return minutes < 1 ? '少于 1 分钟' : `${minutes}分钟`
})

const englishReadingTime = computed(() => {
  const minutes = Math.ceil(Number(englishChars.value) / 200)
  return minutes < 1 ? '少于 1 分钟' : `${minutes}分钟`
})

const speakingTime = computed(() => {
  const minutes = Math.ceil(words.value / 150)
  return minutes < 1 ? '少于 1 分钟' : `${minutes}分钟`
})

const readingAloudTime = computed(() => {
  const minutes = Math.ceil(words.value / 100)
  return minutes < 1 ? '少于 1 分钟' : `${minutes}分钟`
})

const clear = () => {
  text.value = ''
}

const paste = async () => {
  try {
    const clipboard = await navigator.clipboard.readText()
    text.value = clipboard
  } catch {
    toast.error('无法读取剪贴板')
  }
}
</script>
