// Message utilities
export * from './message'

// Toast utilities
export * from './toast'

// Export utilities
export * from './export'

// Common helpers
export function queryDOM(selector: string): HTMLElement | null {
  return document.querySelector(selector)
}

export function isDev(): boolean {
  return import.meta.env.DEV
}
