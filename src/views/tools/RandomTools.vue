<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">随机小工具</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Tab Navigation -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex gap-2 mb-6 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all',
            activeTab === tab.id
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4 inline-block mr-1" />
          {{ tab.name }}
        </button>
      </div>

      <!-- Coin Flip -->
      <div v-if="activeTab === 'coin'" class="bg-white rounded-xl p-8 shadow-sm">
        <div class="text-center">
          <div class="relative w-48 h-48 mx-auto mb-8 perspective-1000">
            <div
              class="relative w-full h-full transition-transform duration-1000"
              :style="{ transform: coinRotation }"
            >
              <!-- Front (Heads) -->
              <div
                class="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center backface-hidden shadow-lg"
              >
                <div class="text-center">
                  <span class="text-4xl font-bold text-white">正面</span>
                  <p class="text-yellow-100 text-sm">HEADS</p>
                </div>
              </div>
              <!-- Back (Tails) -->
              <div
                class="absolute inset-0 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center backface-hidden shadow-lg"
                style="transform: rotateY(180deg)"
              >
                <div class="text-center">
                  <span class="text-4xl font-bold text-white">反面</span>
                  <p class="text-gray-200 text-sm">TAILS</p>
                </div>
              </div>
            </div>
          </div>

          <button
            @click="flipCoin"
            :disabled="isFlipping"
            class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {{ isFlipping ? '抛掷中...' : '抛硬币' }}
          </button>

          <div v-if="coinResult" class="mt-6 p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-600">结果：<span class="font-bold text-blue-600">{{ coinResult }}</span></p>
          </div>
        </div>
      </div>

      <!-- Dice Roll -->
      <div v-if="activeTab === 'dice'" class="bg-white rounded-xl p-8 shadow-sm">
        <div class="text-center">
          <div class="flex justify-center gap-4 mb-8 flex-wrap">
            <div
              v-for="(die, index) in dice"
              :key="index"
              class="w-20 h-20 bg-white border-2 border-gray-300 rounded-xl shadow-lg flex items-center justify-center"
            >
              <div class="grid grid-cols-3 gap-1 w-12 h-12">
                <div
                  v-for="dot in 9"
                  :key="dot"
                  :class="[
                    'rounded-full transition-all',
                    showDiceDot(die.value, dot)
                      ? 'bg-gray-800 scale-100'
                      : 'bg-transparent scale-0'
                  ]"
                />
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center gap-4 mb-6">
            <label class="text-gray-600">骰子数量:</label>
            <select
              v-model="diceCount"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="n in 6" :key="n" :value="n">{{ n }} 个</option>
            </select>
          </div>

          <button
            @click="rollDice"
            :disabled="isRolling"
            class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {{ isRolling ? '掷骰中...' : '掷骰子' }}
          </button>

          <div v-if="diceTotal > 0" class="mt-6 p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-600">
              结果：<span class="font-bold text-blue-600">{{ dice.map(d => d.value).join(', ') }}</span>
              <span v-if="diceCount > 1" class="ml-2">(总计：{{ diceTotal }})</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Roulette Wheel (1-12) -->
      <div v-if="activeTab === 'roulette'" class="bg-white rounded-xl p-8 shadow-sm">
        <div class="text-center">
          <div class="relative w-64 h-64 mx-auto mb-8">
            <div
              ref="rouletteWheel"
              class="w-full h-full rounded-full border-4 border-gray-800 shadow-lg overflow-hidden"
              :style="{ transform: `rotate(${wheelRotation}deg)`, transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none' }"
            >
              <svg viewBox="0 0 100 100" class="w-full h-full">
                <g v-for="(segment, index) in rouletteSegments" :key="index">
                  <path
                    :d="segment.path"
                    :fill="segment.color"
                    stroke="#fff"
                    stroke-width="0.5"
                  />
                  <text
                    :x="segment.textX"
                    :y="segment.textY"
                    :transform="`rotate(${segment.textRotation}, ${segment.textX}, ${segment.textY})`"
                    fill="white"
                    font-size="4"
                    font-weight="bold"
                    text-anchor="middle"
                    dominant-baseline="middle"
                  >
                    {{ segment.number }}
                  </text>
                </g>
              </svg>
            </div>
            <!-- Pointer -->
            <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-500 z-10" />
            <!-- Center -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-4 border-gray-800 z-10 flex items-center justify-center">
              <span class="text-xs font-bold text-gray-800">12</span>
            </div>
          </div>

          <button
            @click="spinRoulette"
            :disabled="isSpinning"
            class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {{ isSpinning ? '旋转中...' : '旋转轮盘' }}
          </button>

          <div v-if="rouletteResult !== null" class="mt-6 p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-600">
              结果：<span
                :class="[
                  'font-bold',
                  [1,3,5,7,9,11].includes(rouletteResult) ? 'text-red-600' : 'text-gray-800'
                ]"
              >
                {{ rouletteResult }}
                <span v-if="[1,3,5,7,9,11].includes(rouletteResult)"> (红色)</span>
                <span v-else> (黑色)</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Drawing Lots -->
      <div v-if="activeTab === 'lots'" class="bg-white rounded-xl p-8 shadow-sm">
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">
              选项列表 (每行一个)
            </label>
            <div class="flex gap-2">
              <input
                ref="fileInput"
                type="file"
                accept=".txt,.csv"
                class="hidden"
                @change="handleFileImport"
              />
              <button
                @click="fileInput?.click()"
                class="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-1"
              >
                <Upload class="w-4 h-4" />
                导入文件
              </button>
              <button
                @click="loadSampleData"
                class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                示例数据
              </button>
            </div>
          </div>
          <textarea
            v-model="lotsOptions"
            rows="8"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入选项，每行一个&#10;例如:&#10;选项 A&#10;选项 B&#10;选项 C&#10;&#10;也可以导入 TXT 或 CSV 文件"
          />
          <p class="text-sm text-gray-500 mt-1">当前有效选项数：{{ validLotsOptions.length }}</p>
        </div>

        <div class="flex items-center gap-4 mb-6 flex-wrap">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">抽取数量</label>
            <input
              v-model.number="lotsCount"
              type="number"
              min="1"
              :max="validLotsOptions.length || 999"
              class="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex items-center gap-2 mt-6">
            <input v-model="allowLotsDuplicates" type="checkbox" class="rounded" />
            <span class="text-sm text-gray-700">允许重复</span>
          </div>
        </div>

        <button
          @click="drawLots"
          :disabled="isDrawing || validLotsOptions.length < 1"
          class="w-full px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {{ isDrawing ? '抽签中...' : '开始抽签' }}
        </button>

        <div v-if="lotsResults.length > 0" class="mt-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-700">抽签结果</h3>
            <button
              @click="copyResults"
              class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Copy class="w-4 h-4" />
              复制结果
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="(result, index) in lotsResults"
              :key="index"
              class="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white text-center font-semibold shadow-md"
            >
              {{ result }}
            </div>
          </div>
        </div>

        <!-- Saved Datasets -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-700">保存的数据集</h3>
            <button
              @click="saveCurrentDataset"
              :disabled="validLotsOptions.length < 1"
              class="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存当前列表
            </button>
          </div>
          <div v-if="savedDatasets.length > 0" class="space-y-2">
            <div
              v-for="(dataset, index) in savedDatasets"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <span class="font-medium text-gray-700">{{ dataset.name }}</span>
                <span class="text-sm text-gray-500">({{ dataset.options.length }} 项)</span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="loadDataset(dataset)"
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  加载
                </button>
                <button
                  @click="deleteDataset(index)"
                  class="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500 text-center py-4">暂无保存的数据集</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Coins, Dices, Circle, Ticket, Upload, Copy } from 'lucide-vue-next'

