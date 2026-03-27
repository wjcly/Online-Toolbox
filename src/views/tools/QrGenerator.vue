<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">QR Code Generator</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-6">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4">QR Code Type</h3>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="type in qrTypes"
                :key="type.value"
                @click="qrType = type.value as 'url' | 'text' | 'email' | 'phone' | 'wifi'"
                :class="[
                  'p-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-2',
                  qrType === type.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300',
                ]"
              >
                <component :is="type.icon" class="w-5 h-5" />
                <span class="text-sm font-medium">{{ type.label }}</span>
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4">Content</h3>
            <div v-if="qrType === 'wifi'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Network Name (SSID)</label>
                <input
                  v-model="wifiData.ssid"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MyWiFi"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  v-model="wifiData.password"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your password"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Encryption</label>
                <select
                  v-model="wifiData.encryption"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Encryption</option>
                </select>
              </div>
              <label class="flex items-center gap-2">
                <input v-model="wifiData.hidden" type="checkbox" class="rounded border-gray-300" />
                <span class="text-sm text-gray-600">Hidden network</span>
              </label>
            </div>

            <div v-else-if="qrType === 'email'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  v-model="emailData.to"
                  type="email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="recipient@example.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  v-model="emailData.subject"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email subject"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <textarea
                  v-model="emailData.body"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Email body..."
                ></textarea>
              </div>
            </div>

            <div v-else>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ qrType === 'url' ? 'URL' : qrType === 'phone' ? 'Phone Number' : 'Text' }}
              </label>
              <input
                v-model="content"
                :type="qrType === 'phone' ? 'tel' : qrType === 'url' ? 'url' : 'text'"
                :placeholder="inputPlaceholder"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4">Customization</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Size: {{ size }}px</label>
                <input
                  v-model.number="size"
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  class="w-full"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Foreground Color</label>
                  <div class="flex gap-2">
                    <input v-model="fgColor" type="color" class="w-12 h-10 rounded border border-gray-300 cursor-pointer" />
                    <input
                      v-model="fgColor"
                      type="text"
                      class="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <div class="flex gap-2">
                    <input v-model="bgColor" type="color" class="w-12 h-10 rounded border border-gray-300 cursor-pointer" />
                    <input
                      v-model="bgColor"
                      type="text"
                      class="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            @click="generateQR"
            class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Generate QR Code
          </button>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-4">Preview</h3>
          <div class="flex items-center justify-center min-h-[300px] bg-gray-50 rounded-xl mb-6">
            <div v-if="qrUrl" class="text-center">
              <img :src="qrUrl" alt="QR Code" class="max-w-full rounded-lg shadow-md" />
              <canvas ref="canvasRef" class="hidden"></canvas>
            </div>
            <div v-else class="text-center text-gray-400">
              <QrCode class="w-24 h-24 mx-auto mb-4 opacity-50" />
              <p>Enter content and click Generate</p>
            </div>
          </div>
          <div v-if="qrUrl" class="flex gap-3">
            <button
              @click="downloadQR"
              class="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download class="w-5 h-5" />
              Download PNG
            </button>
            <button
              @click="copyToClipboard"
              class="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Check v-if="copied" class="w-5 h-5 text-green-500" />
              <Copy v-else class="w-5 h-5" />
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, Download, Copy, Check, QrCode, Link, Type } from 'lucide-vue-next'
import { toast } from '@/utils/toast'

const content = ref('')
const qrType = ref<'url' | 'text' | 'email' | 'phone' | 'wifi'>('url')
const size = ref(256)
const fgColor = ref('#000000')
const bgColor = ref('#ffffff')
const qrUrl = ref('')
const copied = ref(false)

const wifiData = ref({ ssid: '', password: '', encryption: 'WPA', hidden: false })
const emailData = ref({ to: '', subject: '', body: '' })

const qrTypes = [
  { value: 'url', label: 'URL', icon: Link },
  { value: 'text', label: 'Text', icon: Type },
  { value: 'email', label: 'Email', icon: Type },
  { value: 'phone', label: 'Phone', icon: Type },
  { value: 'wifi', label: 'WiFi', icon: QrCode },
]

const inputPlaceholder = computed(() => {
  const placeholders: Record<string, string> = {
    url: 'https://example.com',
    text: 'Enter your text here...',
    email: 'recipient@example.com',
    phone: '+1234567890',
    wifi: 'Network name',
  }
  return placeholders[qrType.value] || 'Enter content'
})

const generateQrData = () => {
  switch (qrType.value) {
    case 'url':
      return content.value
    case 'text':
      return content.value
    case 'email':
      return `mailto:${emailData.value.to}?subject=${encodeURIComponent(emailData.value.subject)}&body=${encodeURIComponent(emailData.value.body)}`
    case 'phone':
      return `tel:${content.value}`
    case 'wifi':
      return `WIFI:T:${wifiData.value.encryption};S:${wifiData.value.ssid};P:${wifiData.value.password};H:${wifiData.value.hidden};;`
    default:
      return content.value
  }
}

const generateQR = () => {
  const data = generateQrData()
  if (!data) {
    toast.error('Please enter content for the QR code')
    return
  }
  qrUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=${size.value}x${size.value}&data=${encodeURIComponent(data)}&color=${fgColor.value.replace('#', '')}&bgcolor=${bgColor.value.replace('#', '')}`
}

const downloadQR = () => {
  if (!qrUrl.value) return
  const a = document.createElement('a')
  a.href = qrUrl.value
  a.download = `qrcode-${Date.now()}.png`
  a.click()
}

const copyToClipboard = async () => {
  if (!qrUrl.value) return
  try {
    const response = await fetch(qrUrl.value)
    const blob = await response.blob()
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    navigator.clipboard.writeText(qrUrl.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
}
</script>
