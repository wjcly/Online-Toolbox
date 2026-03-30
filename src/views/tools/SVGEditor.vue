<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Download, Minimize2, Eraser, Palette, Copy, Check, Upload, Trash2, ZoomIn, ZoomOut } from 'lucide-vue-next'
import { toast } from '@/utils/toast'

const router = useRouter()

// SVG code state
const svgCode = ref(`<svg xmlns="http://www.w3.org/2000/svg"></svg>`)

const previewScale = ref(100)
const showGrid = ref(true)
const copied = ref(false)

// Edit options
const editOptions = ref({
  width: 200,
  height: 200,
  fillColor: '#3b82f6',
  strokeColor: '#1d4ed8',
  strokeWidth: 3,
  opacity: 100,
})

// Optimization options
const optimizeOptions = ref({
  removeComments: true,
  removeMetadata: true,
  minify: true,
  precision: 2,
})

// Stats
const stats = computed(() => {
  const original = svgCode.value.length
  const optimized = optimizeSVG(svgCode.value).length
  const reduction = ((1 - optimized / original) * 100).toFixed(1)
  return {
    original,
    optimized,
    reduction,
  }
})

// Optimized SVG
const optimizedSVG = computed(() => {
  return optimizeSVG(svgCode.value)
})

// Parse SVG attributes
function parseSVGAttributes(svg: string): { width: string; height: string; viewBox: string } {
  const match = svg.match(/<svg[^>]*>/)
  if (!match) return { width: '100', height: '100', viewBox: '0 0 100 100' }

  const svgTag = match[0]
  const widthMatch = svgTag.match(/width="([^"]*)"/)
  const heightMatch = svgTag.match(/height="([^"]*)"/)
  const viewBoxMatch = svgTag.match(/viewBox="([^"]*)"/)

  return {
    width: widthMatch?.[1] || '100',
    height: heightMatch?.[1] || '100',
    viewBox: viewBoxMatch?.[1] || '0 0 100 100',
  }
}

// Update SVG attributes
function updateSVGAttribute(attr: string, value: string) {
  const svg = svgCode.value
  const regex = new RegExp(`(${attr})="[^"]*"`, 'i')
  if (regex.test(svg)) {
    svgCode.value = svg.replace(regex, `$1="${value}"`)
  } else {
    const svgTagMatch = svg.match(/<svg([^>]*)>/)
    if (svgTagMatch) {
      svgCode.value = svg.replace(
        svgTagMatch[0],
        `<svg${svgTagMatch[1]} ${attr}="${value}">`
      )
    }
  }
}

// Optimize SVG
function optimizeSVG(svg: string): string {
  let result = svg
  
  if (optimizeOptions.value.removeComments) {
    result = result.replace(/<!--[\s\S]*?-->/g, '')
  }
  
  if (optimizeOptions.value.removeMetadata) {
    result = result.replace(/<metadata[^>]*>[\s\S]*?<\/metadata>/gi, '')
  }
  
  if (optimizeOptions.value.minify) {
    result = result
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/\s*=\s*/g, '=')
      .replace(/;\s*/g, ';')
  }
  
  if (optimizeOptions.value.precision > 0) {
    const precision = optimizeOptions.value.precision
    result = result.replace(/\d+\.\d+/g, (match) => {
      return parseFloat(match).toFixed(precision)
    })
  }
  
  return result.trim()
}

// Watch for dimension changes
watch(() => editOptions.value.width, (newVal) => {
  updateSVGAttribute('width', String(newVal))
})

watch(() => editOptions.value.height, (newVal) => {
  updateSVGAttribute('height', String(newVal))
})

// Copy to clipboard
async function copySVG() {
  try {
    await navigator.clipboard.writeText(svgCode.value)
    copied.value = true
    toast.success('已复制到剪贴板')
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    toast.error('复制失败')
  }
}

// Download as SVG file
function downloadSVG() {
  const blob = new Blob([optimizedSVG.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'image.svg'
  a.click()
  URL.revokeObjectURL(url)
  toast.success('SVG 文件已下载')
}

// Download as PNG
function downloadPNG() {
  const svgData = optimizedSVG.value
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  const attrs = parseSVGAttributes(svgData)
  const width = parseInt(attrs.width) || 200
  const height = parseInt(attrs.height) || 200
  
  canvas.width = width * 2
  canvas.height = height * 2
  
  const img = new Image()
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)
  
  img.onload = () => {
    if (ctx) {
      ctx.scale(2, 2)
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        if (blob) {
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = 'image.png'
          a.click()
          toast.success('PNG 文件已下载')
        }
        URL.revokeObjectURL(url)
      }, 'image/png')
    }
  }
  
  img.onerror = () => {
    toast.error('PNG 导出失败')
    URL.revokeObjectURL(url)
  }
  
  img.src = url
}

// Clear editor
function clearEditor() {
  svgCode.value = '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
  toast.info('编辑器已清空')
}

