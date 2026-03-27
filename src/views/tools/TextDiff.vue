<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">对比工具</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-4">文本 A</h3>
          <textarea
            v-model="textA"
            placeholder="输入第一段文本..."
            class="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
          ></textarea>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-4">文本 B</h3>
          <textarea
            v-model="textB"
            placeholder="输入第二段文本..."
            class="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
          ></textarea>
        </div>
      </div>

      <div class="flex justify-center gap-4 mb-6">
        <button @click="compare" class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          开始对比
        </button>
        <button @click="clear" class="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
          清空
        </button>
      </div>

      <div v-if="result" class="bg-white rounded-xl p-6 shadow-sm">
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="p-4 bg-green-50 rounded-lg text-center">
            <p class="text-sm text-green-600">相同行数</p>
            <p class="text-3xl font-bold text-green-700 mt-2">{{ result.same }}</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg text-center">
            <p class="text-sm text-yellow-600">不同行数</p>
            <p class="text-3xl font-bold text-yellow-700 mt-2">{{ result.diff }}</p>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg text-center">
            <p class="text-sm text-blue-600">相似度</p>
            <p class="text-3xl font-bold text-blue-700 mt-2">{{ result.similarity }}%</p>
          </div>
        </div>

        <div class="space-y-4">
          <div v-if="result.onlyInA.length > 0" class="p-4 bg-red-50 rounded-lg">
            <h4 class="font-semibold text-red-800 mb-2">仅在 A 中出现 ({{ result.onlyInA.length }}行)</h4>
            <ul class="text-sm text-red-700 space-y-1">
              <li v-for="(line, i) in result.onlyInA" :key="i" class="font-mono">• {{ line }}</li>
            </ul>
          </div>

          <div v-if="result.onlyInB.length > 0" class="p-4 bg-blue-50 rounded-lg">
            <h4 class="font-semibold text-blue-800 mb-2">仅在 B 中出现 ({{ result.onlyInB.length }}行)</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li v-for="(line, i) in result.onlyInB" :key="i" class="font-mono">• {{ line }}</li>
            </ul>
          </div>

          <div v-if="result.common.length > 0" class="p-4 bg-green-50 rounded-lg">
            <h4 class="font-semibold text-green-800 mb-2">相同内容 ({{ result.common.length }}行)</h4>
            <ul class="text-sm text-green-700 space-y-1">
              <li v-for="(line, i) in result.common.slice(0, 20)" :key="i" class="font-mono">✓ {{ line }}</li>
            </ul>
            <p v-if="result.common.length > 20" class="text-sm text-green-600 mt-2">... 还有 {{ result.common.length - 20 }} 行</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'

const textA = ref('')
const textB = ref('')
const result = ref<any>(null)

const compare = () => {
  const linesA = textA.value.split('\n').map(l => l.trim()).filter(l => l)
  const linesB = textB.value.split('\n').map(l => l.trim()).filter(l => l)

  const setA = new Set(linesA)
  const setB = new Set(linesB)

  const onlyInA = linesA.filter(l => !setB.has(l))
  const onlyInB = linesB.filter(l => !setA.has(l))
  const common = linesA.filter(l => setB.has(l))

  const total = Math.max(linesA.length, linesB.length)
  const similarity = total > 0 ? Math.round((common.length / total) * 100) : 0

  result.value = {
    same: common.length,
    diff: onlyInA.length + onlyInB.length,
    similarity,
    onlyInA,
    onlyInB,
    common,
  }
}

const clear = () => {
  textA.value = ''
  textB.value = ''
  result.value = null
}
</script>
