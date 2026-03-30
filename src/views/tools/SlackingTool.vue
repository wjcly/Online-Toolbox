<template>
  <div class="tool-page min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Top Bar -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">摸鱼神器</h1>
            <span class="text-xs text-gray-500 dark:text-gray-400">Slacking Tool</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Mode Selector -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm">
        <div class="flex flex-wrap gap-3">
          <button
            v-for="mode in modes"
            :key="mode.id"
            @click="setMode(mode.id)"
            :class="[
              'px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2',
              currentMode === mode.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            <component :is="mode.icon" class="w-4 h-4" />
            {{ mode.name }}
          </button>
        </div>
      </div>

      <!-- Fake Terminal Mode -->
      <div v-if="currentMode === 'terminal'" class="bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-700">
        <div class="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div class="text-xs text-gray-400 font-mono">user@server:~</div>
          <div class="flex items-center gap-2">
            <button @click="clearTerminal" class="text-xs text-gray-400 hover:text-white transition-colors">Clear</button>
          </div>
        </div>
        <div class="p-4 font-mono text-sm h-96 overflow-y-auto" ref="terminalRef">
          <div v-for="(line, index) in terminalLines" :key="index" class="whitespace-pre-wrap break-all">
            <span class="text-green-400">$</span>
            <span class="text-gray-100 ml-2">{{ line }}</span>
          </div>
          <div class="flex items-center mt-2">
            <span class="text-green-400">$</span>
            <span class="w-2 h-5 bg-gray-400 ml-2 animate-pulse"></span>
          </div>
        </div>
      </div>

      <!-- Fake Code Mode -->
      <div v-if="currentMode === 'code'" class="bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-700">
        <div class="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div class="text-xs text-gray-400 font-mono">{{ currentFile }}</div>
          <button @click="generateNewCode" class="text-xs text-gray-400 hover:text-white transition-colors">Regenerate</button>
        </div>
        <div class="p-4 font-mono text-sm h-96 overflow-y-auto">
          <div v-for="(line, index) in codeLines" :key="index" class="flex">
            <span class="text-gray-600 w-12 text-right pr-4 select-none">{{ index + 1 }}</span>
            <span v-html="highlightSyntax(line)"></span>
          </div>
        </div>
      </div>

      <!-- Fake Log Mode -->
      <div v-if="currentMode === 'log'" class="bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-700">
        <div class="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div class="text-xs text-gray-400 font-mono">System Logs - Running</div>
          <div class="flex items-center gap-2">
            <button @click="clearLogs" class="text-xs text-gray-400 hover:text-white transition-colors">Clear</button>
          </div>
        </div>
        <div class="p-4 font-mono text-xs h-96 overflow-y-auto" ref="logRef">
          <div v-for="(log, index) in logs" :key="index" class="flex gap-4 py-1 border-b border-gray-800">
            <span class="text-gray-500 w-24 shrink-0">{{ log.time }}</span>
            <span :class="getLogLevelClass(log.level)" class="w-16 shrink-0">[{{ log.level }}]</span>
            <span class="text-gray-300 flex-1">{{ log.message }}</span>
          </div>
        </div>
      </div>

      <!-- Fake Document Mode -->
      <div v-if="currentMode === 'document'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
          <div class="flex items-center gap-2">
            <FileText class="w-4 h-4 text-gray-500" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ currentDocName }}</span>
          </div>
          <button @click="generateDocument" class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            刷新内容
          </button>
        </div>
        <div class="p-6">
          <div class="prose dark:prose-invert max-w-none">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ docTitle }}</h2>
            <div class="space-y-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              <p v-for="(paragraph, index) in docContent" :key="index">{{ paragraph }}</p>
            </div>
            <div class="mt-6 flex items-center gap-2 text-xs text-gray-400">
              <Clock class="w-3 h-3" />
              <span>最后编辑：{{ lastEditTime }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Fake Spreadsheet Mode -->
      <div v-if="currentMode === 'spreadsheet'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="bg-green-50 dark:bg-green-900/30 px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
          <div class="flex items-center gap-2">
            <Table class="w-4 h-4 text-green-600 dark:text-green-400" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ spreadsheetName }}</span>
          </div>
          <button @click="generateSpreadsheet" class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            刷新数据
          </button>
        </div>
        <div class="p-4 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th v-for="header in spreadsheetHeaders" :key="header" class="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-300">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in spreadsheetData" :key="row.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="py-2 px-3 text-gray-600 dark:text-gray-300">{{ row.name }}</td>
                <td class="py-2 px-3 text-gray-600 dark:text-gray-300">{{ row.department }}</td>
                <td class="py-2 px-3 text-gray-600 dark:text-gray-300">{{ row.project }}</td>
                <td class="py-2 px-3">
                  <span :class="getStatusClass(row.status)" class="px-2 py-0.5 rounded text-xs">
                    {{ row.status }}
                  </span>
                </td>
                <td class="py-2 px-3 text-gray-600 dark:text-gray-300">{{ row.progress }}</td>
                <td class="py-2 px-3 text-gray-600 dark:text-gray-300">{{ row.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Fake Data Analysis Mode -->
      <div v-if="currentMode === 'analysis'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
          <div class="flex items-center gap-2">
            <BarChart3 class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">数据分析报告</span>
          </div>
          <button @click="generateAnalysis" class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            刷新分析
          </button>
        </div>
        <div class="p-6">
          <!-- Summary Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-4">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">总访问量</div>
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ analysisData.totalViews }}</div>
              <div class="text-xs text-green-500 mt-1">↑ {{ analysisData.viewsGrowth }}%</div>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-4">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">转化率</div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ analysisData.conversionRate }}%</div>
              <div class="text-xs text-green-500 mt-1">↑ {{ analysisData.conversionGrowth }}%</div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-4">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">活跃用户</div>
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ analysisData.activeUsers }}</div>
              <div class="text-xs text-red-500 mt-1">↓ {{ analysisData.usersGrowth }}%</div>
            </div>
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-lg p-4">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">平均时长</div>
              <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ analysisData.avgDuration }}min</div>
              <div class="text-xs text-green-500 mt-1">↑ {{ analysisData.durationGrowth }}%</div>
            </div>
          </div>
          
          <!-- Chart Placeholder -->
          <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">趋势分析</h3>
            <div class="h-48 flex items-end justify-between gap-2">
              <div v-for="(bar, index) in chartBars" :key="index" class="flex-1 flex flex-col items-center gap-1">
                <div 
                  class="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500"
                  :style="{ height: bar + '%' }"
                ></div>
                <span class="text-xs text-gray-500">{{ chartLabels[index] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fake Meeting Mode -->
      <div v-if="currentMode === 'meeting'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="bg-purple-50 dark:bg-purple-900/30 px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
          <div class="flex items-center gap-2">
            <Users class="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">会议安排</span>
          </div>
          <button @click="generateMeetings" class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            刷新列表
          </button>
        </div>
        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          <div v-for="meeting in meetings" :key="meeting.id" class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-medium text-gray-900 dark:text-white">{{ meeting.title }}</h3>
                <div class="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <Clock class="w-3 h-3" />
                    {{ meeting.time }}
                  </span>
                  <span class="flex items-center gap-1">
                    <MapPin class="w-3 h-3" />
                    {{ meeting.location }}
                  </span>
                </div>
              </div>
              <span :class="getMeetingStatusClass(meeting.status)" class="px-2 py-1 rounded text-xs font-medium">
                {{ meeting.status }}
              </span>
            </div>
            <div class="mt-3 flex items-center gap-2">
              <div v-for="attendee in meeting.attendees" :key="attendee" 
                   class="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 flex items-center justify-center text-xs text-white font-medium">
                {{ attendee[0] }}
              </div>
              <span class="text-xs text-gray-400">+{{ meeting.attendees.length }} 参会人</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Fake Email Mode -->
      <div v-if="currentMode === 'email'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="bg-red-50 dark:bg-red-900/30 px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
          <div class="flex items-center gap-2">
            <Mail class="w-4 h-4 text-red-600 dark:text-red-400" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">工作邮箱</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-500 dark:text-gray-400">收件箱 ({{ emails.length }})</span>
            <button @click="generateEmails" class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              刷新
            </button>
          </div>
        </div>
        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          <div v-for="email in emails" :key="email.id" 
               class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
                  {{ email.sender[0] }}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-900 dark:text-white truncate">{{ email.sender }}</span>
                    <span class="text-xs text-gray-400 shrink-0 ml-2">{{ email.time }}</span>
                  </div>
                  <div class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ email.subject }}</div>
                  <div class="text-xs text-gray-400 truncate mt-1">{{ email.preview }}</div>
                </div>
              </div>
              <div v-if="email.unread" class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Panel -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 mt-6 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">设置</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">自动刷新</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="autoRefresh" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">刷新间隔 (秒)</span>
            <input
              type="number"
              v-model="refreshInterval"
              min="5"
              max="60"
              step="5"
              class="w-20 px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Tip -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          💡 温馨提示：适度休息，劳逸结合，工作效率更高哦~
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ArrowLeft,
  FileText,
  Table,
  BarChart3,
  Users,
  Mail,
  Clock,
  MapPin,
  Terminal,
} from 'lucide-vue-next'