// Handle file upload
function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    if (content.includes('<svg')) {
      svgCode.value = content
      toast.success('SVG 文件已加载')
    } else {
      toast.error('不是有效的 SVG 文件')
    }
  }
  reader.readAsText(file)
  input.value = ''
}

// Optimize button handler
function handleOptimize() {
  svgCode.value = optimizedSVG.value
  toast.success('SVG 已优化')
}
</script>

<template>
  <div class="tool-page min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            @click="router.back()"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">SVG 编辑器与优化器</h1>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="clearEditor"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="清空"
          >
            <Trash2 class="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <label class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
            <Upload class="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <input type="file" accept=".svg" @change="handleFileUpload" class="hidden" />
          </label>
          <button
            @click="copySVG"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="复制"
          >
            <component :is="copied ? Check : Copy" class="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            @click="downloadSVG"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download class="w-4 h-4" />
            <span>导出 SVG</span>
          </button>
          <button
            @click="downloadPNG"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download class="w-4 h-4" />
            <span>导出 PNG</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Editor Panel -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Type class="w-5 h-5" />
              SVG 源码
            </h2>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ svgCode.length }} 字符</span>
          </div>
          <div class="relative">
            <textarea
              v-model="svgCode"
              class="w-full h-96 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none"
              spellcheck="false"
              placeholder="在此粘贴或输入 SVG 代码..."
            />
          </div>
        </div>

        <!-- Preview Panel -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Palette class="w-5 h-5" />
              实时预览
            </h2>
            <div class="flex items-center gap-2">
              <button
                @click="previewScale = Math.max(25, previewScale - 25)"
                class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ZoomOut class="w-4 h-4" />
              </button>
              <span class="text-sm text-gray-500 dark:text-gray-400 w-12 text-center">{{ previewScale }}%</span>
              <button
                @click="previewScale = Math.min(200, previewScale + 25)"
                class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ZoomIn class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div
            class="h-96 flex items-center justify-center overflow-auto p-4"
            :class="{ 'bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=)]': showGrid, 'bg-white dark:bg-gray-900': !showGrid }"
          >
            <div
              class="transition-transform duration-200"
              :style="{ transform: `scale(${previewScale / 100})` }"
              v-html="optimizedSVG"
            />
          </div>
          
          <!-- Preview Options -->
          <div class="p-4 border-t border-gray-200 dark:border-gray-700">
            <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              <input v-model="showGrid" type="checkbox" class="rounded" />
              显示网格背景
            </label>
          </div>
        </div>
      </div>

      <!-- Edit & Optimize Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <!-- Edit Options -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Palette class="w-5 h-5" />
            基础编辑
          </h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">宽度</label>
              <input
                v-model.number="editOptions.width"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">高度</label>
              <input
                v-model.number="editOptions.height"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">填充颜色</label>
              <input
                v-model="editOptions.fillColor"
                type="color"
                class="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">描边颜色</label>
              <input
                v-model="editOptions.strokeColor"
                type="color"
                class="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">描边宽度</label>
              <input
                v-model.number="editOptions.strokeWidth"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">不透明度</label>
              <input
                v-model.number="editOptions.opacity"
                type="range"
                min="0"
                max="100"
                class="w-full"
              />
              <span class="text-sm text-gray-500">{{ editOptions.opacity }}%</span>
            </div>
          </div>
        </div>

        <!-- Optimize Options -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Minimize2 class="w-5 h-5" />
            SVG 优化
          </h2>
          
          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.original }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">原始大小</div>
            </div>
            <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ stats.optimized }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">优化后</div>
            </div>
            <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ stats.reduction }}%</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">压缩率</div>
            </div>
          </div>

          <!-- Options -->
          <div class="space-y-3">
            <label class="flex items-center justify-between">
              <span class="text-sm text-gray-700 dark:text-gray-300">移除注释</span>
              <input v-model="optimizeOptions.removeComments" type="checkbox" class="rounded" />
            </label>
            <label class="flex items-center justify-between">
              <span class="text-sm text-gray-700 dark:text-gray-300">移除元数据</span>
              <input v-model="optimizeOptions.removeMetadata" type="checkbox" class="rounded" />
            </label>
            <label class="flex items-center justify-between">
              <span class="text-sm text-gray-700 dark:text-gray-300">压缩空白</span>
              <input v-model="optimizeOptions.minify" type="checkbox" class="rounded" />
            </label>
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-gray-700 dark:text-gray-300">小数精度</span>
                <span class="text-sm text-gray-500">{{ optimizeOptions.precision }}</span>
              </div>
              <input
                v-model.number="optimizeOptions.precision"
                type="range"
                min="0"
                max="4"
                class="w-full"
              />
            </div>
          </div>

          <button
            @click="handleOptimize"
            class="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Eraser class="w-4 h-4" />
            <span>应用优化</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.tool-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

input[type="color"] {
  -webkit-appearance: none;
  border: none;
  padding: 0;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

input[type="color"]::-moz-color-swatch {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}
</style>
