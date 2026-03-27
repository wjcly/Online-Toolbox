<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">JSON Formatter</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">Indent:</label>
            <select
              v-model="indent"
              class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="2">2 spaces</option>
              <option :value="4">4 spaces</option>
              <option :value="0">Tabs</option>
            </select>
          </div>
          <div class="flex-1"></div>
          <button
            @click="validate"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            Validate
          </button>
          <button
            @click="minify"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center gap-1"
          >
            <Minimize2 class="w-4 h-4" />
            Minify
          </button>
          <button
            @click="format"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
          >
            <Maximize2 class="w-4 h-4" />
            Format
          </button>
          <button
            @click="clear"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm flex items-center gap-1"
          >
            <Trash2 class="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 class="font-semibold">Input JSON</h3>
            <button
              @click="pasteFromClipboard"
              class="text-sm text-blue-600 hover:underline"
            >
              Paste from clipboard
            </button>
          </div>
          <textarea
            v-model="input"
            @input="autoValidate"
            placeholder='Paste your JSON here, e.g., {"name": "John", "age": 30}'
            class="w-full h-96 p-4 font-mono text-sm focus:outline-none resize-none"
          ></textarea>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 class="font-semibold">Output</h3>
            <button
              @click="copyToClipboard"
              class="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <Check v-if="copied" class="w-4 h-4" />
              <Copy v-else class="w-4 h-4" />
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <div class="relative">
            <textarea
              v-model="output"
              readonly
              placeholder="Formatted JSON will appear here"
              :class="[
                'w-full h-96 p-4 font-mono text-sm focus:outline-none resize-none',
                error ? 'text-red-600 bg-red-50' : '',
              ]"
            ></textarea>
            <div v-if="error && output !== '✓ Valid JSON!'" class="absolute bottom-4 left-4 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg">
              <strong>Error:</strong> {{ error }}
            </div>
            <div
              v-if="output === '✓ Valid JSON!'"
              class="absolute inset-0 flex items-center justify-center bg-green-50"
            >
              <div class="text-center">
                <CheckCircle class="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p class="text-xl font-semibold text-green-700">Valid JSON!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Copy, Check, CheckCircle, Trash2, Minimize2, Maximize2 } from 'lucide-vue-next'
import { toast } from '@/utils/toast'

const input = ref('')
const output = ref('')
const error = ref<string | null>(null)
const copied = ref(false)
const indent = ref(2)

const parseAndFormat = (minify = false) => {
  try {
    const parsed = JSON.parse(input.value)
    output.value = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent.value === 0 ? '\t' : indent.value)
    error.value = null
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Invalid JSON'
    output.value = ''
  }
}

const format = () => parseAndFormat(false)
const minify = () => parseAndFormat(true)

const validate = () => {
  try {
    JSON.parse(input.value)
    error.value = null
    output.value = '✓ Valid JSON!'
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Invalid JSON'
    output.value = ''
  }
}

const autoValidate = () => {
  if (input.value.trim()) {
    try {
      JSON.parse(input.value)
      error.value = null
    } catch {
      error.value = null
    }
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    input.value = text
  } catch {
    toast.error('Failed to read from clipboard')
  }
}

const clear = () => {
  input.value = ''
  output.value = ''
  error.value = null
}
</script>
