<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">Regex Tester</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Controls -->
      <div class="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">正则表达式</label>
            <div class="flex gap-2">
              <span class="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">/</span>
              <input
                v-model="pattern"
                placeholder="在此输入正则表达式，例如：\d{3}-\d{4}"
                class="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <span class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 text-gray-600">/</span>
              <div class="flex gap-1">
                <button
                  v-for="flag in ['g', 'i', 'm', 's', 'u']"
                  :key="flag"
                  @click="toggleFlag(flag)"
                  :class="[
                    'px-3 py-2 border rounded font-mono text-sm transition-colors',
                    flags.includes(flag)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50',
                  ]"
                  :title="getFlagDescription(flag)"
                >
                  {{ flag }}
                </button>
              </div>
            </div>
            <p v-if="regexError" class="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle class="w-4 h-4" />
              {{ regexError }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">测试文本</label>
            <textarea
              v-model="testString"
              placeholder="在此输入要测试的文本内容..."
              rows="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y"
            ></textarea>
            <div class="flex gap-2 mt-2">
              <button
                @click="testRegex"
                class="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
              >
                <Search class="w-4 h-4" />
                测试
              </button>
              <button
                @click="pasteFromClipboard"
                class="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center gap-1"
              >
                <ClipboardPaste class="w-4 h-4" />
                粘贴
              </button>
              <button
                @click="clearAll"
                class="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors flex items-center gap-1"
              >
                <Trash2 class="w-4 h-4" />
                清空
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Match Results -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 class="font-semibold flex items-center gap-2">
              <CheckCircle class="w-5 h-5 text-green-600" />
              匹配结果
            </h3>
            <span :class="['px-2 py-1 rounded text-sm font-medium', matches.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">
              {{ matches.length }} 个匹配
            </span>
          </div>
          <div class="p-4 max-h-96 overflow-y-auto">
            <div v-if="matches.length === 0" class="text-gray-500 text-sm text-center py-8">
              未找到匹配，请尝试调整正则表达式
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="(match, index) in matches"
                :key="index"
                class="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    匹配 {{ index + 1 }}
                  </span>
                  <span class="text-xs text-gray-500">
                    位置：{{ match.index }} - {{ match.index + match.match.length }}
                  </span>
                  <button
                    @click="copyMatch(match.match)"
                    class="ml-auto text-gray-400 hover:text-gray-600"
                    title="复制匹配内容"
                  >
                    <Copy class="w-4 h-4" />
                  </button>
                </div>
                <p class="font-mono text-sm text-gray-800 break-all bg-white px-2 py-1 rounded">
                  {{ match.match }}
                </p>
                <div v-if="match.groups && Object.keys(match.groups).length > 0" class="mt-2 space-y-1">
                  <p class="text-xs text-gray-500">分组：</p>
                  <div v-for="(group, key) in match.groups" :key="key" class="flex gap-2 text-xs">
                    <span class="text-gray-600">{{ key }}:</span>
                    <span class="font-mono text-gray-800">{{ group }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Highlighted View -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 class="font-semibold flex items-center gap-2">
              <Eye class="w-5 h-5 text-blue-600" />
              高亮视图
            </h3>
            <button
              @click="copyHighlighted"
              class="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <Check v-if="copiedHighlight" class="w-4 h-4" />
              <Copy v-else class="w-4 h-4" />
              {{ copiedHighlight ? '已复制' : '复制' }}
            </button>
          </div>
          <div class="p-4 max-h-96 overflow-y-auto">
            <div
              class="font-mono text-sm whitespace-pre-wrap break-all"
              v-html="highlightedText"
            ></div>
          </div>
        </div>
      </div>

      <!-- Quick Reference -->
      <div class="mt-6 bg-white rounded-xl p-6 shadow-sm">
        <h3 class="font-semibold mb-4 flex items-center gap-2">
          <BookOpen class="w-5 h-5 text-purple-600" />
          快速参考
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="p-3 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-sm mb-1">字符类</h4>
            <ul class="text-xs text-gray-600 space-y-1 font-mono">
              <li><code class="bg-gray-200 px-1 rounded">\d</code> - 数字</li>
              <li><code class="bg-gray-200 px-1 rounded">\w</code> - 单词字符</li>
              <li><code class="bg-gray-200 px-1 rounded">\s</code> - 空白字符</li>
              <li><code class="bg-gray-200 px-1 rounded">.</code> - 任意字符</li>
            </ul>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-sm mb-1">锚点</h4>
            <ul class="text-xs text-gray-600 space-y-1 font-mono">
              <li><code class="bg-gray-200 px-1 rounded">^</code> - 行首</li>
              <li><code class="bg-gray-200 px-1 rounded">$</code> - 行尾</li>
              <li><code class="bg-gray-200 px-1 rounded">\b</code> - 单词边界</li>
            </ul>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-sm mb-1">数量词</h4>
            <ul class="text-xs text-gray-600 space-y-1 font-mono">
              <li><code class="bg-gray-200 px-1 rounded">*</code> - 0 次或多次</li>
              <li><code class="bg-gray-200 px-1 rounded">+</code> - 1 次或多次</li>
              <li><code class="bg-gray-200 px-1 rounded">?</code> - 0 次或 1 次</li>
              <li><code class="bg-gray-200 px-1 rounded">{n}</code> - 恰好 n 次</li>
              <li><code class="bg-gray-200 px-1 rounded">{n,}</code> - n 次或更多</li>
              <li><code class="bg-gray-200 px-1 rounded">{n,m}</code> - n 到 m 次</li>
            </ul>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-sm mb-1">字符集</h4>
            <ul class="text-xs text-gray-600 space-y-1 font-mono">
              <li><code class="bg-gray-200 px-1 rounded">[abc]</code> - a、b 或 c</li>
              <li><code class="bg-gray-200 px-1 rounded">[^abc]</code> - 非 a、b、c</li>
              <li><code class="bg-gray-200 px-1 rounded">[a-z]</code> - a 到 z</li>
              <li><code class="bg-gray-200 px-1 rounded">(a|b)</code> - a 或 b</li>
            </ul>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-sm mb-1">分组</h4>
            <ul class="text-xs text-gray-600 space-y-1 font-mono">
              <li><code class="bg-gray-200 px-1 rounded">( )</code> - 捕获分组</li>
              <li><code class="bg-gray-200 px-1 rounded">(?: )</code> - 非捕获分组</li>
              <li><code class="bg-gray-200 px-1 rounded">\1</code> - 反向引用</li>
            </ul>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-sm mb-1">环视</h4>
            <ul class="text-xs text-gray-600 space-y-1 font-mono">
              <li><code class="bg-gray-200 px-1 rounded">(?= )</code> - 正向先行</li>
              <li><code class="bg-gray-200 px-1 rounded">(?! )</code> - 负向先行</li>
              <li><code class="bg-gray-200 px-1 rounded">(?&lt;= )</code> - 正向后行</li>
              <li><code class="bg-gray-200 px-1 rounded">(?&lt;! )</code> - 负向后行</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Common Patterns -->
      <div class="mt-6 bg-white rounded-xl p-6 shadow-sm">
        <h3 class="font-semibold mb-4 flex items-center gap-2">
          <Zap class="w-5 h-5 text-yellow-600" />
          常用模式
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            v-for="preset in presets"
            :key="preset.name"
            @click="applyPreset(preset)"
            class="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors border border-gray-200"
          >
            <div class="flex items-center gap-2">
              <span class="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {{ preset.pattern }}
              </span>
            </div>
            <p class="text-xs text-gray-600 mt-1">{{ preset.description }}</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ArrowLeft,
  Copy,
  Check,
  Trash2,
  ClipboardPaste,
  AlertCircle,
  CheckCircle,
  Eye,
  BookOpen,
  Zap,
  Search,
} from 'lucide-vue-next'
import { toast } from '@/utils/toast'

const pattern = ref('')
const flags = ref<string[]>([])
const testString = ref('')
const regexError = ref<string | null>(null)
const matches = ref<Array<{ match: string; index: number; groups?: Record<string, string> }>>([])
const copiedHighlight = ref(false)

const presets = [
  { name: 'digits', pattern: '\\d+', description: '匹配一个或多个数字' },
  { name: 'letters', pattern: '[a-zA-Z]+', description: '匹配一个或多个字母' },
  { name: 'four-letter-words', pattern: '\\b\\w{4}\\b', description: '匹配 4 个字母的单词' },
  { name: 'empty-lines', pattern: '^\\s*$', description: '匹配空行' },
  { name: 'emails', pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', description: '匹配电子邮件地址' },
  { name: 'ip-addresses', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', description: '匹配 IP 地址' },
  { name: 'urls', pattern: 'https?://[^\\s]+', description: '匹配 URL' },
  { name: 'phone', pattern: '\\d{3}-\\d{3}-\\d{4}', description: '匹配电话号码 (XXX-XXX-XXXX)' },
]

const getFlagDescription = (flag: string) => {
  const descriptions: Record<string, string> = {
    g: '全局 - 查找所有匹配',
    i: '忽略大小写',
    m: '多行 - ^ 和 $ 匹配行边界',
    s: '点号通配 - . 匹配换行符',
    u: 'Unicode - 启用 Unicode 匹配',
  }
  return descriptions[flag] || ''
}

const toggleFlag = (flag: string) => {
  const index = flags.value.indexOf(flag)
  if (index > -1) {
    flags.value.splice(index, 1)
  } else {
    flags.value.push(flag)
  }
  testRegex()
}

const buildRegex = () => {
  try {
    if (!pattern.value) {
      regexError.value = null
      return null
    }
    const regex = new RegExp(pattern.value, flags.value.join(''))
    regexError.value = null
    return regex
  } catch (e) {
    regexError.value = (e as Error).message
    return null
  }
}

const testRegex = () => {
  const regex = buildRegex()
  matches.value = []

  if (!regex || !testString.value) {
    return
  }

  // 检查是否使用了全局标志
  if (!regex.global) {
    regexError.value = '请勾选 "g" 标志（全局匹配）以使用 matchAll 方法'
    return
  }

  try {
    const allMatches = testString.value.matchAll(regex)
    for (const match of allMatches) {
      matches.value.push({
        match: match[0],
        index: match.index ?? 0,
        groups: match.groups || {},
      })
    }
  } catch (e) {
    const errorMsg = (e as Error).message
    // 翻译常见的错误信息
    if (errorMsg.includes('non-global')) {
      regexError.value = '正则表达式必须包含 "g" 标志（全局匹配）'
    } else if (errorMsg.includes('Invalid regular expression')) {
      regexError.value = '无效的正则表达式：' + errorMsg.split(':').slice(1).join(':').trim()
    } else {
      regexError.value = errorMsg
    }
  }
}

const highlightedText = computed(() => {
  if (!testString.value || matches.value.length === 0) {
    return testString.value || '<span class="text-gray-400">No text to highlight</span>'
  }

  let result = ''
  let lastIndex = 0

  // Sort matches by index to handle them in order
  const sortedMatches = [...matches.value].sort((a, b) => a.index - b.index)

  for (const match of sortedMatches) {
    // Add text before this match
    const textBefore = testString.value.slice(lastIndex, match.index)
    result += escapeHtml(textBefore)

    // Add highlighted match
    result += `<mark class="bg-yellow-300 px-0.5 rounded">${escapeHtml(match.match)}</mark>`

    lastIndex = match.index + match.match.length
  }

  // Add remaining text
  result += escapeHtml(testString.value.slice(lastIndex))

  return result
})

const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    testString.value = text
    testRegex()
    toast.success('已从剪贴板粘贴')
  } catch (e) {
    toast.error('粘贴失败')
  }
}

const copyMatch = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('已复制匹配内容')
  } catch (e) {
    toast.error('复制失败')
  }
}

const copyHighlighted = async () => {
  try {
    await navigator.clipboard.writeText(testString.value)
    copiedHighlight.value = true
    toast.success('已复制文本')
    setTimeout(() => {
      copiedHighlight.value = false
    }, 2000)
  } catch (e) {
    toast.error('复制失败')
  }
}

const clearAll = () => {
  pattern.value = ''
  flags.value = []
  testString.value = ''
  matches.value = []
  regexError.value = null
}

const applyPreset = (preset: typeof presets[0]) => {
  pattern.value = preset.pattern
  testRegex()
  toast.success(`已应用预设：${preset.description}`)
}
</script>

<style scoped>
mark {
  color: inherit;
}
</style>
