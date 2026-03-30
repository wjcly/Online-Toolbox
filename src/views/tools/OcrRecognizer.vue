<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">OCR 文本识别</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Upload Section -->
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-4">上传图片</h2>

        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="clickFileInput"
        >
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          />
          <ScanText class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 mb-2">点击或拖拽上传图片</p>
          <p class="text-sm text-gray-400">支持 PNG、JPG、JPEG、BMP、GIF 等格式</p>
        </div>
      </div>

      <!-- Preview and Process Section -->
      <div v-if="previewImage" class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-4">图片预览</h2>
        <div class="flex flex-col md:flex-row gap-6">
          <div class="md:w-1/3">
            <img :src="previewImage" alt="Preview" class="w-full object-contain border rounded-lg p-2 bg-gray-50" />
          </div>
          <div class="md:w-2/3 flex flex-col gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                识别语言
              </label>
              <select
                v-model="selectedLang"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="chi_sim">简体中文</option>
                <option value="chi_tra">繁體中文</option>
                <option value="eng">English</option>
                <option value="jpn">日本語</option>
                <option value="kor">한국어</option>
              </select>
            </div>
            <div class="flex gap-4">
              <button
                @click="performOCR"
                :disabled="loading"
                class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ScanText class="w-5 h-5" />
                {{ loading ? '识别中...' : '开始识别' }}
              </button>
              <button
                @click="reset"
                class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                重新上传
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Section -->
      <div v-if="loading" class="bg-white rounded-xl p-6 shadow-sm text-center">
        <RefreshCw class="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
        <p class="text-gray-600 mb-2">正在识别文字...</p>
        <p class="text-sm text-gray-400">{{ progressMessage }}</p>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Result Section -->
      <div v-if="recognizedText" class="bg-white rounded-xl shadow-sm">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="font-semibold">识别结果</h3>
          <div class="flex gap-2">
            <button
              @click="copyToClipboard"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
            >
              <Copy class="w-4 h-4" />
              复制
            </button>
            <button
              @click="downloadAsText"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2"
            >
              <Download class="w-4 h-4" />
              下载
            </button>
          </div>
        </div>
        <div class="p-4">
          <div class="mb-4">
            <p class="text-sm text-gray-500 mb-2">
              置信度：{{ confidence }}% | 字数：{{ recognizedText.length }}
            </p>
            <textarea
              v-model="recognizedText"
              class="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="识别结果将显示在这里..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Error Section -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Tips Section -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
        <h3 class="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Lightbulb class="w-5 h-5" />
          使用提示
        </h3>
        <ul class="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>适用于扫描件、截图、证件等场景的数字化与检索</li>
          <li>图片越清晰，识别准确率越高</li>
          <li>支持多语言识别，可选择中文、英文、日文、韩文等</li>
          <li>识别结果可直接复制或下载为文本文件</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, ScanText, RefreshCw, Copy, Download, Lightbulb } from 'lucide-vue-next'
import Tesseract from 'tesseract.js'

const previewImage = ref<string | null>(null)
const recognizedText = ref<string>('')
const loading = ref(false)
const progress = ref(0)
const progressMessage = ref('')
const error = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedLang = ref('chi_sim')
const confidence = ref(0)

const clickFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    loadImage(file)
  }
}

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    loadImage(file)
  }
}

const loadImage = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target?.result as string
    recognizedText.value = ''
    error.value = null
    progress.value = 0
    confidence.value = 0
  }
  reader.readAsDataURL(file)
}

const performOCR = async () => {
  if (!previewImage.value) return

  loading.value = true
  error.value = null
  recognizedText.value = ''
  progress.value = 0
  confidence.value = 0

  try {
    const result = await Tesseract.recognize(previewImage.value, selectedLang.value, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          progress.value = Math.round(m.progress * 100)
          progressMessage.value = `识别进度：${Math.round(m.progress * 100)}%`
        } else {
          progressMessage.value = m.status
        }
      },
    })

    recognizedText.value = result.data.text
    confidence.value = Math.round(result.data.confidence)
  } catch (err) {
    error.value = '识别失败，请重试或尝试更清晰的图片'
    console.error('OCR Error:', err)
  } finally {
    loading.value = false
  }
}

const copyToClipboard = () => {
  if (recognizedText.value) {
    navigator.clipboard.writeText(recognizedText.value)
  }
}

const downloadAsText = () => {
  if (recognizedText.value) {
    const blob = new Blob([recognizedText.value], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ocr-result-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
}

const reset = () => {
  previewImage.value = null
  recognizedText.value = ''
  error.value = null
  progress.value = 0
  confidence.value = 0
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}
</script>
