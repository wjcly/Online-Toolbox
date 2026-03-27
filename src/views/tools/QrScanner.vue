<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">二维码解码</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-4">扫描二维码图片解码</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            上传二维码图片
          </label>
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
            <QrCode class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 mb-2">点击或拖拽上传图片</p>
            <p class="text-sm text-gray-400">支持 PNG、JPG、JPEG 格式</p>
          </div>
        </div>

        <div v-if="previewImage" class="mb-4">
          <div class="flex items-center gap-4">
            <img :src="previewImage" alt="Preview" class="w-32 h-32 object-contain border rounded-lg p-2" />
            <div class="flex-1">
              <p class="text-sm text-gray-500 mb-2">已选择图片</p>
              <button
                @click="decodeQR"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                开始解码
              </button>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <button
            @click="reset"
            :disabled="!previewImage"
            class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            清空
          </button>
        </div>
      </div>

      <div v-if="loading" class="bg-white rounded-xl p-6 shadow-sm text-center">
        <RefreshCw class="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
        <p class="text-gray-600">正在解码中...</p>
      </div>

      <div v-if="decodedContent" class="bg-white rounded-xl shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h3 class="font-semibold">解码结果</h3>
        </div>
        <div class="p-4">
          <div class="mb-4">
            <p class="text-sm text-gray-500 mb-2">内容类型：{{ contentType }}</p>
            <p class="text-gray-900 break-all whitespace-pre-wrap">{{ decodedContent }}</p>
          </div>
          <div class="flex gap-2">
            <button
              @click="copyToClipboard"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
            >
              <Copy class="w-4 h-4" />
              复制
            </button>
            <a
              v-if="isUrl"
              :href="decodedContent"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
            >
              <ExternalLink class="w-4 h-4" />
              打开链接
            </a>
          </div>
        </div>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, QrCode, RefreshCw, Copy, ExternalLink } from 'lucide-vue-next'
import jsQR from 'jsqr'

const previewImage = ref<string | null>(null)
const decodedContent = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const clickFileInput = () => {
  fileInputRef.value?.click()
}

const contentType = computed(() => {
  if (!decodedContent.value) return ''
  if (isUrl.value) return 'URL 链接'
  if (decodedContent.value.startsWith('mailto:')) return '邮箱地址'
  if (decodedContent.value.startsWith('tel:')) return '电话号码'
  if (decodedContent.value.length > 100) return '长文本'
  return '文本'
})

const isUrl = computed(() => {
  if (!decodedContent.value) return false
  try {
    new URL(decodedContent.value)
    return true
  } catch {
    return false
  }
})

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
    decodedContent.value = null
    error.value = null
  }
  reader.readAsDataURL(file)
}

const decodeQR = async () => {
  if (!previewImage.value) return

  loading.value = true
  error.value = null
  decodedContent.value = null

  try {
    const img = new Image()
    img.src = previewImage.value

    await new Promise((resolve) => {
      img.onload = resolve
    })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('无法创建画布上下文')
    }

    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)

    if (code) {
      decodedContent.value = code.data
    } else {
      error.value = '未检测到二维码，请确保图片清晰且二维码完整'
    }
  } catch (err) {
    error.value = '解码失败，请重试'
  } finally {
    loading.value = false
  }
}

const copyToClipboard = () => {
  if (decodedContent.value) {
    navigator.clipboard.writeText(decodedContent.value)
  }
}

const reset = () => {
  previewImage.value = null
  decodedContent.value = null
  error.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}
</script>
