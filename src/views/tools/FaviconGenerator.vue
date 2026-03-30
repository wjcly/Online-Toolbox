<template>
  <div class="tool-page min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft class="w-5 h-5 text-gray-600" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">Favicon 生成器</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left: Input Section -->
        <div class="space-y-6">
          <!-- Mode Selection -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <Layers class="w-5 h-5 text-blue-600" />
              生成模式
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="mode = 'image'"
                :class="[
                  'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                  mode === 'image' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <Image class="w-6 h-6" :class="mode === 'image' ? 'text-blue-600' : 'text-gray-400'" />
                <span class="font-medium">图片生成</span>
              </button>
              <button
                @click="mode = 'text'"
                :class="[
                  'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                  mode === 'text' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <Type class="w-6 h-6" :class="mode === 'text' ? 'text-blue-600' : 'text-gray-400'" />
                <span class="font-medium">文字生成</span>
              </button>
            </div>
          </div>

          <!-- Image Mode -->
          <div v-if="mode === 'image'" class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <Upload class="w-5 h-5 text-blue-600" />
              上传图片
            </h3>
            <div
              class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              @click="triggerFileInput"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              :class="{ 'border-blue-400 bg-blue-50': isDragging }"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
              />
              <Image class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500 mb-1">点击或拖拽上传图片</p>
              <p class="text-sm text-gray-400">支持 PNG、JPG、SVG、ICO 等格式</p>
            </div>
            <div v-if="previewUrl" class="mt-4 flex items-center gap-4">
              <img :src="previewUrl" alt="Preview" class="w-16 h-16 rounded-lg object-cover border border-gray-200" />
              <button @click="clearImage" class="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
                <Trash2 class="w-4 h-4" />
                清除图片
              </button>
            </div>
          </div>

          <!-- Text Mode -->
          <div v-if="mode === 'text'" class="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 class="font-semibold mb-2 flex items-center gap-2">
              <Type class="w-5 h-5 text-blue-600" />
              输入文字
            </h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">文字内容</label>
              <input
                v-model="textContent"
                type="text"
                maxlength="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入 1-2 个字符"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">字体大小</label>
                <input
                  v-model.number="textSize"
                  type="range"
                  min="20"
                  max="80"
                  class="w-full"
                />
                <p class="text-xs text-gray-500 mt-1">{{ textSize }}px</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">字体粗细</label>
                <select
                  v-model="fontWeight"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">正常</option>
                  <option value="bold">粗体</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Customization Options -->
          <div class="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 class="font-semibold mb-2 flex items-center gap-2">
              <Palette class="w-5 h-5 text-blue-600" />
              样式设置
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">背景颜色</label>
                <div class="flex gap-2">
                  <input
                    v-model="bgColor"
                    type="color"
                    class="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    v-model="bgColor"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm uppercase"
                  />
                </div>
              </div>
              <div v-if="mode === 'text'">
                <label class="block text-sm font-medium text-gray-700 mb-1">文字颜色</label>
                <div class="flex gap-2">
                  <input
                    v-model="fgColor"
                    type="color"
                    class="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    v-model="fgColor"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm uppercase"
                  />
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">背景形状</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  @click="shape = 'square'"
                  :class="[
                    'p-2 rounded-lg border-2 transition-all flex items-center justify-center',
                    shape === 'square' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <Square class="w-5 h-5" />
                </button>
                <button
                  @click="shape = 'rounded'"
                  :class="[
                    'p-2 rounded-lg border-2 transition-all flex items-center justify-center',
                    shape === 'rounded' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <Square class="w-5 h-5" style="border-radius: 4px;" />
                </button>
                <button
                  @click="shape = 'circle'"
                  :class="[
                    'p-2 rounded-lg border-2 transition-all flex items-center justify-center',
                    shape === 'circle' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <Circle class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Generate Button -->
          <button
            @click="generateFavicon"
            :disabled="!canGenerate"
            class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md flex items-center justify-center gap-2"
          >
            <Zap class="w-5 h-5" />
            生成 Favicon
          </button>
        </div>

        <!-- Right: Preview & Download -->
        <div class="space-y-6">
          <!-- Preview -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <Eye class="w-5 h-5 text-blue-600" />
              预览效果
            </h3>
            <div class="flex flex-col items-center justify-center min-h-[200px] bg-gray-50 rounded-xl p-6">
              <canvas ref="canvasRef" class="hidden"></canvas>
              <div v-if="generatedUrl" class="flex flex-col items-center gap-4">
                <img :src="generatedUrl" alt="Favicon Preview" class="w-32 h-32 rounded-xl shadow-lg border border-gray-200" />
                <p class="text-sm text-gray-500">预览图 (512x512)</p>
              </div>
              <div v-else class="text-center text-gray-400">
                <Image class="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p>上传图片或输入文字后点击生成</p>
              </div>
            </div>
          </div>

          <!-- Size Options -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <Grid3X3 class="w-5 h-5 text-blue-600" />
              选择尺寸
            </h3>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="size in faviconSizes"
                :key="size.value"
                @click="selectedSizes.includes(size.value) 
                  ? selectedSizes = selectedSizes.filter(s => s !== size.value)
                  : selectedSizes.push(size.value)"
                :class="[
                  'p-3 rounded-lg border-2 transition-all text-sm',
                  selectedSizes.includes(size.value)
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                {{ size.label }}
              </button>
            </div>
          </div>

          <!-- Download Section -->
          <div v-if="generatedUrl" class="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 class="font-semibold mb-2 flex items-center gap-2">
              <Download class="w-5 h-5 text-blue-600" />
              下载文件
            </h3>
            <div class="space-y-2">
              <button
                @click="downloadAll"
                class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <FolderArchive class="w-5 h-5" />
                打包下载所有尺寸 (ZIP)
              </button>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="size in selectedSizes"
                  :key="size"
                  @click="downloadSingle(size)"
                  class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-1"
                >
                  <Download class="w-4 h-4" />
                  {{ size }}x{{ size }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  ArrowLeft,
  Image,
  Type,
  Upload,
  Trash2,
  Palette,
  Square,
  Circle,
  Zap,
  Eye,
  Grid3X3,
  Download,
  FolderArchive,
  Layers
} from 'lucide-vue-next'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const mode = ref<'image' | 'text'>('image')
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')
const uploadedImage = ref<HTMLImageElement | null>(null)
const textContent = ref('')
const textSize = ref(50)
const fontWeight = ref('bold')
const bgColor = ref('#4F46E5')
const fgColor = ref('#FFFFFF')
const shape = ref<'square' | 'rounded' | 'circle'>('rounded')
const generatedUrl = ref('')
const selectedSizes = ref<number[]>([16, 32, 48, 64, 128, 256, 512])
const canvasRef = ref<HTMLCanvasElement | null>(null)

