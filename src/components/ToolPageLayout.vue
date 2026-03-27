<template>
  <div class="tool-page">
    <header class="tool-header">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="handleBack" class="tool-back-btn">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="tool-title">
              <slot name="title">{{ title }}</slot>
            </h1>
          </div>
          <slot name="header-action"></slot>
        </div>
      </div>
    </header>

    <main class="tool-main">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

defineProps<{
  title?: string
}>()

const emit = defineEmits<{
  back: []
}>()

const handleBack = () => {
  emit('back')
}
</script>

<style scoped>
.tool-page {
  min-height: 100vh;
  background-color: #f9fafb;
}

.tool-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.tool-back-btn {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.15s ease;
}

.tool-back-btn:hover {
  background-color: #f3f4f6;
}

.tool-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.tool-main {
  padding: 2rem 0;
}

/* Dark mode */
.dark .tool-page {
  background-color: #0f172a;
}

.dark .tool-header {
  background-color: #1e293b;
  border-bottom-color: #334155;
}

.dark .tool-back-btn:hover {
  background-color: #334155;
}

.dark .tool-title {
  color: #f1f5f9;
}
</style>
