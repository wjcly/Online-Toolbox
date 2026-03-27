<template>
  <div class="tool-page min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft class="w-5 h-5 text-gray-600" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">证件照制作</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Editor Section -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left: Canvas Area -->
        <div class="lg:col-span-7 xl:col-span-8 space-y-6">
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Image class="w-4 h-4 text-blue-600" />
                </div>
                照片预览
              </h3>
              <button @click="resetImage" class="text-sm text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 class="w-4 h-4" />
                重新上传
              </button>
            </div>
            
            <!-- Upload placeholder when no image -->
            <div v-if="!originalImage" class="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer" @click="handleUploadClick">
              <Upload class="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-500 mb-2">点击上传照片</p>
              <p class="text-sm text-gray-400">支持 JPG、PNG 格式</p>
            </div>

            <!-- Hidden file input (always in DOM) -->
            <input type="file" ref="fileInput" accept="image/*" @change="handleImageUpload" class="hidden" />

            <!-- Canvas when image loaded -->
            <div v-if="originalImage" class="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div
                class="relative"
                style="min-height: 400px;"
                @mousedown="handleCanvasMouseDown"
                @mousemove="handleCanvasMouseMove"
                @mouseup="handleCanvasMouseUp"
                @mouseleave="handleCanvasMouseUp"
                @wheel="handleCanvasWheel"
              >
                <canvas
                  ref="canvasRef"
                  v-show="selectedSize"
                  :width="selectedSize?.width || 295"
                  :height="selectedSize?.height || 413"
                  class="rounded-lg shadow-lg transition cursor-default"
                  :class="{ 'cursor-grab': selectedCloth && !isDragging, 'cursor-grabbing': isDragging }"
                  style="max-width: 100%; height: auto; touch-action: none;"
                ></canvas>
                <div v-show="!selectedSize" class="absolute inset-0 flex items-center justify-center">
                  <p class="text-gray-400">请先选择尺寸</p>
                </div>
                <!-- Drag hint -->
                <div v-if="selectedCloth && !isDragging" class="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/60 text-white text-xs rounded-full pointer-events-none whitespace-nowrap">
                  🖱️ 拖拽移动 · 滚轮缩放
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Tab Controls -->
        <div class="lg:col-span-5 xl:col-span-4">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <!-- Tab Headers -->
            <div class="flex border-b border-gray-200">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'flex-1 px-4 py-4 text-sm font-medium transition-all flex flex-col items-center gap-1.5',
                  activeTab === tab.id
                    ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                ]"
              >
                <component :is="tab.icon" class="w-5 h-5" />
                <span>{{ tab.name }}</span>
              </button>
            </div>

            <!-- Tab Content -->
            <div class="p-6">
              <!-- Crop Tab -->
              <div v-show="activeTab === 'crop'" class="space-y-4">
                <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Crop class="w-4 h-4" />
                  选择尺寸
                </h4>
                <div class="grid grid-cols-2 gap-2.5">
                  <button
                    v-for="size in photoSizes"
                    :key="size.name"
                    @click="selectSize(size)"
                    :class="[
                      'px-3 py-3 rounded-xl text-sm transition-all border-2',
                      selectedSize?.name === size.name
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                        : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'
                    ]"
                  >
                    <div class="font-medium">{{ size.name }}</div>
                    <div class="text-xs text-gray-500 mt-0.5">{{ size.mm }} ({{ size.px }}px)</div>
                  </button>
                </div>
              </div>

              <!-- Background Tab -->
              <div v-show="activeTab === 'background'" class="space-y-4">
                <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Palette class="w-4 h-4" />
                  背景颜色
                </h4>
                <div class="grid grid-cols-5 gap-2.5">
                  <button
                    v-for="bg in backgroundColors"
                    :key="bg.name"
                    @click="changeBackground(bg)"
                    :class="[
                      'aspect-square rounded-xl border-2 transition-all hover:scale-110 shadow-sm',
                      selectedBg?.name === bg.name ? 'border-blue-600 ring-2 ring-blue-200 scale-110' : 'border-gray-200'
                    ]"
                    :style="{ backgroundColor: bg.color }"
                    :title="bg.name"
                  >
                    <Check v-if="selectedBg?.name === bg.name" class="w-5 h-5 mx-auto text-white drop-shadow-lg" />
                  </button>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <input v-model="customBgColor" type="color" @change="handleCustomBgColor" class="w-10 h-10 rounded-lg cursor-pointer border-0" />
                  <div>
                    <span class="text-sm font-medium text-gray-700">自定义颜色</span>
                    <p class="text-xs text-gray-400">{{ customBgColor }}</p>
                  </div>
                </div>
              </div>

              <!-- Clothing Tab -->
              <div v-show="activeTab === 'clothing'" class="space-y-4">
                <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shirt class="w-4 h-4" />
                  更换服装（需要透明背景 PNG）
                </h4>

                <!-- Main category tabs -->
                <div class="flex gap-2 mb-3">
                  <button
                    @click="selectMainCategory('children')"
                    :class="[
                      'px-4 py-2 text-sm rounded-lg transition-colors font-medium',
                      mainCategory === 'children' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    👶 儿童
                  </button>
                  <button
                    @click="selectMainCategory('major')"
                    :class="[
                      'px-4 py-2 text-sm rounded-lg transition-colors font-medium',
                      mainCategory === 'major' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    👔 成人
                  </button>
                </div>

                <!-- Sub category tabs -->
                <div v-if="mainCategory" class="flex gap-2 mb-3">
                  <button
                    v-for="cat in subCategories"
                    :key="cat.id"
                    @click="clothingCategory = cat.id"
                    :class="[
                      'px-3 py-1.5 text-xs rounded-lg transition-colors',
                      clothingCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    {{ cat.name }}
                  </button>
                </div>

                <!-- Clothing options -->
                <div v-if="clothingOptions.length > 0" class="grid grid-cols-4 gap-2 mb-4 max-h-96 overflow-y-auto p-2 bg-gray-50 rounded-xl">
                  <button
                    v-for="cloth in filteredClothingOptions"
                    :key="cloth.id"
                    :data-cloth-id="cloth.id"
                    @click="changeClothing(cloth)"
                    :class="[
                      'px-2 py-3 rounded-xl text-xs transition-all border-2 flex flex-col items-center gap-1.5 bg-white',
                      selectedCloth?.id === cloth.id
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    ]"
                  >
                    <div v-if="cloth.thumbnail" class="w-10 h-12 rounded overflow-hidden mb-1 bg-transparent">
                      <img :src="cloth.thumbnail" :alt="cloth.name" class="w-full h-full object-contain" />
                    </div>
                    <div v-else class="w-10 h-12 rounded mb-1 bg-gray-100 flex items-center justify-center">
                      <span class="text-xs text-gray-400">加载中...</span>
                    </div>
                    <span class="text-[10px] leading-tight text-center font-medium">{{ cloth.name }}</span>
                  </button>
                </div>
                <div v-else class="mb-4 p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-xl">
                  <p>正在加载服装...</p>
                  <p class="mt-1 text-xs">已加载：{{ clothingOptions.length }} 件</p>
                </div>

                <!-- Clothing Adjustments -->
                <div v-if="selectedCloth" class="space-y-4 pt-4 border-t border-gray-100">
                  <div>
                    <div class="flex justify-between mb-2">
                      <label class="text-sm font-medium text-gray-700">服装大小</label>
                      <span class="text-xs text-gray-400">{{ (clothScale * 100).toFixed(0) }}%</span>
                    </div>
                    <input v-model.number="clothScale" type="range" min="0.5" max="2.0" step="0.05" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div class="flex gap-2">
                    <button @click="resetClothingTransform" class="flex-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      重置位置
                    </button>
                  </div>
                </div>

                <!-- Info box -->
                <div class="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p class="text-xs text-blue-800 leading-relaxed">
                    <strong>💡 操作提示：</strong>
                  </p>
                  <ul class="text-xs text-blue-700 mt-1 space-y-0.5">
                    <li>• 在画布上直接拖拽移动服装</li>
                    <li>• 使用鼠标滚轮缩放服装大小</li>
                    <li>• 服装会自动绘制在人像下方</li>
                    <li class="text-blue-600 mt-1">• 当前分类：{{ filteredClothingOptions.length }} 件服装</li>
                  </ul>
                </div>
              </div>

              <!-- Export Tab -->
              <div v-show="activeTab === 'export'" class="space-y-4">
                <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Download class="w-4 h-4" />
                  导出照片
                </h4>
                <div class="space-y-2.5">
                  <button
                    @click="downloadPhoto('png')"
                    class="w-full px-4 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
                  >
                    <Download class="w-4 h-4" />
                    下载 PNG 格式
                  </button>
                  <button
                    @click="downloadPhoto('jpeg')"
                    class="w-full px-4 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
                  >
                    <Download class="w-4 h-4" />
                    下载 JPG 格式
                  </button>
                </div>
                <div v-if="selectedSize" class="mt-4 p-4 bg-gray-50 rounded-xl">
                  <div class="text-sm text-gray-600">
                    <p><span class="font-medium">当前尺寸：</span>{{ selectedSize.name }}</p>
                    <p class="mt-1"><span class="font-medium">像素规格：</span>{{ selectedSize.px }}</p>
                    <p class="mt-1"><span class="font-medium">物理规格：</span>{{ selectedSize.mm }}</p>
                    <p class="mt-1"><span class="font-medium">DPI：</span>{{ selectedSize.dpi }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm">
        <Loader2 class="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p class="text-gray-600 font-medium mb-2">{{ loadingMessage }}</p>
        <p class="text-gray-400 text-sm">请稍候...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, watch, computed } from 'vue'
