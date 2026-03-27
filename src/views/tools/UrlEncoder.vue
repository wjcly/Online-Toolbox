<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">URL 编码解码</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-4">编码</h3>
          <textarea
            v-model="encodeInput"
            placeholder="输入要编码的文本..."
            class="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm mb-4"
          ></textarea>
          <div class="flex gap-2 mb-4">
            <button @click="doEncodeURI" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              encodeURI
            </button>
            <button @click="doEncodeURIComponent" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              encodeURIComponent
            </button>
          </div>
          <textarea
            v-model="encodeOutput"
            readonly
            placeholder="编码结果"
            class="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
          ></textarea>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-4">解码</h3>
          <textarea
            v-model="decodeInput"
            placeholder="输入要解码的文本..."
            class="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm mb-4"
          ></textarea>
          <button @click="decode" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4">
            解码
          </button>
          <textarea
            v-model="decodeOutput"
            readonly
            placeholder="解码结果"
            class="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
          ></textarea>
        </div>
      </div>

      <div class="mt-6 bg-white rounded-xl p-6 shadow-sm">
        <h3 class="font-semibold mb-4">常用 URL 编码对照</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="item in urlEncodingTable" :key="item.char" class="p-3 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium">"{{ item.char }}"</p>
            <p class="text-xs text-gray-500">{{ item.code }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'

const encodeInput = ref('')
const encodeOutput = ref('')
const decodeInput = ref('')
const decodeOutput = ref('')

const doEncodeURI = () => {
  if (encodeInput.value) {
    encodeOutput.value = encodeURI(encodeInput.value)
  }
}

const doEncodeURIComponent = () => {
  if (encodeInput.value) {
    encodeOutput.value = encodeURIComponent(encodeInput.value)
  }
}

const decode = () => {
  if (decodeInput.value) {
    try {
      decodeOutput.value = decodeURIComponent(decodeInput.value)
    } catch {
      decodeOutput.value = '解码失败'
    }
  }
}

const urlEncodingTable = [
  { char: ' ', code: '%20' },
  { char: '!', code: '%21' },
  { char: '#', code: '%23' },
  { char: '$', code: '%24' },
  { char: '%', code: '%25' },
  { char: '&', code: '%26' },
  { char: "'", code: '%27' },
  { char: '(', code: '%28' },
  { char: ')', code: '%29' },
  { char: '*', code: '%2A' },
  { char: '+', code: '%2B' },
  { char: ',', code: '%2C' },
  { char: '/', code: '%2F' },
  { char: ':', code: '%3A' },
  { char: ';', code: '%3B' },
  { char: '=', code: '%3D' },
  { char: '?', code: '%3F' },
  { char: '@', code: '%40' },
  { char: '[', code: '%5B' },
  { char: ']', code: '%5D' },
]
</script>
