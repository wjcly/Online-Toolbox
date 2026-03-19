<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">Web Scraper</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-4">Fetch Web Page</h2>
        <div class="flex gap-4">
          <input
            v-model="url"
            type="url"
            placeholder="Enter URL (e.g., https://example.com)"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="fetchPage"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Search class="w-4 h-4" />
            Fetch
          </button>
          <button
            @click="showPasteDialog = true"
            class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Paste HTML
          </button>
        </div>
      </div>

      <div v-if="htmlContent" class="bg-white rounded-xl shadow-sm mb-6">
        <div class="flex border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-6 py-3 text-sm font-medium capitalize transition-colors',
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            {{ tab }} ({{ getDataCount(tab) }})
          </button>
        </div>

        <div class="p-6">
          <div v-if="activeTab === 'links'">
            <div v-if="extractedData.links.length === 0" class="text-gray-500">No links found</div>
            <div v-else class="space-y-2">
              <div
                v-for="(link, index) in extractedData.links"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ link.text || 'No text' }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ link.href }}</p>
                </div>
                <div class="flex gap-2">
                  <button @click="copyToClipboard(link.href)" class="p-2 hover:bg-gray-200 rounded" title="Copy URL">
                    <Copy class="w-4 h-4" />
                  </button>
                  <a
                    v-if="link.href.startsWith('http')"
                    :href="link.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-2 hover:bg-gray-200 rounded"
                  >
                    <ExternalLink class="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'images'">
            <div v-if="extractedData.images.length === 0" class="text-gray-500">No images found</div>
            <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="(img, index) in extractedData.images" :key="index" class="bg-gray-50 rounded-lg p-3">
                <img
                  :src="img.src"
                  :alt="img.alt || 'No alt text'"
                  class="w-full h-32 object-cover rounded mb-2"
                  @error="handleImageError"
                />
                <p class="text-xs text-gray-500 truncate">{{ img.alt || 'No alt text' }}</p>
                <button
                  @click="copyToClipboard(img.src)"
                  class="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Copy class="w-3 h-3" />
                  Copy URL
                </button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'headings'">
            <div v-if="extractedData.headings.length === 0" class="text-gray-500">No headings found</div>
            <div v-else class="space-y-2">
              <div
                v-for="(heading, index) in extractedData.headings"
                :key="index"
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-mono">{{ heading.level }}</span>
                <span class="text-gray-900">{{ heading.text }}</span>
                <button @click="copyToClipboard(heading.text)" class="ml-auto p-2 hover:bg-gray-200 rounded">
                  <Copy class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'paragraphs'">
            <div v-if="extractedData.paragraphs.length === 0" class="text-gray-500">No paragraphs found</div>
            <div v-else class="space-y-2">
              <div v-for="(para, index) in extractedData.paragraphs" :key="index" class="p-3 bg-gray-50 rounded-lg">
                <p class="text-gray-700 text-sm">{{ para }}</p>
                <button
                  @click="copyToClipboard(para)"
                  class="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Copy class="w-3 h-3" />
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="htmlContent" class="flex justify-end">
        <button
          @click="downloadData"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Download class="w-4 h-4" />
          Export JSON
        </button>
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
import { ref } from 'vue'
import { ArrowLeft, Search, Copy, ExternalLink, Download } from 'lucide-vue-next'

const url = ref('')
const htmlContent = ref('')
const pastedHtml = ref('')
const showPasteDialog = ref(false)
const activeTab = ref('links')
const tabs = ['links', 'images', 'headings', 'paragraphs']

const extractedData = ref({
  links: [] as { text: string; href: string }[],
  images: [] as { src: string; alt: string }[],
  headings: [] as { level: string; text: string }[],
  paragraphs: [] as string[],
})

const parseHTML = (html: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  extractedData.value.links = Array.from(doc.querySelectorAll('a')).map((a) => ({
    text: a.textContent?.trim() || '',
    href: a.getAttribute('href') || '',
  }))

  extractedData.value.images = Array.from(doc.querySelectorAll('img')).map((img) => ({
    src: img.getAttribute('src') || '',
    alt: img.getAttribute('alt') || '',
  }))

  extractedData.value.headings = []
  ;['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag) => {
    Array.from(doc.querySelectorAll(tag)).forEach((el) => {
      extractedData.value.headings.push({ level: tag, text: el.textContent?.trim() || '' })
    })
  })

  extractedData.value.paragraphs = Array.from(doc.querySelectorAll('p')).map((p) => p.textContent?.trim() || '')
}

const fetchPage = async () => {
  if (!url.value) return
  try {
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url.value)}`)
    const html = await response.text()
    htmlContent.value = html
    parseHTML(html)
  } catch (error) {
    alert('Failed to fetch the page. Please try pasting HTML directly.')
  }
}

const processPastedHtml = () => {
  if (pastedHtml.value) {
    htmlContent.value = pastedHtml.value
    parseHTML(pastedHtml.value)
    showPasteDialog.value = false
    pastedHtml.value = ''
  }
}

const getDataCount = (tab: string) => {
  const data = extractedData.value[tab as keyof typeof extractedData.value]
  return Array.isArray(data) ? data.length : 0
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23ccc" width="100" height="100"/><text x="50" y="50" text-anchor="middle" fill="%23666">Broken</text></svg>'
}

const downloadData = () => {
  const data = JSON.stringify(extractedData.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const downloadUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = downloadUrl
  a.download = 'extracted-data.json'
  a.click()
  URL.revokeObjectURL(downloadUrl)
}
</script>