import {
  ArrowLeft,
  Upload,
  Image,
  Trash2,
  Crop,
  Palette,
  Shirt,
  Download,
  Check,
  Loader2
} from 'lucide-vue-next'
import type { ClothingAsset } from '@/utils/clothingAssetGenerator'
import {
  getClothingCategories,
  loadCategoryAssets,
  type ClothingCategory,
  type LazyClothingAsset
} from '@/utils/lazyClothingLoader'

interface ClothingTransform {
  offsetX: number
  offsetY: number
  scale: number
  rotation: number
}

interface PhotoSize {
  name: string
  mm: string
  px: string
  width: number
  height: number
  dpi: number
}

interface BackgroundColor {
  name: string
  color: string
}

interface Tab {
  id: string
  name: string
  icon: any
}

const tabs: Tab[] = [
  { id: 'crop', name: '裁剪', icon: Crop },
  { id: 'background', name: '背景', icon: Palette },
  { id: 'clothing', name: '服装', icon: Shirt },
  { id: 'export', name: '导出', icon: Download },
]

const photoSizes: PhotoSize[] = [
  { name: '1 寸', mm: '25×35mm', px: '295×413', width: 295, height: 413, dpi: 300 },
  { name: '2 寸', mm: '35×49mm', px: '413×579', width: 413, height: 579, dpi: 300 },
  { name: '小 2 寸', mm: '33×48mm', px: '390×567', width: 390, height: 567, dpi: 300 },
  { name: '大 1 寸', mm: '33×48mm', px: '390×567', width: 390, height: 567, dpi: 300 },
  { name: '护照', mm: '33×48mm', px: '390×567', width: 390, height: 567, dpi: 300 },
  { name: '签证 (美)', mm: '51×51mm', px: '600×600', width: 600, height: 600, dpi: 300 },
  { name: '简历', mm: '25×35mm', px: '295×413', width: 295, height: 413, dpi: 300 },
  { name: '驾驶证', mm: '22×32mm', px: '260×378', width: 260, height: 378, dpi: 300 },
]

