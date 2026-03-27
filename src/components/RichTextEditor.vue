<template>
  <div class="h-full flex flex-col">
    <!-- Toolbar -->
    <div class="flex items-center gap-1 p-2 border-b border-gray-700 bg-[#252526] flex-wrap">
      <button @click="execCommand('bold')" class="p-2 hover:bg-gray-700 rounded" title="Bold">
        <Bold :size="16" />
      </button>
      <button @click="execCommand('italic')" class="p-2 hover:bg-gray-700 rounded" title="Italic">
        <Italic :size="16" />
      </button>
      <button @click="execCommand('underline')" class="p-2 hover:bg-gray-700 rounded" title="Underline">
        <Underline :size="16" />
      </button>
      <button @click="execCommand('strikeThrough')" class="p-2 hover:bg-gray-700 rounded" title="Strikethrough">
        <Strikethrough :size="16" />
      </button>
      <div class="w-px h-5 bg-gray-600 mx-1"></div>
      <button @click="execCommand('justifyLeft')" class="p-2 hover:bg-gray-700 rounded" title="Align Left">
        <AlignLeft :size="16" />
      </button>
      <button @click="execCommand('justifyCenter')" class="p-2 hover:bg-gray-700 rounded" title="Align Center">
        <AlignCenter :size="16" />
      </button>
      <button @click="execCommand('justifyRight')" class="p-2 hover:bg-gray-700 rounded" title="Align Right">
        <AlignRight :size="16" />
      </button>
      <div class="w-px h-5 bg-gray-600 mx-1"></div>
      <button @click="execCommand('insertUnorderedList')" class="p-2 hover:bg-gray-700 rounded" title="Bullet List">
        <List :size="16" />
      </button>
      <button @click="execCommand('insertOrderedList')" class="p-2 hover:bg-gray-700 rounded" title="Numbered List">
        <ListOrdered :size="16" />
      </button>
      <div class="w-px h-5 bg-gray-600 mx-1"></div>
      <select @change="execCommand('formatBlock', $event)" class="bg-gray-700 text-gray-200 px-2 py-1 rounded text-sm border border-gray-600">
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
      </select>
      <div class="w-px h-5 bg-gray-600 mx-1"></div>
      <button @click="insertLink" class="p-2 hover:bg-gray-700 rounded" title="Insert Link">
        <Link :size="16" />
      </button>
      <button @click="clearFormatting" class="p-2 hover:bg-gray-700 rounded" title="Clear Formatting">
        <Eraser :size="16" />
      </button>
    </div>
    
    <!-- Editor -->
    <div class="flex-1 relative">
      <div
        ref="editorRef"
        contenteditable="true"
        :innerHTML="html"
        @input="handleInput"
        class="absolute inset-0 w-full h-full bg-[#1e1e1e] text-gray-100 p-4 text-sm resize-none focus:outline-none overflow-auto prose prose-invert max-w-none [&_*]:text-gray-100 [&_a]:text-blue-400"
        style="caret-color: white;"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, Eraser } from 'lucide-vue-next'

const props = defineProps<{
  html: string
}>()

const emit = defineEmits<{
  'update:html': [value: string]
}>()

const editorRef = ref<HTMLElement | null>(null)

const execCommand = (command: string, value?: string | Event) => {
  let arg: string | undefined = undefined
  if (value instanceof Event) {
    const target = value.target as HTMLSelectElement
    arg = target.value
  } else {
    arg = value
  }
  
  document.execCommand(command, false, arg)
  editorRef.value?.focus()
}

const clearFormatting = () => {
  execCommand('removeFormat')
  execCommand('formatBlock', 'p')
}

const insertLink = () => {
  const url = window.prompt('Enter URL:')
  if (url) {
    execCommand('createLink', url)
  }
}

const handleInput = (e: Event) => {
  const target = e.target as HTMLElement
  emit('update:html', target.innerHTML)
}

// Sync external changes
watch(() => props.html, (newHtml) => {
  if (editorRef.value && document.activeElement !== editorRef.value) {
    editorRef.value.innerHTML = newHtml
  }
})
</script>
