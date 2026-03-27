<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Sun v-if="isDark" class="w-5 h-5" />
    <Moon v-else class="w-5 h-5" />
  </button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const { toggleTheme } = themeStore
</script>
