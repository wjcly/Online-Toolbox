<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">批量背景去除工具</h1>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">容差值：</label>
              <input
                v-model.number="tolerance"
                type="range"
                min="0"
                max="200"
                class="w-32"
              />
              <span class="text-sm text-gray-600 w-12">{{ tolerance }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Upload Area -->
      <div v-if="images.length === 0" class="bg-white rounded-xl p-12 shadow-sm text-center">
        <div class="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-blue-500 transition-colors">
          <ImageIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 class="text-xl font-semibold text-gray-900 mb-2">上传图片</h2>
          <p class="text-gray-500 mb-6">支持批量上传，自动去除背景变为透明色</p>
          <div class="flex items-center justify-center gap-4 flex-wrap">
            <label class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <Upload class="w-5 h-5" />
              选择图片
              <input type="file" accept="image/*" multiple @change="handleImageUpload" class="hidden" />
            </label>
          </div>
        </div>
        <div class="mt-8 p-4 bg-blue-50 rounded-lg text-left max-w-2xl mx-auto">
          <h4 class="font-medium text-blue-900 mb-2">使用说明：</h4>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>• 支持 JPG、PNG、WebP 等常见图片格式</li>
            <li>• 可批量上传多张图片同时处理</li>
            <li>• <strong>自动检测背景颜色</strong>，智能识别并去除</li>
            <li>• 输出为透明背景的 PNG 格式</li>
            <li>• 所有处理在本地完成，图片不会上传到服务器</li>
            <li>• 调整容差值可控制背景去除的敏感度</li>
          </ul>
        </div>
      </div>

      <!-- Processing Area -->
      <div v-else class="space-y-6">
        <!-- Control Panel -->
        <div class="bg-white rounded-xl p-6 shadow-sm sticky top-16 z-10">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-4 flex-wrap">
              <button
                @click="resetAll"
                class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <ArrowLeft class="w-4 h-4" />
                返回上传
              </button>
              <span class="text-gray-600">已选择 {{ images.length }} 张图片</span>
            </div>
            <div class="flex items-center gap-4">
              <button
                @click="processAll"
                :disabled="isProcessing || allProcessed"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Wand class="w-4 h-4" />
                {{ isProcessing ? '处理中...' : '批量处理' }}
              </button>
              <button
                @click="downloadAll"
                :disabled="!allProcessed || isDownloading"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Download class="w-4 h-4" />
                {{ isDownloading ? '打包中...' : '打包下载全部' }}
              </button>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div v-if="isProcessing" class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600">处理进度</span>
              <span class="text-sm text-gray-600">{{ processedCount }} / {{ images.length }}</span>
            </div>
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-600 transition-all duration-300"
                :style="{ width: `${(processedCount / images.length) * 100}%` }"
              ></div>
            </div>
            <p v-if="currentProcessingName" class="text-sm text-gray-500 mt-2">
              正在处理：{{ currentProcessingName }}
            </p>
          </div>
        </div>

        <!-- Image Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="(img, index) in images"
            :key="index"
            class="bg-white rounded-xl p-4 shadow-sm"
          >
            <div class="relative aspect-square mb-4 rounded-lg overflow-hidden" style="background-image: linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%); background-size: 16px 16px; background-position: 0 0, 0 8px, 8px -8px, -8px 0px;">
              <img
                :src="img.processed && img.result ? img.result : img.preview"
                :alt="img.name"
                class="w-full h-full object-contain"
              />
              <div v-if="img.processed" class="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                <CheckCircle class="w-12 h-12 text-green-600" />
              </div>
              <div v-if="img.processing" class="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <Loader class="w-12 h-12 text-blue-600 animate-spin" />
              </div>
              <div class="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {{ index + 1 }}
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ img.name }}</p>
                <p class="text-xs text-gray-500">
                  {{ img.processed ? '处理完成' : img.processing ? '处理中...' : '待处理' }}
                </p>
              </div>
              <button
                v-if="img.processed"
                @click="downloadSingle(img)"
                class="ml-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="下载单张"
              >
                <Download class="w-4 h-4" />
              </button>
              <button
                @click="removeImage(index)"
                class="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="移除"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Add More Images -->
        <div class="text-center pb-8">
          <label class="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
            <Plus class="w-5 h-5" />
            继续添加图片
            <input type="file" accept="image/*" multiple @change="handleImageUpload" class="hidden" />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ArrowLeft,
  Upload,
  Download,
  Image as ImageIcon,
  Wand,
  CheckCircle,
  Loader,
  X,
  Plus
} from 'lucide-vue-next'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface ImageItem {
  file: File
  preview: string
  processed: boolean
  processing: boolean
  result: string | null
  name: string
}

const images = ref<ImageItem[]>([])
const isProcessing = ref(false)
const isDownloading = ref(false)
const processedCount = ref(0)
const currentProcessingName = ref('')
const tolerance = ref(50)

const allProcessed = computed(() => {
  return images.value.length > 0 && images.value.every(img => img.processed)
})

const handleImageUpload = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (event) => {
      images.value.push({
        file,
        preview: event.target?.result as string,
        processed: false,
        processing: false,
        result: null,
        name: file.name
      })
    }
    reader.readAsDataURL(file)
  })

  ;(e.target as HTMLInputElement).value = ''
}

