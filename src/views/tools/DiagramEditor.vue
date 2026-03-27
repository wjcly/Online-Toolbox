<template>
  <div class="tool-page min-h-screen bg-gray-50 flex flex-col" @keydown="handleKeyDown" tabindex="0" ref="editorContainer">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
      <div class="flex items-center gap-4">
        <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <h1 class="text-lg font-bold text-gray-900">流程图编辑器</h1>
      </div>
      <div class="flex items-center gap-2">
        <button @click="selectAll" class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2" title="Ctrl+A">
          <Copy class="w-4 h-4" />
          全选
        </button>
        <button @click="clearCanvas" class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2">
          <Trash2 class="w-4 h-4" />
          清空
        </button>
        <button @click="exportImage" class="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2">
          <Download class="w-4 h-4" />
          导出图片
        </button>
        <button @click="exportJSON" class="px-3 py-1.5 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg flex items-center gap-2">
          <FileJson class="w-4 h-4" />
          导出 JSON
        </button>
        <label class="px-3 py-1.5 text-sm bg-purple-600 text-white hover:bg-purple-700 rounded-lg flex items-center gap-2 cursor-pointer">
          <Upload class="w-4 h-4" />
          导入 JSON
          <input type="file" @change="importJSON" accept=".json" class="hidden" />
        </label>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar - Shapes -->
      <div class="w-56 bg-white border-r border-gray-200 overflow-y-auto">
        <div class="p-4">
          <h3 class="font-semibold text-gray-700 mb-3">基本形状</h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="shape in basicShapes"
              :key="shape.type"
              @mousedown="startDragShape(shape.type)"
              class="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing"
            >
              <component :is="shape.icon" class="w-6 h-6 text-gray-600" />
              <span class="text-xs text-gray-600">{{ shape.name }}</span>
            </button>
          </div>

          <h3 class="font-semibold text-gray-700 mb-3 mt-6">流程图</h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="shape in flowchartShapes"
              :key="shape.type"
              @mousedown="startDragShape(shape.type)"
              class="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing"
            >
              <component :is="shape.icon" class="w-6 h-6 text-gray-600" />
              <span class="text-xs text-gray-600">{{ shape.name }}</span>
            </button>
          </div>

          <h3 class="font-semibold text-gray-700 mb-3 mt-6">连接线</h3>
          <div class="space-y-2">
            <button
              @click="addLine('straight')"
              class="w-full p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <Minus class="w-6 h-6 text-gray-600" />
              <span class="text-xs text-gray-600">直线</span>
            </button>
            <button
              @click="addLine('arrow')"
              class="w-full p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <ArrowRight class="w-6 h-6 text-gray-600" />
              <span class="text-xs text-gray-600">箭头</span>
            </button>
            <button
              @click="addLine('curve')"
              class="w-full p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <CornerDownRight class="w-6 h-6 text-gray-600" />
              <span class="text-xs text-gray-600">曲线</span>
            </button>
          </div>

          <h3 class="font-semibold text-gray-700 mb-3 mt-6">样式</h3>
          <div class="space-y-3">
            <div>
              <label class="text-xs text-gray-500">填充颜色</label>
              <div class="flex flex-wrap gap-1 mt-1">
                <button
                  v-for="color in colors"
                  :key="color"
                  @click="selectedColor = color"
                  :style="{ backgroundColor: color }"
                  :class="selectedColor === color ? 'ring-2 ring-blue-500' : ''"
                  class="w-6 h-6 rounded border border-gray-300"
                ></button>
              </div>
            </div>
            <div>
              <label class="text-xs text-gray-500">线条粗细</label>
              <input type="range" v-model.number="strokeWidth" min="1" max="10" class="w-full mt-1" />
            </div>
          </div>
          
          <!-- Keyboard shortcuts help -->
          <div class="mt-6 p-3 bg-blue-50 rounded-lg">
            <h4 class="font-semibold text-blue-900 text-sm mb-2">⌨️ 快捷键</h4>
            <ul class="text-xs text-blue-700 space-y-1">
              <li><kbd class="px-1 bg-white rounded">Delete</kbd> 删除选中</li>
              <li><kbd class="px-1 bg-white rounded">Ctrl</kbd>+<kbd class="px-1 bg-white rounded">A</kbd> 全选</li>
              <li><kbd class="px-1 bg-white rounded">Ctrl</kbd>+<kbd class="px-1 bg-white rounded">Z</kbd> 撤销</li>
              <li><kbd class="px-1 bg-white rounded">拖拽</kbd> 移动元素</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Canvas -->
      <div class="flex-1 relative overflow-hidden bg-gray-100" ref="canvasContainer" @mousedown="handleCanvasMouseDown" @mousemove="handleCanvasMouseMove" @mouseup="handleCanvasMouseUp" @mouseleave="handleCanvasMouseUp">
        <div class="absolute inset-0" ref="canvasWrapper" :style="{ transform: `scale(${zoom})`, transformOrigin: 'top left' }">
          <!-- Grid Pattern -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <!-- Shapes and Lines -->
          <svg class="absolute inset-0 w-full h-full" ref="svgCanvas">
            <!-- Lines -->
            <g v-for="line in lines" :key="line.id" @mousedown.stop="selectElement(line)" :class="['cursor-pointer', isSelected(line) ? 'selected' : '']">
              <!-- Straight Line -->
              <line v-if="line.type === 'straight'"
                :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2"
                :stroke="line.stroke" :stroke-width="line.strokeWidth" fill="none"
              />
              <!-- Arrow Line -->
              <g v-if="line.type === 'arrow'">
                <line :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2"
                  :stroke="line.stroke" :stroke-width="line.strokeWidth" fill="none"
                />
                <line :x1="line.x2" :y1="line.y2" 
                  :x2="arrowX1(line)" :y2="arrowY1(line)"
                  :stroke="line.stroke" :stroke-width="line.strokeWidth" fill="none"
                />
                <line :x1="line.x2" :y1="line.y2"
                  :x2="arrowX2(line)" :y2="arrowY2(line)"
                  :stroke="line.stroke" :stroke-width="line.strokeWidth" fill="none"
                />
              </g>
              <!-- Curve Line -->
              <path v-if="line.type === 'curve'"
                :d="curvePath(line)"
                :stroke="line.stroke" :stroke-width="line.strokeWidth" fill="none"
              />
              <!-- Selection highlight -->
              <component v-if="isSelected(line)"
                :is="line.type === 'curve' ? 'path' : 'line'"
                v-bind="line.type === 'curve' ? { d: curvePath(line) } : { x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2 }"
                stroke="#3b82f6" stroke-width="4" stroke-opacity="0.3" fill="none"
              />
            </g>

            <!-- Shapes -->
            <g v-for="shape in shapes" :key="shape.id" 
               @mousedown.stop="handleShapeMouseDown(shape, $event)" 
               class="cursor-pointer"
               :class="{ selected: isSelected(shape) }">
              <!-- Rectangle -->
              <rect v-if="shape.type === 'rectangle'"
                :x="shape.x" :y="shape.y" :width="shape.width" :height="shape.height"
                :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
              />
              <!-- Circle -->
              <circle v-if="shape.type === 'circle'"
                :cx="shape.x + shape.width / 2" :cy="shape.y + shape.height / 2"
                :r="Math.min(shape.width, shape.height) / 2"
                :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
              />
              <!-- Ellipse -->
              <ellipse v-if="shape.type === 'ellipse'"
                :cx="shape.x + shape.width / 2" :cy="shape.y + shape.height / 2"
                :rx="shape.width / 2" :ry="shape.height / 2"
                :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
              />
              <!-- Triangle -->
              <polygon v-if="shape.type === 'triangle'"
                :points="`${shape.x + shape.width / 2},${shape.y} ${shape.x + shape.width},${shape.y + shape.height} ${shape.x},${shape.y + shape.height}`"
                :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
              />
              <!-- Diamond -->
              <polygon v-if="shape.type === 'diamond'"
                :points="`${shape.x + shape.width / 2},${shape.y} ${shape.x + shape.width},${shape.y + shape.height / 2} ${shape.x + shape.width / 2},${shape.y + shape.height} ${shape.x},${shape.y + shape.height / 2}`"
                :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
              />
              <!-- Parallelogram -->
              <polygon v-if="shape.type === 'parallelogram'"
                :points="`${shape.x + shape.width * 0.2},${shape.y} ${shape.x + shape.width},${shape.y} ${shape.x + shape.width - shape.width * 0.2},${shape.y + shape.height} ${shape.x},${shape.y + shape.height}`"
                :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
              />
              <!-- Hexagon -->
              <polygon v-if="shape.type === 'hexagon'"
                :points="`${shape.x + shape.width * 0.15},${shape.y} ${shape.x + shape.width - shape.width * 0.15},${shape.y} ${shape.x + shape.width},${shape.y + shape.height / 2} ${shape.x + shape.width - shape.width * 0.15},${shape.y + shape.height} ${shape.x + shape.width * 0.15},${shape.y + shape.height} ${shape.x},${shape.y + shape.height / 2}`"
                :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
              />
              <!-- Rounded Rectangle -->
              <rect v-if="shape.type === 'rounded'"
                :x="shape.x" :y="shape.y" :width="shape.width" :height="shape.height"
                :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth" rx="10"
              />
              
              <!-- Selection highlight -->
              <component v-if="isSelected(shape)"
                :is="getHighlightType(shape.type)"
                v-bind="getShapeHighlightProps(shape)"
                fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="5,5"
              />
              
              <!-- Resize handles for selected shape -->
              <g v-if="isSelected(shape) && !isMultiSelected">
                <circle :cx="shape.x" :cy="shape.y" r="6" fill="#3b82f6" class="cursor-nw-resize" @mousedown.stop="startResize(shape, 'nw', $event)" />
                <circle :cx="shape.x + shape.width" :cy="shape.y" r="6" fill="#3b82f6" class="cursor-ne-resize" @mousedown.stop="startResize(shape, 'ne', $event)" />
                <circle :cx="shape.x" :cy="shape.y + shape.height" r="6" fill="#3b82f6" class="cursor-sw-resize" @mousedown.stop="startResize(shape, 'sw', $event)" />
                <circle :cx="shape.x + shape.width" :cy="shape.y + shape.height" r="6" fill="#3b82f6" class="cursor-se-resize" @mousedown.stop="startResize(shape, 'se', $event)" />
              </g>
              
              <!-- Text -->
              <text
                v-if="shape.text"
                :x="shape.x + shape.width / 2"
                :y="shape.y + shape.height / 2"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="#1f2937"
                font-size="14"
                class="pointer-events-none select-none"
              >
                {{ shape.text }}
              </text>
            </g>
          </svg>
        </div>

        <!-- Zoom controls -->
        <div class="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
          <button @click="zoomOut" class="p-1 hover:bg-gray-100 rounded">
            <Minus class="w-4 h-4" />
          </button>
          <span class="text-sm w-12 text-center">{{ Math.round(zoom * 100) }}%</span>
          <button @click="zoomIn" class="p-1 hover:bg-gray-100 rounded">
            <Plus class="w-4 h-4" />
          </button>
        </div>
        
        <!-- Selection info -->
        <div v-if="selectedElements.length > 0" class="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 text-sm text-gray-600">
          已选择 {{ selectedElements.length }} 个元素
        </div>
      </div>

      <!-- Right Sidebar - Properties -->
      <div class="w-64 bg-white border-l border-gray-200 overflow-y-auto">
        <div class="p-4">
          <h3 class="font-semibold text-gray-700 mb-4">属性</h3>
          
          <div v-if="selectedElement && !isMultiSelected" class="space-y-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">文本</label>
              <input
                v-model="selectedElement.text"
                @input="updateElement"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="输入文本..."
              />
            </div>
            
            <div>
              <label class="block text-sm text-gray-600 mb-1">位置 X</label>
              <input
                v-model.number="selectedElement.x"
                @input="updateElement"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            
            <div>
              <label class="block text-sm text-gray-600 mb-1">位置 Y</label>
              <input
                v-model.number="selectedElement.y"
                @input="updateElement"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div v-if="hasWidth">
              <label class="block text-sm text-gray-600 mb-1">宽度</label>
              <input
                v-model.number="selectedElement.width"
                @input="updateElement"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div v-if="hasHeight">
              <label class="block text-sm text-gray-600 mb-1">高度</label>
              <input
                v-model.number="selectedElement.height"
                @input="updateElement"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">填充颜色</label>
              <input
                v-model="selectedElement.fill"
                @input="updateElement"
                type="color"
                class="w-full h-10 rounded cursor-pointer"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">线条颜色</label>
              <input
                v-model="selectedElement.stroke"
                @input="updateElement"
                type="color"
                class="w-full h-10 rounded cursor-pointer"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">线条粗细</label>
              <input
                v-model.number="selectedElement.strokeWidth"
                @input="updateElement"
                type="number"
                min="1"
                max="20"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <button @click="deleteSelected" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
              删除
            </button>
          </div>
          
          <div v-else-if="isMultiSelected" class="space-y-4">
            <p class="text-sm text-gray-600">已选择 {{ selectedElements.length }} 个元素</p>
            <button @click="deleteSelected" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
              删除选中的元素
            </button>
          </div>

          <div v-else class="text-center py-8 text-gray-400">
            <MousePointer2 class="w-12 h-12 mx-auto mb-3" />
            <p>选择一个元素编辑属性</p>
          </div>

          <!-- Quick Templates -->
          <div class="mt-6">
            <h4 class="font-semibold text-gray-700 mb-3">快速模板</h4>
            <div class="space-y-2">
              <button @click="loadTemplate('flowchart')" class="w-full px-3 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 rounded-lg text-sm text-left transition-colors">
                📊 基础流程图
              </button>
              <button @click="loadTemplate('orgchart')" class="w-full px-3 py-2 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 rounded-lg text-sm text-left transition-colors">
                👥 组织结构图
              </button>
              <button @click="loadTemplate('mindmap')" class="w-full px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 rounded-lg text-sm text-left transition-colors">
                🧠 思维导图
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ArrowLeft, Trash2, Download, FileJson, Upload, Plus, Minus,
  Square, Circle, Diamond, Hexagon, Triangle,
  ArrowRight, CornerDownRight, MousePointer2, Copy
} from 'lucide-vue-next'
import { toast } from '@/utils/toast'