type ModeType = 'terminal' | 'code' | 'log' | 'document' | 'spreadsheet' | 'analysis' | 'meeting' | 'email'

const modes = [
  { id: 'terminal' as const, name: '终端模式', icon: Terminal },
  { id: 'code' as const, name: '代码模式', icon: BarChart3 },
  { id: 'log' as const, name: '日志模式', icon: FileText },
  { id: 'document' as const, name: '文档模式', icon: FileText },
  { id: 'spreadsheet' as const, name: '表格模式', icon: Table },
  { id: 'analysis' as const, name: '数据分析', icon: BarChart3 },
  { id: 'meeting' as const, name: '会议安排', icon: Users },
  { id: 'email' as const, name: '工作邮箱', icon: Mail },
]

const currentMode = ref<ModeType>('terminal')
const autoRefresh = ref(true)
const refreshInterval = ref(15)

const terminalRef = ref<HTMLElement | null>(null)
const logRef = ref<HTMLElement | null>(null)

const terminalLines = ref<string[]>([])
const codeLines = ref<string[]>([])
const logs = ref<Array<{ time: string; level: string; message: string }>>([])
const currentFile = ref('main.ts')

const currentDocName = ref('')
const docTitle = ref('')
const docContent = ref<string[]>([])
const lastEditTime = ref('')

