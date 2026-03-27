<template>
  <div class="tool-page h-screen flex flex-col">
    <header class="bg-white border-b border-gray-200 flex-shrink-0">
      <div class="px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">Office Viewer</h1>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-hidden">
      <div v-if="!file" class="h-full flex items-center justify-center p-8">
        <div class="text-center py-16">
          <div class="bg-gradient-to-br from-blue-100 to-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText class="w-12 h-12 text-blue-600" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Upload Office Document
          </h2>
          <p class="text-gray-500 mb-8">
            Edit Word, Excel, and PowerPoint files directly in your browser with OnlyOffice
          </p>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div class="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors">
              <FileText class="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p class="text-sm font-medium text-green-700">Word</p>
              <p class="text-xs text-green-600 mt-1">.docx, .doc, .odt</p>
            </div>
            <div class="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors">
              <FileText class="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p class="text-sm font-medium text-blue-700">Excel</p>
              <p class="text-xs text-blue-600 mt-1">.xlsx, .xls, .ods</p>
            </div>
            <div class="p-4 bg-orange-50 rounded-xl text-center hover:bg-orange-100 transition-colors col-span-2 md:col-span-1">
              <FileText class="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p class="text-sm font-medium text-orange-700">PowerPoint</p>
              <p class="text-xs text-orange-600 mt-1">.pptx, .ppt, .odp</p>
            </div>
          </div>

          <label class="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer text-lg font-medium shadow-lg shadow-blue-600/20">
            <Upload class="w-6 h-6" />
            Choose File
            <input
              ref="fileInputRef"
              type="file"
              accept=".docx,.doc,.xlsx,.xls,.pptx,.ppt,.odt,.ods,.odp"
              @change="handleFileUpload"
              class="hidden"
            />
          </label>

          <p class="text-sm text-gray-400 mt-6">
            or drag and drop files here
          </p>

          <div class="mt-8 p-4 bg-amber-50 rounded-lg max-w-md mx-auto">
            <p class="text-sm text-amber-800">
              <strong>Note:</strong> Files are processed locally in your browser.
              No data is sent to external servers.
            </p>
          </div>
        </div>
      </div>

      <div v-else class="h-full">
        <VueOnlyOfficeLocal
          :file="file"
          :file-name="file.name"
          sdk-url="/office/web-apps/apps/api/documents/api.js"
          x2t-url="/office/wasm/x2t/x2t.js"
          @ready="onEditorReady"
          @error="onEditorError"
          @document-ready="onDocumentReady"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Upload, FileText } from 'lucide-vue-next'
import { VueOnlyOfficeLocal } from '@zzk-1015/vue-onlyoffice-local'
import '@zzk-1015/vue-onlyoffice-local/style.css'
import { toast } from '@/utils/toast'

// 设置 OnlyOffice 的基础路径
declare global {
  interface Window {
    extensionParams?: {
      url: string
    }
  }
}
window.extensionParams = {
  url: '/office/web-apps/'
}

const file = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
  }
}

const onEditorReady = (editor: any) => {
  console.log('Editor initialized:', editor)
}

const onEditorError = (err: Error) => {
  console.error('Editor failed:', err)
  toast.error('Failed to initialize editor: ' + err.message)
}

const onDocumentReady = () => {
  console.log('Document is ready')
}
</script>