const tabs = [
  { id: 'coin', name: '抛硬币', icon: Coins },
  { id: 'dice', name: '掷骰子', icon: Dices },
  { id: 'roulette', name: '轮盘', icon: Circle },
  { id: 'lots', name: '抽签', icon: Ticket },
]

const activeTab = ref('coin')
const fileInput = ref<HTMLInputElement | null>(null)

// Coin Flip
const isFlipping = ref(false)
const coinRotation = ref('rotateY(0deg)')
const coinResult = ref('')

const flipCoin = () => {
  if (isFlipping.value) return
  isFlipping.value = true
  coinResult.value = ''

  const isHeads = Math.random() < 0.5
  const rotations = 5
  const targetRotation = isHeads ? 0 : 180

  coinRotation.value = `rotateY(${rotations * 360 + targetRotation}deg)`

  setTimeout(() => {
    isFlipping.value = false
    coinResult.value = isHeads ? '正面' : '反面'
  }, 1000)
}

// Dice Roll
const isRolling = ref(false)
const diceCount = ref(1)
const dice = ref<{ value: number }[]>([{ value: 1 }])
const diceTotal = ref(0)

const showDiceDot = (value: number, dot: number) => {
  const patterns: Record<number, number[]> = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9],
  }
  return patterns[value]?.includes(dot) || false
}

