<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <Wrench class="w-6 h-6 text-white" />
            </div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">ToolBox Pro</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <div class="bg-white dark:bg-gray-800 py-16 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">在线工具集合</h2>
        <p class="text-gray-600 dark:text-gray-400 text-lg mb-8">
          一套强大的在线工具集，包含 {{ tools.length }} 个实用工具，全部在本地浏览器中运行
        </p>

        <!-- Search Bar -->
        <div class="max-w-xl mx-auto relative">
          <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索工具..."
            class="w-full pl-12 pr-4 py-3 rounded-full text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          ]"
        >
          <component :is="iconMap[category.icon]" class="w-4 h-4" />
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
          class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 group"
        >
          <div :class="`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`">
            <component :is="iconMap[tool.icon]" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ tool.name }}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{{ tool.description }}</p>
        </div>
      </div>
      <div v-if="filteredTools.length === 0" class="text-center py-16">
        <Wrench class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400 text-lg">未找到匹配的工具</p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© 2026 ToolBox Pro. 所有工具均在本地浏览器中运行。</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import {
  Grid,
  Shield,
  RefreshCw,
  Wrench,
  File,
  Image,
  FileText,
  Palette,
  Code,
  Scan,
  Key,
  Lock,
  Calculator,
  GitCompare,
  Monitor,
  Hash,
  Link,
  Globe,
  Timer,
  Ruler,
  Scale,
  Type,
  CaseSensitive,
  QrCode,
  Binary,
  Coins,
  Percent,
  Crop,
  Tags,
  Calendar,
  User,
  MessageSquare,
  Github,
  Linkedin,
  Sparkles,
  Shirt,
  Search,
  Volume2,
  PenTool,
  Eye,
  ScanText,
  Disc,
  CalendarDays
} from 'lucide-vue-next'

const selectedCategory = ref('all')
const searchQuery = ref('')

