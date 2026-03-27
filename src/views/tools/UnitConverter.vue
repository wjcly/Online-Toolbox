<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">单位换算</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-4">长度、重量、温度等单位换算</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">类别</label>
            <select
              v-model="category"
              @change="onCategoryChange"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="length">长度</option>
              <option value="weight">重量</option>
              <option value="temperature">温度</option>
              <option value="area">面积</option>
              <option value="volume">体积</option>
              <option value="speed">速度</option>
              <option value="time">时间</option>
              <option value="data">数据存储</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">数值</label>
            <input
              v-model.number="value"
              type="number"
              step="any"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">从单位</label>
            <select
              v-model="fromUnit"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="unit in currentUnits" :key="unit.value" :value="unit.value">
                {{ unit.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">到单位</label>
          <select
            v-model="toUnit"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="unit in currentUnits" :key="unit.value" :value="unit.value">
              {{ unit.label }}
            </option>
          </select>
        </div>

        <div class="flex gap-4">
          <button
            @click="convert"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw class="w-4 h-4" />
            转换
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
          <h3 class="font-semibold">转换结果</h3>
        </div>
        <div class="p-4">
          <p class="text-2xl font-bold text-gray-900">{{ result }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, RefreshCw, Copy } from 'lucide-vue-next'

const category = ref('length')
const value = ref(1)
const fromUnit = ref('m')
const toUnit = ref('ft')

const units: Record<string, { value: string; label: string; factor: number }[]> = {
  length: [
    { value: 'm', label: '米 (m)', factor: 1 },
    { value: 'km', label: '千米 (km)', factor: 1000 },
    { value: 'cm', label: '厘米 (cm)', factor: 0.01 },
    { value: 'mm', label: '毫米 (mm)', factor: 0.001 },
    { value: 'ft', label: '英尺 (ft)', factor: 0.3048 },
    { value: 'in', label: '英寸 (in)', factor: 0.0254 },
    { value: 'yd', label: '码 (yd)', factor: 0.9144 },
    { value: 'mi', label: '英里 (mi)', factor: 1609.344 },
  ],
  weight: [
    { value: 'kg', label: '千克 (kg)', factor: 1 },
    { value: 'g', label: '克 (g)', factor: 0.001 },
    { value: 'mg', label: '毫克 (mg)', factor: 0.000001 },
    { value: 'lb', label: '磅 (lb)', factor: 0.453592 },
    { value: 'oz', label: '盎司 (oz)', factor: 0.0283495 },
    { value: 't', label: '吨 (t)', factor: 1000 },
  ],
  temperature: [
    { value: 'c', label: '摄氏度 (°C)', factor: 1 },
    { value: 'f', label: '华氏度 (°F)', factor: 1 },
    { value: 'k', label: '开尔文 (K)', factor: 1 },
  ],
  area: [
    { value: 'm2', label: '平方米 (m²)', factor: 1 },
    { value: 'km2', label: '平方千米 (km²)', factor: 1000000 },
    { value: 'cm2', label: '平方厘米 (cm²)', factor: 0.0001 },
    { value: 'ft2', label: '平方英尺 (ft²)', factor: 0.092903 },
    { value: 'acre', label: '英亩 (acre)', factor: 4046.86 },
    { value: 'ha', label: '公顷 (ha)', factor: 10000 },
  ],
  volume: [
    { value: 'l', label: '升 (L)', factor: 1 },
    { value: 'ml', label: '毫升 (mL)', factor: 0.001 },
    { value: 'm3', label: '立方米 (m³)', factor: 1000 },
    { value: 'gal', label: '加仑 (gal)', factor: 3.78541 },
    { value: 'qt', label: '夸脱 (qt)', factor: 0.946353 },
    { value: 'pt', label: '品脱 (pt)', factor: 0.473176 },
  ],
  speed: [
    { value: 'm/s', label: '米/秒 (m/s)', factor: 1 },
    { value: 'km/h', label: '千米/时 (km/h)', factor: 0.277778 },
    { value: 'mph', label: '英里/时 (mph)', factor: 0.44704 },
    { value: 'kn', label: '节 (kn)', factor: 0.514444 },
  ],
  time: [
    { value: 's', label: '秒 (s)', factor: 1 },
    { value: 'min', label: '分钟 (min)', factor: 60 },
    { value: 'h', label: '小时 (h)', factor: 3600 },
    { value: 'd', label: '天 (d)', factor: 86400 },
    { value: 'wk', label: '周 (wk)', factor: 604800 },
    { value: 'ms', label: '毫秒 (ms)', factor: 0.001 },
  ],
  data: [
    { value: 'B', label: '字节 (B)', factor: 1 },
    { value: 'KB', label: '千字节 (KB)', factor: 1024 },
    { value: 'MB', label: '兆字节 (MB)', factor: 1048576 },
    { value: 'GB', label: '吉字节 (GB)', factor: 1073741824 },
    { value: 'TB', label: '太字节 (TB)', factor: 1099511627776 },
    { value: 'b', label: '比特 (bit)', factor: 0.125 },
  ],
}

const currentUnits = computed(() => units[category.value])

const onCategoryChange = () => {
  fromUnit.value = currentUnits.value[0].value
  toUnit.value = currentUnits.value[1]?.value || currentUnits.value[0].value
  result.value = ''
}

const result = ref('')

const convertTemperature = (value: number, from: string, to: string): number => {
  let celsius: number
  // Convert to Celsius first
  if (from === 'c') celsius = value
  else if (from === 'f') celsius = (value - 32) * 5 / 9
  else if (from === 'k') celsius = value - 273.15
  else celsius = value
  
  // Convert from Celsius to target
  if (to === 'c') return celsius
  if (to === 'f') return celsius * 9 / 5 + 32
  if (to === 'k') return celsius + 273.15
  return celsius
}

const convert = () => {
  if (category.value === 'temperature') {
    const converted = convertTemperature(value.value, fromUnit.value, toUnit.value)
    result.value = `${value.value} ${getUnitLabel(fromUnit.value)} = ${converted.toFixed(4)} ${getUnitLabel(toUnit.value)}`
  } else {
    const fromFactor = currentUnits.value.find((u) => u.value === fromUnit.value)?.factor || 1
    const toFactor = currentUnits.value.find((u) => u.value === toUnit.value)?.factor || 1
    const converted = (value.value * fromFactor) / toFactor
    result.value = `${value.value} ${getUnitLabel(fromUnit.value)} = ${converted.toFixed(6)} ${getUnitLabel(toUnit.value)}`
  }
}

const getUnitLabel = (unitValue: string) => {
  return currentUnits.value.find((u) => u.value === unitValue)?.label || unitValue
}

const copyResult = () => {
  navigator.clipboard.writeText(result.value)
}
</script>
