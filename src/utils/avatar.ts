import { successMessage, errorMessage, warningMessage } from '@/utils/message'

// 头像占位符正则
export const AVATAR_PLACEHOLDER = /!\[个人头像\]\([^)]*\)|!\[头像\]\([^)]*\)/

/**
 * 上传头像并替换 Markdown 中的占位符
 * @param file - 头像文件
 * @param markdownContent - 当前 Markdown 内容
 * @param resumeType - 简历类型
 * @param setMDContent - 设置 MD 内容的函数
 * @returns 处理后的头像 URL
 */
export function useAvatarUpload(
  markdownContent: string,
  resumeType: string,
  setMDContent: (content: string, type: string) => void
) {
  const uploadAvatar = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // 检查文件大小 (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        errorMessage('头像大小不能超过 5MB')
        reject(new Error('File too large'))
        return
      }

      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        errorMessage('请上传图片文件')
        reject(new Error('Invalid file type'))
        return
      }

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        
        // 检查是否有头像占位符
        if (!AVATAR_PLACEHOLDER.test(markdownContent)) {
          warningMessage('请在编辑器中添加头像占位符：![个人头像](...)')
          reject(new Error('No avatar placeholder'))
          return
        }

        // 替换占位符
        const newContent = markdownContent.replace(
          AVATAR_PLACEHOLDER,
          `![个人头像](${base64})`
        )
        
        setMDContent(newContent, resumeType)
        successMessage('头像上传成功')
        resolve(base64)
      }
      reader.onerror = () => {
        errorMessage('头像上传失败')
        reject(new Error('Read error'))
      }
    })
  }

  return { uploadAvatar }
}

/**
 * 更新可编辑模式中的头像显示
 * @param avatarUrl - 头像 URL
 */
export function updateWritableAvatar(avatarUrl: string) {
  const writableDOM = document.querySelector('.writable-edit-mode')
  if (writableDOM) {
    const avatar = writableDOM.querySelector('img[alt*=个人头像]') as HTMLImageElement
    if (avatar) {
      avatar.src = avatarUrl
    }
  }
}
