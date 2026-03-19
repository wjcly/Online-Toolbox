<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">404 Link Checker</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-4">Check Links for 404 Errors</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Base URL (for resolving relative links)</label>
          <input
            v-model="baseUrl"
            type="url"
            placeholder="https://example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex gap-4 mb-4">
          <button
            @click="fetchAndCheck"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Search class="w-4 h-4" />
            Fetch URL & Check
          </button>
          <button
            @click="showPasteDialog = true"
            class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Paste HTML
          </button>
          <button
            v-if="htmlContent"
            @click="checkLinks"
            :disabled="isChecking"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {{ isChecking ? 'Checking...' : 'Check Links' }}
          </button>
        </div>
        <div v-if="isChecking" class="mt-4">
          <div class="bg-gray-200 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full transition-all" :style="{ width: progress + '%' }"></div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Checking links... {{ progress }}%</p>
        </div>
      </div>

      <div v-if="results.length > 0" class="space-y-6">
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <p class="text-sm text-gray-500">Total Links</p>
            <p class="text-3xl font-bold text-gray-900">{{ results.length }}</p>
          </div>
          <div class="bg-green-50 rounded-xl p-6 shadow-sm border border-green-200">
            <p class="text-sm text-green-600">Valid Links</p>
            <p class="text-3xl font-bold text-green-700">{{ validCount }}</p>
          </div>
          <div class="bg-red-50 rounded-xl p-6 shadow-sm border border-red-200">
            <p class="text-sm text-red-600">Broken Links</p>
            <p class="text-3xl font-bold text-red-700">{{ brokenCount }}</p>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm">
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="font-semibold">Link Results</h3>
            <button
              @click="downloadReport"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Download class="w-4 h-4" />
              Download Report
            </button>
          </div>
          <div class="divide-y divide-gray-200">
            <div
              v-for="(result, index) in results"
              :key="index"
              :class="['p-4 flex items-center gap-4', result.isValid ? 'bg-green-50/50' : 'bg-red-50/50']"
            >
              <CheckCircle v-if="result.isValid" class="w-5 h-5 text-green-500 flex-shrink-0" />
              <XCircle v-else class="w-5 h-5 text-red-500 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ result.text || 'No link text' }}</p>
                <p class="text-xs text-gray-500 truncate">{{ result.url }}</p>
              </div>
              <span
                :class="[
                  'px-2 py-1 text-xs rounded',
                  result.isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                ]"
              >
                {{ result.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Paste Dialog -->
      <div v-if="showPasteDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl p-6 max-w-2xl w-full">
          <h3 class="text-lg font-semibold mb-4">Paste HTML Content</h3>
          <textarea
            v-model="pastedHtml"
            class="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your HTML here..."
          ></textarea>
          <div class="flex gap-3 mt-4">
            <button
              @click="showPasteDialog = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="processPastedHtml"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Process
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, Search, Download, CheckCircle, XCircle } from 'lucide-vue-next'

const baseUrl = ref('')
const htmlContent = ref('')
const pastedHtml = ref('')
const showPasteDialog = ref(false)
const isChecking = ref(false)
const progress = ref(0)
const results = ref<Array<{ url: string; text: string; status: number | string; statusText: string; isValid: boolean }>>([])

const extractLinks = (html: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  return Array.from(doc.querySelectorAll('a'))
    .map((a) => ({
      url: a.getAttribute('href') || '',
      text: a.textContent?.trim() || '',
    }))
    .filter((link) => link.url && !link.url.startsWith('#') && !link.url.startsWith('javascript:'))
}

const checkLink = async (url: string) => {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const response = await fetch(url, { method: 'HEAD', signal: controller.signal })
    clearTimeout(timeout)
    return {
      status: response.status,
      statusText: response.statusText,
      isValid: response.status >= 200 && response.status < 400,
    }
  } catch (error) {
    return {
      status: 'error',
      statusText: error instanceof Error ? error.message : 'Unknown error',
      isValid: false,
    }
  }
}

const fetchAndCheck = async () => {
  const url = prompt('Enter URL to fetch and check:')
  if (!url) return

  try {
    baseUrl.value = url
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`)
    const html = await response.text()
    htmlContent.value = html

    const links = extractLinks(html)
    const total = links.length
    results.value = []
    isChecking.value = true
    let completed = 0

    for (const link of links) {
      let fullUrl = link.url
      if (link.url.startsWith('/')) {
        fullUrl = url.replace(/\/$/, '') + link.url
      } else if (!link.url.startsWith('http')) {
        fullUrl = url + '/' + link.url
      }

      const status = await checkLink(fullUrl)
      results.value.push({ url: fullUrl, text: link.text, ...status })
      completed++
      progress.value = Math.round((completed / total) * 100)
    }

    isChecking.value = false
  } catch (error) {
    alert('Failed to fetch the page. Please paste HTML directly.')
    isChecking.value = false
  }
}

const checkLinks = async () => {
  if (!htmlContent.value) return

  isChecking.value = true
  progress.value = 0
  results.value = []

  const links = extractLinks(htmlContent.value)
  const total = links.length

  for (let i = 0; i < links.length; i++) {
    const link = links[i]
    let fullUrl = link.url

    if (link.url.startsWith('/')) {
      fullUrl = baseUrl.value ? baseUrl.value.replace(/\/$/, '') + link.url : window.location.origin + link.url
    } else if (!link.url.startsWith('http')) {
      fullUrl = baseUrl.value || window.location.origin + '/' + link.url
    }

    const status = await checkLink(fullUrl)
    results.value.push({ url: fullUrl, text: link.text, ...status })
    progress.value = Math.round(((i + 1) / total) * 100)
  }

  isChecking.value = false
}

const processPastedHtml = () => {
  if (pastedHtml.value) {
    htmlContent.value = pastedHtml.value
    showPasteDialog.value = false
    pastedHtml.value = ''
  }
}

const validCount = computed(() => results.value.filter((r) => r.isValid).length)
const brokenCount = computed(() => results.value.filter((r) => !r.isValid).length)

const downloadReport = () => {
  const report = results.value
    .map((r) => `${r.isValid ? '✓' : '✗'} ${r.status} - ${r.text || 'No text'} - ${r.url}`)
    .join('\n')
  const summary = `Link Checker Report\n==================\nTotal: ${results.value.length}\nValid: ${validCount.value}\nBroken: ${brokenCount.value}\n\n${report}`
  const blob = new Blob([summary], { type: 'text/plain' })
  const downloadUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = downloadUrl
  a.download = 'link-checker-report.txt'
  a.click()
  URL.revokeObjectURL(downloadUrl)
}
</script>