// Shape icons
const basicShapes = [
  { type: 'rectangle', name: '矩形', icon: Square },
  { type: 'circle', name: '圆形', icon: Circle },
  { type: 'ellipse', name: '椭圆', icon: Circle },
  { type: 'triangle', name: '三角形', icon: Triangle },
]

const flowchartShapes = [
  { type: 'diamond', name: '菱形', icon: Diamond },
  { type: 'parallelogram', name: '平行四边形', icon: Square },
  { type: 'hexagon', name: '六边形', icon: Hexagon },
  { type: 'rounded', name: '圆角矩形', icon: Square },
]

const colors = ['#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#6b7280']

// State
const editorContainer = ref<HTMLElement | null>(null)
const canvasContainer = ref<HTMLElement | null>(null)
const canvasWrapper = ref<HTMLElement | null>(null)
const svgCanvas = ref<SVGSVGElement | null>(null)

const shapes = ref<any[]>([])
const lines = ref<any[]>([])
const zoom = ref(1)

const selectedElement = ref<any>(null)
const selectedElements = ref<any[]>([])
const selectedColor = ref('#3b82f6')
const strokeWidth = ref(2)

// Drag state
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const dragElements = ref<any[]>([])

// Resize state
const isResizing = ref(false)
const resizeCorner = ref('')
const resizeShape = ref<any>(null)
const resizeStartPos = ref({ x: 0, y: 0 })
const resizeStartBounds = ref({ x: 0, y: 0, width: 0, height: 0 })

