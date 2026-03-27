import { ref, h, createApp } from 'vue'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
}

const toasts = ref<ToastOptions[]>([])

function getTypeClass(type: ToastType) {
  const classes: Record<ToastType, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }
  return classes[type]
}

let containerMounted = false

function mountContainer() {
  if (containerMounted) return
  const container = document.createElement('div')
  container.id = 'toast-container'
  document.body.appendChild(container)
  const app = createApp({
    setup() {
      return () => h('div', { class: 'fixed top-4 right-4 z-50 flex flex-col gap-2' }, [
        toasts.value.map((toast, index) =>
          h(
            'div',
            {
              key: toast.message + index,
              class: [
                'px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 max-w-md',
                getTypeClass(toast.type || 'info'),
                'text-white',
              ],
            },
            [
              h('div', { class: 'flex items-start gap-3' }, [
                h('span', { class: 'font-medium break-all' }, toast.message),
                h(
                  'button',
                  {
                    class: 'ml-2 hover:opacity-70 flex-shrink-0 text-white',
                    onClick: () => remove(index),
                  },
                  '✕'
                ),
              ]),
            ]
          )
        ),
      ])
    },
  })
  app.mount(container)
  containerMounted = true
}

function remove(index: number) {
  toasts.value.splice(index, 1)
}

function showToast(options: ToastOptions) {
  mountContainer()
  toasts.value.push(options)

  if (options.duration !== 0 && (options.duration || 3000) > 0) {
    setTimeout(() => {
      const idx = toasts.value.findIndex(t => t.message === options.message)
      if (idx > -1) {
        remove(idx)
      }
    }, options.duration || 3000)
  }
}

export const toast = {
  success: (message: string, duration?: number) =>
    showToast({ message, type: 'success', duration }),
  error: (message: string, duration?: number) => showToast({ message, type: 'error', duration }),
  info: (message: string, duration?: number) => showToast({ message, type: 'info', duration }),
  warning: (message: string, duration?: number) =>
    showToast({ message, type: 'warning', duration }),
}
