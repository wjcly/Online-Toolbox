/**
 * Dynamic Clothing Asset Loader
 * Automatically loads all clothing images from folders
 */

import type { ClothingAsset } from './clothingAssetGenerator'

export interface ClothingCategory {
  id: string
  name: string
  type: 'suit' | 'shirt' | 'formal' | 'casual' | 'children'
  folder: string
}

export const CLOTHING_CATEGORIES: ClothingCategory[] = [
  { id: 'children-men', name: '男童', type: 'children', folder: 'children/men' },
  { id: 'children-women', name: '女童', type: 'children', folder: 'children/women' },
  { id: 'major-men', name: '男装', type: 'suit', folder: 'major/men' },
  { id: 'major-women', name: '女装', type: 'formal', folder: 'major/women' }
]

/**
 * Generate clothing asset list from folder structure
 * This creates configs for all images in the clothing folders
 */
export async function loadClothingAssetsFromFolders(): Promise<ClothingAsset[]> {
  const assets: ClothingAsset[] = []

  for (const category of CLOTHING_CATEGORIES) {
    try {
      // Try to load index file that lists all files in folder
      const indexUrl = `/assets/${category.folder}/index.json`
      const response = await fetch(indexUrl)

      if (response.ok) {
        const files: string[] = await response.json()

        for (const file of files) {
          const fileName = file.replace(/\.[^/.]+$/, '')
          const asset = await loadClothingAsset({
            id: `${category.id}-${fileName}`,
            name: `${category.name}-${fileName}`,
            type: category.type,
            color: '#333333',
            imagePath: `/assets/${category.folder}/${file}`
          })

          if (asset) {
            assets.push(asset)
          }
        }
      }
    } catch (error) {
      // Index file doesn't exist, will use fallback method
      console.log(`No index file for ${category.folder}, using fallback`)
    }
  }

  return assets
}

/**
 * Load a single clothing asset from image
 */
export async function loadClothingAsset(
  config: {
    id: string
    name: string
    type: 'suit' | 'shirt' | 'formal' | 'casual' | 'children'
    color: string
    imagePath: string
  }
): Promise<ClothingAsset | null> {
  try {
    const image = await loadImage(config.imagePath)

    // Generate thumbnail
    const thumbCanvas = document.createElement('canvas')
    thumbCanvas.width = 80
    thumbCanvas.height = 100
    const ctx = thumbCanvas.getContext('2d')
    let thumbnail = ''
    if (ctx) {
      ctx.drawImage(image, 0, 0, 80, 100)
      thumbnail = thumbCanvas.toDataURL('image/png')
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
        imagePath: config.imageSrc || ''
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
 * Load all clothing assets
 */
export async function loadAllClothingAssets(): Promise<ClothingAsset[]> {
  // Try dynamic loading first
  const dynamicAssets = await loadClothingAssetsFromFolders()
  
  if (dynamicAssets.length > 0) {
    return dynamicAssets
  }
  
  // Fallback to empty array (will use generated assets)
  return []
}

/**
 * Get all clothing categories
 */
export function getClothingCategories(): ClothingCategory[] {
  return CLOTHING_CATEGORIES
}