// History for undo
const history = ref<any[]>([])

let elementId = 0

// Computed
const hasWidth = computed(() => selectedElement.value && 'width' in selectedElement.value)
const hasHeight = computed(() => selectedElement.value && 'height' in selectedElement.value)
const isMultiSelected = computed(() => selectedElements.value.length > 1)

// Methods
const isSelected = (element: any) => {
  return selectedElements.value.some(e => e.id === element.id)
}

const getHighlightType = (type: string) => {
  if (type === 'circle') return 'circle'
  if (type === 'ellipse') return 'ellipse'
  return 'rect'
}

const getShapeHighlightProps = (shape: any) => {
  if (shape.type === 'circle') {
    const radius = Math.min(shape.width, shape.height) / 2
    return { cx: shape.x + shape.width / 2, cy: shape.y + shape.height / 2, r: radius }
  } else if (shape.type === 'ellipse') {
    return { cx: shape.x + shape.width / 2, cy: shape.y + shape.height / 2, rx: shape.width / 2, ry: shape.height / 2 }
  } else {
    return { x: shape.x, y: shape.y, width: shape.width, height: shape.height }
  }
}

const arrowX1 = (line: any) => line.x2 - 15 * Math.cos(Math.atan2(line.y2 - line.y1, line.x2 - line.x1) - Math.PI / 6)
const arrowY1 = (line: any) => line.y2 - 15 * Math.sin(Math.atan2(line.y2 - line.y1, line.x2 - line.x1) - Math.PI / 6)
const arrowX2 = (line: any) => line.x2 - 15 * Math.cos(Math.atan2(line.y2 - line.y1, line.x2 - line.x1) + Math.PI / 6)
const arrowY2 = (line: any) => line.y2 - 15 * Math.sin(Math.atan2(line.y2 - line.y1, line.x2 - line.x1) + Math.PI / 6)
const curvePath = (line: any) => `M ${line.x1} ${line.y1} Q ${(line.x1 + line.x2) / 2 + 50} ${(line.y1 + line.y2) / 2} ${line.x2} ${line.y2}`

