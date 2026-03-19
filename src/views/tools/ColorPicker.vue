<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">Color Picker</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-6">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div :style="{ backgroundColor: color }" class="w-full h-48 rounded-xl mb-6 shadow-inner"></div>
            <div class="flex items-center gap-4 mb-6">
              <input v-model="color" type="color" class="w-16 h-12 rounded-lg cursor-pointer border-0" />
              <input
                v-model="color"
                type="text"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="space-y-3">
              <h3 class="font-semibold text-gray-700">Color Formats</h3>
              <div
                v-for="format in colorFormats"
                :key="format.name"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <span class="text-xs text-gray-500 font-medium">{{ format.name }}</span>
                  <p class="font-mono text-sm">{{ format.value }}</p>
                </div>
                <button @click="copyToClipboard(format.value, format.name)" class="p-2 hover:bg-gray-200 rounded">
                  <Check v-if="copied === format.name" class="w-4 h-4 text-green-500" />
                  <Copy v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <Palette class="w-4 h-4" />
              Quick Colors
            </h3>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="c in quickColors"
                :key="c"
                @click="color = c"
                :style="{ backgroundColor: c }"
                class="w-full aspect-square rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
              ></button>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4">Lightness Palette</h3>
            <div class="grid grid-cols-10 gap-1">
              <button
                v-for="(c, i) in lightnessPalette"
                :key="i"
                @click="color = c"
                :style="{ backgroundColor: c }"
                :title="i * 10 + '% lightness'"
                class="aspect-square rounded-lg hover:scale-110 transition-transform"
              ></button>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4">Analogous Colors</h3>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="(c, i) in analogousColors"
                :key="i"
                @click="color = c"
                :style="{ backgroundColor: c }"
                class="aspect-square rounded-lg hover:scale-110 transition-transform border-2 border-gray-200"
              ></button>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4">Complementary</h3>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="(c, i) in complementaryColors"
                :key="i"
                @click="color = c"
                :style="{ backgroundColor: c }"
                class="aspect-square rounded-lg hover:scale-110 transition-transform border-2 border-gray-200"
              ></button>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold mb-4">Triadic Colors</h3>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="(c, i) in triadicColors"
                :key="i"
                @click="color = c"
                :style="{ backgroundColor: c }"
                class="aspect-square rounded-lg hover:scale-110 transition-transform border-2 border-gray-200"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, Copy, Check, Palette } from 'lucide-vue-next'

const color = ref('#3B82F6')
const copied = ref<string | null>(null)

const quickColors = [
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#84CC16',
  '#22C55E',
  '#14B8A6',
  '#06B6D4',
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#F43F5E',
  '#78716C',
  '#1F2937',
  '#FFFFFF',
]

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

const hslToHex = (h: number, s: number, l: number) => {
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0,
    g = 0,
    b = 0

  if (h < 60) {
    r = c
    g = x
  } else if (h < 120) {
    r = x
    g = c
  } else if (h < 180) {
    g = c
    b = x
  } else if (h < 240) {
    g = x
    b = c
  } else if (h < 300) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const getRgb = () => hexToRgb(color.value)
const getHsl = () => {
  const rgb = getRgb()
  return rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
}

const colorFormats = computed(() => [
  { name: 'HEX', value: color.value },
  { name: 'RGB', value: getRgb() ? `rgb(${getRgb()!.r}, ${getRgb()!.g}, ${getRgb()!.b})` : '' },
  { name: 'HSL', value: getHsl() ? `hsl(${getHsl()!.h}, ${getHsl()!.s}%, ${getHsl()!.l}%)` : '' },
])

const lightnessPalette = computed(() => {
  const hsl = getHsl()
  if (!hsl) return []
  return Array.from({ length: 11 }, (_, i) => hslToHex(hsl.h, hsl.s, i * 10))
})

const analogousColors = computed(() => {
  const hsl = getHsl()
  if (!hsl) return []
  return [
    hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h - 15 + 360) % 360, hsl.s, hsl.l),
    color.value,
    hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
  ]
})

const complementaryColors = computed(() => {
  const hsl = getHsl()
  if (!hsl) return []
  return [color.value, hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)]
})

const triadicColors = computed(() => {
  const hsl = getHsl()
  if (!hsl) return []
  return [
    color.value,
    hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
  ]
})

const copyToClipboard = (text: string, format: string) => {
  navigator.clipboard.writeText(text)
  copied.value = format
  setTimeout(() => (copied.value = null), 2000)
}
</script>