const tools = [
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
    id: 'background-remover',
    name: '背景去除',
    description: '批量去除图片背景',
    icon: 'Crop',
    category: 'converter',
    path: '/tools/background-remover',
    color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
  },
  {
    id: 'id-photo-maker',
    name: '证件照制作',
    description: '裁剪换底换服装',
    icon: 'User',
    category: 'converter',
    path: '/tools/id-photo-maker',
    color: 'bg-blue-600',
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
    description: '编辑 Office 文档',
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
    icon: 'FileText',
    category: 'utility',
    path: '/tools/word-counter',
    color: 'bg-gray-500',
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
    color: 'bg-cyan-500',
  },
  {
    id: 'password-generator',
    name: '密码生成器',
    description: '生成强密码',
    icon: 'Key',
    category: 'security',
    path: '/tools/password-generator',
    color: 'bg-rose-500',
  },
  {
    id: 'timestamp-converter',
    name: '时间戳转换',
    description: '时间戳日期互转',
    icon: 'Globe',
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
    color: 'bg-pink-500',
  },
  {
    id: 'text-diff',
    name: '文本对比',
    description: '比较文本差异',
    icon: 'GitCompare',
    category: 'utility',
    path: '/tools/text-diff',
    color: 'bg-green-500',
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
    color: 'bg-gray-600',
  },
  {
    id: 'uuid-generator',
    name: 'UUID 生成器',
    description: '生成 UUID/GUID',
    icon: 'Binary',
    category: 'utility',
    path: '/tools/uuid-generator',
    color: 'bg-slate-500',
  },
  {
    id: 'lorem-ipsum',
    name: '占位文本生成',
    description: '生成 Lorem Ipsum',
    icon: 'Type',
    category: 'creator',
    path: '/tools/lorem-ipsum',
    color: 'bg-stone-500',
  },
  {
    id: 'case-converter',
    name: '大小写转换',
    description: '文本大小写转换',
    icon: 'CaseSensitive',
    category: 'utility',
    path: '/tools/case-converter',
    color: 'bg-lime-500',
  },
  {
    id: 'unit-converter',
    name: '单位换算',
    description: '长度/重量/温度转换',
    icon: 'Scale',
    category: 'converter',
    path: '/tools/unit-converter',
    color: 'bg-emerald-600',
  },
  {
    id: 'pomodoro',
    name: '番茄钟',
    description: '25 分钟工作法',
    icon: 'Timer',
    category: 'utility',
    path: '/tools/pomodoro',
    color: 'bg-orange-500',
  },
  {
    id: 'percentage-calc',
    name: '百分比计算器',
    description: '百分比计算',
    icon: 'Percent',
    category: 'utility',
    path: '/tools/percentage-calc',
    color: 'bg-teal-500',
  },
  {
    id: 'currency-converter',
    name: '货币换算',
    description: '汇率换算',
    icon: 'Coins',
    category: 'converter',
    path: '/tools/currency-converter',
    color: 'bg-yellow-600',
  },
  {
    id: 'qr-scanner',
    name: '二维码解码',
    description: '扫描二维码解码',
    icon: 'QrCode',
    category: 'utility',
    path: '/tools/qr-scanner',
    color: 'bg-cyan-600',
  },
  {
    id: 'skill-tag',
    name: '技能标签生成',
    description: '快速生成技能标签',
    icon: 'Tags',
    category: 'creator',
    path: '/tools/skill-tag',
    color: 'bg-indigo-500',
  },
  {
    id: 'achievement-quantifier',
    name: '成就量化器',
    description: '工作成就量化描述',
    icon: 'Calendar',
    category: 'creator',
    path: '/tools/achievement-quantifier',
    color: 'bg-amber-500',
  },
  {
    id: 'contact-formatter',
    name: '联系方式格式化',
    description: '简历联系方式整理',
    icon: 'User',
    category: 'creator',
    path: '/tools/contact-formatter',
    color: 'bg-teal-500',
  },
  {
    id: 'date-format',
    name: '日期格式转换',
    description: '工作时间格式转换',
    icon: 'Calendar',
    category: 'utility',
    path: '/tools/date-format',
    color: 'bg-blue-500',
  },
  {
    id: 'diagram-editor',
    name: '流程图编辑器',
    description: '绘制各种图表',
    icon: 'PenTool',
    category: 'creator',
    path: '/tools/diagram-editor',
    color: 'bg-purple-600',
  },
  {
    id: 'tts-generator',
    name: 'TTS 语音生成',
    description: '文本转语音工具',
    icon: 'Volume2',
    category: 'utility',
    path: '/tools/tts-generator',
    color: 'bg-emerald-500',
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: '正则表达式在线测试',
    icon: 'Code',
    category: 'utility',
    path: '/tools/regex-tester',
    color: 'bg-indigo-500',
  },
  {
    id: 'nickname-generator',
    name: '网名生成器',
    description: '生成创意网名昵称',
    icon: 'Sparkles',
    category: 'creator',
    path: '/tools/nickname-generator',
    color: 'bg-gradient-to-r from-pink-500 to-rose-600',
  },
  {
    id: 'comment-generator',
    name: '评论生成器',
    description: '生成专业评论和反馈',
    icon: 'MessageSquare',
    category: 'creator',
    path: '/tools/comment-generator',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
  },
  {
    id: 'slacking-tool',
    name: '摸鱼神器',
    description: '假装在工作神器',
    icon: 'Eye',
    category: 'utility',
    path: '/tools/slacking-tool',
    color: 'bg-gradient-to-r from-red-600 to-orange-600',
  },
  {
    id: 'ocr-recognizer',
    name: 'OCR 文本识别',
    description: '图片文字识别提取',
    icon: 'ScanText',
    category: 'utility',
    path: '/tools/ocr-recognizer',
    color: 'bg-gradient-to-r from-cyan-500 to-blue-600',
  },
  {
    id: 'favicon-generator',
    name: 'Favicon 生成器',
    description: '生成多尺寸网站图标',
    icon: 'Image',
    category: 'utility',
    path: '/tools/favicon-generator',
    color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
  },
  {
    id: 'svg-editor',
    name: 'SVG 编辑器',
    description: 'SVG 编辑与优化器',
    icon: 'PenTool',
    category: 'creator',
    path: '/tools/svg-editor',
    color: 'bg-gradient-to-r from-purple-500 to-pink-600',
  },
  {
    id: 'random-tools',
    name: '随机小工具',
    description: '抛硬币/掷骰子/轮盘/抽签',
    icon: 'Coins',
    category: 'utility',
    path: '/tools/random-tools',
    color: 'bg-gradient-to-r from-amber-500 to-orange-600',
  },
  {
    id: 'music-searcher',
    name: '音乐搜索器',
    description: '网易云音乐搜索播放',
    icon: 'Disc',
    category: 'utility',
    path: '/tools/music-searcher',
    color: 'bg-gradient-to-r from-pink-500 to-rose-600',
  },
  {
    id: 'calendar',
    name: '日历万年历',
    description: '在线日历和万年历查询',
    icon: 'CalendarDays',
    category: 'utility',
    path: '/tools/calendar',
    color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
  },
]

const categories = [
  { id: 'all', name: '全部', icon: 'Grid' },
  { id: 'creator', name: '创作', icon: 'FileText' },
  { id: 'security', name: '安全', icon: 'Shield' },
  { id: 'converter', name: '转换', icon: 'RefreshCw' },
  { id: 'utility', name: '工具', icon: 'Wrench' },
  { id: 'office', name: '办公', icon: 'File' },
]

const iconMap: Record<string, any> = {
  Grid,
  Shield,
  RefreshCw,
  Wrench,
  File,
  Image,
  FileText,
  Palette,
  Code,
  Scan,
  Key,
  Lock,
  Calculator,
  GitCompare,
  Monitor,
  Hash,
  Link,
  Globe,
  Timer,
  Ruler,
  Scale,
  Type,
  CaseSensitive,
  QrCode,
  Binary,
  Coins,
  Percent,
  Crop,
  Tags,
  Calendar,
  User,
  MessageSquare,
  Github,
  Linkedin,
  Sparkles,
  Shirt,
  PenTool,
  Search,
  Volume2,
  Eye,
  ScanText,
  Disc,
  CalendarDays
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
  window.location.href = path
}
</script>
