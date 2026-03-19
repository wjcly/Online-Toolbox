<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">Base64 Converter</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div class="flex items-center justify-center gap-4">
          <button
            @click="setMode('encode')"
            :class="[
              'px-6 py-2 rounded-lg font-medium transition-colors',
              mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
          >
            Encode to Base64
          </button>
          <button @click="swapMode" class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Swap">
            <RefreshCw class="w-5 h-5" />
          </button>
          <button
            @click="setMode('decode')"
            :class="[
              'px-6 py-2 rounded-lg font-medium transition-colors',
              mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
          >
            Decode from Base64
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 class="font-semibold">{{ mode === 'encode' ? 'Input Text / Image' : 'Base64 Input' }}</h3>
            <label
              v-if="mode === 'encode'"
              class="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm"
            >
              <Upload class="w-4 h-4" />
              Upload Image
              <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
            </label>
          </div>
          <div class="p-4">
            <img v-if="imagePreview && mode === 'encode'" :src="imagePreview" alt="Preview" class="max-h-48 rounded-lg mb-4" />
            <textarea
              v-model="input"
              :placeholder="mode === 'encode' ? 'Enter text or upload an image...' : 'Enter Base64 string...'"
              class="w-full h-64 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 class="font-semibold">{{ mode === 'encode' ? 'Base64 Output' : 'Decoded Output' }}</h3>
            <button
              @click="copyToClipboard"
              class="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <Check v-if="copied" class="w-4 h-4" />
              <Copy v-else class="w-4 h-4" />
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <div class="p-4">
            <img v-if="imagePreview && mode === 'decode'" :src="imagePreview" alt="Decoded" class="max-h-48 rounded-lg mb-4" />
            <textarea
              v-model="output"
              readonly
              placeholder="Output will appear here..."
              :class="[
                'w-full h-64 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:outline-none resize-none',
                error ? 'border-red-300 bg-red-50' : '',
              ]"
            ></textarea>
            <div v-if="error" class="mt-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg">
              <strong>Error:</strong> {{ error }}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-center">
        <button
          @click="convert"
          :disabled="!input"
          class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {{ mode === 'encode' ? 'Encode' : 'Decode' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Copy, Check, RefreshCw, Upload } from 'lucide-vue-next'

const input = ref('')
const output = ref('')
const mode = ref<'encode' | 'decode'>('encode')
const copied = ref(false)
const error = ref<string | null>(null)
const imagePreview = ref<string | null>(null)

const convert = () => {
  error.value = null
  imagePreview.value = null

  try {
    if (mode.value === 'encode') {
      if (input.value.startsWith('data:')) {
        const commaIndex = input.value.indexOf(',')
        output.value = input.value.substring(commaIndex + 1)
        imagePreview.value = input.value
      } else {
        output.value = btoa(unescape(encodeURIComponent(input.value)))
      }
    } else {
      const decoded = decodeURIComponent(escape(atob(input.value)))
      output.value = decoded

      if (input.value.match(/^[A-Za-z0-9+/=]+$/) && input.value.length > 100) {
        const imageSrc = `data:image/png;base64,${input.value}`
        const img = new Image()
        img.onload = () => (imagePreview.value = imageSrc)
        img.onerror = () => (imagePreview.value = null)
        img.src = imageSrc
      }
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Conversion failed'
    output.value = ''
  }
}

const handleFileUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    const result = event.target?.result as string
    input.value = result
    mode.value = 'encode'
    const commaIndex = result.indexOf(',')
    output.value = result.substring(commaIndex + 1)
    imagePreview.value = result
  }
  reader.readAsDataURL(file)
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const swapMode = () => {
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  input.value = output.value
  output.value = input.value
  error.value = null
  imagePreview.value = null
}

const setMode = (newMode: 'encode' | 'decode') => {
  mode.value = newMode
  clear()
}

const clear = () => {
  input.value = ''
  output.value = ''
  error.value = null
  imagePreview.value = null
}
</script>
