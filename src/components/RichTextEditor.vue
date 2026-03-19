<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 relative">
      <div
        contenteditable="true"
        :innerHTML="html"
        @input="handleInput"
        class="absolute inset-0 w-full h-full bg-[#1e1e1e] text-gray-100 p-4 text-sm resize-none focus:outline-none overflow-auto"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  html: string
}>()

const emit = defineEmits<{
  'update:html': [value: string]
}>()

const handleInput = (e: Event) => {
  const target = e.target as HTMLElement
  emit('update:html', target.innerHTML)
}
</script>
