/**
 * Clothing Asset Generator
 * Generates clothing PNG assets for ID photo clothing replacement
 * 
 * Note: For production use, replace with real photographed clothing assets
 * for more realistic results.
 */

export interface ClothingAsset {
  id: string
  name: string
  type: 'suit' | 'shirt' | 'formal' | 'children' | 'casual'
  color: string
  image: HTMLImageElement | HTMLCanvasElement
  thumbnail: string
}

/**
 * Generate clothing asset by drawing on canvas
 * This creates base clothing shapes that can be used for compositing
 */
export function generateClothingAsset(
  _id: string,
  _name: string,
  type: 'suit' | 'shirt' | 'formal' | 'children' | 'casual',
  baseColor: string
): { canvas: HTMLCanvasElement, thumbnail: string } {
  const canvas = document.createElement('canvas')
  canvas.width = 400
  canvas.height = 500
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Clothing parameters
  const centerX = canvas.width / 2
  const neckY = canvas.height * 0.35
  const shoulderY = canvas.height * 0.42
  const shoulderWidth = canvas.width * 0.35
  const clothingBottom = canvas.height * 0.85

  // Create gradient for fabric effect
  const gradient = ctx.createLinearGradient(0, shoulderY, 0, clothingBottom)
  gradient.addColorStop(0, baseColor)
  gradient.addColorStop(1, adjustColor(baseColor, -30))

  ctx.save()
  ctx.fillStyle = gradient

  // Draw clothing shape
  ctx.beginPath()
  // Left shoulder
  ctx.moveTo(centerX - shoulderWidth + 10, shoulderY)
  ctx.quadraticCurveTo(
    centerX - shoulderWidth - 15, shoulderY + 20,
    centerX - shoulderWidth, shoulderY + clothingBottom * 0.15
  )
  // Left side
  ctx.quadraticCurveTo(
    centerX - shoulderWidth + 20, (shoulderY + clothingBottom) / 2,
    centerX - shoulderWidth + 30, clothingBottom
  )
  // Bottom
  ctx.quadraticCurveTo(
    centerX, clothingBottom + 10,
    centerX + shoulderWidth - 30, clothingBottom
  )
  // Right side
  ctx.quadraticCurveTo(
    centerX + shoulderWidth - 20, (shoulderY + clothingBottom) / 2,
    centerX + shoulderWidth, shoulderY + clothingBottom * 0.15
  )
  ctx.quadraticCurveTo(
    centerX + shoulderWidth + 15, shoulderY + 20,
    centerX + shoulderWidth - 10, shoulderY
  )
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // Draw collar/lapel based on type
  ctx.save()
  if (type === 'shirt') {
    // Shirt collar
    const collarColor = adjustColor(baseColor, 40)
    ctx.fillStyle = collarColor

    // Left collar
    ctx.beginPath()
    ctx.moveTo(centerX - 8, neckY - 5)
    ctx.quadraticCurveTo(
      centerX - 20, neckY + 15,
      centerX - 45, neckY + 60
    )
    ctx.quadraticCurveTo(
      centerX - 35, neckY + 50,
      centerX - 25, neckY + 35
    )
    ctx.quadraticCurveTo(
      centerX - 15, neckY + 20,
      centerX - 5, neckY + 10
    )
    ctx.lineTo(centerX, neckY + 5)
    ctx.closePath()
    ctx.fill()

    // Right collar
    ctx.beginPath()
    ctx.moveTo(centerX + 8, neckY - 5)
    ctx.quadraticCurveTo(
      centerX + 20, neckY + 15,
      centerX + 45, neckY + 60
    )
    ctx.quadraticCurveTo(
      centerX + 35, neckY + 50,
      centerX + 25, neckY + 35
    )
    ctx.quadraticCurveTo(
      centerX + 15, neckY + 20,
      centerX + 5, neckY + 10
    )
    ctx.lineTo(centerX, neckY + 5)
    ctx.closePath()
    ctx.fill()

    // Collar stitching
    ctx.strokeStyle = adjustColor(baseColor, -20)
    ctx.lineWidth = 1.5
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(centerX - 8, neckY - 5)
    ctx.quadraticCurveTo(
      centerX - 20, neckY + 15,
      centerX - 45, neckY + 60
    )
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(centerX + 8, neckY - 5)
    ctx.quadraticCurveTo(
      centerX + 20, neckY + 15,
      centerX + 45, neckY + 60
    )
    ctx.stroke()

    ctx.restore()

    // Buttons
    ctx.fillStyle = '#d0d0d0'
    ctx.globalAlpha = 1
    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.arc(centerX, neckY + 50 + i * 25, 3, 0, Math.PI * 2)
      ctx.fill()
    }

  } else if (type === 'suit' || type === 'formal') {
    // Suit lapels
    const lapelColor = adjustColor(baseColor, -50)
    ctx.fillStyle = lapelColor
    ctx.globalAlpha = 0.9

    // Left lapel
    ctx.beginPath()
    ctx.moveTo(centerX - 10, neckY - 3)
    ctx.quadraticCurveTo(
      centerX - 30, neckY + 20,
      centerX - 50, neckY + 80
    )
    ctx.quadraticCurveTo(
      centerX - 40, neckY + 60,
      centerX - 30, neckY + 45
    )
    ctx.quadraticCurveTo(
      centerX - 20, neckY + 70,
      centerX, neckY + 90
    )
    ctx.lineTo(centerX, neckY)
    ctx.closePath()
    ctx.fill()

    // Right lapel
    ctx.beginPath()
    ctx.moveTo(centerX + 10, neckY - 3)
    ctx.quadraticCurveTo(
      centerX + 30, neckY + 20,
      centerX + 50, neckY + 80
    )
    ctx.quadraticCurveTo(
      centerX + 40, neckY + 60,
      centerX + 30, neckY + 45
    )
    ctx.quadraticCurveTo(
      centerX + 20, neckY + 70,
      centerX, neckY + 90
    )
    ctx.lineTo(centerX, neckY)
    ctx.closePath()
    ctx.fill()

    ctx.restore()

    // Suit buttons
    ctx.fillStyle = '#888888'
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.arc(centerX - 25, neckY + 100, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(centerX + 25, neckY + 100, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  // Add fabric texture/shading
  ctx.save()
  const shadowGradient = ctx.createLinearGradient(
    centerX - shoulderWidth, 0,
    centerX + shoulderWidth, 0
  )
  shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)')
  shadowGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.08)')
  shadowGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)')
  shadowGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.08)')
  shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)')

  ctx.fillStyle = shadowGradient
  ctx.globalCompositeOperation = 'overlay'
  ctx.globalAlpha = 0.5

  ctx.beginPath()
  ctx.moveTo(centerX - shoulderWidth + 10, shoulderY)
  ctx.quadraticCurveTo(
    centerX - shoulderWidth - 15, shoulderY + 20,
    centerX - shoulderWidth, shoulderY + clothingBottom * 0.15
  )
  ctx.quadraticCurveTo(
    centerX - shoulderWidth + 20, (shoulderY + clothingBottom) / 2,
    centerX - shoulderWidth + 30, clothingBottom
  )
  ctx.quadraticCurveTo(
    centerX, clothingBottom + 10,
    centerX + shoulderWidth - 30, clothingBottom
  )
  ctx.quadraticCurveTo(
    centerX + shoulderWidth - 20, (shoulderY + clothingBottom) / 2,
    centerX + shoulderWidth, shoulderY + clothingBottom * 0.15
  )
  ctx.quadraticCurveTo(
    centerX + shoulderWidth + 15, shoulderY + 20,
    centerX + shoulderWidth - 10, shoulderY
  )
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // Create thumbnail
  const thumbCanvas = document.createElement('canvas')
  thumbCanvas.width = 80
  thumbCanvas.height = 100
  const thumbCtx = thumbCanvas.getContext('2d')
  if (thumbCtx) {
    thumbCtx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height)
  }

  return {
    canvas,
    thumbnail: thumbCanvas.toDataURL('image/png')
  }
}

