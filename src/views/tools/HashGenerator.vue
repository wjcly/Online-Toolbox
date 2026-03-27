<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">MD5/SHA 哈希生成</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
          <textarea
            v-model="inputText"
            placeholder="输入要计算哈希的文本..."
            class="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          ></textarea>
        </div>

        <div class="flex gap-2 mb-4">
          <button @click="clear" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">清空</button>
          <button @click="paste" class="px-4 py-2 text-blue-600 hover:bg-gray-100 rounded-lg">粘贴</button>
        </div>

        <div class="space-y-4">
          <div v-for="algo in algorithms" :key="algo.name" class="p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">{{ algo.name }}</h3>
              <button @click="copyHash(algo.name)" class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Check v-if="copied === algo.name" class="w-4 h-4" />
                <Copy v-else class="w-4 h-4" />
                复制
              </button>
            </div>
            <p class="font-mono text-sm break-all text-gray-700">{{ hashes[algo.name] || '-' }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm">
        <h3 class="font-semibold mb-4">哈希算法说明</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium mb-2">MD5</h4>
            <p class="text-sm text-gray-600">128 位哈希值，常用于文件校验</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium mb-2">SHA-1</h4>
            <p class="text-sm text-gray-600">160 位哈希值，Git 使用此算法</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium mb-2">SHA-256</h4>
            <p class="text-sm text-gray-600">256 位哈希值，比特币使用此算法</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium mb-2">SHA-512</h4>
            <p class="text-sm text-gray-600">512 位哈希值，更高安全性</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ArrowLeft, Copy, Check } from 'lucide-vue-next'
import CryptoJS from 'crypto-js'
import { toast } from '@/utils/toast'

const inputText = ref('')
const hashes = ref<Record<string, string>>({})
const copied = ref<string | null>(null)

const algorithms = [
  { name: 'MD5' },
  { name: 'SHA-1' },
  { name: 'SHA-256' },
  { name: 'SHA-512' },
]

watch(inputText, () => {
  if (inputText.value) {
    hashes.value = {
      'MD5': CryptoJS.MD5(inputText.value).toString(),
      'SHA-1': CryptoJS.SHA1(inputText.value).toString(),
      'SHA-256': CryptoJS.SHA256(inputText.value).toString(),
      'SHA-512': CryptoJS.SHA512(inputText.value).toString(),
    }
  } else {
    hashes.value = {}
  }
}, { immediate: true })

const copyHash = (algo: string) => {
  if (hashes.value[algo]) {
    navigator.clipboard.writeText(hashes.value[algo])
    copied.value = algo
    setTimeout(() => (copied.value = null), 2000)
  }
}

const clear = () => {
  inputText.value = ''
}

const paste = async () => {
  try {
    inputText.value = await navigator.clipboard.readText()
  } catch {
    toast.error('无法读取剪贴板')
  }
}
</script>
