/**
 * Clothing Asset Loader
 * Load real clothing assets from images
 * 
 * Usage:
 * 1. Upload clothing images via ClothingManager page
 * 2. Or place PNG images in /public/assets/clothing/
 * 3. Update CLOTHING_ASSETS config below
 */

import type { ClothingAsset } from './clothingAssetGenerator'

export interface ClothingAssetConfig {
  id: string
  name: string
  type: 'suit' | 'shirt' | 'formal'
  color: string
  // Path to clothing image (relative to public folder)
  imagePath: string
  // Thumbnail path
  thumbnailPath?: string
  // Or use data URL directly
  imageSrc?: string
}

/**
 * Clothing assets configuration
 * Replace these with your real clothing images
 */
export const CLOTHING_ASSETS: ClothingAssetConfig[] = [
  // Men's clothing (20 items)
  { id: 'men-01', name: '男装 01', type: 'suit', color: '#1a1a2e', imagePath: '/assets/clothing/men/01.jpg' },
  { id: 'men-02', name: '男装 02', type: 'suit', color: '#1e3a5f', imagePath: '/assets/clothing/men/02.jpg' },
  { id: 'men-03', name: '男装 03', type: 'suit', color: '#2c3e50', imagePath: '/assets/clothing/men/03.jpg' },
  { id: 'men-04', name: '男装 04', type: 'suit', color: '#3d3d3d', imagePath: '/assets/clothing/men/04.jpg' },
  { id: 'men-05', name: '男装 05', type: 'suit', color: '#4a4a4a', imagePath: '/assets/clothing/men/05.jpg' },
  { id: 'men-06', name: '男装 06', type: 'suit', color: '#2a2a3e', imagePath: '/assets/clothing/men/06.jpg' },
  { id: 'men-07', name: '男装 07', type: 'suit', color: '#1f3a4f', imagePath: '/assets/clothing/men/07.jpg' },
  { id: 'men-08', name: '男装 08', type: 'suit', color: '#3c4c5d', imagePath: '/assets/clothing/men/08.jpg' },
  { id: 'men-09', name: '男装 09', type: 'suit', color: '#2d3d4e', imagePath: '/assets/clothing/men/09.jpg' },
  { id: 'men-10', name: '男装 10', type: 'suit', color: '#4e5e6f', imagePath: '/assets/clothing/men/10.jpg' },
  { id: 'men-11', name: '男装 11', type: 'suit', color: '#1a2a3a', imagePath: '/assets/clothing/men/11.jpg' },
  { id: 'men-12', name: '男装 12', type: 'suit', color: '#2b3b4b', imagePath: '/assets/clothing/men/12.jpg' },
  { id: 'men-13', name: '男装 13', type: 'suit', color: '#3c4c5c', imagePath: '/assets/clothing/men/13.jpg' },
  { id: 'men-14', name: '男装 14', type: 'suit', color: '#4d5d6d', imagePath: '/assets/clothing/men/14.jpg' },
  { id: 'men-15', name: '男装 15', type: 'suit', color: '#5e6e7e', imagePath: '/assets/clothing/men/15.jpg' },
  { id: 'men-16', name: '男装 16', type: 'suit', color: '#1c2c3c', imagePath: '/assets/clothing/men/16.jpg' },
  { id: 'men-17', name: '男装 17', type: 'suit', color: '#2d3d4d', imagePath: '/assets/clothing/men/17.jpg' },
  { id: 'men-18', name: '男装 18', type: 'suit', color: '#3e4e5e', imagePath: '/assets/clothing/men/18.jpg' },
  { id: 'men-19', name: '男装 19', type: 'suit', color: '#4f5f6f', imagePath: '/assets/clothing/men/19.jpg' },
  { id: 'men-20', name: '男装 20', type: 'suit', color: '#607080', imagePath: '/assets/clothing/men/20.jpg' },
  
  // Women's clothing (20 items)
  { id: 'women-01', name: '女装 01', type: 'formal', color: '#1a1a2e', imagePath: '/assets/clothing/women/1.jpg' },
  { id: 'women-02', name: '女装 02', type: 'formal', color: '#2c3e50', imagePath: '/assets/clothing/women/2.jpg' },
  { id: 'women-03', name: '女装 03', type: 'formal', color: '#3d3d3d', imagePath: '/assets/clothing/women/3.jpg' },
  { id: 'women-04', name: '女装 04', type: 'formal', color: '#4a4a4a', imagePath: '/assets/clothing/women/4.jpg' },
  { id: 'women-05', name: '女装 05', type: 'formal', color: '#5d5d5d', imagePath: '/assets/clothing/women/5.jpg' },
  { id: 'women-06', name: '女装 06', type: 'formal', color: '#2a2a3e', imagePath: '/assets/clothing/women/6.jpg' },
  { id: 'women-07', name: '女装 07', type: 'formal', color: '#1f3a4f', imagePath: '/assets/clothing/women/7.jpg' },
  { id: 'women-08', name: '女装 08', type: 'formal', color: '#3c4c5d', imagePath: '/assets/clothing/women/8.jpg' },
  { id: 'women-09', name: '女装 09', type: 'formal', color: '#2d3d4e', imagePath: '/assets/clothing/women/9.jpg' },
  { id: 'women-10', name: '女装 10', type: 'formal', color: '#4e5e6f', imagePath: '/assets/clothing/women/10.jpg' },
  { id: 'women-11', name: '女装 11', type: 'formal', color: '#1a2a3a', imagePath: '/assets/clothing/women/11.jpg' },
  { id: 'women-12', name: '女装 12', type: 'formal', color: '#2b3b4b', imagePath: '/assets/clothing/women/12.jpg' },
  { id: 'women-13', name: '女装 13', type: 'formal', color: '#3c4c5c', imagePath: '/assets/clothing/women/13.jpg' },
  { id: 'women-14', name: '女装 14', type: 'formal', color: '#4d5d6d', imagePath: '/assets/clothing/women/14.jpg' },
  { id: 'women-15', name: '女装 15', type: 'formal', color: '#5e6e7e', imagePath: '/assets/clothing/women/15.jpg' },
  { id: 'women-16', name: '女装 16', type: 'formal', color: '#1c2c3c', imagePath: '/assets/clothing/women/16.jpg' },
  { id: 'women-17', name: '女装 17', type: 'formal', color: '#2d3d4d', imagePath: '/assets/clothing/women/17.jpg' },
  { id: 'women-18', name: '女装 18', type: 'formal', color: '#3e4e5e', imagePath: '/assets/clothing/women/18.jpg' },
  { id: 'women-19', name: '女装 19', type: 'formal', color: '#4f5f6f', imagePath: '/assets/clothing/women/19.jpg' },
  { id: 'women-20', name: '女装 20', type: 'formal', color: '#607080', imagePath: '/assets/clothing/women/20.jpg' }
]