const backgroundColors: BackgroundColor[] = [
  { name: '白色', color: '#FFFFFF' },
  { name: '蓝色', color: '#4A90E2' },
  { name: '红色', color: '#E74C3C' },
  { name: '灰色', color: '#95A5A6' },
  { name: '深蓝', color: '#1e3a5f' },
]

// Clothing options with lazy loading
const clothingOptions = ref<LazyClothingAsset[]>([])
const clothingImages = ref<Map<string, HTMLCanvasElement>>(new Map())
const loadedCategories = ref<Set<string>>(new Set())
const loadedThumbnails = ref<Set<string>>(new Set())
let intersectionObserver: IntersectionObserver | null = null

// Filtered clothing options by category - now just returns clothingOptions directly
const filteredClothingOptions = computed(() => {
  return clothingOptions.value
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const originalImage = ref<HTMLImageElement | null>(null)
const selectedSize = ref<PhotoSize | null>(null)
const selectedBg = ref<BackgroundColor | null>(null)
const selectedCloth = ref<ClothingAsset | null>(null)
const customBgColor = ref('#FFFFFF')
const clothScale = ref(1)
const isLoading = ref(false)
const loadingMessage = ref('正在加载...')
const activeTab = ref('crop')
const clothingCategory = ref<string>('children-men')
const clothingCategories = ref<ClothingCategory[]>([])
const mainCategory = ref<string>('children')

interface SubCategory {
  id: string
  name: string
}

const subCategories = computed<SubCategory[]>(() => {
  if (!mainCategory.value) return []
  return clothingCategories.value
    .filter(cat => cat.id.startsWith(`${mainCategory.value}-`))
    .map(cat => ({ id: cat.id, name: cat.name }))
})

const selectMainCategory = (category: string) => {
  mainCategory.value = category
  // Auto select first sub category
  const firstSub = clothingCategories.value.find(cat => cat.id.startsWith(`${category}-`))
  if (firstSub) {
    clothingCategory.value = firstSub.id
    // Watch will handle the loading
  }
}

// Load clothing assets for a specific category (lazy loading)
async function loadClothingForCategory(categoryId: string) {
  // Skip if already loaded
  if (loadedCategories.value.has(categoryId)) {
    // Still need to re-observe the DOM elements for this category
    await nextTick()
    reobserveClothingItems()
    return
  }

  loadingMessage.value = '正在加载服装...'
  isLoading.value = true

  try {
    // Load lazy assets (metadata only, very fast)
    const assets = await loadCategoryAssets(categoryId)
    
    // Replace clothing options (not append)
    clothingOptions.value = assets
    loadedCategories.value.add(categoryId)

    // Wait for DOM to update with new clothing items
    await nextTick()
    await nextTick()
    
    // Re-observe all clothing items after DOM update
    reobserveClothingItems()
  } catch (error) {
    console.error(`Failed to load assets for ${categoryId}:`, error)
  } finally {
    isLoading.value = false
  }
}

// Initialize Intersection Observer for lazy loading thumbnails
function initIntersectionObserver() {
  if (intersectionObserver) {
    intersectionObserver.disconnect()
  }

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-cloth-id')
          if (id) {
            loadThumbnailForAsset(id)
            // Stop observing after loaded
            intersectionObserver?.unobserve(entry.target)
          }
        }
      })
    },
    {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    }
  )

  // Observe all current clothing items
  reobserveClothingItems()
}