const saveHistory = () => {
  history.value.push({
    shapes: JSON.parse(JSON.stringify(shapes.value)),
    lines: JSON.parse(JSON.stringify(lines.value)),
  })
  if (history.value.length > 50) {
    history.value.shift()
  }
}

const undo = () => {
  if (history.value.length === 0) return
  const lastState = history.value.pop()
  shapes.value = lastState.shapes
  lines.value = lastState.lines
  selectedElement.value = null
  selectedElements.value = []
  toast.info('已撤销')
}

const addLine = (type: string) => {
  saveHistory()
  lines.value.push({
    id: ++elementId,
    type,
    x1: 100 + lines.value.length * 20,
    y1: 100 + lines.value.length * 20,
    x2: 250 + lines.value.length * 20,
    y2: 150 + lines.value.length * 20,
    stroke: '#1f2937',
    strokeWidth: strokeWidth.value,
  })
}

const startDragShape = (type: string) => {
  saveHistory()
  const newShape = {
    id: ++elementId,
    type,
    x: 100 + shapes.value.length * 20,
    y: 100 + shapes.value.length * 20,
    width: 120,
    height: 80,
    fill: selectedColor.value,
    stroke: '#1f2937',
    strokeWidth: strokeWidth.value,
    text: '',
  }
  shapes.value.push(newShape)
  selectElement(newShape)
  isDragging.value = true
  dragElements.value = [newShape]
  dragOffset.value = { x: 60, y: 40 }
}

