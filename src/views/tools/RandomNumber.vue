<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">随机数生成器</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">最小值</label>
            <input
              v-model.number="min"
              type="number"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">最大值</label>
            <input
              v-model.number="max"
              type="number"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="mb-6">
          <label class="flex items-center gap-2">
            <input v-model="allowDuplicates" type="checkbox" class="rounded" />
            <span class="text-sm text-gray-700">允许重复</span>
          </label>
        </div>

        <button @click="generate()" class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          生成随机数
        </button>
      </div>

      <div v-if="randomNumbers.length > 0" class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">生成的随机数</h3>
          <button @click="copyNumbers" class="text-sm text-blue-600 hover:text-blue-800">
            复制全部
          </button>
        </div>
        <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          <div
            v-for="(num, i) in randomNumbers"
            :key="i"
            class="aspect-square flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white font-bold text-lg"
          >
            {{ num }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-xl p-6 shadow-sm cursor-pointer hover:shadow-lg transition-shadow" @click="quickPick(6, 1, 49)">
          <h3 class="font-semibold mb-2">双色球选号</h3>
          <p class="text-sm text-gray-500">生成 6 个 1-49 的随机数</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm cursor-pointer hover:shadow-lg transition-shadow" @click="quickPick(7, 1, 35)">
          <h3 class="font-semibold mb-2">大乐透选号</h3>
          <p class="text-sm text-gray-500">生成 7 个 1-35 的随机数</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import { toast } from '@/utils/toast'

const min = ref(1)
const max = ref(100)
const allowDuplicates = ref(false)
const randomNumbers = ref<number[]>([])

const generate = (count: number = 10) => {
  if (min.value >= max.value) {
    toast.error('最小值必须小于最大值')
    return
  }

  const range = max.value - min.value + 1
  if (!allowDuplicates.value && count > range) {
    toast.warning(`在不允许重复的情况下，最多只能生成 ${range} 个随机数`)
    return
  }

  randomNumbers.value = []
  
  if (allowDuplicates.value) {
    for (let i = 0; i < count; i++) {
      randomNumbers.value.push(Math.floor(Math.random() * range) + min.value)
    }
  } else {
    const pool = Array.from({ length: range }, (_, i) => min.value + i)
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length)
      randomNumbers.value.push(pool[randomIndex])
      pool.splice(randomIndex, 1)
    }
  }
}

const quickPick = (count: number, minVal: number, maxVal: number) => {
  min.value = minVal
  max.value = maxVal
  generate(count)
}

const copyNumbers = () => {
  navigator.clipboard.writeText(randomNumbers.value.join(', '))
}
</script>
