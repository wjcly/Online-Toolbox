<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">工作成就量化器</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-2">将模糊的工作描述转换为量化的成就</h2>
        <p class="text-gray-500 text-sm mb-6">输入你的工作内容，选择量化维度，生成有说服力的简历描述</p>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">原始工作描述</label>
          <textarea
            v-model="inputDescription"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例如：负责公司网站的后端开发，优化了系统性能"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">量化维度</label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button
              v-for="dim in dimensions"
              :key="dim.id"
              @click="toggleDimension(dim.id)"
              :class="selectedDimensions.has(dim.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {{ dim.icon }} {{ dim.name }}
            </button>
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="generate" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            生成量化描述
          </button>
          <button @click="reset" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            重置
          </button>
        </div>
      </div>

      <div v-if="generatedResults.length > 0" class="bg-white rounded-xl p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">生成的量化成就描述</h2>
        
        <div class="space-y-4">
          <div v-for="(result, index) in generatedResults" :key="index" class="border rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div class="flex items-start justify-between mb-2">
              <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">{{ result.type }}</span>
              <button @click="copyToClipboard(result.text)" class="text-gray-400 hover:text-gray-600">
                <Copy class="w-4 h-4" />
              </button>
            </div>
            <p class="text-gray-800">{{ result.text }}</p>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button @click="copyAll" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <Copy class="w-4 h-4" />
            复制全部
          </button>
        </div>
      </div>

      <!-- Templates & Tips -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-3">📝 常用量化模板</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-start gap-2">
              <span class="text-blue-500">•</span>
              <span>通过 [技术/方法]，将 [指标] 从 X 提升到 Y，增幅 Z%</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500">•</span>
              <span>主导 [项目]，在 [时间] 内完成，节省成本 X 元</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500">•</span>
              <span>优化 [流程]，减少 [时间/人力] 投入 X%，效率提升 Y%</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500">•</span>
              <span>负责 [模块]，支持日均 X 万请求，可用性达 99.9%</span>
            </li>
          </ul>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-3">💡 量化指标参考</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">性能提升</span>
              <span class="text-green-600">10% - 300%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">成本节省</span>
              <span class="text-green-600">5 万 - 100 万+</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">效率提升</span>
              <span class="text-green-600">20% - 80%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">用户增长</span>
              <span class="text-green-600">1 万 - 500 万+</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">可用性</span>
              <span class="text-green-600">99.5% - 99.99%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Copy } from 'lucide-vue-next'
import { toast } from '@/utils/toast'

const inputDescription = ref('')
const selectedDimensions = ref(new Set<string>())

const dimensions = [
  { id: 'percentage', name: '百分比', icon: '%' },
  { id: 'number', name: '数量', icon: '#' },
  { id: 'time', name: '时间', icon: '⏱' },
  { id: 'money', name: '金额', icon: '¥' },
  { id: 'efficiency', name: '效率', icon: '⚡' },
  { id: 'quality', name: '质量', icon: '✓' },
]

const generatedResults = ref<Array<{ type: string; text: string }>>([])

const toggleDimension = (id: string) => {
  if (selectedDimensions.value.has(id)) {
    selectedDimensions.value.delete(id)
  } else {
    selectedDimensions.value.add(id)
  }
}

const generate = () => {
  if (!inputDescription.value.trim()) {
    toast.error('请输入工作描述')
    return
  }

  const results: Array<{ type: string; text: string }> = []
  const dims = Array.from(selectedDimensions.value)

  if (dims.length === 0) {
    // Generate all types
    generatePercentage(results)
    generateNumber(results)
    generateTime(results)
    generateMoney(results)
    generateEfficiency(results)
    generateQuality(results)
  } else {
    if (dims.includes('percentage')) generatePercentage(results)
    if (dims.includes('number')) generateNumber(results)
    if (dims.includes('time')) generateTime(results)
    if (dims.includes('money')) generateMoney(results)
    if (dims.includes('efficiency')) generateEfficiency(results)
    if (dims.includes('quality')) generateQuality(results)
  }

  generatedResults.value = results
}

const generatePercentage = (results: Array<{ type: string; text: string }>) => {
  const templates = [
    `通过优化技术方案，将系统性能提升了 50%，用户满意度提高 30%`,
    `主导项目重构，代码复用率提升 60%，开发效率提升 40%`,
    `优化数据库查询，响应时间减少 70%，并发能力提升 100%`,
    `改进部署流程，上线时间缩短 80%，错误率降低 90%`,
  ]
  results.push({ type: '百分比量化', text: templates[Math.floor(Math.random() * templates.length)] })
}

const generateNumber = (results: Array<{ type: string; text: string }>) => {
  const templates = [
    `负责核心模块开发，支撑日均 100 万 + 用户访问`,
    `主导 5 个微服务的设计与实现，管理 10+ 张核心数据表`,
    `完成 20+ 个功能模块开发，编写 100+ 个单元测试`,
    `优化 15 个关键接口，处理数据量达 1000 万 + 条`,
  ]
  results.push({ type: '数量量化', text: templates[Math.floor(Math.random() * templates.length)] })
}

const generateTime = (results: Array<{ type: string; text: string }>) => {
  const templates = [
    `在 2 周内完成原本需要 1 个月的开发任务，提前 50% 交付`,
    `将系统部署时间从 2 小时缩短至 15 分钟`,
    `3 天内定位并解决线上紧急问题，减少业务损失 100 万+`,
    `连续 6 个月保持零线上事故，系统可用性 99.99%`,
  ]
  results.push({ type: '时间量化', text: templates[Math.floor(Math.random() * templates.length)] })
}

const generateMoney = (results: Array<{ type: string; text: string }>) => {
  const templates = [
    `通过技术优化，为公司节省服务器成本 50 万/年`,
    `主导自研系统开发，替代外部采购，节省 200 万+`,
    `优化资源使用，月度云成本从 10 万降至 5 万`,
    `通过性能优化，减少带宽支出 30 万/年`,
  ]
  results.push({ type: '金额量化', text: templates[Math.floor(Math.random() * templates.length)] })
}

const generateEfficiency = (results: Array<{ type: string; text: string }>) => {
  const templates = [
    `开发自动化脚本，将重复性工作从 2 天减少到 1 小时`,
    `搭建 CI/CD 流水线，发布频率从每周 1 次提升到每天 10 次`,
    `引入代码审查机制，Bug 率降低 60%，返工减少 40%`,
    `建立组件库，新功能开发效率提升 3 倍`,
  ]
  results.push({ type: '效率量化', text: templates[Math.floor(Math.random() * templates.length)] })
}

const generateQuality = (results: Array<{ type: string; text: string }>) => {
  const templates = [
    `负责模块单元测试覆盖率 95%+，线上零故障`,
    `代码审查通过率 100%，获团队技术标杆奖`,
    `主导的技术方案被 3 个产品线采用，成为公司标准`,
    `获得 2 项技术专利，发表 5 篇技术博客`,
  ]
  results.push({ type: '质量量化', text: templates[Math.floor(Math.random() * templates.length)] })
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

const copyAll = () => {
  const allText = generatedResults.value.map(r => r.text).join('\n')
  navigator.clipboard.writeText(allText)
}

const reset = () => {
  inputDescription.value = ''
  selectedDimensions.value.clear()
  generatedResults.value = []
}
</script>
