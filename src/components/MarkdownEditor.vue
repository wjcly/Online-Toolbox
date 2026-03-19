<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 relative">
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        class="absolute inset-0 w-full h-full bg-[#1e1e1e] text-gray-100 p-4 font-mono text-sm resize-none focus:outline-none"
        placeholder="输入 Markdown 内容..."
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
