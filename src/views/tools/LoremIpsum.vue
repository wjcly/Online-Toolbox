<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">占位文本生成器</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-4">生成 Lorem Ipsum 占位文本</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">类型</label>
          <select
            v-model="type"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="paragraphs">段落</option>
            <option value="sentences">句子</option>
            <option value="words">单词</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">数量</label>
          <input
            v-model.number="count"
            type="number"
            min="1"
            max="100"
            class="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex gap-4">
          <button
            @click="generate"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw class="w-4 h-4" />
            生成
          </button>
          <button
            @click="copyToClipboard"
            :disabled="!result"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Copy class="w-4 h-4" />
            复制
          </button>
        </div>
      </div>

      <div v-if="result" class="bg-white rounded-xl shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h3 class="font-semibold">生成结果</h3>
        </div>
        <div class="p-4">
          <p class="text-gray-700 whitespace-pre-wrap">{{ result }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, RefreshCw, Copy } from 'lucide-vue-next'

const type = ref<'paragraphs' | 'sentences' | 'words'>('paragraphs')
const count = ref(3)
const result = ref('')

const words = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
]

const generateSentence = (): string => {
  const len = Math.floor(Math.random() * 8) + 5
  const sentence = Array.from({ length: len }, () => words[Math.floor(Math.random() * words.length)])
  sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1)
  return sentence.join(' ') + '.'
}

const generate = () => {
  if (type.value === 'words') {
    result.value = Array.from({ length: count.value }, () => words[Math.floor(Math.random() * words.length)]).join(' ')
  } else if (type.value === 'sentences') {
    result.value = Array.from({ length: count.value }, () => generateSentence()).join(' ')
  } else {
    result.value = Array.from({ length: count.value }, () => {
      const sentences = Array.from({ length: Math.floor(Math.random() * 3) + 2 }, () => generateSentence()).join(' ')
      return sentences
    }).join('\n\n')
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(result.value)
}
</script>
