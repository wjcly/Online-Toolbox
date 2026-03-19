<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">文本加密解密</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div class="flex gap-4 mb-6">
          <button
            @click="mode = 'encrypt'"
            :class="[
              'flex-1 px-6 py-3 rounded-lg font-medium transition-colors',
              mode === 'encrypt' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            加密
          </button>
          <button
            @click="mode = 'decrypt'"
            :class="[
              'flex-1 px-6 py-3 rounded-lg font-medium transition-colors',
              mode === 'decrypt' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            解密
          </button>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
          <input
            v-model="password"
            type="password"
            placeholder="输入加密/解密密码"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ mode === 'encrypt' ? '输入文本' : '加密文本' }}
          </label>
          <textarea
            v-model="inputText"
            :placeholder="mode === 'encrypt' ? '输入要加密的文本...' : '输入要解密的文本...'"
            class="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          ></textarea>
        </div>

        <button
          @click="process"
          class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {{ mode === 'encrypt' ? '加密' : '解密' }}
        </button>
      </div>

      <div v-if="outputText" class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">结果</h3>
          <button @click="copyOutput" class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <Check v-if="copied" class="w-4 h-4" />
            <Copy v-else class="w-4 h-4" />
            {{ copied ? '已复制' : '复制' }}
          </button>
        </div>
        <textarea
          v-model="outputText"
          readonly
          class="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Copy, Check } from 'lucide-vue-next'

const mode = ref<'encrypt' | 'decrypt'>('encrypt')
const password = ref('')
const inputText = ref('')
const outputText = ref('')
const copied = ref(false)

const xorCipher = (text: string, key: string): string => {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const textChar = text.charCodeAt(i)
    const keyChar = key.charCodeAt(i % key.length)
    result += String.fromCharCode(textChar ^ keyChar)
  }
  return result
}

const process = () => {
  if (!password.value || !inputText.value) {
    alert('请输入密码和文本')
    return
  }

  try {
    if (mode.value === 'encrypt') {
      const encrypted = xorCipher(inputText.value, password.value)
      outputText.value = btoa(unescape(encodeURIComponent(encrypted)))
    } else {
      const decoded = decodeURIComponent(escape(atob(inputText.value)))
      outputText.value = xorCipher(decoded, password.value)
    }
  } catch {
    alert('操作失败，请检查输入')
  }
}

const copyOutput = () => {
  navigator.clipboard.writeText(outputText.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>
