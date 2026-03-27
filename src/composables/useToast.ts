import { ref } from 'vue'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: number
  message: string
  type: ToastType
  duration?: number
}

const toasts = ref<Toast[]>([])
let toastId = 0

export function useToast() {
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

  return {
    toasts,
    success,
    error,
    info,
    warning,
  }
}
