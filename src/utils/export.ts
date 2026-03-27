import { successMessage, errorMessage } from '@/utils/message'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * 导出为 PDF
 * @param element - 要导出的 DOM 元素
 * @param fileName - 文件名
 * @param options - 导出选项
 */
export async function exportToPDF(
  element: HTMLElement,
  fileName: string = 'resume',
  options: {
    scale?: number
    useCORS?: boolean
    backgroundColor?: string
  } = {}
) {
  const {
    scale = 2,
    useCORS = true,
    backgroundColor = '#ffffff'
  } = options

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS,
      backgroundColor,
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight
    })

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`${fileName}.pdf`)
    successMessage('PDF 导出成功')
  } catch (error) {
    console.error('PDF export failed:', error)
    errorMessage('PDF 导出失败，请重试')
    throw error
  }
}

/**
 * 导出为 PNG 图片
 * @param element - 要导出的 DOM 元素
 * @param fileName - 文件名
 * @param options - 导出选项
 */
export async function exportToPNG(
  element: HTMLElement,
  fileName: string = 'resume',
  options: {
    scale?: number
    useCORS?: boolean
  } = {}
) {
  const {
    scale = 2,
    useCORS = true
  } = options

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS,
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight
    })

    return new Promise<void>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${fileName}.png`)
          successMessage('图片导出成功')
          resolve()
        } else {
          errorMessage('图片生成失败')
          reject(new Error('Failed to create blob'))
        }
      }, 'image/png')
    })
  } catch (error) {
    console.error('PNG export failed:', error)
    errorMessage('图片导出失败，请重试')
    throw error
  }
}

/**
 * 导出为 Markdown 文件
 * @param content - Markdown 内容
 * @param fileName - 文件名
 */
export function exportToMarkdown(content: string, fileName: string = 'resume') {
  try {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    saveAs(blob, `${fileName}.md`)
    successMessage('Markdown 导出成功')
  } catch (error) {
    console.error('Markdown export failed:', error)
    errorMessage('Markdown 导出失败')
    throw error
  }
}

/**
 * 导入 Markdown 文件
 * @returns Promise<string> - Markdown 内容
 */
export function importMarkdown(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.txt'
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) {
        reject(new Error('No file selected'))
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        resolve(content)
      }
      reader.onerror = () => {
        errorMessage('文件读取失败')
        reject(new Error('Read error'))
      }
      reader.readAsText(file, 'utf-8')
    }
    
    input.click()
  })
}

/**
 * 原生打印（使用浏览器打印功能）
 * @param content - HTML 内容
 */
export function printNative(content: string) {
  try {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      errorMessage('无法打开打印窗口，请检查浏览器设置')
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>打印简历</title>
          <style>
            @media print {
              @page {
                size: A4 portrait;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
            }
            body {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.focus()
    
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
    
    successMessage('打印窗口已打开')
  } catch (error) {
    console.error('Print failed:', error)
    errorMessage('打印失败')
    throw error
  }
}

/**
 * 导出选项类型
 */
export type ExportOptions = {
  format: 'pdf' | 'png' | 'markdown' | 'print'
  fileName?: string
  scale?: number
  useCORS?: boolean
}

/**
 * 统一的导出函数
 * @param element - DOM 元素或内容
 * @param options - 导出选项
 */
export async function resumeExport(
  element: HTMLElement | string,
  options: ExportOptions
) {
  const {
    format,
    fileName = 'resume',
    scale = 2,
    useCORS = true
  } = options

  switch (format) {
    case 'pdf':
      if (!(element instanceof HTMLElement)) {
        throw new Error('PDF export requires HTMLElement')
      }
      return await exportToPDF(element, fileName, { scale, useCORS })
    
    case 'png':
      if (!(element instanceof HTMLElement)) {
        throw new Error('PNG export requires HTMLElement')
      }
      return await exportToPNG(element, fileName, { scale, useCORS })
    
    case 'markdown':
      if (typeof element !== 'string') {
        throw new Error('Markdown export requires string content')
      }
      return exportToMarkdown(element, fileName)
    
    case 'print':
      if (typeof element !== 'string') {
        throw new Error('Print export requires string content')
      }
      return printNative(element)
    
    default:
      throw new Error(`Unknown export format: ${format}`)
  }
}