/**
 * Create clothing assets from real images
 */
export async function loadClothingAssetFromImage(
  id: string,
  name: string,
  type: 'suit' | 'shirt' | 'formal',
  imageUrl: string
): Promise<ClothingAsset> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      resolve({
        id,
        name,
        type,
        color: '#000000',
        image: img,
        thumbnail: ''
      })
    }
    img.onerror = reject
    img.src = imageUrl
  })
}

/**
 * Adjust color brightness
 */
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * Default clothing presets
 */
export const DEFAULT_CLOTHING_PRESETS = [
  { id: 'suit-black', name: '黑色西装', type: 'suit' as const, color: '#1a1a2e' },
  { id: 'suit-navy', name: '深蓝西装', type: 'suit' as const, color: '#1e3a5f' },
  { id: 'suit-gray', name: '灰色西装', type: 'suit' as const, color: '#3d3d3d' },
  { id: 'formal-navy', name: '藏青正装', type: 'formal' as const, color: '#2c3e50' },
  { id: 'formal-charcoal', name: '炭灰正装', type: 'formal' as const, color: '#4a4a4a' },
  { id: 'shirt-white', name: '白色衬衫', type: 'shirt' as const, color: '#f5f5f5' },
  { id: 'shirt-blue', name: '蓝色衬衫', type: 'shirt' as const, color: '#5d8aa8' },
]