const handleShapeMouseDown = (shape: any, e: MouseEvent) => {
  if (!isSelected(shape)) {
    if (!e.shiftKey) {
      selectedElements.value = []
    }
    selectElement(shape)
  } else if (e.shiftKey) {
    deselectElement(shape)
  }
  
  isDragging.value = true
  dragElements.value = selectedElements.value.length > 0 ? selectedElements.value : [shape]
  dragOffset.value = {
    x: e.clientX / zoom.value - shape.x,
    y: e.clientY / zoom.value - shape.y,
  }
}

const handleCanvasMouseDown = (e: MouseEvent) => {
  if (e.target === canvasContainer.value || e.target === canvasWrapper.value) {
    if (!e.shiftKey) {
      selectedElements.value = []
      selectedElement.value = null
    }
  }
}

const handleCanvasMouseMove = (e: MouseEvent) => {
  if (isDragging.value && dragElements.value.length > 0) {
    const canvasRect = canvasContainer.value?.getBoundingClientRect()
    if (canvasRect) {
      const newX = (e.clientX - canvasRect.left) / zoom.value - dragOffset.value.x
      const newY = (e.clientY - canvasRect.top) / zoom.value - dragOffset.value.y
      
      const dx = newX - dragElements.value[0].x
      const dy = newY - dragElements.value[0].y
      
      dragElements.value.forEach(el => {
        if ('x' in el) el.x += dx
        if ('y' in el) el.y += dy
        if ('x1' in el) { el.x1 += dx; el.x2 += dx }
        if ('y1' in el) { el.y1 += dy; el.y2 += dy }
      })
    }
  }
}