/**
 * Load a single clothing asset from image
 */
export async function loadClothingAsset(
  config: ClothingAssetConfig
): Promise<ClothingAsset | null> {
  try {
    let image: HTMLImageElement
    
    // Load from data URL or file path
    if (config.imageSrc) {
      image = await loadImage(config.imageSrc)
    } else {
      image = await loadImage(config.imagePath)
    }
    
    // Load thumbnail (or generate from main image)
    let thumbnail = ''
    if (config.thumbnailPath) {
      try {
        const thumbImg = await loadImage(config.thumbnailPath)
        const thumbCanvas = document.createElement('canvas')
        thumbCanvas.width = 80
        thumbCanvas.height = 100
        const ctx = thumbCanvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(thumbImg, 0, 0, 80, 100)
          thumbnail = thumbCanvas.toDataURL('image/png')
        }
      } catch {
        thumbnail = generateThumbnail(image)
      }
    } else {
      thumbnail = generateThumbnail(image)
    }

    return {
      id: config.id,
      name: config.name,
      type: config.type,
      color: config.color,
      image: image,
      thumbnail: thumbnail
    }
  } catch (error) {
    console.error(`Failed to load clothing asset ${config.id}:`, error)
    return null
  }
}

/**
 * Generate thumbnail from image
 */
function generateThumbnail(image: HTMLImageElement): string {
  const thumbCanvas = document.createElement('canvas')
  thumbCanvas.width = 80
  thumbCanvas.height = 100
  const ctx = thumbCanvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(image, 0, 0, 80, 100)
    return thumbCanvas.toDataURL('image/png')
  }
  return ''
}

/**
 * Load all clothing assets
 */
export async function loadAllClothingAssets(): Promise<ClothingAsset[]> {
  const assets: ClothingAsset[] = []
  
  // Load default assets
  for (const config of CLOTHING_ASSETS) {
    const asset = await loadClothingAsset(config)
    if (asset) {
      assets.push(asset)
    }
  }
  
  // Load custom assets from localStorage
  const customAssets = await loadCustomClothingAssets()
  assets.push(...customAssets)
  
  return assets
}

/**
 * Load custom clothing assets from localStorage
 */
export async function loadCustomClothingAssets(): Promise<ClothingAsset[]> {
  const assets: ClothingAsset[] = []
  
  try {
    const stored = localStorage.getItem('customClothing')
    if (!stored) return assets
    
    const customConfigs = JSON.parse(stored)
    for (const config of customConfigs) {
      const asset = await loadClothingAsset({
        id: config.id,
        name: config.name,
        type: config.type || 'suit',
        color: config.color || '#333333',
        imagePath: '',
        imageSrc: config.imageSrc
      })
      if (asset) {
        assets.push(asset)
      }
    }
  } catch (error) {
    console.error('Failed to load custom clothing assets:', error)
  }
  
  return assets
}

/**
 * Load image from URL
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

/**
 * Generate clothing asset from uploaded image
 * Allows users to upload their own clothing
 */
export async function loadClothingFromUpload(
  file: File
): Promise<ClothingAsset> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Generate thumbnail
        const thumbCanvas = document.createElement('canvas')
        thumbCanvas.width = 80
        thumbCanvas.height = 100
        const ctx = thumbCanvas.getContext('2d')
        let thumbnail = ''
        if (ctx) {
          ctx.drawImage(img, 0, 0, 80, 100)
          thumbnail = thumbCanvas.toDataURL('image/png')
        }
        
        resolve({
          id: `custom-${Date.now()}`,
          name: '自定义服装',
          type: 'suit',
          color: '#333333',
          image: img,
          thumbnail: thumbnail
        })
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Create clothing asset from canvas (for generated assets)
 */
export function createClothingAssetFromCanvas(
  id: string,
  name: string,
  type: 'suit' | 'shirt' | 'formal',
  color: string,
  canvas: HTMLCanvasElement
): ClothingAsset {
  const thumbCanvas = document.createElement('canvas')
  thumbCanvas.width = 80
  thumbCanvas.height = 100
  const thumbCtx = thumbCanvas.getContext('2d')
  if (thumbCtx) {
    thumbCtx.drawImage(canvas, 0, 0, 80, 100)
  }

  return {
    id,
    name,
    type,
    color,
    image: canvas,
    thumbnail: thumbCanvas.toDataURL('image/png')
  }
}