// Re-observe all clothing items from DOM
function reobserveClothingItems() {
  if (!intersectionObserver) return
  
  // Wait for DOM to be ready
  nextTick(() => {
    const clothingButtons = document.querySelectorAll('[data-cloth-id]')
    clothingButtons.forEach((el) => {
      const id = el.getAttribute('data-cloth-id')
      if (id && !loadedThumbnails.value.has(id)) {
        intersectionObserver?.observe(el)
      }
    })
  })
}

// Load thumbnail for a specific asset
async function loadThumbnailForAsset(assetId: string) {
  // Skip if already loaded
  if (loadedThumbnails.value.has(assetId)) {
    return
  }

  const asset = clothingOptions.value.find(c => c.id === assetId)
  if (!asset || asset.loaded) return

  try {
    const { loadAsset } = await import('@/utils/lazyClothingLoader')
    await loadAsset(asset)
    loadedThumbnails.value.add(assetId)
  } catch (error) {
    console.error(`Failed to load thumbnail for ${assetId}:`, error)
  }
}

// Clothing drag state
const clothTransform = ref<ClothingTransform>({
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  rotation: 0
})
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// Store the cutout image data
const cutoutImageData = ref<ImageData | null>(null)

onMounted(async () => {
  const canvas = canvasRef.value
  if (canvas) {
    ctx.value = canvas.getContext('2d', { willReadFrequently: true })
  }

  // Initialize clothing categories first
  clothingCategories.value = getClothingCategories()

  // Initialize Intersection Observer
  initIntersectionObserver()

  // Load default category directly (not through watch)
  await loadClothingForCategory('children-men')
  
  // Set default category after loading
  clothingCategory.value = 'children-men'
  mainCategory.value = 'children'
})

