<template>
  <div class="tool-page min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/tools/id-photo-maker')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft class="w-5 h-5 text-gray-600" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">服装素材管理</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Upload Section -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">上传服装素材</h2>
        <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="hidden"
            ref="fileInput"
            multiple
          />
          <label @click="fileInput?.click()" class="cursor-pointer">
            <Upload class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 font-medium">点击或拖拽上传服装图片</p>
            <p class="text-sm text-gray-400 mt-2">支持 JPG、PNG 格式，建议使用纯色背景的服装照片</p>
          </label>
        </div>

        <!-- Uploaded Files Preview -->
        <div v-if="uploadedFiles.length > 0" class="mt-6">
          <h3 class="text-sm font-medium text-gray-700 mb-3">已上传的服装</h3>
          <div class="grid grid-cols-4 gap-4">
            <div v-for="file in uploadedFiles" :key="file.id" class="relative group">
              <div class="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img :src="file.preview" :alt="file.name" class="w-full h-full object-cover" />
              </div>
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button @click="useClothing(file)" class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                  使用
                </button>
                <button @click="removeFile(file.id)" class="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">
                  删除
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1 truncate">{{ file.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">服装素材要求</h2>
        <div class="space-y-3 text-sm text-gray-600">
          <div class="flex gap-3">
            <div class="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">✓</div>
            <div>
              <strong>最佳格式：</strong>PNG 透明背景图片
            </div>
          </div>
          <div class="flex gap-3">
            <div class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">ℹ</div>
            <div>
              <strong>JPG 图片：</strong>会自动处理，但建议使用纯色背景拍摄
            </div>
          </div>
          <div class="flex gap-3">
            <div class="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">📐</div>
            <div>
              <strong>建议尺寸：</strong>400x500 像素或更大，保持清晰
            </div>
          </div>
          <div class="flex gap-3">
            <div class="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">👔</div>
            <div>
              <strong>拍摄角度：</strong>正面平视，服装完整展示肩部和领口
            </div>
          </div>
        </div>

        <div class="mt-6 p-4 bg-gray-50 rounded-xl">
          <h3 class="font-medium text-gray-900 mb-2">如何使用外部服装素材：</h3>
          <ol class="list-decimal list-inside space-y-1 text-sm text-gray-600">
            <li>将服装图片上传到此页面</li>
            <li>点击"使用"按钮选择服装</li>
            <li>在证件照制作页面即可使用该服装</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Upload } from 'lucide-vue-next'

interface UploadedFile {
  id: string
  name: string
  file: File
  preview: string
}

const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFiles = ref<UploadedFile[]>([])

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const reader = new FileReader()
    
    reader.onload = (e) => {
      uploadedFiles.value.push({
        id: `${file.name}-${Date.now()}-${i}`,
        name: file.name,
        file: file,
        preview: e.target?.result as string
      })
    }
    
    reader.readAsDataURL(file)
  }
  
  // Reset input
  input.value = ''
}

const removeFile = (id: string) => {
  const index = uploadedFiles.value.findIndex(f => f.id === id)
  if (index > -1) {
    uploadedFiles.value.splice(index, 1)
  }
}

const useClothing = (file: UploadedFile) => {
  // Save to localStorage for IdPhotoMaker to use
  const customClothing = {
    id: file.id,
    name: file.name.replace(/\.[^/.]+$/, ''),
    type: 'suit' as const,
    color: '#333333',
    imageSrc: file.preview
  }
  
  // Get existing custom clothing
  const existing = localStorage.getItem('customClothing')
  let customClothings = existing ? JSON.parse(existing) : []
  
  // Add new clothing
  customClothings.push(customClothing)
  localStorage.setItem('customClothing', JSON.stringify(customClothings))
  
  // Redirect to IdPhotoMaker
  router.push('/tools/id-photo-maker')
}
</script>

<style scoped>
input[type="file"] {
  display: none;
}
</style>