const handleCanvasMouseUp = () => {
  isDragging.value = false
  dragElements.value = []
}

const selectElement = (element: any) => {
  selectedElement.value = element
  if (!selectedElements.value.some(e => e.id === element.id)) {
    selectedElements.value.push(element)
  }
}

const deselectElement = (element: any) => {
  selectedElements.value = selectedElements.value.filter(e => e.id !== element.id)
  if (selectedElement.value?.id === element.id) {
    selectedElement.value = selectedElements.value[0] || null
  }
}

const selectAll = () => {
  selectedElements.value = [...shapes.value, ...lines.value]
  selectedElement.value = selectedElements.value[0] || null
}

const startResize = (shape: any, corner: string, e: MouseEvent) => {
  isResizing.value = true
  resizeCorner.value = corner
  resizeShape.value = shape
  resizeStartPos.value = { x: e.clientX, y: e.clientY }
  resizeStartBounds.value = { x: shape.x, y: shape.y, width: shape.width, height: shape.height }
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (e: MouseEvent) => {
  if (!isResizing.value || !resizeShape.value) return
  
  const dx = (e.clientX - resizeStartPos.value.x) / zoom.value
  const dy = (e.clientY - resizeStartPos.value.y) / zoom.value
  const shape = resizeShape.value
  const corner = resizeCorner.value
  
  if (corner.includes('e')) {
    shape.width = Math.max(20, resizeStartBounds.value.width + dx)
  }
  if (corner.includes('w')) {
    const newWidth = Math.max(20, resizeStartBounds.value.width - dx)
    shape.x = resizeStartBounds.value.x + (resizeStartBounds.value.width - newWidth)
    shape.width = newWidth
  }
  if (corner.includes('s')) {
    shape.height = Math.max(20, resizeStartBounds.value.height + dy)
  }
  if (corner.includes('n')) {
    const newHeight = Math.max(20, resizeStartBounds.value.height - dy)
    shape.y = resizeStartBounds.value.y + (resizeStartBounds.value.height - newHeight)
    shape.height = newHeight
  }
}

const stopResize = () => {
  isResizing.value = false
  resizeShape.value = null
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

const updateElement = () => {
  // Update element in array
  const shapeIndex = shapes.value.findIndex(s => s.id === selectedElement.value.id)
  if (shapeIndex !== -1) {
    shapes.value[shapeIndex] = { ...selectedElement.value }
  }
  
  const lineIndex = lines.value.findIndex(l => l.id === selectedElement.value.id)
  if (lineIndex !== -1) {
    lines.value[lineIndex] = { ...selectedElement.value }
  }
}

const deleteSelected = () => {
  if (selectedElements.value.length === 0) return
  
  saveHistory()
  
  selectedElements.value.forEach(el => {
    const shapeIndex = shapes.value.findIndex(s => s.id === el.id)
    if (shapeIndex !== -1) {
      shapes.value.splice(shapeIndex, 1)
    }
    
    const lineIndex = lines.value.findIndex(l => l.id === el.id)
    if (lineIndex !== -1) {
      lines.value.splice(lineIndex, 1)
    }
  })
  
  selectedElement.value = null
  selectedElements.value = []
  toast.success('已删除选中的元素')
}

const handleKeyDown = (e: KeyboardEvent) => {
  // Delete key
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selectedElements.value.length > 0) {
      e.preventDefault()
      deleteSelected()
    }
  }
  
  // Ctrl+A - Select all
  if (e.ctrlKey && e.key === 'a') {
    e.preventDefault()
    selectAll()
  }
  
  // Ctrl+Z - Undo
  if (e.ctrlKey && e.key === 'z') {
    e.preventDefault()
    undo()
  }
  
  // Ctrl+C - Copy (future feature)
  // Ctrl+V - Paste (future feature)
}

