<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">格式转换</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Input Section -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-4">输入</h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">源格式</label>
            <select
              v-model="sourceFormat"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="xml">XML</option>
              <option value="txt">纯文本</option>
              <option value="base64">Base64</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">上传文件或粘贴内容</label>
            <label class="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors mb-2">
              <Upload class="w-4 h-4" />
              <span class="text-sm">选择文件</span>
              <input type="file" @change="handleFileUpload" class="hidden" />
            </label>
            <textarea
              v-model="inputContent"
              placeholder="或在此粘贴内容..."
              class="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            ></textarea>
          </div>
        </div>

        <!-- Output Section -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-4">输出</h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">目标格式</label>
            <select
              v-model="targetFormat"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="xml">XML</option>
              <option value="txt">纯文本</option>
              <option value="base64">Base64</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">结果</label>
            <textarea
              v-model="outputContent"
              readonly
              placeholder="转换结果将显示在此处"
              class="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-gray-50"
            ></textarea>
          </div>
          <div class="flex gap-2">
            <button
              @click="convert"
              :disabled="isConverting || !inputContent"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RefreshCw :class="{ 'animate-spin': isConverting }" class="w-4 h-4" />
              {{ isConverting ? '转换中...' : '转换' }}
            </button>
            <button
              v-if="outputContent"
              @click="download"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download class="w-4 h-4" />
              下载
            </button>
          </div>
        </div>
      </div>

      <!-- Supported Conversions -->
      <div class="mt-6 bg-white rounded-xl p-6 shadow-sm">
        <h3 class="font-semibold mb-4">支持的转换</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium">JSON ↔ CSV</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium">JSON ↔ XML</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium">文本 ↔ Base64</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium">CSV ↔ XML</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Upload, Download, RefreshCw } from 'lucide-vue-next'

const inputContent = ref('')
const outputContent = ref('')
const sourceFormat = ref('json')
const targetFormat = ref('csv')
const isConverting = ref(false)

const handleFileUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    inputContent.value = event.target?.result as string
  }
  reader.readAsText(file)
}

const jsonToCsv = (json: string): string => {
  try {
    const data = JSON.parse(json)
    const array = Array.isArray(data) ? data : [data]
    if (array.length === 0) return ''

    const headers = Object.keys(array[0])
    const csvRows = [headers.join(',')]

    for (const row of array) {
      const values = headers.map((header) => {
        const val = row[header]
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      })
      csvRows.push(values.join(','))
    }

    return csvRows.join('\n')
  } catch {
    throw new Error('无效的 JSON 格式')
  }
}

const csvToJson = (csv: string): string => {
  const lines = csv.trim().split('\n')
  if (lines.length === 0) return '[]'

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  const result = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
    const obj: Record<string, string> = {}
    headers.forEach((header, index) => {
      obj[header] = values[index] || ''
    })
    result.push(obj)
  }

  return JSON.stringify(result, null, 2)
}

const jsonToXml = (json: string): string => {
  try {
    const data = JSON.parse(json)

    const convert = (obj: unknown): string => {
      if (Array.isArray(obj)) {
        return obj.map((item) => convert(item)).join('')
      } else if (typeof obj === 'object' && obj !== null) {
        const entries = Object.entries(obj)
        return entries.map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            return `<${key}>${convert(value)}</${key}>`
          }
          return `<${key}>${value}</${key}>`
        }).join('')
      }
      return String(obj)
    }

    return `<?xml version="1.0" encoding="UTF-8"?>\n<root>${convert(data)}</root>`
  } catch {
    throw new Error('无效的 JSON 格式')
  }
}

const xmlToJson = (xml: string): string => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')

  const parseNode = (node: Element): unknown => {
    const children = Array.from(node.children)
    if (children.length === 0) {
      return node.textContent
    }

    const result: Record<string, unknown> = {}
    children.forEach((child) => {
      const value = parseNode(child)
      if (result[child.nodeName]) {
        if (Array.isArray(result[child.nodeName])) {
          (result[child.nodeName] as unknown[]).push(value)
        } else {
          result[child.nodeName] = [result[child.nodeName], value]
        }
      } else {
        result[child.nodeName] = value
      }
    })

    return result
  }

  return JSON.stringify(parseNode(doc.documentElement), null, 2)
}

const csvToXml = (csv: string): string => {
  const json = csvToJson(csv)
  return jsonToXml(json)
}

const xmlToCsv = (xml: string): string => {
  const json = xmlToJson(xml)
  return jsonToCsv(json)
}

const convert = () => {
  isConverting.value = true
  outputContent.value = ''

  try {
    let result = ''

    if (sourceFormat.value === 'json' && targetFormat.value === 'csv') {
      result = jsonToCsv(inputContent.value)
    } else if (sourceFormat.value === 'csv' && targetFormat.value === 'json') {
      result = csvToJson(inputContent.value)
    } else if (sourceFormat.value === 'json' && targetFormat.value === 'xml') {
      result = jsonToXml(inputContent.value)
    } else if (sourceFormat.value === 'xml' && targetFormat.value === 'json') {
      result = xmlToJson(inputContent.value)
    } else if (sourceFormat.value === 'csv' && targetFormat.value === 'xml') {
      result = csvToXml(inputContent.value)
    } else if (sourceFormat.value === 'xml' && targetFormat.value === 'csv') {
      result = xmlToCsv(inputContent.value)
    } else if (targetFormat.value === 'base64') {
      result = btoa(inputContent.value)
    } else if (sourceFormat.value === 'base64') {
      result = atob(inputContent.value)
    } else if (targetFormat.value === 'txt') {
      result = inputContent.value
    } else {
      throw new Error('不支持的转换类型')
    }

    outputContent.value = result
  } catch (error) {
    alert(error instanceof Error ? error.message : '转换失败')
  }

  isConverting.value = false
}

const download = () => {
  const ext = targetFormat.value === 'json' ? 'json' : targetFormat.value === 'csv' ? 'csv' : targetFormat.value === 'xml' ? 'xml' : 'txt'
  const blob = new Blob([outputContent.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `converted.${ext}`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
