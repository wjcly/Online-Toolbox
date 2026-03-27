<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">联系方式格式化工具</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Input Section -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">基本信息</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input v-model="contact.name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="张三" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                <input v-model="contact.phone" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="13800138000" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input v-model="contact.email" type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="zhangsan@example.com" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">微信号（可选）</label>
                <input v-model="contact.wechat" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="zhangsan_wechat" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">地址信息</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">省份/城市</label>
                <input v-model="contact.city" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="北京市" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">详细地址（可选）</label>
                <input v-model="contact.address" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="朝阳区 xx 街道 xx 号" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">社交链接（可选）</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                <input v-model="contact.github" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://github.com/zhangsan" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input v-model="contact.linkedin" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://linkedin.com/in/zhangsan" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">个人网站/博客</label>
                <input v-model="contact.website" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://zhangsan.com" />
              </div>
            </div>
          </div>

          <button @click="generate" class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            生成格式化结果
          </button>
        </div>

        <!-- Output Section -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">预览效果</h2>
            
            <div v-if="hasContent" class="border rounded-lg p-6 bg-gray-50">
              <div class="text-center mb-4">
                <h3 class="text-2xl font-bold text-gray-900">{{ contact.name || '姓名' }}</h3>
                <p class="text-gray-500 text-sm mt-1">{{ contact.city || '城市' }}{{ contact.address ? ' · ' + contact.address : '' }}</p>
              </div>
              
              <div class="flex flex-wrap justify-center gap-3 text-sm text-gray-600 mb-4">
                <span v-if="contact.phone" class="flex items-center gap-1">
                  <Phone class="w-4 h-4" /> {{ formatPhone(contact.phone) }}
                </span>
                <span v-if="contact.email" class="flex items-center gap-1">
                  <Mail class="w-4 h-4" /> {{ contact.email }}
                </span>
                <span v-if="contact.wechat" class="flex items-center gap-1">
                  <MessageSquare class="w-4 h-4" /> {{ contact.wechat }}
                </span>
              </div>
              
              <div v-if="hasSocialLinks" class="flex justify-center gap-3 text-sm text-blue-600">
                <a v-if="contact.github" :href="contact.github" target="_blank" class="hover:underline flex items-center gap-1">
                  <Github class="w-4 h-4" /> GitHub
                </a>
                <a v-if="contact.linkedin" :href="contact.linkedin" target="_blank" class="hover:underline flex items-center gap-1">
                  <Linkedin class="w-4 h-4" /> LinkedIn
                </a>
                <a v-if="contact.website" :href="contact.website" target="_blank" class="hover:underline flex items-center gap-1">
                  <Globe class="w-4 h-4" /> 个人网站
                </a>
              </div>
            </div>
            
            <div v-else class="text-center py-16">
              <User class="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p class="text-gray-400">填写信息后预览</p>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">输出格式</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">简洁一行式</label>
                <div class="flex gap-2">
                  <input readonly :value="outputFormats.simple" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                  <button @click="copyToClipboard(outputFormats.simple)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    <Copy class="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">标准格式</label>
                <div class="flex gap-2">
                  <input readonly :value="outputFormats.standard" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                  <button @click="copyToClipboard(outputFormats.standard)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    <Copy class="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">详细格式</label>
                <textarea readonly :value="outputFormats.detailed" rows="4" class="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm font-mono" />
                <button @click="copyToClipboard(outputFormats.detailed)" class="mt-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm flex items-center gap-2">
                  <Copy class="w-4 h-4" /> 复制详细格式
                </button>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">JSON 格式</label>
                <textarea readonly :value="outputFormats.json" rows="6" class="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm font-mono" />
                <button @click="copyToClipboard(outputFormats.json)" class="mt-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm flex items-center gap-2">
                  <Copy class="w-4 h-4" /> 复制 JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { ArrowLeft, Copy, Phone, Mail, MessageSquare, Github, Linkedin, Globe, User } from 'lucide-vue-next'

const contact = reactive({
  name: '',
  phone: '',
  email: '',
  wechat: '',
  city: '',
  address: '',
  github: '',
  linkedin: '',
  website: '',
})

const hasContent = computed(() => {
  return Object.values(contact).some(v => v.trim())
})

const hasSocialLinks = computed(() => {
  return contact.github || contact.linkedin || contact.website
})

const formatPhone = (phone: string) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
  }
  return phone
}

const outputFormats = computed(() => {
  const parts: string[] = []
  
  if (contact.phone) parts.push(formatPhone(contact.phone))
  if (contact.email) parts.push(contact.email)
  if (contact.wechat) parts.push(`微信：${contact.wechat}`)
  
  const location = [contact.city, contact.address].filter(Boolean).join(' · ')
  
  return {
    simple: [contact.name, location, ...parts].filter(Boolean).join(' | '),
    standard: `${contact.name}\n${location}\n${parts.join(' | ')}`,
    detailed: `${contact.name || ''}
${location || ''}
手机：${formatPhone(contact.phone) || ''}
邮箱：${contact.email || ''}
${contact.wechat ? `微信：${contact.wechat}` : ''}
${contact.github ? `GitHub：${contact.github}` : ''}
${contact.linkedin ? `LinkedIn：${contact.linkedin}` : ''}
${contact.website ? `个人网站：${contact.website}` : ''}`.trim(),
    json: JSON.stringify({
      name: contact.name,
      contact: {
        phone: contact.phone,
        email: contact.email,
        wechat: contact.wechat,
      },
      location: {
        city: contact.city,
        address: contact.address,
      },
      social: {
        github: contact.github,
        linkedin: contact.linkedin,
        website: contact.website,
      },
    }, null, 2),
  }
})

const generate = () => {
  // Trigger recompute
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}
</script>