onUnmounted(() => {
  if (intersectionObserver) {
    intersectionObserver.disconnect()
  }
})

// Old function removed - using lazy loading instead
// async function initializeClothingAssets() { ... }

// Watch for clothing category changes to load assets lazily
let isInitialized = false
watch(clothingCategory, async (newCategory, oldCategory) => {
  // Skip initial load (handled by onMounted)
  if (!isInitialized) {
    isInitialized = true
    return
  }
  
  if (newCategory && (!oldCategory || newCategory !== oldCategory)) {
    // Disconnect observer when switching categories
    if (intersectionObserver) {
      intersectionObserver.disconnect()
    }
    // Clear loaded thumbnails for visual feedback
    loadedThumbnails.value.clear()

    await loadClothingForCategory(newCategory)
  }
})

// Watch for originalImage changes to initialize canvas
watch(originalImage, async (newImage) => {
  if (newImage) {
    await nextTick()
    await nextTick()

    const canvas = canvasRef.value

    if (canvas && !ctx.value) {
      ctx.value = canvas.getContext('2d', { willReadFrequently: true })
    }

    // Select default size to trigger render
    if (ctx.value && photoSizes.length > 0) {
      selectSize(photoSizes[0])
    }
  }
})

// loadImage function removed - using lazyClothingLoader instead

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  isLoading.value = true
  loadingMessage.value = '正在加载图片...'

  try {
    // Read file as DataURL
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    // Create image
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    
    await new Promise((resolve, reject) => {
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = dataUrl
    })

    // Reset state before setting new image
    cutoutImageData.value = null
    selectedSize.value = null
    selectedBg.value = null
    selectedCloth.value = null
    clothTransform.value = { offsetX: 0, offsetY: 0, scale: 1, rotation: 0 }
    clothScale.value = 1

    // Clear canvas
    const canvas = canvasRef.value
    if (canvas && ctx.value) {
      ctx.value.clearRect(0, 0, canvas.width, canvas.height)
      ctx.value = null
    }

    // Set new image
    originalImage.value = img
  } catch (error) {
    console.error('Error loading image:', error)
    alert('图片加载失败，请重试')
  } finally {
    isLoading.value = false
  }
}

const resetImage = () => {
  originalImage.value = null
  cutoutImageData.value = null
  selectedSize.value = null
  selectedBg.value = null
  selectedCloth.value = null
  clothTransform.value = { offsetX: 0, offsetY: 0, scale: 1, rotation: 0 }
  clothScale.value = 1

  // Clear canvas
  const canvas = canvasRef.value
  if (canvas && ctx.value) {
    ctx.value.clearRect(0, 0, canvas.width, canvas.height)
    ctx.value = null
  }
  
  // Reset file input value to allow re-uploading the same file
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const handleUploadClick = () => {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) {
    fileInput.click()
  }
}

const selectSize = (size: PhotoSize) => {
  selectedSize.value = size
  nextTick(() => {
    renderCanvas()
  })
}

const changeBackground = (bg: BackgroundColor) => {
  selectedBg.value = bg
  nextTick(() => {
    renderCanvas()
  })
}

const handleCustomBgColor = () => {
  selectedBg.value = { name: '自定义', color: customBgColor.value }
  nextTick(() => {
    renderCanvas()
  })
}

