<template>
  <Teleport to="body">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'fixed right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300',
          getTypeClass(toast.type)
        ]"
        style="top: 1rem"
      >
        <div class="flex items-center gap-3">
          <component :is="getIcon(toast.type)" class="w-5 h-5" />
          <span class="font-medium">{{ toast.message }}</span>
          <button @click="remove(toast.id)" class="ml-2 hover:opacity-70">
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-vue-next'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: number
  message: string
  type: ToastType
  duration?: number
}

const toasts = ref<Toast[]>([])
let toastId = 0

const getTypeClass = (type: ToastType) => {
  const classes = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white',
  }
  return classes[type]
}

const getIcon = (type: ToastType) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }
  return icons[type]
}

const add = (message: string, type: ToastType = 'info', duration = 3000) => {
  const id = ++toastId
  const toast: Toast = { id, message, type, duration }
  toasts.value.push(toast)

  if (duration > 0) {
    setTimeout(() => remove(id), duration)
  }
}

const remove = (id: number) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const success = (message: string, duration?: number) => add(message, 'success', duration)
const error = (message: string, duration?: number) => add(message, 'error', duration)
const info = (message: string, duration?: number) => add(message, 'info', duration)
const warning = (message: string, duration?: number) => add(message, 'warning', duration)

defineExpose({ success, error, info, warning })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
