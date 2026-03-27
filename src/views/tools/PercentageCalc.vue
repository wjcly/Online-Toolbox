<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">百分比计算器</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-6">百分比计算</h2>
        
        <!-- Calculator 1: What is X% of Y? -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-medium mb-3">1. 求百分比：X 的 Y% 是多少？</h3>
          <div class="flex flex-wrap items-center gap-3">
            <input
              v-model.number="calc1Value"
              type="number"
              placeholder="数值"
              class="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-gray-500">的</span>
            <input
              v-model.number="calc1Percent"
              type="number"
              placeholder="百分比"
              class="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-gray-500">%</span>
            <span class="text-gray-500">=</span>
            <span class="text-xl font-bold text-blue-600">{{ calc1Result }}</span>
          </div>
        </div>

        <!-- Calculator 2: X is what percent of Y? -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-medium mb-3">2. 占比计算：X 是 Y 的百分之几？</h3>
          <div class="flex flex-wrap items-center gap-3">
            <input
              v-model.number="calc2Value"
              type="number"
              placeholder="部分值"
              class="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-gray-500">是</span>
            <input
              v-model.number="calc2Total"
              type="number"
              placeholder="总值"
              class="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-gray-500">的</span>
            <span class="text-xl font-bold text-blue-600">{{ calc2Result }}</span>
            <span class="text-gray-500">%</span>
          </div>
        </div>

        <!-- Calculator 3: Percentage change -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-medium mb-3">3. 增减百分比：从 X 到 Y 变化了多少？</h3>
          <div class="flex flex-wrap items-center gap-3">
            <input
              v-model.number="calc3From"
              type="number"
              placeholder="原值"
              class="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-gray-500">到</span>
            <input
              v-model.number="calc3To"
              type="number"
              placeholder="新值"
              class="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-gray-500">变化了</span>
            <span :class="['text-xl font-bold', calc3ResultClass]">{{ calc3Result }}</span>
            <span class="text-gray-500">%</span>
          </div>
        </div>

        <!-- Calculator 4: Add/Subtract percentage -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-medium mb-3">4. 加减百分比：X 加/减 Y% 是多少？</h3>
          <div class="flex flex-wrap items-center gap-3">
            <input
              v-model.number="calc4Value"
              type="number"
              placeholder="数值"
              class="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              v-model="calc4Operation"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="add">加上</option>
              <option value="subtract">减去</option>
            </select>
            <input
              v-model.number="calc4Percent"
              type="number"
              placeholder="百分比"
              class="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-gray-500">%</span>
            <span class="text-gray-500">=</span>
            <span class="text-xl font-bold text-blue-600">{{ calc4Result }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm">
        <h3 class="font-semibold mb-4">常用百分比公式</h3>
        <div class="space-y-3 text-sm text-gray-600">
          <div class="flex items-start gap-3">
            <span class="font-mono bg-gray-100 px-2 py-1 rounded">A × B%</span>
            <span>→ A 的 B% 是多少</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="font-mono bg-gray-100 px-2 py-1 rounded">(A / B) × 100</span>
            <span>→ A 是 B 的百分之几</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="font-mono bg-gray-100 px-2 py-1 rounded">((B - A) / A) × 100</span>
            <span>→ 从 A 到 B 的变化百分比</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="font-mono bg-gray-100 px-2 py-1 rounded">A × (1 ± B%)</span>
            <span>→ A 加/减 B% 后的值</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'

// Calculator 1: What is X% of Y?
const calc1Value = ref<number | null>(null)
const calc1Percent = ref<number | null>(null)

const calc1Result = computed(() => {
  if (calc1Value.value === null || calc1Percent.value === null) return '-'
  return ((calc1Value.value * calc1Percent.value) / 100).toFixed(2)
})

// Calculator 2: X is what percent of Y?
const calc2Value = ref<number | null>(null)
const calc2Total = ref<number | null>(null)

const calc2Result = computed(() => {
  if (calc2Value.value === null || calc2Total.value === null || calc2Total.value === 0) return '-'
  return ((calc2Value.value / calc2Total.value) * 100).toFixed(2)
})

// Calculator 3: Percentage change
const calc3From = ref<number | null>(null)
const calc3To = ref<number | null>(null)

const calc3Result = computed(() => {
  if (calc3From.value === null || calc3To.value === null || calc3From.value === 0) return '-'
  const change = ((calc3To.value - calc3From.value) / Math.abs(calc3From.value)) * 100
  return change.toFixed(2)
})

const calc3ResultClass = computed(() => {
  if (calc3From.value === null || calc3To.value === null) return 'text-blue-600'
  const change = calc3To.value - calc3From.value
  if (change > 0) return 'text-green-600'
  if (change < 0) return 'text-red-600'
  return 'text-gray-600'
})

// Calculator 4: Add/Subtract percentage
const calc4Value = ref<number | null>(null)
const calc4Operation = ref<'add' | 'subtract'>('add')
const calc4Percent = ref<number | null>(null)

const calc4Result = computed(() => {
  if (calc4Value.value === null || calc4Percent.value === null) return '-'
  const percentValue = (calc4Value.value * calc4Percent.value) / 100
  if (calc4Operation.value === 'add') {
    return (calc4Value.value + percentValue).toFixed(2)
  }
  return (calc4Value.value - percentValue).toFixed(2)
})
</script>