const faviconSizes = [
  { label: '16px', value: 16 },
  { label: '32px', value: 32 },
  { label: '48px', value: 48 },
  { label: '64px', value: 64 },
  { label: '128px', value: 128 },
  { label: '256px', value: 256 },
  { label: '512px', value: 512 },
]

const canGenerate = computed(() => {
  if (mode.value === 'image') {
    return uploadedImage.value !== null
  }
  return textContent.value.trim().length > 0
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    processImageFile(file)
  }
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    processImageFile(file)
  }
}

const processImageFile = async (file: File) => {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const img = new window.Image()
  img.onload = () => {
    uploadedImage.value = img
    previewUrl.value = dataUrl
    generateFavicon()
  }
  img.onerror = () => {
    alert('图片加载失败，请重试')
  }
  img.src = dataUrl
}

const clearImage = () => {
  uploadedImage.value = null
  previewUrl.value = ''
  generatedUrl.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const drawFavicon = (size: number): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      resolve('')
      return
    }

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw background
    ctx.fillStyle = bgColor.value
    ctx.beginPath()

    if (shape.value === 'circle') {
      const radius = size / 2
      ctx.arc(radius, radius, radius, 0, Math.PI * 2)
    } else if (shape.value === 'rounded') {
      const radius = size * 0.15
      ctx.moveTo(radius, 0)
      ctx.lineTo(size - radius, 0)
      ctx.quadraticCurveTo(size, 0, size, radius)
      ctx.lineTo(size, size - radius)
      ctx.quadraticCurveTo(size, size, size - radius, size)
      ctx.lineTo(radius, size)
      ctx.quadraticCurveTo(0, size, 0, size - radius)
      ctx.lineTo(0, radius)
      ctx.quadraticCurveTo(0, 0, radius, 0)
    } else {
      ctx.rect(0, 0, size, size)
    }
    ctx.fill()

    if (mode.value === 'image' && uploadedImage.value) {
      // Draw image centered and scaled
      const img = uploadedImage.value
      const imgAspect = img.width / img.height
      const canvasAspect = 1 // square canvas

      let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number

      if (imgAspect > canvasAspect) {
        // Image is wider
        drawHeight = size * 0.8
        drawWidth = drawHeight * imgAspect
        offsetX = (size - drawWidth) / 2
        offsetY = (size - drawHeight) / 2
      } else {
        // Image is taller
        drawWidth = size * 0.8
        drawHeight = drawWidth / imgAspect
        offsetX = (size - drawWidth) / 2
        offsetY = (size - drawHeight) / 2
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    } else if (mode.value === 'text' && textContent.value.trim()) {
      // Draw text centered
      ctx.fillStyle = fgColor.value
      ctx.font = `${fontWeight.value} ${textSize.value / 100 * size}px Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(textContent.value.toUpperCase(), size / 2, size / 2)
    }

    resolve(canvas.toDataURL('image/png'))
  })
}

const generateFavicon = async () => {
  if (!canGenerate.value) return

  await nextTick()
  generatedUrl.value = await drawFavicon(512)
}

const downloadSingle = async (size: number) => {
  const dataUrl = await drawFavicon(size)
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = `favicon-${size}x${size}.png`
  link.click()
}

const downloadAll = async () => {
  const zip = new JSZip()
  const folder = zip.folder('favicons')

  for (const size of selectedSizes.value) {
    const dataUrl = await drawFavicon(size)
    const base64Data = dataUrl.split(',')[1]
    folder?.file(`favicon-${size}x${size}.png`, base64Data, { base64: true })
  }

  // Add HTML template
  const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <title>Favicon Implementation</title>
  <!-- Add these to your HTML <head> section -->
  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="48x48" href="favicon-48x48.png">
  <link rel="icon" type="image/png" sizes="64x64" href="favicon-64x64.png">
  <link rel="icon" type="image/png" sizes="128x128" href="favicon-128x128.png">
  <link rel="icon" type="image/png" sizes="256x256" href="favicon-256x256.png">
  <link rel="icon" type="image/png" sizes="512x512" href="favicon-512x512.png">
  
  <!-- For Apple devices -->
  <link rel="apple-touch-icon" sizes="180x180" href="favicon-512x512.png">
</head>
<body>
  <h1>Favicon Implementation Guide</h1>
  <p>Copy the favicon files and the above code to your website.</p>
</body>
</html>`
  folder?.file('README.html', htmlTemplate)

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'favicons.zip')
}
</script>
