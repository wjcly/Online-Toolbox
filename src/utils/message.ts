import { ElMessage } from 'element-plus'

export function successMessage(message: string) {
  ElMessage({
    message,
    type: 'success',
    duration: 2000
  })
}

export function errorMessage(message: string) {
  ElMessage({
    message,
    type: 'error',
    duration: 3000
  })
}

export function warningMessage(message: string) {
  ElMessage({
    message,
    type: 'warning',
    duration: 2000
  })
}

export function infoMessage(message: string) {
  ElMessage({
    message,
    type: 'info',
    duration: 2000
  })
}