const changeClothing = async (cloth: LazyClothingAsset) => {
  if (selectedCloth.value?.id === cloth.id) {
    selectedCloth.value = null
  } else {
    // Load full image if not loaded yet (user clicked, need full resolution)
    if (!cloth.loaded) {
      isLoading.value = true
      loadingMessage.value = '正在加载服装...'
      try {
        const { loadAsset } = await import('@/utils/lazyClothingLoader')
        const loadedAsset = await loadAsset(cloth)
        if (loadedAsset) {
          selectedCloth.value = loadedAsset
          if (loadedAsset.image) {
            clothingImages.value.set(cloth.id, loadedAsset.image as HTMLCanvasElement)
          }
        }
      } catch (error) {
        console.error('Failed to load clothing:', error)
      } finally {
        isLoading.value = false
      }
    } else {
      selectedCloth.value = cloth as ClothingAsset
    }
    clothTransform.value = { offsetX: 0, offsetY: 0, scale: 1, rotation: 0 }
    clothScale.value = 1
  }
  nextTick(() => {
    renderCanvas()
  })
}

const resetClothingTransform = () => {
  clothTransform.value = { offsetX: 0, offsetY: 0, scale: 1, rotation: 0 }
  clothScale.value = 1
  nextTick(() => {
    renderCanvas()
  })
}

watch([clothTransform, clothScale], () => {
  nextTick(() => {
    renderCanvas()
  })
}, { deep: true })

// Canvas drag handlers
const getCanvasCoordinates = (e: MouseEvent | WheelEvent) => {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  }
}

const handleCanvasMouseDown = (e: MouseEvent) => {
  if (!selectedCloth) return
  e.preventDefault()
  isDragging.value = true
  const coords = getCanvasCoordinates(e)
  dragStart.value = { 
    x: coords.x - clothTransform.value.offsetX, 
    y: coords.y - clothTransform.value.offsetY 
  }
}

const handleCanvasMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !selectedCloth) return
  e.preventDefault()
  const coords = getCanvasCoordinates(e)
  clothTransform.value = {
    ...clothTransform.value,
    offsetX: coords.x - dragStart.value.x,
    offsetY: coords.y - dragStart.value.y
  }
}

const handleCanvasMouseUp = () => {
  isDragging.value = false
}

const handleCanvasWheel = (e: WheelEvent) => {
  if (!selectedCloth) return
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.05 : 0.05
  clothScale.value = Math.max(0.5, Math.min(2.0, clothScale.value + delta))
}

const renderCanvas = () => {
  if (!ctx.value || !originalImage.value || !selectedSize.value) {
    return
  }

  const canvas = canvasRef.value!
  const size = selectedSize.value
  const img = originalImage.value

  if (!img.complete || img.naturalWidth === 0) {
    return
  }

  canvas.width = size.width
  canvas.height = size.height

  // Calculate crop area
  const targetRatio = size.width / size.height
  const imgRatio = img.width / img.height

  let cropX = 0, cropY = 0, cropWidth = img.width, cropHeight = img.height

  if (imgRatio > targetRatio) {
    cropWidth = img.height * targetRatio
    cropX = (img.width - cropWidth) / 2
  } else {
    cropHeight = img.width / targetRatio
    cropY = (img.height - cropHeight) / 2
  }

  // Draw original image
  ctx.value.drawImage(
    img,
    cropX, cropY, cropWidth, cropHeight,
    0, 0, size.width, size.height
  )

  // Get image data for processing
  const imageData = ctx.value.getImageData(0, 0, size.width, size.height)
  const data = imageData.data
  const width = size.width
  const height = size.height

  // Create background mask
  const backgroundMask = createBackgroundMask(data, width, height)
  const featheredMask = applyFeathering(backgroundMask, width, height)

  // Apply the mask to make background transparent
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const maskValue = featheredMask[y * width + x]
      data[i + 3] = Math.round(data[i + 3] * maskValue)
    }
  }

  cutoutImageData.value = new ImageData(new Uint8ClampedArray(data), width, height)

  // Create temporary canvas for compositing
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = width
  tempCanvas.height = height
  const tempCtx = tempCanvas.getContext('2d')

  if (tempCtx) {
    tempCtx.putImageData(cutoutImageData.value, 0, 0)
    ctx.value.clearRect(0, 0, width, height)

    // Fill background color
    const bgColorValue = selectedBg.value?.color || '#FFFFFF'
    ctx.value.fillStyle = bgColorValue
    ctx.value.fillRect(0, 0, width, height)

    // Draw cutout on top of background
    ctx.value.drawImage(tempCanvas, 0, 0)
  }

  // Draw clothing overlay if selected
  if (selectedCloth.value) {
    drawClothingOverlay(size)
  }
}

