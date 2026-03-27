<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">密码生成器</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">生成的密码</label>
          <div class="flex gap-2">
            <input
              v-model="generatedPassword"
              readonly
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg"
            />
            <button @click="copyPassword()" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Check v-if="copied" class="w-5 h-5" />
              <Copy v-else class="w-5 h-5" />
            </button>
            <button @click="generate" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <RefreshCw class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">密码长度：{{ length }}</label>
          <input
            v-model.number="length"
            type="range"
            min="6"
            max="64"
            class="w-full"
          />
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <label class="flex items-center gap-2">
            <input v-model="options.uppercase" type="checkbox" class="rounded" />
            <span class="text-sm">大写字母 (A-Z)</span>
          </label>
          <label class="flex items-center gap-2">
            <input v-model="options.lowercase" type="checkbox" class="rounded" />
            <span class="text-sm">小写字母 (a-z)</span>
          </label>
          <label class="flex items-center gap-2">
            <input v-model="options.numbers" type="checkbox" class="rounded" />
            <span class="text-sm">数字 (0-9)</span>
          </label>
          <label class="flex items-center gap-2">
            <input v-model="options.symbols" type="checkbox" class="rounded" />
            <span class="text-sm">特殊字符 (!@#$...)</span>
          </label>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">排除字符</label>
          <input
            v-model="excludeChars"
            type="text"
            placeholder="输入要排除的字符，如：il1o0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button @click="generate" class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          生成密码
        </button>
      </div>

      <div v-if="passwords.length > 0" class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">历史密码</h3>
          <button @click="passwords = []" class="text-sm text-red-600 hover:text-red-800">清空</button>
        </div>
        <div class="space-y-2">
          <div
            v-for="(pwd, index) in passwords"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <code class="text-sm">{{ pwd }}</code>
            <button @click="copyPassword(pwd)" class="text-blue-600 hover:text-blue-800">
              <Copy class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 class="font-semibold text-blue-900 mb-3">密码强度建议</h3>
        <ul class="text-sm text-blue-700 space-y-2">
          <li>• 至少使用 12 个字符</li>
          <li>• 混合使用大小写字母、数字和特殊字符</li>
          <li>• 避免使用常见单词、姓名或日期</li>
          <li>• 每个账户使用不同的密码</li>
          <li>• 定期更换重要账户的密码</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ArrowLeft, Copy, Check, RefreshCw } from 'lucide-vue-next'
import { toast } from '@/utils/toast'

const generatedPassword = ref('')
const copied = ref(false)
const length = ref(16)
const excludeChars = ref('')
const passwords = ref<string[]>([])

const options = reactive({
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
})

const generate = () => {
  let charset = ''
  if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
  if (options.numbers) charset += '0123456789'
  if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (excludeChars.value) {
    charset = charset.split('').filter(c => !excludeChars.value.includes(c)).join('')
  }

  if (charset.length === 0) {
    toast.error('请至少选择一个字符类型')
    return
  }

  let password = ''
  const values = new Uint32Array(length.value)
  crypto.getRandomValues(values)

  for (let i = 0; i < length.value; i++) {
    password += charset[values[i] % charset.length]
  }

  generatedPassword.value = password
  passwords.value.unshift(password)
  if (passwords.value.length > 10) {
    passwords.value.pop()
  }
}

const copyPassword = (pwd?: string) => {
  const text = pwd || generatedPassword.value
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

generate()
</script>
