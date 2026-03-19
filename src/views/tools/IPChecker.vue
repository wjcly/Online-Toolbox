<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">IP 地址查询</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div class="flex gap-4 mb-6">
          <input
            v-model="queryIp"
            type="text"
            placeholder="输入 IP 地址或留空查询本机 IP"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button @click="queryIP" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            查询
          </button>
        </div>

        <div v-if="loading" class="text-center py-8">
          <RefreshCw class="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p class="text-gray-500 mt-2">查询中...</p>
        </div>

        <div v-else-if="ipInfo" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
              <p class="text-blue-100 text-sm">IP 地址</p>
              <p class="text-2xl font-bold mt-1">{{ ipInfo.ip }}</p>
            </div>
            <div class="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
              <p class="text-green-100 text-sm">国家/地区</p>
              <p class="text-xl font-bold mt-1">{{ ipInfo.country || '-' }}</p>
            </div>
            <div class="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
              <p class="text-purple-100 text-sm">省份/城市</p>
              <p class="text-lg font-bold mt-1">{{ ipInfo.region || '-' }} {{ ipInfo.city || '-' }}</p>
            </div>
            <div class="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white">
              <p class="text-orange-100 text-sm">ISP</p>
              <p class="text-lg font-bold mt-1">{{ ipInfo.isp || '-' }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500">纬度</p>
              <p class="text-lg font-mono">{{ ipInfo.lat || '-' }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500">经度</p>
              <p class="text-lg font-mono">{{ ipInfo.lon || '-' }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500">时区</p>
              <p class="text-lg font-mono">{{ ipInfo.timezone || '-' }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500">ASN</p>
              <p class="text-lg font-mono">{{ ipInfo.as || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 class="font-semibold text-blue-900 mb-2">关于 IP 查询</h3>
        <p class="text-sm text-blue-700">
          本工具使用 ipapi.co 提供的免费 API 查询 IP 地址的地理位置信息。
          留空查询将显示您当前网络的公网 IP 地址和位置信息。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, RefreshCw } from 'lucide-vue-next'

const queryIp = ref('')
const ipInfo = ref<any>(null)
const loading = ref(false)

const queryIP = async () => {
  loading.value = true
  ipInfo.value = null

  try {
    const url = queryIp.value
      ? `https://ipapi.co/${queryIp.value}/json/`
      : 'https://ipapi.co/json/'
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.error) {
      alert('查询失败：' + data.reason)
    } else {
      ipInfo.value = data
    }
  } catch {
    alert('查询失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}
</script>
