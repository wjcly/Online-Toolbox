<template>
  <div class="markdown-preview h-full overflow-auto p-8 bg-white" :style="{ fontFamily }">
    <div v-html="renderedHtml"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'

const props = withDefaults(defineProps<{
  content: string
  themeColor?: string
  template?: string
  fontFamily?: string
}>(), {
  themeColor: '#2563eb',
  template: 'modern',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
})

const renderedHtml = computed(() => {
  return marked(props.content)
})
</script>

<style>
.markdown-preview {
  font-size: 10.5pt;
  line-height: 1.6;
  color: #1a1a1a;
}

.markdown-preview h1 {
  font-size: 2em;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 0.5em;
  color: #1a1a1a;
}

.markdown-preview h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.markdown-preview h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.markdown-preview p {
  margin-bottom: 1em;
}

.markdown-preview ul,
.markdown-preview ol {
  margin-bottom: 1em;
  padding-left: 2em;
}

.markdown-preview li {
  margin-bottom: 0.5em;
}

.markdown-preview a {
  color: #2563eb;
  text-decoration: underline;
}

.markdown-preview strong {
  font-weight: 600;
}

.markdown-preview code {
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  font-size: 85%;
}

.markdown-preview pre {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  margin-bottom: 1em;
}

.markdown-preview pre code {
  background-color: transparent;
  padding: 0;
}

.markdown-preview blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1em;
  margin: 1em 0;
  color: #6a737d;
}

.markdown-preview table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1em;
}

.markdown-preview th,
.markdown-preview td {
  border: 1px solid #dfe2e5;
  padding: 0.5em 1em;
}

.markdown-preview th {
  background-color: #f6f8fa;
  font-weight: 600;
}

.markdown-preview tr:nth-child(even) {
  background-color: #f6f8fa;
}

.markdown-preview hr {
  height: 2px;
  background: #e1e4e8;
  border: none;
  margin: 2em 0;
}

.markdown-preview img {
  max-width: 100%;
  height: auto;
  margin: 1em 0;
}
</style>
