/**
 * Lazy Clothing Asset Loader
 * Loads clothing assets on-demand to improve initial load performance
 */

import type { ClothingAsset } from './clothingAssetGenerator'

export interface ClothingCategory {
  id: string
  name: string
  type: 'suit' | 'shirt' | 'formal' | 'casual' | 'children'
  folder: string
}

export interface LazyClothingAsset {
  id: string
  name: string
  type: 'suit' | 'shirt' | 'formal' | 'children' | 'casual'
  color: string
  imagePath: string
  thumbnail?: string
  image?: HTMLImageElement | HTMLCanvasElement
  loaded: boolean
}

export const CLOTHING_CATEGORIES: ClothingCategory[] = [
  { id: 'children-men', name: '男童', type: 'children', folder: 'children/men' },
  { id: 'children-women', name: '女童', type: 'children', folder: 'children/women' },
  { id: 'major-men', name: '男装', type: 'suit', folder: 'major/men' },
  { id: 'major-women', name: '女装', type: 'formal', folder: 'major/women' }
]

/**
 * Cache for storing loaded assets and file lists
 */
const fileCache = new Map<string, string[]>()
const assetCache = new Map<string, LazyClothingAsset>()

/**
 * Get file list for a category (cached)
 */
export async function getCategoryFiles(categoryId: string): Promise<string[]> {
  if (fileCache.has(categoryId)) {
    return fileCache.get(categoryId)!
  }

  const category = CLOTHING_CATEGORIES.find(cat => cat.id === categoryId)
  if (!category) return []

  try {
    const indexUrl = `/assets/${category.folder}/index.json`
    const response = await fetch(indexUrl)
    if (!response.ok) {
      return []
    }

    const files: string[] = await response.json()
    fileCache.set(categoryId, files)
    return files
  } catch (error) {
    console.error(`Failed to load files for ${categoryId}:`, error)
    return []
  }
}

/**
 * Create a lazy clothing asset (not loaded yet)
 */
function createLazyAsset(
  categoryId: string,
  fileName: string,
  categoryName: string,
  type: string
): LazyClothingAsset {
  const cleanId = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '')
  const category = CLOTHING_CATEGORIES.find(cat => cat.id === categoryId)
  
  return {
    id: `${categoryId}-${cleanId}`,
    name: `${categoryName}-${fileName.replace('.png', '')}`,
    type: type as any,
    color: '#333333',
    imagePath: `/assets/${category?.folder}/${fileName}`,
    loaded: false
  }
}

/**
 * Load a single asset's image and thumbnail
 */
export async function loadAsset(asset: LazyClothingAsset): Promise<ClothingAsset | null> {
  if (asset.loaded && asset.image) {
    return {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      color: asset.color,
      image: asset.image,
      thumbnail: asset.thumbnail || ''
    }
  }

  try {
    const image = await loadImage(asset.imagePath)

    // Generate small thumbnail
    const thumbCanvas = document.createElement('canvas')
    thumbCanvas.width = 40
    thumbCanvas.height = 50
    const ctx = thumbCanvas.getContext('2d')
    let thumbnail = ''
    if (ctx) {
      ctx.drawImage(image, 0, 0, 40, 50)
      thumbnail = thumbCanvas.toDataURL('image/jpeg', 0.7)
    }

    asset.image = image
    asset.thumbnail = thumbnail
    asset.loaded = true

    return {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      color: asset.color,
      image: image,
      thumbnail: thumbnail
    }
  } catch (error) {
    console.error(`Failed to load asset ${asset.id}:`, error)
    return null
  }
}

/**
 * Load assets for a specific category (lazy - only creates metadata, doesn't load images)
 */
export async function loadCategoryAssets(categoryId: string): Promise<LazyClothingAsset[]> {
  const category = CLOTHING_CATEGORIES.find(cat => cat.id === categoryId)
  if (!category) return []

  const files = await getCategoryFiles(categoryId)
  const assets: LazyClothingAsset[] = []

  for (const file of files) {
    const cacheKey = `${categoryId}-${file}`
    if (assetCache.has(cacheKey)) {
      assets.push(assetCache.get(cacheKey)!)
    } else {
      const asset = createLazyAsset(categoryId, file, category.name, category.type)
      assetCache.set(cacheKey, asset)
      assets.push(asset)
    }
  }

  return assets
}

/**
 * Load and realize assets for a specific category
 */
export async function realizeCategoryAssets(categoryId: string): Promise<ClothingAsset[]> {
  const lazyAssets = await loadCategoryAssets(categoryId)
  const realizedAssets: ClothingAsset[] = []

  // Load in batches
  const batchSize = 10
  for (let i = 0; i < lazyAssets.length; i += batchSize) {
    const batch = lazyAssets.slice(i, i + batchSize)
    const promises = batch.map(asset => loadAsset(asset))
    const results = await Promise.all(promises)
    realizedAssets.push(...results.filter((r): r is ClothingAsset => r !== null))
  }

  return realizedAssets
}

/**
 * Preload thumbnails for a category (lightweight)
 */
export async function preloadCategoryThumbnails(categoryId: string): Promise<void> {
  const lazyAssets = await loadCategoryAssets(categoryId)
  
  // Load only first few assets fully, rest remain lazy
  const preloadCount = Math.min(5, lazyAssets.length)
  for (let i = 0; i < preloadCount; i++) {
    await loadAsset(lazyAssets[i])
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
 * Get all clothing categories
 */
export function getClothingCategories(): ClothingCategory[] {
  return CLOTHING_CATEGORIES
}
