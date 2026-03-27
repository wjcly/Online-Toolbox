<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">UUID 生成器</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-4">生成 UUID/GUID</h2>
        
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

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">版本</label>
          <select
            v-model="version"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="v4">UUID v4 (随机)</option>
            <option value="v1">UUID v1 (基于时间)</option>
          </select>
        </div>

        <div class="flex gap-4">
          <button
            @click="generateUUIDs"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw class="w-4 h-4" />
            生成 UUID
          </button>
          <button
            @click="copyAll"
            :disabled="!uuids.length"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Copy class="w-4 h-4" />
            复制全部
          </button>
          <button
            @click="uuids = []"
            :disabled="!uuids.length"
            class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            清空
          </button>
        </div>
      </div>

      <div v-if="uuids.length > 0" class="bg-white rounded-xl shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h3 class="font-semibold">生成的 UUID ({{ uuids.length }})</h3>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="(uuid, index) in uuids"
            :key="index"
            class="p-4 flex items-center justify-between gap-4"
          >
            <code class="flex-1 text-sm font-mono bg-gray-50 px-3 py-2 rounded">{{ uuid }}</code>
            <button
              @click="copyToClipboard(uuid)"
              class="p-2 hover:bg-gray-100 rounded transition-colors"
              title="复制"
            >
              <Copy class="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, RefreshCw, Copy } from 'lucide-vue-next'

const count = ref(1)
const version = ref('v4')
const uuids = ref<string[]>([])

const generateUUIDv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const generateUUIDv1 = (): string => {
  const now = Date.now()
  const timestamp = ((now - 0x01b21dd213814000) / 10000) * 10000 + 10000000
  const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, '0')
  const timeMid = ((timestamp >> 32) & 0xffff).toString(16).padStart(4, '0')
  const timeHi = (((timestamp >> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0')
  const clockSeq = Math.floor(Math.random() * 0x3fff).toString(16).padStart(4, '0')
  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 0x100).toString(16).padStart(2, '0')
  ).join('')
  
  return `${timeLow}-${timeMid}-${timeHi}-${clockSeq}-${node}`
}

const generateUUIDs = () => {
  uuids.value = Array.from({ length: Math.min(count.value, 100) }, () =>
    version.value === 'v4' ? generateUUIDv4() : generateUUIDv1()
  )
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

const copyAll = () => {
  navigator.clipboard.writeText(uuids.value.join('\n'))
}
</script>