const createBackgroundMask = (data: Uint8ClampedArray, width: number, height: number): boolean[] => {
  const mask: boolean[] = new Array(width * height).fill(false)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]

      if (a < 10) {
        mask[y * width + x] = true
        continue
      }

      const brightness = (r + g + b) / 3
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const saturation = max === 0 ? 0 : (max - min) / max
      const lightness = (max + min) / 2

      const isSkinTone = (
        r > 80 && g > 40 && b > 20 &&
        r > g && g > b &&
        r - g > 5 && r - g < 80 &&
        lightness > 60 && lightness < 220
      )

      const isHair = (
        brightness < 60 &&
        saturation < 0.3 &&
        r > 20 && g > 20 && b > 20
      )

      const isClothing = (
        saturation > 0.15 ||
        (brightness < 150 && saturation > 0.05)
      )

      let isEdge = false
      if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
        const leftIdx = ((y) * width + (x - 1)) * 4
        const rightIdx = ((y) * width + (x + 1)) * 4
        const topIdx = ((y - 1) * width + x) * 4
        const bottomIdx = ((y + 1) * width + x) * 4

        const leftBrightness = (data[leftIdx] + data[leftIdx + 1] + data[leftIdx + 2]) / 3
        const rightBrightness = (data[rightIdx] + data[rightIdx + 1] + data[rightIdx + 2]) / 3
        const topBrightness = (data[topIdx] + data[topIdx + 1] + data[topIdx + 2]) / 3
        const bottomBrightness = (data[bottomIdx] + data[bottomIdx + 1] + data[bottomIdx + 2]) / 3

        const brightnessVariance = Math.max(
          Math.abs(brightness - leftBrightness),
          Math.abs(brightness - rightBrightness),
          Math.abs(brightness - topBrightness),
          Math.abs(brightness - bottomBrightness)
        )

        isEdge = brightnessVariance > 40
      }

      const isBackground = (
        brightness > 200 &&
        saturation < 0.15 &&
        !isSkinTone &&
        !isHair &&
        !isClothing &&
        !isEdge
      )

      const isNearWhite = (
        r > 240 && g > 240 && b > 240 &&
        !isSkinTone &&
        !isHair
      )

      if (isBackground || isNearWhite) {
        mask[y * width + x] = true
      }
    }
  }

  return cleanUpMask(mask, width, height)
}

const cleanUpMask = (mask: boolean[], width: number, height: number): boolean[] => {
  let cleanedMask = [...mask]

  const erodedMask = [...cleanedMask]
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x
      if (mask[i]) {
        let backgroundCount = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!mask[(y + dy) * width + (x + dx)]) {
              backgroundCount++
            }
          }
        }
        if (backgroundCount >= 5) {
          erodedMask[i] = false
        }
      }
    }
  }
  cleanedMask = erodedMask

  const dilatedMask = [...cleanedMask]
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x
      if (!cleanedMask[i]) {
        let backgroundCount = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (cleanedMask[(y + dy) * width + (x + dx)]) {
              backgroundCount++
            }
          }
        }
        if (backgroundCount >= 6) {
          dilatedMask[i] = true
        }
      }
    }
  }

  return dilatedMask
}