const spreadsheetName = ref('')
const spreadsheetHeaders = ['姓名', '部门', '项目', '状态', '进度', '日期']
const spreadsheetData = ref<Array<{ id: number; name: string; department: string; project: string; status: string; progress: string; date: string }>>([])

const analysisData = ref({
  totalViews: 0,
  viewsGrowth: 0,
  conversionRate: 0,
  conversionGrowth: 0,
  activeUsers: 0,
  usersGrowth: 0,
  avgDuration: 0,
  durationGrowth: 0,
})
const chartBars = ref<number[]>([])
const chartLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const meetings = ref<Array<{ id: number; title: string; time: string; location: string; status: string; attendees: string[] }>>([])
const emails = ref<Array<{ id: number; sender: string; subject: string; preview: string; time: string; unread: boolean }>>([])

let refreshTimer: ReturnType<typeof setInterval> | null = null
let terminalInterval: ReturnType<typeof setInterval> | null = null
let logInterval: ReturnType<typeof setInterval> | null = null
let currentCommandIndex = 0

// Terminal commands and outputs
const terminalCommands = [
  'npm install', 'npm run dev', 'git status', 'git add .', 'git commit -m "feat: update"',
  'git push origin main', 'docker build -t app .', 'docker-compose up -d', 'kubectl get pods',
  'yarn build', 'pnpm install', 'npm run test', 'npm run lint', 'tsc --noEmit', 'vite build',
]

