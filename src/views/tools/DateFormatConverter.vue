<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">日期格式转换工具</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Input Section -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">选择日期</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
                <input v-model="startDate" type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
                <input v-model="endDate" type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">快速选择</h2>
            
            <div class="grid grid-cols-2 gap-2">
              <button @click="setPreset('today')" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                今天
              </button>
              <button @click="setPreset('thisWeek')" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                本周
              </button>
              <button @click="setPreset('thisMonth')" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                本月
              </button>
              <button @click="setPreset('thisYear')" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                今年
              </button>
              <button @click="setPreset('lastMonth')" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                上月
              </button>
              <button @click="setPreset('lastYear')" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                去年
              </button>
              <button @click="setPreset('3months')" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                近 3 个月
              </button>
              <button @click="setPreset('6months')" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                近 6 个月
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">工作时间段计算</h2>
            
            <div v-if="durationInfo" class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">总天数</span>
                <span class="font-medium">{{ durationInfo.days }} 天</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">总周数</span>
                <span class="font-medium">{{ durationInfo.weeks }} 周</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">总月数</span>
                <span class="font-medium">{{ durationInfo.months }} 个月</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">总年数</span>
                <span class="font-medium">{{ durationInfo.years }} 年</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">简历描述</span>
                <span class="font-medium text-blue-600">{{ durationInfo.resumeFormat }}</span>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-gray-400">
              选择开始和结束日期后自动计算
            </div>
          </div>
        </div>

        <!-- Output Section -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-semibold mb-4">输出格式</h2>
          
          <div v-if="startDate" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">YYYY-MM-DD</label>
              <div class="flex gap-2">
                <input readonly :value="formats.ymd" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                <button @click="copyToClipboard(formats.ymd)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  <Copy class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">YYYY/MM/DD</label>
              <div class="flex gap-2">
                <input readonly :value="formats.ymdSlash" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                <button @click="copyToClipboard(formats.ymdSlash)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  <Copy class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">YYYY 年 MM 月 DD 日</label>
              <div class="flex gap-2">
                <input readonly :value="formats.chinese" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                <button @click="copyToClipboard(formats.chinese)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  <Copy class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">MM/DD/YYYY (美式)</label>
              <div class="flex gap-2">
                <input readonly :value="formats.us" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                <button @click="copyToClipboard(formats.us)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  <Copy class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">DD/MM/YYYY (欧式)</label>
              <div class="flex gap-2">
                <input readonly :value="formats.eu" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                <button @click="copyToClipboard(formats.eu)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  <Copy class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">YYYY.MM.DD</label>
              <div class="flex gap-2">
                <input readonly :value="formats.dot" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                <button @click="copyToClipboard(formats.dot)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  <Copy class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">YYYY-MM</label>
              <div class="flex gap-2">
                <input readonly :value="formats.ym" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                <button @click="copyToClipboard(formats.ym)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  <Copy class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">YYYY 年 MM 月</label>
              <div class="flex gap-2">
                <input readonly :value="formats.ymChinese" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                <button @click="copyToClipboard(formats.ymChinese)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  <Copy class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div v-if="endDate">
              <label class="block text-sm font-medium text-gray-700 mb-1">时间段格式</label>
              <div class="flex gap-2">
                <input readonly :value="formats.range" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                <button @click="copyToClipboard(formats.range)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  <Copy class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Unix 时间戳 (秒)</label>
              <div class="flex gap-2">
                <input readonly :value="formats.timestamp" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm font-mono" />
                <button @click="copyToClipboard(formats.timestamp)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  <Copy class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-16">
            <Calendar class="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p class="text-gray-400">选择日期后查看格式</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, Copy, Calendar } from 'lucide-vue-next'

const startDate = ref('')
const endDate = ref('')

const formatDate = (dateStr: string) => {
  if (!dateStr) return null
  return new Date(dateStr)
}

const formatNumber = (num: number) => num.toString().padStart(2, '0')

const formats = computed(() => {
  const start = formatDate(startDate.value)
  const end = formatDate(endDate.value)

  if (!start) return { ymd: '', ymdSlash: '', chinese: '', us: '', eu: '', dot: '', ym: '', ymChinese: '', range: '', timestamp: '' }

  const y = start.getFullYear()
  const m = formatNumber(start.getMonth() + 1)
  const d = formatNumber(start.getDate())

  const endY = end?.getFullYear()
  const endM = end ? formatNumber(end.getMonth() + 1) : null

  return {
    ymd: `${y}-${m}-${d}`,
    ymdSlash: `${y}/${m}/${d}`,
    chinese: `${y}年${m}月${d}日`,
    us: `${m}/${d}/${y}`,
    eu: `${d}/${m}/${y}`,
    dot: `${y}.${m}.${d}`,
    ym: `${y}-${m}`,
    ymChinese: `${y}年${m}月`,
    range: end ? `${y}.${m} - ${endY}.${endM}` : '',
    timestamp: Math.floor(start.getTime() / 1000).toString(),
  }
})

const durationInfo = computed(() => {
  const start = formatDate(startDate.value)
  const end = formatDate(endDate.value)
  
  if (!start || !end) return null
  
  const diffTime = end.getTime() - start.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return null
  
  const weeks = Math.floor(diffDays / 7)
  const months = Math.floor(diffDays / 30)
  const years = Math.floor(diffDays / 365)
  
  let resumeFormat = ''
  if (years > 0 && months > 0) {
    resumeFormat = `${years}年${Math.floor(months % 12)}个月`
  } else if (years > 0) {
    resumeFormat = `${years}年`
  } else if (months > 0) {
    resumeFormat = `${months}个月`
  } else if (weeks > 0) {
    resumeFormat = `${weeks}周`
  } else {
    resumeFormat = `${diffDays}天`
  }
  
  return {
    days: diffDays,
    weeks,
    months,
    years,
    resumeFormat,
  }
})

const setPreset = (preset: string) => {
  const now = new Date()
  const start = new Date()
  const end = new Date()
  
  switch (preset) {
    case 'today':
      break
    case 'thisWeek':
      start.setDate(now.getDate() - now.getDay())
      break
    case 'thisMonth':
      start.setDate(1)
      break
    case 'thisYear':
      start.setMonth(0, 1)
      break
    case 'lastMonth':
      start.setMonth(now.getMonth() - 1, 1)
      start.setDate(now.getDate() > 28 ? 28 : now.getDate())
      end.setMonth(now.getMonth(), 0)
      break
    case 'lastYear':
      start.setFullYear(now.getFullYear() - 1, 0, 1)
      end.setFullYear(now.getFullYear() - 1, 11, 31)
      break
    case '3months':
      start.setMonth(now.getMonth() - 3)
      break
    case '6months':
      start.setMonth(now.getMonth() - 6)
      break
  }
  
  startDate.value = start.toISOString().split('T')[0]
  endDate.value = end.toISOString().split('T')[0]
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}
</script>