const applyFeathering = (mask: boolean[], width: number, height: number): number[] => {
  const featheredMask: number[] = new Array(width * height).fill(0)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x

      if (mask[i]) {
        featheredMask[i] = 0
      } else {
        let minDistance = Infinity
        const searchRadius = 8
        for (let dy = -searchRadius; dy <= searchRadius; dy++) {
          for (let dx = -searchRadius; dx <= searchRadius; dx++) {
            const ny = y + dy
            const nx = x + dx
            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              if (mask[ny * width + nx]) {
                const distance = Math.sqrt(dx * dx + dy * dy)
                minDistance = Math.min(minDistance, distance)
              }
            }
          }
        }

        if (minDistance === Infinity) {
          featheredMask[i] = 1
        } else if (minDistance <= 2) {
          featheredMask[i] = 0.3 + (minDistance / 2) * 0.7
        } else {
          featheredMask[i] = 1
        }
      }
    }
  }

  return featheredMask
}

const drawClothingOverlay = (size: PhotoSize) => {
  if (!ctx.value || !selectedCloth.value) return

  const cloth = selectedCloth.value
  const drawCtx = ctx.value
  let clothingImage: HTMLImageElement | HTMLCanvasElement | undefined = clothingImages.value.get(cloth.id) as HTMLImageElement | HTMLCanvasElement

  // Fallback: use the image directly from selectedCloth if not in map
  if (!clothingImage && 'image' in cloth && cloth.image) {
    clothingImage = cloth.image
  }

  if (!clothingImage) return

  // Clothing dimensions based on generated asset
  const baseShoulderWidth = size.width * 0.6
  const baseClothingHeight = size.height * 0.32

  // Calculate center position
  let centerX = size.width / 2 + clothTransform.value.offsetX
  let neckBaseY = size.height * 0.50 + clothTransform.value.offsetY

  // Apply scale to body
  const shoulderWidth = baseShoulderWidth * clothScale.value
  const clothingHeight = baseClothingHeight * clothScale.value

  // Calculate draw dimensions
  const imgAspect = clothingImage.width / clothingImage.height
  const targetAspect = shoulderWidth / clothingHeight

  let drawWidth: number, drawHeight: number, drawX: number, drawY: number

  if (imgAspect > targetAspect) {
    drawHeight = clothingHeight * 1.15
    drawWidth = drawHeight * imgAspect
    drawX = centerX - drawWidth / 2
    drawY = neckBaseY - drawHeight * 0.2
  } else {
    drawWidth = shoulderWidth * 1.25
    drawHeight = drawWidth / imgAspect
    drawX = centerX - drawWidth / 2
    drawY = neckBaseY - drawHeight * 0.2
  }

  // Draw clothing image
  drawCtx.save()
  drawCtx.drawImage(clothingImage, drawX, drawY, drawWidth, drawHeight)
  drawCtx.restore()
}

const downloadPhoto = (format: 'png' | 'jpeg') => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  let mimeType = 'image/png'
  let quality = 1.0

  if (format === 'jpeg') {
    mimeType = 'image/jpeg'
    quality = 0.95
  }

  canvas.toBlob((blob) => {
    if (!blob) return

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    const sizeName = selectedSize.value?.name || '证件照'
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    link.download = `${sizeName}_${timestamp}.${format}`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, mimeType, quality)
}
</script>

<style scoped>
input[type="range"] {
  height: 0.5rem;
  background-color: rgb(229, 231, 235);
  border-radius: 0.5rem;
  appearance: none;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  width: 1rem;
  height: 1rem;
  background-color: rgb(37, 99, 235);
  border-radius: 0.5rem;
  appearance: none;
  cursor: pointer;
  transition: background-color 150ms;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background-color: rgb(29, 78, 216);
}

input[type="range"]::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  background-color: rgb(37, 99, 235);
  border-radius: 0.5rem;
  appearance: none;
  cursor: pointer;
  transition: background-color 150ms;
  border: 0;
}

input[type="range"]::-moz-range-thumb:hover {
  background-color: rgb(29, 78, 216);
}

.cursor-grab {
  cursor: grab !important;
}

.cursor-grabbing {
  cursor: grabbing !important;
}
</style>
