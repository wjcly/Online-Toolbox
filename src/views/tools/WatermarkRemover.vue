<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">去水印工具</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="!image" class="bg-white rounded-xl p-12 shadow-sm text-center">
        <Upload class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 mb-2">上传图片</h2>
        <p class="text-gray-500 mb-6">选择带有水印的图片进行去除</p>
        <label class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
          <Upload class="w-5 h-5" />
          选择图片
          <input type="file" accept="image/*" @change="handleImageUpload" class="hidden" />
        </label>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-4">控制</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">画笔大小：{{ brushSize }}px</label>
              <input
                v-model.number="brushSize"
                type="range"
                min="5"
                max="100"
                class="w-full"
              />
            </div>
            <div class="space-y-2">
              <button
                @click="clearMask"
                class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <Eraser class="w-4 h-4" />
                清除标记
              </button>
              <button
                @click="removeWatermark"
                :disabled="isProcessing"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Eraser class="w-4 h-4" />
                {{ isProcessing ? '处理中...' : '去除水印' }}
              </button>
              <button
                v-if="processedImage"
                @click="downloadImage"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download class="w-4 h-4" />
                下载
              </button>
            </div>
            <div class="pt-4 border-t">
              <button
                @click="reset"
                class="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                上传新图片
              </button>
            </div>
          </div>
          <div class="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 class="font-medium text-blue-900 mb-2">使用说明：</h4>
            <ol class="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>在水印区域涂抹</li>
              <li>点击"去除水印"</li>
              <li>下载处理后的图片</li>
            </ol>
          </div>
        </div>

        <div class="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <div class="relative overflow-auto max-h-[600px]">
            <div class="relative inline-block">
              <img ref="imageRef" :src="image" alt="Original" class="max-w-full" @load="initCanvas" />
              <canvas
                ref="maskCanvasRef"
                class="absolute inset-0 cursor-crosshair"
                @mousedown="startDrawing"
                @mouseup="stopDrawing"
                @mouseleave="stopDrawing"
                @mousemove="draw"
              ></canvas>
            </div>
          </div>
          <div v-if="processedImage" class="mt-6 pt-6 border-t">
            <h3 class="font-semibold mb-4">处理结果</h3>
            <img :src="processedImage" alt="Processed" class="max-w-full max-h-[400px]" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Upload, Download, Eraser } from 'lucide-vue-next'

const image = ref<string | null>(null)
const processedImage = ref<string | null>(null)
const brushSize = ref(20)
const isProcessing = ref(false)
const imageRef = ref<HTMLImageElement | null>(null)
const maskCanvasRef = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)

const handleImageUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    image.value = event.target?.result as string
    processedImage.value = null
  }
  reader.readAsDataURL(file)
}

const initCanvas = () => {
  const img = imageRef.value
  const canvas = maskCanvasRef.value
  if (!img || !canvas) return

  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

const getCanvasCoords = (e: MouseEvent) => {
  const canvas = maskCanvasRef.value
  if (!canvas) return { x: 0, y: 0 }

  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  }
}

const startDrawing = (e: MouseEvent) => {
  isDrawing.value = true
  draw(e)
}

const stopDrawing = () => {
  isDrawing.value = false
}

const draw = (e: MouseEvent) => {
  if (!isDrawing.value && e.type !== 'mousedown') return

  const canvas = maskCanvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return

  const coords = getCanvasCoords(e)
  ctx.beginPath()
  ctx.arc(coords.x, coords.y, brushSize.value, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
  ctx.fill()
}

const clearMask = () => {
  const canvas = maskCanvasRef.value
  const ctx = canvas?.getContext('2d')
  if (canvas && ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

const removeWatermark = () => {
  const img = imageRef.value
  const maskCanvas = maskCanvasRef.value
  if (!img || !maskCanvas) return

  isProcessing.value = true

  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  const maskCtx = maskCanvas.getContext('2d')

  if (!ctx || !maskCtx) {
    isProcessing.value = false
    return
  }

  ctx.drawImage(img, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
  const data = imageData.data
  const mask = maskData.data

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4
      if (mask[idx + 3] > 0) {
        let sumR = 0, sumG = 0, sumB = 0, count = 0
        const radius = brushSize.value

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx
            const ny = y + dy
            if (nx >= 0 && nx < canvas.width && ny >= 0 && ny < canvas.height) {
              const nIdx = (ny * canvas.width + nx) * 4
              if (mask[nIdx + 3] === 0) {
                sumR += data[nIdx]
                sumG += data[nIdx + 1]
                sumB += data[nIdx + 2]
                count++
              }
            }
          }
        }

        if (count > 0) {
          data[idx] = sumR / count
          data[idx + 1] = sumG / count
          data[idx + 2] = sumB / count
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0)
  processedImage.value = canvas.toDataURL()
  isProcessing.value = false
}

const downloadImage = () => {
  if (!processedImage.value) return
  const a = document.createElement('a')
  a.href = processedImage.value
  a.download = 'watermark-removed.png'
  a.click()
}

const reset = () => {
  image.value = null
  processedImage.value = null
}
</script>
