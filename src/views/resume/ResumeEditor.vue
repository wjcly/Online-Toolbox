<template>
  <div class="h-screen flex flex-col bg-[#1a1f2e]">
    <!-- Top Header -->
    <header class="bg-[#1a1f2e] border-b border-gray-700 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="$router.push('/')" class="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white" title="返回主页">
          <ArrowLeft :size="18" />
        </button>
        <div class="w-px h-6 bg-gray-600"></div>
        <div class="flex items-center gap-1">
          <button
            @click="viewMode = 'split'"
            :class="['p-2 rounded-lg flex items-center gap-1.5 text-sm', viewMode === 'split' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800']"
            title="分屏显示"
          >
            <Split :size="16" />
          </button>
          <button
            @click="viewMode = 'editor'"
            :class="['p-2 rounded-lg flex items-center gap-1.5 text-sm', viewMode === 'editor' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800']"
            title="仅编辑器"
          >
            <FileText :size="16" />
          </button>
          <button
            @click="viewMode = 'preview'"
            :class="['p-2 rounded-lg flex items-center gap-1.5 text-sm', viewMode === 'preview' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800']"
            title="仅预览"
          >
            <Eye :size="16" />
          </button>
        </div>
        <div class="w-px h-6 bg-gray-600"></div>
        <div class="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
          <button
            @click="editorMode = 'markdown'"
            :class="['px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm transition-all', editorMode === 'markdown' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white']"
          >
            <Code :size="14" /> Markdown
          </button>
          <button
            @click="editorMode = 'content'"
            :class="['px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm transition-all', editorMode === 'content' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white']"
          >
            <Pencil :size="14" /> 内容编辑
          </button>
        </div>
        <div class="w-px h-6 bg-gray-600"></div>
        <div class="relative">
          <button @click="showFileMenu = !showFileMenu" class="flex items-center gap-1.5 px-3 py-1.5 text-sm text-orange-400 hover:bg-gray-800 rounded-lg">
            <Upload :size="14" /> 导入/导出
          </button>
          <div v-if="showFileMenu" class="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 min-w-[160px] z-50">
            <div class="px-3 py-2 text-xs text-gray-500 border-b border-gray-700">导入</div>
            <button @click="importMarkdown" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
              <FileUp :size="14" /> 导入 Markdown
            </button>
            <div class="px-3 py-2 text-xs text-gray-500 border-t border-b border-gray-700 mt-1">导出</div>
            <button @click="exportMarkdown" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
              <FileDown :size="14" /> 导出 Markdown
            </button>
            <button @click="exportPDF" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
              <FileDown :size="14" /> 导出 PDF
            </button>
            <button @click="exportImage" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
              <Image :size="14" /> 导出图片
            </button>
          </div>
        </div>
        <button @click="showTemplatePanel = true" class="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800 rounded-lg font-medium">
          <LayoutTemplate :size="14" /> 简历模板
        </button>
      </div>
      <div class="flex items-center gap-3">
        <button @click="showThemePanel = true" class="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800 rounded-lg">
          <Palette :size="14" /> 主题
        </button>
        <div class="flex items-center gap-2">
          <button @click="zoom = Math.max(50, zoom - 10)" class="p-2 text-gray-400 hover:bg-gray-800 rounded-lg">
            <Minus :size="16" />
          </button>
          <span class="text-sm text-gray-400 w-12 text-center">{{ zoom }}%</span>
          <button @click="zoom = Math.min(150, zoom + 10)" class="p-2 text-gray-400 hover:bg-gray-800 rounded-lg">
            <Plus :size="16" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden">
      <div v-if="viewMode === 'split'" class="h-full grid grid-cols-2 gap-0">
        <div class="h-full overflow-hidden border-r border-gray-700">
          <MarkdownEditor v-if="editorMode === 'markdown'" v-model="markdownContent" />
          <RichTextEditor v-else v-model:html="htmlContent" />
        </div>
        <div class="h-full overflow-hidden" ref="previewRef">
          <MarkdownPreview :content="markdownContent" :theme-color="themeColor" :template="currentTemplate" />
        </div>
      </div>
      <div v-else-if="viewMode === 'editor'" class="h-full overflow-hidden">
        <MarkdownEditor v-if="editorMode === 'markdown'" v-model="markdownContent" />
        <RichTextEditor v-else v-model:html="htmlContent" />
      </div>
      <div v-else class="h-full overflow-hidden bg-white">
        <MarkdownPreview :content="markdownContent" :theme-color="themeColor" :template="currentTemplate" />
      </div>
    </div>

    <!-- Template Panel -->
    <div v-if="showTemplatePanel" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">选择简历模板</h2>
          <button @click="showTemplatePanel = false" class="text-gray-400 hover:text-white">
            <X :size="24" />
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="template in templates"
            :key="template.id"
            @click="selectTemplate(template.id)"
            :class="['p-4 rounded-lg cursor-pointer transition-all', currentTemplate === template.id ? 'bg-blue-600 ring-2 ring-white' : 'bg-gray-700 hover:bg-gray-600']"
          >
            <div :class="['w-full h-32 rounded-lg mb-3 bg-gradient-to-br', template.color]"></div>
            <h3 class="text-white font-medium">{{ template.name }}</h3>
            <p class="text-gray-400 text-sm mt-1">{{ template.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Theme Panel -->
    <div v-if="showThemePanel" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">主题设置</h2>
          <button @click="showThemePanel = false" class="text-gray-400 hover:text-white">
            <X :size="24" />
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-2">主题颜色</label>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="color in colors"
                :key="color"
                @click="themeColor = color"
                :class="['w-10 h-10 rounded-lg transition-all', currentThemeColor === color ? 'ring-2 ring-white' : '']"
                :style="{ backgroundColor: color }"
              ></button>
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">字体</label>
            <select v-model="fontFamily" class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
              <option value="-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, sans-serif">默认字体</option>
              <option value="Georgia, &quot;Times New Roman&quot;, serif">衬线字体</option>
              <option value="Arial, Helvetica, sans-serif">Arial</option>
              <option value="&quot;Fira Code&quot;, &quot;JetBrains Mono&quot;, monospace">等宽字体</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  ArrowLeft, Split, FileText, Eye, Code, Pencil, Upload, FileUp, FileDown, Image,
  LayoutTemplate, Palette, X, Minus, Plus
} from 'lucide-vue-next'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import RichTextEditor from '@/components/RichTextEditor.vue'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const viewMode = ref<'split' | 'editor' | 'preview'>('split')
const editorMode = ref<'markdown' | 'content'>('markdown')
const showFileMenu = ref(false)
const showTemplatePanel = ref(false)
const showThemePanel = ref(false)
const zoom = ref(100)
const markdownContent = ref(`# 你的姓名

## 基本信息
- 📧 email@example.com
- 📱 138-0000-0000
- 📍 城市

## 工作经历

### 公司名称 | 职位
**2020-至今**

- 工作内容描述
- 负责的项目
- 取得的成就

## 项目经验

### 项目名称

项目描述和技术栈

## 技能清单

- 编程语言：Java, Python, JavaScript
- 框架：Spring, Vue, React
`)
const htmlContent = ref('')
const currentTemplate = ref('modern')
const themeColor = ref('#2563eb')
const fontFamily = ref('-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif')

const templates = [
  { id: 'modern', name: '现代', color: 'from-blue-500 to-blue-600', description: '简洁现代风格' },
  { id: 'classic', name: '经典', color: 'from-slate-600 to-slate-700', description: '传统商务风格' },
  { id: 'minimal', name: '简约', color: 'from-emerald-500 to-teal-600', description: '极简设计风格' },
  { id: 'professional', name: '专业', color: 'from-indigo-500 to-indigo-600', description: '专业严谨风格' },
  { id: 'creative', name: '创意', color: 'from-purple-500 to-pink-500', description: '创意设计风格' },
  { id: 'elegant', name: '优雅', color: 'from-rose-400 to-pink-500', description: '优雅知性风格' },
  { id: 'bold', name: '醒目', color: 'from-orange-500 to-red-600', description: '醒目突出风格' },
  { id: 'tech', name: '极客', color: 'from-green-500 to-emerald-600', description: '程序员风格' },
]

const colors = ['#2563eb', '#059669', '#7c3aed', '#dc2626', '#ea580c', '#0891b2', '#7c3aed', '#db2777']

const currentThemeColor = computed(() => themeColor.value)

const selectTemplate = (id: string) => {
  currentTemplate.value = id
  showTemplatePanel.value = false
}

const importMarkdown = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.md,.txt'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        markdownContent.value = event.target?.result as string
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

const exportMarkdown = () => {
  const blob = new Blob([markdownContent.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'resume.md'
  a.click()
  URL.revokeObjectURL(url)
}

const exportPDF = async () => {
  const element = document.querySelector('.markdown-preview') as HTMLElement
  if (!element) return
  
  const canvas = await html2canvas(element, { scale: 2 })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const imgWidth = 210
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
  pdf.save('resume.pdf')
}

const exportImage = async () => {
  const element = document.querySelector('.markdown-preview') as HTMLElement
  if (!element) return
  
  const canvas = await html2canvas(element, { scale: 2 })
  const link = document.createElement('a')
  link.download = 'resume.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

watch(editorMode, (newMode) => {
  if (newMode === 'content' && !htmlContent.value) {
    // Convert markdown to HTML when switching to content mode
    htmlContent.value = markdownContent.value
  }
})
</script>
