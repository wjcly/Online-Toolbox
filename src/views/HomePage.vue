<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <Wrench class="w-6 h-6 text-white" />
            </div>
            <h1 class="text-xl font-bold text-gray-900">ToolBox Pro</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold mb-4">在线工具集合</h2>
        <p class="text-blue-100 text-lg mb-8">
          一套强大的在线工具集，包含 21 个实用工具，全部在本地浏览器中运行
        </p>

        <!-- Search Bar -->
        <div class="max-w-xl mx-auto relative">
          <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索工具..."
            class="w-full pl-12 pr-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-wrap gap-2 justify-center">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
            selectedCategory === category.id
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          ]"
        >
          <component :is="getIcon(category.icon)" class="w-4 h-4" />
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Tools Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="tool in filteredTools"
          :key="tool.id"
          @click="navigateToTool(tool.path)"
          class="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200 group"
        >
          <div :class="`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`">
            <component :is="iconMap[tool.icon]" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ tool.name }}</h3>
          <p class="text-gray-500 text-sm">{{ tool.description }}</p>
        </div>
      </div>
      <div v-if="filteredTools.length === 0" class="text-center py-16">
        <Wrench class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">未找到匹配的工具</p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
        <p>© 2026 ToolBox Pro. 所有工具均在本地浏览器中运行。</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Grid,
  Globe,
  Shield,
  RefreshCw,
  Wrench,
  File,
  Link,
  Image,
  FileText,
  Palette,
  Code,
  Scan,
  Search,
  Key,
  Clock,
  Type,
  Lock,
  Hash,
  Calculator,
  GitCompare,
  Monitor,
} from 'lucide-vue-next'

const router = useRouter()
const selectedCategory = ref('all')
const searchQuery = ref('')

const tools = [
  {
    id: 'resume-builder',
    name: '简历编辑器',
    description: 'Markdown 简历编辑',
    icon: 'FileText',
    category: 'creator',
    path: '/resume',
    color: 'bg-emerald-500',
  },
  {
    id: 'web-scraper',
    name: '网页爬虫',
    description: '提取网页元素',
    icon: 'Globe',
    category: 'scraper',
    path: '/tools/web-scraper',
    color: 'bg-blue-500',
  },
  {
    id: 'link-checker',
    name: '404 检测',
    description: '检测死链',
    icon: 'Link',
    category: 'scraper',
    path: '/tools/link-checker',
    color: 'bg-red-500',
  },
  {
    id: 'watermark-remover',
    name: '去水印',
    description: '图片去水印',
    icon: 'Image',
    category: 'converter',
    path: '/tools/watermark-remover',
    color: 'bg-purple-500',
  },
  {
    id: 'format-converter',
    name: '格式转换',
    description: 'JSON/CSV/XML 转换',
    icon: 'FileText',
    category: 'converter',
    path: '/tools/format-converter',
    color: 'bg-green-500',
  },
  {
    id: 'color-picker',
    name: '取色器',
    description: '颜色拾取转换',
    icon: 'Palette',
    category: 'utility',
    path: '/tools/color-picker',
    color: 'bg-pink-500',
  },
  {
    id: 'password-manager',
    name: '密码管理器',
    description: 'AES-256 加密存储',
    icon: 'Lock',
    category: 'security',
    path: '/tools/password-manager',
    color: 'bg-indigo-500',
  },
  {
    id: 'office-viewer',
    name: 'Office 编辑',
    description: '在线编辑 Office 文档',
    icon: 'File',
    category: 'office',
    path: '/tools/office-viewer',
    color: 'bg-orange-500',
  },
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '格式化验证 JSON',
    icon: 'Code',
    category: 'utility',
    path: '/tools/json-formatter',
    color: 'bg-yellow-500',
  },
  {
    id: 'base64-converter',
    name: 'Base64 转换',
    description: 'Base64 编解码',
    icon: 'RefreshCw',
    category: 'utility',
    path: '/tools/base64-converter',
    color: 'bg-cyan-500',
  },
  {
    id: 'qr-generator',
    name: '二维码生成',
    description: '生成二维码',
    icon: 'Scan',
    category: 'utility',
    path: '/tools/qr-generator',
    color: 'bg-teal-500',
  },
  {
    id: 'word-counter',
    name: '字数统计',
    description: '字符统计',
    icon: 'Type',
    category: 'utility',
    path: '/tools/word-counter',
    color: 'bg-stone-500',
  },
  {
    id: 'text-cipher',
    name: '文本加密',
    description: '加密解密',
    icon: 'Key',
    category: 'security',
    path: '/tools/text-cipher',
    color: 'bg-violet-500',
  },
  {
    id: 'url-encoder',
    name: 'URL 编解码',
    description: 'URL 编码解码',
    icon: 'Link',
    category: 'utility',
    path: '/tools/url-encoder',
    color: 'bg-sky-500',
  },
  {
    id: 'password-generator',
    name: '密码生成器',
    description: '生成强密码',
    icon: 'Shield',
    category: 'security',
    path: '/tools/password-generator',
    color: 'bg-rose-500',
  },
  {
    id: 'timestamp-converter',
    name: '时间戳转换',
    description: '时间戳日期互转',
    icon: 'Clock',
    category: 'utility',
    path: '/tools/timestamp-converter',
    color: 'bg-amber-500',
  },
  {
    id: 'ip-checker',
    name: 'IP 查询',
    description: 'IP 地址查询',
    icon: 'Globe',
    category: 'utility',
    path: '/tools/ip-checker',
    color: 'bg-blue-600',
  },
  {
    id: 'hash-generator',
    name: '哈希生成',
    description: 'MD5/SHA 哈希',
    icon: 'Hash',
    category: 'security',
    path: '/tools/hash-generator',
    color: 'bg-fuchsia-500',
  },
  {
    id: 'text-diff',
    name: '文本对比',
    description: '比较文本差异',
    icon: 'GitCompare',
    category: 'utility',
    path: '/tools/text-diff',
    color: 'bg-lime-500',
  },
  {
    id: 'random-number',
    name: '随机数生成',
    description: '生成随机数',
    icon: 'Calculator',
    category: 'utility',
    path: '/tools/random-number',
    color: 'bg-indigo-500',
  },
  {
    id: 'fullscreen-clock',
    name: '全屏时钟',
    description: '全屏显示时间',
    icon: 'Monitor',
    category: 'utility',
    path: '/tools/fullscreen-clock',
    color: 'bg-neutral-500',
  },
]

const categories = [
  { id: 'all', name: '全部', icon: 'Grid' },
  { id: 'creator', name: '创作', icon: 'FileText' },
  { id: 'scraper', name: '爬虫', icon: 'Globe' },
  { id: 'security', name: '安全', icon: 'Shield' },
  { id: 'converter', name: '转换', icon: 'RefreshCw' },
  { id: 'utility', name: '工具', icon: 'Wrench' },
  { id: 'office', name: '办公', icon: 'File' },
]

const iconMap: Record<string, any> = {
  Grid,
  Globe,
  Shield,
  RefreshCw,
  Wrench,
  File,
  Link,
  Image,
  FileText,
  Palette,
  Code,
  Scan,
  Key,
  Clock,
  Type,
  Lock,
  Hash,
  Calculator,
  GitCompare,
  Monitor,
}

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Grid
}

const filteredTools = computed(() => {
  return tools.filter((tool) => {
    const matchesCategory = selectedCategory.value === 'all' || tool.category === selectedCategory.value
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const navigateToTool = (path: string) => {
  router.push(path)
}
</script>