const terminalOutputs: Record<string, string> = {
  'npm install': 'added 142 packages in 3s\n\nfound 0 vulnerabilities',
  'npm run dev': 'VITE v5.2.0  ready in 312 ms\n\n➜  Local:   http://localhost:5173/\n➜  Network: use --host to expose',
  'git status': 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges to be committed:',
  'git commit -m "feat: update"': '[main 8f3a2b1] feat: update\n 3 files changed, 45 insertions(+), 12 deletions(-)',
  'git push origin main': 'Enumerating objects: 15, done.\nCounting objects: 100% (15/15), done.\nWriting objects: 100% (8/8), 1.23 KiB | 1.23 MiB/s, done.\nTo github.com:user/repo.git\n   3a2b1c4..8f3a2b1  main -> main',
  'docker build -t app .': 'Sending build context to Docker daemon  2.048kB\nStep 1/8 : FROM node:18-alpine\n ---> a1b2c3d4e5f6\nSuccessfully built c3d4e5f6a7b8\nSuccessfully tagged app:latest',
  'yarn build': 'yarn run v1.22.19\n$ vite build\n✓ 142 modules transformed.\ndist/index.html  0.45 kB │ gzip:  0.30 kB\n✓ built in 2.34s\nDone in 2.89s.',
  'npm run test': 'RUN  v1.3.1\n ✓ tests/unit.test.ts (12)\n ✓ tests/integration.test.ts (5)\n Test Files  2 passed (2)\n      Tests  17 passed (17)',
}

// Code templates
const codeTemplates = [
  `// Data processing module
import { processData, validateInput } from '@/utils/helpers'
import type { UserData } from '@/types'

export async function fetchUserData(userId: string): Promise<UserData> {
  const response = await fetch(\`/api/users/\${userId}\`)
  if (!response.ok) {
    throw new Error(\`Failed to fetch user: \${response.statusText}\`)
  }
  const data = await response.json()
  return processData(data)
}`,
  `// Vue component with composition API
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/stores/main'

export default function useUserData() {
  const store = useStore()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const users = computed(() => store.state.users)

  const fetchUsers = async () => {
    loading.value = true
    try {
      await store.dispatch('fetchUsers')
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchUsers()
  })

  return { loading, error, users, fetchUsers }
}`,
  `// API service layer
import axios from 'axios'
import type { ApiResponse } from '@/types/api'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`
  }
  return config
})

