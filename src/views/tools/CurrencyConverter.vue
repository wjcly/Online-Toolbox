<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">货币换算</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-4">汇率换算</h2>
        
        <div class="mb-4">
          <p class="text-sm text-gray-500 mb-2">
            * 汇率数据仅供参考，实际交易以银行柜台成交价为准
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">金额</label>
            <input
              v-model.number="amount"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">从</label>
            <select
              v-model="fromCurrency"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
                {{ currency.code }} - {{ currency.name }}
              </option>
            </select>
          </div>

          <div class="flex items-end justify-center">
            <button
              @click="swapCurrencies"
              class="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="交换"
            >
              <ArrowLeftRight class="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">到</label>
            <select
              v-model="toCurrency"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
                {{ currency.code }} - {{ currency.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex gap-4">
          <button
            @click="convert"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw class="w-4 h-4" />
            换算
          </button>
          <button
            @click="copyResult"
            :disabled="!result"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Copy class="w-4 h-4" />
            复制结果
          </button>
        </div>
      </div>

      <div v-if="result" class="bg-white rounded-xl shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h3 class="font-semibold">换算结果</h3>
        </div>
        <div class="p-4">
          <p class="text-3xl font-bold text-gray-900 mb-2">{{ result }}</p>
          <p class="text-sm text-gray-500">1 {{ fromCurrency }} = {{ rate }} {{ toCurrency }}</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm mt-6">
        <div class="p-4 border-b border-gray-200">
          <h3 class="font-semibold">常用汇率参考</h3>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-gray-500">美元 → 人民币</p>
              <p class="font-semibold text-blue-600">1 USD ≈ 7.25 CNY</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-gray-500">欧元 → 人民币</p>
              <p class="font-semibold text-blue-600">1 EUR ≈ 7.85 CNY</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-gray-500">日元 → 人民币</p>
              <p class="font-semibold text-blue-600">1 JPY ≈ 0.048 CNY</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-gray-500">英镑 → 人民币</p>
              <p class="font-semibold text-blue-600">1 GBP ≈ 9.15 CNY</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, ArrowLeftRight, RefreshCw, Copy } from 'lucide-vue-next'

const amount = ref(1)
const fromCurrency = ref('USD')
const toCurrency = ref('CNY')
const result = ref('')
const rate = ref('')

const currencies = [
  { code: 'USD', name: '美元' },
  { code: 'EUR', name: '欧元' },
  { code: 'GBP', name: '英镑' },
  { code: 'JPY', name: '日元' },
  { code: 'CNY', name: '人民币' },
  { code: 'HKD', name: '港币' },
  { code: 'KRW', name: '韩元' },
  { code: 'AUD', name: '澳元' },
  { code: 'CAD', name: '加元' },
  { code: 'SGD', name: '新加坡元' },
  { code: 'CHF', name: '瑞士法郎' },
  { code: 'INR', name: '印度卢比' },
  { code: 'RUB', name: '俄罗斯卢布' },
  { code: 'BRL', name: '巴西雷亚尔' },
  { code: 'ZAR', name: '南非兰特' },
  { code: 'TWD', name: '新台币' },
  { code: 'THB', name: '泰铢' },
  { code: 'MYR', name: '马来西亚林吉特' },
  { code: 'IDR', name: '印度尼西亚盾' },
  { code: 'PHP', name: '菲律宾比索' },
]

// Approximate exchange rates (base: USD)
const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CNY: 7.25,
  HKD: 7.82,
  KRW: 1320,
  AUD: 1.52,
  CAD: 1.36,
  SGD: 1.34,
  CHF: 0.88,
  INR: 83.2,
  RUB: 92.5,
  BRL: 4.97,
  ZAR: 18.85,
  TWD: 31.5,
  THB: 35.2,
  MYR: 4.68,
  IDR: 15680,
  PHP: 55.8,
}

const convertCurrency = (from: string, to: string): number => {
  const fromRate = exchangeRates[from]
  const toRate = exchangeRates[to]
  if (!fromRate || !toRate) return 0
  return toRate / fromRate
}

const swapCurrencies = () => {
  const temp = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = temp
  convert()
}

const convert = () => {
  const calculatedRate = convertCurrency(fromCurrency.value, toCurrency.value)
  rate.value = calculatedRate.toFixed(6)
  const convertedAmount = amount.value * calculatedRate
  result.value = `${amount.value} ${fromCurrency.value} = ${convertedAmount.toFixed(2)} ${toCurrency.value}`
}

const copyResult = () => {
  navigator.clipboard.writeText(result.value)
}

// Initial conversion
convert()
</script>