const rollDice = () => {
  if (isRolling.value) return
  isRolling.value = true

  let rollCount = 0
  const maxRolls = 10
  const interval = setInterval(() => {
    dice.value = Array.from({ length: diceCount.value }, () => ({
      value: Math.floor(Math.random() * 6) + 1
    }))
    rollCount++

    if (rollCount >= maxRolls) {
      clearInterval(interval)
      dice.value = Array.from({ length: diceCount.value }, () => ({
        value: Math.floor(Math.random() * 6) + 1
      }))
      diceTotal.value = dice.value.reduce((sum, d) => sum + d.value, 0)
      isRolling.value = false
    }
  }, 100)
}

// Roulette Wheel (1-12)
const isSpinning = ref(false)
const wheelRotation = ref(0)
const rouletteResult = ref<number | null>(null)

// Generate 12 segments for the roulette wheel (1-12)
const generateRouletteSegments = () => {
  const segments = []
  const segmentAngle = 360 / 12
  const colors = ['#ef4444', '#1f2937', '#ef4444', '#1f2937', '#ef4444', '#1f2937', 
                  '#ef4444', '#1f2937', '#ef4444', '#1f2937', '#ef4444', '#1f2937']
  
  for (let i = 0; i < 12; i++) {
    const number = i + 1
    const startAngle = i * segmentAngle - 90 // Start from top
    const endAngle = (i + 1) * segmentAngle - 90
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    
    // SVG path for the segment
    const x1 = 50 + 50 * Math.cos(startRad)
    const y1 = 50 + 50 * Math.sin(startRad)
    const x2 = 50 + 50 * Math.cos(endRad)
    const y2 = 50 + 50 * Math.sin(endRad)
    
    const path = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`
    
    // Text position (at 75% radius, centered in segment)
    const textAngle = startAngle + segmentAngle / 2
    const textRad = ((textAngle) * Math.PI) / 180
    const textX = 50 + 35 * Math.cos(textRad)
    const textY = 50 + 35 * Math.sin(textRad)
    
    segments.push({
      number,
      color: colors[i],
      path,
      textX,
      textY,
      textRotation: textAngle + 90,
    })
  }
  
  return segments
}

const rouletteSegments = generateRouletteSegments()

const spinRoulette = () => {
  if (isSpinning.value) return
  isSpinning.value = true
  rouletteResult.value = null

  const randomIndex = Math.floor(Math.random() * 12)
  const segmentAngle = 360 / 12
  // The pointer is at the top, calculate rotation to land on selected segment
  const targetRotation = 360 - (randomIndex * segmentAngle) - (segmentAngle / 2)
  const totalRotations = 5 * 360
  const finalRotation = wheelRotation.value + totalRotations + targetRotation - (wheelRotation.value % 360)

  wheelRotation.value = finalRotation

  setTimeout(() => {
    isSpinning.value = false
    rouletteResult.value = rouletteSegments[randomIndex].number
  }, 3000)
}

// Drawing Lots
const isDrawing = ref(false)
const lotsOptions = ref('吃饭\n喝奶茶\n吃烧烤\n吃火锅\n吃快餐\n吃面食')
const lotsCount = ref(1)
const allowLotsDuplicates = ref(false)
const lotsResults = ref<string[]>([])
const savedDatasets = ref<{ name: string; options: string[] }[]>([])

const validLotsOptions = computed(() => {
  return lotsOptions.value.split('\n').map(s => s.trim()).filter(s => s.length > 0)
})

const handleFileImport = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    // Handle both CSV and TXT files
    const lines = content.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0)
    if (lines.length > 0) {
      lotsOptions.value = lines.join('\n')
    }
  }
  reader.readAsText(file)
  
  // Reset file input
  target.value = ''
}

const loadSampleData = () => {
  const samples = [
    '今天吃什么？\n火锅\n烧烤\n炒菜\n快餐\n面食\n沙拉\n三明治\n寿司\n披萨\n汉堡',
    '周末去哪里玩？\n公园\n博物馆\n电影院\n商场\n海边\n山区\n咖啡馆\n书店\n游乐园\n动物园',
    '喝什么奶茶？\n珍珠奶茶\n布丁奶茶\n椰果奶茶\n红豆奶茶\n抹茶奶茶\n巧克力奶茶\n草莓奶茶\n芒果奶茶\n乌龙奶茶\n咖啡奶茶',
  ]
  lotsOptions.value = samples[Math.floor(Math.random() * samples.length)]
}

const drawLots = () => {
  if (isDrawing.value || validLotsOptions.value.length < 1) return

  const options = validLotsOptions.value
  if (!allowLotsDuplicates.value && lotsCount.value > options.length) {
    return
  }

  isDrawing.value = true
  lotsResults.value = []

  let drawCount = 0
  const availableOptions = [...options]

  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * availableOptions.length)
    lotsResults.value = [availableOptions[randomIndex]]
    drawCount++

    if (drawCount >= 15) {
      clearInterval(interval)
      // Final draw
      lotsResults.value = []
      if (allowLotsDuplicates.value) {
        for (let i = 0; i < lotsCount.value; i++) {
          lotsResults.value.push(options[Math.floor(Math.random() * options.length)])
        }
      } else {
        const shuffled = [...options].sort(() => Math.random() - 0.5)
        lotsResults.value = shuffled.slice(0, lotsCount.value)
      }
      isDrawing.value = false
    }
  }, 100)
}

const copyResults = () => {
  navigator.clipboard.writeText(lotsResults.value.join(', '))
}

const saveCurrentDataset = () => {
  const name = prompt('请输入数据集名称:')
  if (!name) return
  
  savedDatasets.value.push({
    name,
    options: validLotsOptions.value,
  })
  
  // Save to localStorage
  localStorage.setItem('randomToolsDatasets', JSON.stringify(savedDatasets.value))
}

const loadDataset = (dataset: { name: string; options: string[] }) => {
  lotsOptions.value = dataset.options.join('\n')
}

const deleteDataset = (index: number) => {
  savedDatasets.value.splice(index, 1)
  localStorage.setItem('randomToolsDatasets', JSON.stringify(savedDatasets.value))
}

onMounted(() => {
  // Load saved datasets from localStorage
  const saved = localStorage.getItem('randomToolsDatasets')
  if (saved) {
    try {
      savedDatasets.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load saved datasets')
    }
  }
})
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.backface-hidden {
  backface-visibility: hidden;
}
</style>