export const userService = {
  async getUsers(page: number) {
    const { data } = await apiClient.get<ApiResponse>(\`/users?page=\${page}\`)
    return data
  },
}`,
]

// Log messages
const logMessages = [
  { level: 'INFO', messages: ['Application started successfully', 'User logged in', 'Data synchronized', 'Cache updated', 'Request processed'] },
  { level: 'DEBUG', messages: ['Loading configuration', 'Parsing request body', 'Validating input', 'Executing query', 'Rendering component'] },
  { level: 'WARN', messages: ['High memory usage detected', 'Slow query execution', 'Deprecated API called', 'Rate limit approaching'] },
  { level: 'ERROR', messages: ['Failed to connect to database', 'Timeout waiting for response', 'Invalid authentication token', 'File not found'] },
]

// Document templates
const docTemplates = [
  {
    title: '2026 年第一季度工作总结报告',
    name: '季度工作总结.docx',
    paragraphs: [
      '本季度，我们团队在各个方面都取得了显著的进展。首先，在项目推进方面，我们成功完成了三个重要项目的交付，客户满意度达到了 95% 以上。',
      '其次，在团队建设方面，我们新增了 5 名优秀成员，团队规模扩大到 20 人。通过定期的培训和分享会，团队成员的技能水平得到了显著提升。',
      '在技术创新方面，我们引入了多项新技术，包括自动化测试流程和持续集成系统，使开发效率提升了 30%。',
      '展望未来，我们将继续秉承创新精神，不断提升产品质量和服务水平，为公司的发展贡献更大的力量。',
    ],
  },
  {
    title: '市场调研分析报告',
    name: '市场调研报告.docx',
    paragraphs: [
      '根据最新的市场调研数据显示，目标市场规模在过去一年中增长了 25%，显示出强劲的发展势头。我们的主要竞争对手包括 A 公司、B 公司和 C 公司。',
      '消费者需求方面，年轻群体对产品的个性化和智能化要求越来越高。调查显示，超过 60% 的消费者愿意为具有创新功能的产品支付溢价。',
      '在市场机会方面，我们发现三四线城市的市场渗透率仍然较低，存在巨大的增长空间。同时，线上渠道的销售占比持续提升，已达到总销售额的 40%。',
      '基于以上分析，我们建议加大在下沉市场的投入，同时优化线上购物体验，提升用户转化率。',
    ],
  },
  {
    title: '项目进度汇报',
    name: '项目进度汇报.docx',
    paragraphs: [
      '本项目自启动以来，整体进展顺利。目前，需求分析阶段已完成 100%，设计阶段完成 85%，开发阶段完成 60%。',
      '在关键里程碑方面，我们已成功完成了系统架构设计、数据库设计和核心模块的开发工作。下一步将进行接口开发和前端页面制作。',
      '风险管控方面，我们识别了 3 个潜在风险点，并制定了相应的应对措施。目前所有风险均在可控范围内。',
      '预计项目将按计划于下月底完成交付，届时将进行全面的测试和验收工作。',
    ],
  },
  {
    title: '年度预算规划方案',
    name: '年度预算规划.docx',
    paragraphs: [
      '根据公司的战略目标和发展规划，我们制定了 2026 年度的预算方案。总预算金额为 5000 万元，较去年增长 15%。',
      '在支出结构方面，研发投入占比最高，达到 35%；市场营销占比 25%；人力资源占比 20%；运营支出占比 15%；其他支出占比 5%。',
      '收入目标方面，我们设定了 1.2 亿元的销售目标，同比增长 30%。利润目标为 3000 万元，利润率达到 25%。',
      '为确保预算的有效执行，我们将建立月度预算执行分析机制，及时发现和解决预算执行中的问题。',
    ],
  },
  {
    title: '产品运营数据分析报告',
    name: '产品运营分析.docx',
    paragraphs: [
      '本月产品整体运营情况良好，核心指标均呈现增长趋势。日活跃用户数达到 50 万，环比增长 12%；用户留存率提升至 45%，创历史新高。',
      '在功能使用方面，新上线的智能推荐功能使用率达到 35%，用户反馈积极。数据显示，使用该功能的用户平均使用时长提升了 40%。',
      '用户反馈方面，我们收到了超过 1000 条用户建议，其中关于界面优化的建议占比最高，达到 30%。我们计划在下一版本中进行改进。',
      '下月工作重点将放在用户体验优化和新功能开发上，预计上线 3 个新功能，进一步提升产品竞争力。',
    ],
  },
  {
    title: '人力资源培训总结',
    name: '培训总结报告.docx',
    paragraphs: [
      '本次培训为期三天，共有 150 名员工参加，覆盖公司所有部门。培训内容涵盖专业技能、沟通协作、领导力等多个方面。',
      '培训效果评估显示，学员满意度达到 92%，知识掌握程度平均分为 85 分。大部分学员表示培训内容实用，对工作有直接帮助。',
      '在培训方式上，采用线上 + 线下的混合模式，获得了学员的一致好评。互动环节的参与度达到 95%，现场气氛活跃。',
      '后续我们将根据培训反馈，优化课程设计，增加实战案例，并计划每季度举办一次类似的培训活动。',
    ],
  },
  {
    title: '技术架构升级方案',
    name: '技术架构方案.docx',
    paragraphs: [
      '随着业务规模的快速增长，现有系统架构已无法满足性能需求。本次升级旨在提升系统承载能力，支持未来 3 年的业务发展。',
      '升级方案包括：引入微服务架构、搭建容器化平台、实现自动化运维、优化数据库设计等核心内容。预计投入研发资源 20 人月。',
      '实施计划分为三个阶段：第一阶段完成基础架构搭建，第二阶段进行服务拆分，第三阶段完成数据迁移和性能优化。',
      '升级完成后，预计系统性能将提升 5 倍，支持百万级并发访问，同时降低运维成本 40%。',
    ],
  },
]

// Spreadsheet data generators
const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二']
const departments = ['技术部', '市场部', '销售部', '财务部', '人力资源部', '运营部', '产品部']
const projects = ['项目 A', '项目 B', '项目 C', '项目 D', '项目 E', '项目 F']
const statuses = ['进行中', '已完成', '待审核', '延期']
const progressOptions = ['25%', '50%', '75%', '100%', '30%', '60%', '80%']

// Meeting templates
const meetingTitles = [
  '季度业务复盘会议',
  '新产品上线评审会',
  '团队建设研讨会',
  '客户满意度分析会',
  '技术架构优化讨论',
  '市场营销策略会议',
  '年度规划启动会',
  '项目管理经验分享',
]
const meetingLocations = ['会议室 A', '会议室 B', '大会议室', '线上会议', '培训室']
const meetingStatuses = ['即将开始', '进行中', '已结束', '已取消']
const attendeeNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']

// Email templates
const emailSenders = ['人力资源部', '财务部', '技术部', '市场部', '总经办', '行政部', '客户部']
const emailSubjects = [
  '关于召开年度总结大会的通知',
  '请提交本月工作报告',
  '新员工入职培训安排',
  '系统升级维护通知',
  '关于调整考勤制度的说明',
  '节日福利发放通知',
  '请确认年度预算方案',
  '客户满意度调查结果',
]
const emailPreviews = [
  '各位同事，大家好！根据公司安排，将于本周五下午 2 点召开年度总结大会...',
  '请各部门负责人于本周五之前提交本月的工作报告，包括项目进度、人员情况...',
  '新一批员工将于下周一入职，请相关部门做好接待和培训准备工作...',
  '为了提升系统性能，我们将于本周六凌晨进行系统升级，届时服务将暂停...',
]

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

// Terminal functions
const addTerminalLine = (command: string) => {
  terminalLines.value.push(command)
  const output = terminalOutputs[command]
  if (output) {
    output.split('\n').forEach(line => {
      terminalLines.value.push(line)
    })
  }
}

const clearTerminal = () => {
  terminalLines.value = []
}

// Code functions
const generateNewCode = () => {
  const template = getRandomItem(codeTemplates)
  codeLines.value = template.split('\n')
  const files = ['main.ts', 'app.vue', 'utils.ts', 'api.ts', 'store.ts', 'types.ts']
  currentFile.value = getRandomItem(files)
}

const highlightSyntax = (line: string) => {
  let highlighted = line
    .replace(/(\/\/.*)/g, '<span class="text-gray-500">$1</span>')
    .replace(/\b(import|export|from|const|let|var|function|return|if|else|for|while|class|interface|type|async|await|try|catch|throw|new|this)\b/g, '<span class="text-purple-400">$1</span>')
    .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-blue-400">$1</span>')
    .replace(/('[^']*'|"[^"]*")/g, '<span class="text-green-400">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')
  return highlighted
}

// Log functions
const addLog = () => {
  const logGroup = getRandomItem(logMessages)
  const message = getRandomItem(logGroup.messages)
  const now = new Date()
  const time = now.toTimeString().split(' ')[0]
  
  logs.value.push({ time, level: logGroup.level, message })
  if (logs.value.length > 100) logs.value.shift()
}

const clearLogs = () => {
  logs.value = []
}

const getLogLevelClass = (level: string) => {
  const classes: Record<string, string> = {
    INFO: 'text-blue-400',
    DEBUG: 'text-gray-400',
    WARN: 'text-yellow-400',
    ERROR: 'text-red-400',
  }
  return classes[level] || 'text-gray-400'
}

const generateDocument = () => {
  const template = getRandomItem(docTemplates)
  currentDocName.value = template.name
  docTitle.value = template.title
  // Randomly select 2-4 paragraphs to show variety
  const shuffled = [...template.paragraphs].sort(() => Math.random() - 0.5)
  docContent.value = shuffled.slice(0, getRandomNumber(2, 4))
  lastEditTime.value = new Date().toLocaleString('zh-CN')
}

const generateSpreadsheet = () => {
  spreadsheetName.value = `工作进度表_${new Date().toISOString().split('T')[0]}.xlsx`
  spreadsheetData.value = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: getRandomItem(names),
    department: getRandomItem(departments),
    project: getRandomItem(projects),
    status: getRandomItem(statuses),
    progress: getRandomItem(progressOptions),
    date: `${getRandomNumber(1, 12)}月${getRandomNumber(1, 28)}日`,
  }))
}

