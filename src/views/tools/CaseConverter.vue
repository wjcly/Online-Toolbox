<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">大小写转换器</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-4">文本大小写转换</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
          <textarea
            v-model="inputText"
            rows="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入要转换的文本..."
          ></textarea>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <button
            @click="convert('upper')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            UPPERCASE
          </button>
          <button
            @click="convert('lower')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            lowercase
          </button>
          <button
            @click="convert('title')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Title Case
          </button>
          <button
            @click="convert('sentence')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Sentence case
          </button>
          <button
            @click="convert('camel')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            camelCase
          </button>
          <button
            @click="convert('snake')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            snake_case
          </button>
          <button
            @click="convert('kebab')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            kebab-case
          </button>
          <button
            @click="convert('constant')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            CONSTANT_CASE
          </button>
        </div>

        <div class="flex gap-4">
          <button
            @click="copyToClipboard"
            :disabled="!outputText"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Copy class="w-4 h-4" />
            复制结果
          </button>
          <button
            @click="inputText = ''; outputText = ''"
            class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            清空
          </button>
        </div>
      </div>

      <div v-if="outputText" class="bg-white rounded-xl shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h3 class="font-semibold">转换结果</h3>
        </div>
        <div class="p-4">
          <p class="text-gray-700 whitespace-pre-wrap break-all">{{ outputText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Copy } from 'lucide-vue-next'

const inputText = ref('')
const outputText = ref('')

const convert = (type: string) => {
  const text = inputText.value.trim()
  if (!text) return

  switch (type) {
    case 'upper':
      outputText.value = text.toUpperCase()
      break
    case 'lower':
      outputText.value = text.toLowerCase()
      break
    case 'title':
      outputText.value = text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
      break
    case 'sentence':
      outputText.value = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase())
      break
    case 'camel':
      outputText.value = text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      break
    case 'snake':
      outputText.value = text.toLowerCase().replace(/\s+/g, '_')
      break
    case 'kebab':
      outputText.value = text.toLowerCase().replace(/\s+/g, '-')
      break
    case 'constant':
      outputText.value = text.toUpperCase().replace(/\s+/g, '_')
      break
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(outputText.value)
}
</script>