const clearCanvas = () => {
  saveHistory()
  shapes.value = []
  lines.value = []
  selectedElement.value = null
  selectedElements.value = []
  elementId = 0
}

const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.1, 2)
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.1, 0.5)
}

const exportImage = () => {
  const svg = svgCanvas.value
  if (!svg) return

  const svgData = new XMLSerializer().serializeToString(svg)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()

  canvas.width = 800
  canvas.height = 600

  img.onload = () => {
    if (ctx) {
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
    const pngFile = canvas.toDataURL('image/png')
    const downloadLink = document.createElement('a')
    downloadLink.download = 'diagram.png'
    downloadLink.href = pngFile
    downloadLink.click()
    toast.success('图片已导出')
  }

  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
}

const exportJSON = () => {
  const data = { shapes: shapes.value, lines: lines.value }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'diagram.json'
  a.click()
  URL.revokeObjectURL(url)
  toast.success('JSON 已导出')
}

const importJSON = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  saveHistory()
  
  const reader = new FileReader()
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target?.result as string)
      shapes.value = data.shapes || []
      lines.value = data.lines || []
      const maxShapeId = shapes.value.length > 0 ? Math.max(...shapes.value.map(s => s.id)) : 0
      const maxLineId = lines.value.length > 0 ? Math.max(...lines.value.map(l => l.id)) : 0
      elementId = Math.max(maxShapeId, maxLineId)
      toast.success('导入成功')
    } catch {
      toast.error('导入失败：文件格式错误')
    }
  }
  reader.readAsText(file)
}