const generateAnalysis = () => {
  analysisData.value = {
    totalViews: getRandomNumber(10000, 99999),
    viewsGrowth: getRandomNumber(5, 35),
    conversionRate: getRandomNumber(2, 8),
    conversionGrowth: getRandomNumber(1, 15),
    activeUsers: getRandomNumber(1000, 9999),
    usersGrowth: getRandomNumber(-10, 20),
    avgDuration: getRandomNumber(3, 15),
    durationGrowth: getRandomNumber(5, 25),
  }
  chartBars.value = Array.from({ length: 7 }, () => getRandomNumber(30, 100))
}

const generateMeetings = () => {
  const times = ['09:00-10:00', '10:30-11:30', '14:00-15:00', '15:30-16:30', '16:30-17:30']
  meetings.value = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    title: getRandomItem(meetingTitles),
    time: getRandomItem(times),
    location: getRandomItem(meetingLocations),
    status: getRandomItem(meetingStatuses),
    attendees: Array.from({ length: getRandomNumber(2, 5) }, () => getRandomItem(attendeeNames)),
  }))
}

const generateEmails = () => {
  const times = ['09:15', '10:30', '11:45', '13:20', '14:35', '15:50', '16:40']
  emails.value = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    sender: getRandomItem(emailSenders),
    subject: getRandomItem(emailSubjects),
    preview: getRandomItem(emailPreviews),
    time: getRandomItem(times),
    unread: Math.random() > 0.5,
  }))
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    '进行中': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
    '已完成': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
    '待审核': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
    '延期': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
  }
  return classes[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
}

const getMeetingStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    '即将开始': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
    '进行中': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
    '已结束': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
    '已取消': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
  }
  return classes[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
}

const setMode = (mode: ModeType) => {
  currentMode.value = mode
}

const refreshAll = () => {
  switch (currentMode.value) {
    case 'terminal':
      const command = terminalCommands[currentCommandIndex % terminalCommands.length]
      addTerminalLine(command)
      currentCommandIndex++
      break
    case 'code':
      generateNewCode()
      break
    case 'log':
      addLog()
      break
    case 'document':
      generateDocument()
      break
    case 'spreadsheet':
      generateSpreadsheet()
      break
    case 'analysis':
      generateAnalysis()
      break
    case 'meeting':
      generateMeetings()
      break
    case 'email':
      generateEmails()
      break
  }
}

onMounted(() => {
  generateNewCode()
  generateDocument()
  generateSpreadsheet()
  generateAnalysis()
  generateMeetings()
  generateEmails()

  // Terminal auto-run
  terminalInterval = setInterval(() => {
    const command = terminalCommands[currentCommandIndex % terminalCommands.length]
    addTerminalLine(command)
    currentCommandIndex++
  }, 3000)

  // Log auto-run
  logInterval = setInterval(() => {
    addLog()
  }, 1500)

  // General refresh timer
  refreshTimer = setInterval(() => {
    if (autoRefresh.value) {
      refreshAll()
    }
  }, refreshInterval.value * 1000)
})

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer)
  if (terminalInterval) clearInterval(terminalInterval)
  if (logInterval) clearInterval(logInterval)
})
</script>