// Auto-detect background color from image corners and edges
const detectBackgroundColor = (imageData: ImageData): { r: number; g: number; b: number } => {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  
  // Sample pixels from corners and edges
  const samplePoints: [number, number][] = []
  
  // Four corners
  samplePoints.push([0, 0])
  samplePoints.push([width - 1, 0])
  samplePoints.push([0, height - 1])
  samplePoints.push([width - 1, height - 1])
  
  // Mid points of edges
  samplePoints.push([Math.floor(width / 2), 0])
  samplePoints.push([Math.floor(width / 2), height - 1])
  samplePoints.push([0, Math.floor(height / 2)])
  samplePoints.push([width - 1, Math.floor(height / 2)])
  
  // Additional edge samples
  const edgeStep = Math.max(1, Math.floor(Math.min(width, height) / 20))
  for (let i = edgeStep; i < width - edgeStep; i += edgeStep) {
    samplePoints.push([i, 0])
    samplePoints.push([i, height - 1])
  }
  for (let i = edgeStep; i < height - edgeStep; i += edgeStep) {
    samplePoints.push([0, i])
    samplePoints.push([width - 1, i])
  }
  
  // Collect colors from sample points
  const colorCounts = new Map<string, number>()
  
  for (const [x, y] of samplePoints) {
    const idx = (y * width + x) * 4
    const r = data[idx]
    const g = data[idx + 1]
    const b = data[idx + 2]
    
    // Quantize colors to group similar ones
    const quantized = `${Math.floor(r / 10) * 10}-${Math.floor(g / 10) * 10}-${Math.floor(b / 10) * 10}`
    colorCounts.set(quantized, (colorCounts.get(quantized) || 0) + 1)
  }
  
  // Find the most common color
  let maxCount = 0
  let backgroundColor = { r: 255, g: 255, b: 255 } // Default to white
  
  for (const [color, count] of colorCounts.entries()) {
    if (count > maxCount) {
      maxCount = count
      const [r, g, b] = color.split('-').map(Number)
      backgroundColor = { r, g, b }
    }
  }
  
  return backgroundColor
}

// Remove background using canvas-based color detection
const removeBackgroundByColor = (
  imageData: ImageData,
  targetColor: { r: number; g: number; b: number },
  tol: number
): ImageData => {
  const data = imageData.data
  const newImageData = new ImageData(imageData.width, imageData.height)
  const newData = newImageData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    // const a = data[i + 3] // Reserved for future use

    // Calculate color distance
    const distance = Math.sqrt(
      Math.pow(r - targetColor.r, 2) +
      Math.pow(g - targetColor.g, 2) +
      Math.pow(b - targetColor.b, 2)
    )

    // If color is within tolerance, make it transparent
    if (distance <= tol) {
      newData[i] = r
      newData[i + 1] = g
      newData[i + 2] = b
      newData[i + 3] = 0 // Fully transparent
    } else {
      // Keep original pixel
      newData[i] = r
      newData[i + 1] = g
      newData[i + 2] = b
      newData[i + 3] = 255
    }
  }

  return newImageData
}

const processImageWithCanvas = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      // Draw original image
      ctx.drawImage(img, 0, 0)

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // Auto-detect background color from image edges
      const backgroundColor = detectBackgroundColor(imageData)

      // Remove background by detected color
      const processedData = removeBackgroundByColor(imageData, backgroundColor, tolerance.value)

      // Put processed data back
      ctx.putImageData(processedData, 0, 0)

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create blob'))
        }
      }, 'image/png')
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

const processAll = async () => {
  const unprocessedImages = images.value.filter(img => !img.processed)
  if (unprocessedImages.length === 0) return

  isProcessing.value = true
  processedCount.value = images.value.filter(img => img.processed).length

  for (const img of unprocessedImages) {
    img.processing = true
    currentProcessingName.value = img.name

    try {
      // Use canvas-based background removal with auto-detection
      const blob = await processImageWithCanvas(img.file)

      // Convert blob to data URL
      const dataUrl = await blobToDataUrl(blob)
      img.result = dataUrl
      img.processed = true
      processedCount.value++
    } catch (error) {
      console.error('Error processing image:', error)
      alert(`处理图片 ${img.name} 失败：${error}`)
    }

    img.processing = false
  }

  isProcessing.value = false
  currentProcessingName.value = ''
}

const blobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

const downloadSingle = (img: ImageItem) => {
  if (!img.result) return
  const name = img.name.replace(/\.[^.]+$/, '') + '-no-bg.png'
  const a = document.createElement('a')
  a.href = img.result
  a.download = name
  a.click()
}

const downloadAll = async () => {
  const processedImages = images.value.filter(img => img.processed && img.result)
  if (processedImages.length === 0) return

  isDownloading.value = true

  try {
    const zip = new JSZip()
    
    for (const img of processedImages) {
      if (img.result) {
        const response = await fetch(img.result)
        const blob = await response.blob()
        const name = img.name.replace(/\.[^.]+$/, '') + '-no-bg.png'
        zip.file(name, blob)
      }
    }

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'background-removed-images.zip')
  } catch (error) {
    console.error('Error creating zip:', error)
    alert('打包下载失败，请尝试单张下载')
  } finally {
    isDownloading.value = false
  }
}

const removeImage = (index: number) => {
  images.value.splice(index, 1)
}

const resetAll = () => {
  images.value = []
  isProcessing.value = false
  processedCount.value = 0
  currentProcessingName.value = ''
}
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