const loadTemplate = (type: string) => {
  saveHistory()
  clearCanvas()
  
  if (type === 'flowchart') {
    shapes.value = [
      { id: ++elementId, type: 'rounded', x: 200, y: 30, width: 120, height: 50, fill: '#e0f2fe', stroke: '#0369a1', strokeWidth: 2, text: '开始' },
      { id: ++elementId, type: 'rectangle', x: 200, y: 120, width: 120, height: 60, fill: '#fef3c7', stroke: '#b45309', strokeWidth: 2, text: '处理' },
      { id: ++elementId, type: 'diamond', x: 185, y: 220, width: 150, height: 80, fill: '#dbeafe', stroke: '#1d4ed8', strokeWidth: 2, text: '判断' },
      { id: ++elementId, type: 'rectangle', x: 50, y: 340, width: 120, height: 60, fill: '#fef3c7', stroke: '#b45309', strokeWidth: 2, text: '处理 A' },
      { id: ++elementId, type: 'rectangle', x: 350, y: 340, width: 120, height: 60, fill: '#fef3c7', stroke: '#b45309', strokeWidth: 2, text: '处理 B' },
      { id: ++elementId, type: 'rounded', x: 200, y: 450, width: 120, height: 50, fill: '#e0f2fe', stroke: '#0369a1', strokeWidth: 2, text: '结束' },
    ]
    lines.value = [
      { id: ++elementId, type: 'arrow', x1: 260, y1: 80, x2: 260, y2: 120, stroke: '#374151', strokeWidth: 2 },
      { id: ++elementId, type: 'arrow', x1: 260, y1: 180, x2: 260, y2: 220, stroke: '#374151', strokeWidth: 2 },
      { id: ++elementId, type: 'arrow', x1: 185, y1: 260, x2: 110, y2: 340, stroke: '#374151', strokeWidth: 2 },
      { id: ++elementId, type: 'arrow', x1: 335, y1: 260, x2: 410, y2: 340, stroke: '#374151', strokeWidth: 2 },
      { id: ++elementId, type: 'arrow', x1: 110, y1: 400, x2: 260, y2: 450, stroke: '#374151', strokeWidth: 2 },
      { id: ++elementId, type: 'arrow', x1: 410, y1: 400, x2: 260, y2: 450, stroke: '#374151', strokeWidth: 2 },
    ]
  } else if (type === 'orgchart') {
    shapes.value = [
      { id: ++elementId, type: 'rectangle', x: 250, y: 30, width: 150, height: 60, fill: '#fef3c7', stroke: '#b45309', strokeWidth: 2, text: '总经理' },
      { id: ++elementId, type: 'rectangle', x: 50, y: 150, width: 120, height: 50, fill: '#dbeafe', stroke: '#1d4ed8', strokeWidth: 2, text: '技术部' },
      { id: ++elementId, type: 'rectangle', x: 200, y: 150, width: 120, height: 50, fill: '#dbeafe', stroke: '#1d4ed8', strokeWidth: 2, text: '市场部' },
      { id: ++elementId, type: 'rectangle', x: 350, y: 150, width: 120, height: 50, fill: '#dbeafe', stroke: '#1d4ed8', strokeWidth: 2, text: '财务部' },
    ]
    lines.value = [
      { id: ++elementId, type: 'straight', x1: 325, y1: 90, x2: 325, y2: 130, stroke: '#374151', strokeWidth: 2 },
      { id: ++elementId, type: 'straight', x1: 110, y1: 130, x2: 540, y2: 130, stroke: '#374151', strokeWidth: 2 },
      { id: ++elementId, type: 'straight', x1: 110, y1: 130, x2: 110, y2: 150, stroke: '#374151', strokeWidth: 2 },
      { id: ++elementId, type: 'straight', x1: 260, y1: 130, x2: 260, y2: 150, stroke: '#374151', strokeWidth: 2 },
      { id: ++elementId, type: 'straight', x1: 410, y1: 130, x2: 410, y2: 150, stroke: '#374151', strokeWidth: 2 },
    ]
  } else if (type === 'mindmap') {
    shapes.value = [
      { id: ++elementId, type: 'ellipse', x: 300, y: 200, width: 150, height: 80, fill: '#fef3c7', stroke: '#b45309', strokeWidth: 2, text: '中心主题' },
      { id: ++elementId, type: 'ellipse', x: 50, y: 80, width: 120, height: 60, fill: '#dbeafe', stroke: '#1d4ed8', strokeWidth: 2, text: '分支 1' },
      { id: ++elementId, type: 'ellipse', x: 50, y: 200, width: 120, height: 60, fill: '#dbeafe', stroke: '#1d4ed8', strokeWidth: 2, text: '分支 2' },
      { id: ++elementId, type: 'ellipse', x: 50, y: 320, width: 120, height: 60, fill: '#dbeafe', stroke: '#1d4ed8', strokeWidth: 2, text: '分支 3' },
      { id: ++elementId, type: 'ellipse', x: 500, y: 150, width: 120, height: 60, fill: '#dcfce7', stroke: '#15803d', strokeWidth: 2, text: '分支 4' },
      { id: ++elementId, type: 'ellipse', x: 500, y: 280, width: 120, height: 60, fill: '#dcfce7', stroke: '#15803d', strokeWidth: 2, text: '分支 5' },
    ]
    lines.value = [
      { id: ++elementId, type: 'curve', x1: 300, y1: 240, x2: 170, y2: 110, stroke: '#374151', strokeWidth: 2 },
      { id: ++elementId, type: 'curve', x1: 300, y1: 240, x2: 170, y2: 230, stroke: '#374151', strokeWidth: 2 },
      { id: ++elementId, type: 'curve', x1: 300, y1: 240, x2: 170, y2: 350, stroke: '#374151', strokeWidth: 2 },
      { id: ++elementId, type: 'curve', x1: 450, y1: 240, x2: 500, y2: 180, stroke: '#374151', strokeWidth: 2 },
      { id: ++elementId, type: 'curve', x1: 450, y1: 240, x2: 500, y2: 280, stroke: '#374151', strokeWidth: 2 },
    ]
  }
  
  selectAll()
  toast.success('模板已加载')
}

// Focus editor on mount
onMounted(() => {
  editorContainer.value?.focus()
})

// Cleanup
onUnmounted(() => {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.selected {
  filter: drop-shadow(0 0 2px #3b82f6);
}
</style>
