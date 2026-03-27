<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header v-if="isUnlocked" class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <div class="flex items-center gap-2">
              <Shield class="w-6 h-6 text-blue-600" />
              <h1 class="text-xl font-bold text-gray-900">Password Manager</h1>
            </div>
          </div>
          <button @click="lock" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
            <Lock class="w-4 h-4" />
            Lock
          </button>
        </div>
      </div>
    </header>

    <div v-if="!isUnlocked" class="min-h-screen flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <button @click="$router.push('/')" class="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-900">
          <ArrowLeft class="w-5 h-5" />
          Back to Home
        </button>

        <div class="bg-white rounded-xl p-8 shadow-lg">
          <div class="text-center mb-8">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield class="w-8 h-8 text-blue-600" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              {{ setupStep === 0 ? 'Set Up Password Manager' : 'Unlock Password Manager' }}
            </h1>
            <p class="text-gray-500">
              {{ setupStep === 0 ? 'Create a strong master password' : 'Enter your master password' }}
            </p>
          </div>

          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 class="font-medium text-green-800 mb-2 flex items-center gap-2">
              <Lock class="w-4 h-4" />
              Security Features
            </h3>
            <ul class="text-sm text-green-700 space-y-1">
              <li>• AES-256-CBC encryption</li>
              <li>• Zero-knowledge architecture</li>
              <li>• Local encryption/decryption</li>
              <li>• PBKDF2 key derivation (100,000 iterations)</li>
            </ul>
          </div>

          <!-- Setup Step 0: Create Master Password -->
          <div v-if="setupStep === 0" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Master Password</label>
              <div class="relative">
                <input
                  v-model="masterPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Create a strong password"
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Master Password</label>
              <div class="relative">
                <input
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>
            <button
              @click="goToConfirm"
              class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Lock class="w-5 h-5" />
              Continue
            </button>
          </div>

          <!-- Unlock: Enter Master Password -->
          <div v-else class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Master Password</label>
              <div class="relative">
                <input
                  v-model="masterPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your master password"
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @keyup.enter="unlock"
                />
                <button
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>
            <button
              @click="unlock"
              class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Lock class="w-5 h-5" />
              Unlock Vault
            </button>
          </div>

          <div v-if="setupStep === 0" class="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-700 mb-2">Password Requirements:</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li :class="checkLength ? 'text-green-600' : ''">• At least 8 characters</li>
              <li :class="checkUppercase ? 'text-green-600' : ''">• At least one uppercase letter</li>
              <li :class="checkLowercase ? 'text-green-600' : ''">• At least one lowercase letter</li>
              <li :class="checkNumber ? 'text-green-600' : ''">• At least one number</li>
              <li :class="checkSpecial ? 'text-green-600' : ''">• At least one special character</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search passwords..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex gap-2">
          <button
            @click="showExportModal = true"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download class="w-4 h-4" />
            导出
          </button>
          <button
            @click="showImportModal = true"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Upload class="w-4 h-4" />
            导入
          </button>
        </div>
        <button
          @click="showAddForm = true"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          Add Password
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div v-if="filteredEntries.length === 0" class="p-12 text-center">
          <Key class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">{{ searchQuery ? 'No passwords found' : 'No passwords saved yet' }}</p>
        </div>
        <div v-else class="divide-y divide-gray-200">
          <div v-for="entry in filteredEntries" :key="entry.id" class="p-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span class="text-blue-600 font-bold">{{ entry.website.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="min-w-0">
                  <h3 class="font-medium text-gray-900 truncate">{{ entry.website }}</h3>
                  <p class="text-sm text-gray-500 truncate">{{ entry.username }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button @click="copyToClipboard(entry.username, 'user-' + entry.id)" class="p-2 hover:bg-gray-200 rounded" title="Copy username">
                  <Check v-if="copiedField === 'user-' + entry.id" class="w-4 h-4 text-green-500" />
                  <Copy v-else class="w-4 h-4" />
                </button>
                <button @click="copyToClipboard(entry.password, 'pass-' + entry.id)" class="p-2 hover:bg-gray-200 rounded" title="Copy password">
                  <Check v-if="copiedField === 'pass-' + entry.id" class="w-4 h-4 text-green-500" />
                  <Copy v-else class="w-4 h-4" />
                </button>
                <button @click="editEntry(entry)" class="p-2 hover:bg-gray-200 rounded" title="Edit">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="deleteEntry(entry.id)" class="p-2 hover:bg-red-100 text-red-500 rounded" title="Delete">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddForm" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">{{ editingEntry ? 'Edit Password' : 'Add Password' }}</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Website / App *</label>
            <input
              v-model="formData.website"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., google.com"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username / Email *</label>
            <input
              v-model="formData.username"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., user@example.com"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <div class="flex gap-2">
              <input
                v-model="formData.password"
                :type="showFormPassword ? 'text' : 'password'"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button @click="showFormPassword = !showFormPassword" class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Eye v-if="!showFormPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
              <button @click="generatePassword" class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" title="Generate">
                <Key class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              v-model="formData.notes"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Optional notes..."
            ></textarea>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="closeForm" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button @click="saveEntry" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {{ editingEntry ? 'Save Changes' : 'Add Password' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Export Modal -->
    <div v-if="showExportModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
          <Download class="w-5 h-5 text-green-600" />
          导出密码
        </h2>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p class="text-sm text-yellow-800">
            <strong>⚠️ 安全警告：</strong>导出的文件包含所有密码的明文，请妥善保管！
          </p>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
          <select v-model="exportFormat" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="json">JSON 格式（推荐，可导入）</option>
            <option value="csv">CSV 格式（Excel 可用）</option>
          </select>
        </div>
        <div class="flex gap-3">
          <button @click="showExportModal = false" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button @click="exportPasswords" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
            <Download class="w-4 h-4" />
            导出文件
          </button>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
          <Upload class="w-5 h-5 text-purple-600" />
          导入密码
        </h2>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">选择文件</label>
          <input
            type="file"
            @change="handleFileSelect"
            accept=".json,.csv"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p class="text-xs text-gray-500 mt-1">支持 JSON 或 CSV 格式</p>
        </div>
        <div v-if="importPreview.length > 0" class="bg-gray-50 rounded-lg p-3 mb-4 max-h-40 overflow-y-auto">
          <p class="text-xs text-gray-500 mb-2">预览（前 5 条）：</p>
          <div v-for="(item, index) in importPreview.slice(0, 5)" :key="index" class="text-sm text-gray-700 py-1 border-b border-gray-200 last:border-0">
            {{ item.website }} - {{ item.username }}
          </div>
          <p v-if="importPreview.length > 5" class="text-xs text-gray-500 mt-2">共 {{ importPreview.length }} 条记录</p>
        </div>
        <div class="flex gap-3">
          <button @click="showImportModal = false" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button
            @click="importPasswords"
            :disabled="importPreview.length === 0"
            class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload class="w-4 h-4" />
            导入
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed top-4 right-4 z-50 animate-fade-in">
      <div :class="[
        'px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]',
        toastType === 'success' ? 'bg-green-600 text-white' :
        toastType === 'error' ? 'bg-red-600 text-white' :
        toastType === 'warning' ? 'bg-yellow-500 text-white' :
        'bg-gray-800 text-white'
      ]">
        <CheckCircle v-if="toastType === 'success'" class="w-5 h-5" />
        <XCircle v-else-if="toastType === 'error'" class="w-5 h-5" />
        <AlertTriangle v-else-if="toastType === 'warning'" class="w-5 h-5" />
        <Info v-else class="w-5 h-5" />
        <span class="flex-1">{{ toastMessage }}</span>
        <button @click="showToast = false" class="opacity-70 hover:opacity-100">
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <div v-if="showConfirmDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <div class="flex items-center gap-3 mb-4">
          <AlertTriangle class="w-6 h-6 text-yellow-600" />
          <h3 class="text-lg font-bold text-gray-900">确认操作</h3>
        </div>
        <p class="text-gray-600 mb-6">{{ confirmMessage }}</p>
        <div class="flex gap-3">
          <button
            @click="cancelConfirm"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            @click="confirmAction"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Shield, Lock, Eye, EyeOff, Search, Plus, Copy, Check, Edit, Trash2, Key, Download, Upload, CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import CryptoJS from 'crypto-js'

interface PasswordEntry {
  id: string
  website: string
  username: string
  password: string
  notes?: string
  createdAt: number
  updatedAt: number
}

interface EncryptedVault {
  iv: string
  data: string
  salt: string
}

const isUnlocked = ref(false)
const setupStep = ref(0) // 0 = setup/new, 1 = unlock existing
const masterPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showFormPassword = ref(false)
const vault = ref<PasswordEntry[]>([])
const searchQuery = ref('')
const showAddForm = ref(false)
const editingEntry = ref<PasswordEntry | null>(null)
const copiedField = ref<string | null>(null)
const currentPassword = ref('') // 存储当前解锁的密码

// Import/Export state
const showExportModal = ref(false)
const showImportModal = ref(false)
const exportFormat = ref<'json' | 'csv'>('json')
const importPreview = ref<PasswordEntry[]>([])
const selectedFile = ref<File | null>(null)

// Toast notification state
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('info')

// Confirm dialog state
const showConfirmDialog = ref(false)
const confirmMessage = ref('')
const confirmCallback = ref<(() => void) | null>(null)

const formData = ref({ website: '', username: '', password: '', notes: '' })

// ============ Toast & Confirm Utilities ============

const showMessage = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const showConfirm = (message: string, onConfirm: () => void) => {
  confirmMessage.value = message
  confirmCallback.value = onConfirm
  showConfirmDialog.value = true
}

const cancelConfirm = () => {
  showConfirmDialog.value = false
  confirmCallback.value = null
}

const confirmAction = () => {
  if (confirmCallback.value) {
    confirmCallback.value()
  }
  showConfirmDialog.value = false
  confirmCallback.value = null
}

const deriveKey = (password: string, saltHex: string) => {
  const salt = CryptoJS.enc.Hex.parse(saltHex)
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 100000,
    hasher: CryptoJS.algo.SHA256,
  })
}

const encryptData = (data: string, password: string): EncryptedVault => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8)
  const iv = CryptoJS.lib.WordArray.random(128 / 8)
  const key = deriveKey(password, salt.toString(CryptoJS.enc.Hex))

  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  return {
    iv: iv.toString(CryptoJS.enc.Hex),
    data: encrypted.ciphertext.toString(CryptoJS.enc.Hex),
    salt: salt.toString(CryptoJS.enc.Hex),
  }
}

const decryptData = (vault: EncryptedVault, password: string): string => {
  try {
    const iv = CryptoJS.enc.Hex.parse(vault.iv)
    const key = deriveKey(password, vault.salt)
    const ciphertext = CryptoJS.enc.Hex.parse(vault.data)
    
    // 创建正确的 CipherParams 对象
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: ciphertext
    })

    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    )

    // 检查解密结果是否为空
    if (!decrypted || decrypted.sigBytes === 0) {
      throw new Error('Decryption failed - wrong password')
    }

    const bytes = decrypted.toString(CryptoJS.enc.Utf8)

    // 验证解密结果是否为有效的 UTF-8 字符串
    if (!bytes || bytes.length === 0) {
      throw new Error('Decryption failed - empty result')
    }

    return bytes
  } catch (e) {
    console.error('Decryption error:', e)
    throw new Error('主密码错误')
  }
}

const saveVault = (entries: PasswordEntry[], password: string) => {
  const data = JSON.stringify(entries)
  const encrypted = encryptData(data, password)
  localStorage.setItem('pm_vault', JSON.stringify(encrypted))
}

const loadVault = (password: string): boolean => {
  try {
    const encryptedVault = localStorage.getItem('pm_vault')
    if (!encryptedVault) {
      vault.value = []
      return true
    }
    const v: EncryptedVault = JSON.parse(encryptedVault)

    const decrypted = decryptData(v, password)

    vault.value = JSON.parse(decrypted)
    return true
  } catch (e: any) {
    console.error('Failed to load vault:', e.message || e)
    return false
  }
}

const goToConfirm = () => {
  if (!masterPassword.value || masterPassword.value.length < 8) {
    showMessage('密码长度必须至少 8 个字符', 'error')
    return
  }
  if (masterPassword.value !== confirmPassword.value) {
    showMessage('两次输入的密码不一致', 'error')
    return
  }
  // Passwords match, proceed to setup
  setup()
}

const setup = () => {
  const hasUpper = /[A-Z]/.test(masterPassword.value)
  const hasLower = /[a-z]/.test(masterPassword.value)
  const hasDigit = /\d/.test(masterPassword.value)

  if (!hasUpper || !hasLower || !hasDigit) {
    showMessage('主密码必须包含大小写字母和数字', 'error')
    return
  }

  // 清除旧的 vault 数据，避免冲突
  localStorage.removeItem('pm_salt')
  localStorage.removeItem('pm_vault')
  saveVault([], masterPassword.value)

  isUnlocked.value = true
  setupStep.value = 1
  vault.value = []
  currentPassword.value = masterPassword.value // 保存当前密码用于后续加密
  masterPassword.value = ''
  confirmPassword.value = ''
}

const unlock = () => {
  if (!masterPassword.value) {
    showMessage('请输入主密码', 'error')
    return
  }

  const result = loadVault(masterPassword.value)

  if (result) {
    isUnlocked.value = true
    currentPassword.value = masterPassword.value // 保存当前密码用于后续加密
    masterPassword.value = ''
    showMessage('解锁成功', 'success')
  } else {
    showMessage('主密码错误，请重试', 'error')
  }
}

const lock = () => {
  isUnlocked.value = false
  vault.value = []
  masterPassword.value = ''
  currentPassword.value = '' // 清除密码
  setupStep.value = 1 // After locking, show unlock screen
}

const generatePassword = () => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
  let password = ''
  const values = new Uint32Array(16)
  crypto.getRandomValues(values)
  for (let i = 0; i < 16; i++) {
    password += charset[values[i] % charset.length]
  }
  formData.value.password = password
}

const saveEntry = () => {
  if (!formData.value.website || !formData.value.username || !formData.value.password) {
    showMessage('请填写所有必填字段', 'error')
    return
  }

  if (editingEntry.value) {
    vault.value = vault.value.map((e) =>
      e.id === editingEntry.value!.id
        ? { ...e, ...formData.value, updatedAt: Date.now() }
        : e
    )
    showMessage('密码已更新', 'success')
  } else {
    const newEntry: PasswordEntry = {
      id: crypto.randomUUID(),
      ...formData.value,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    vault.value.push(newEntry)
    showMessage('密码已添加', 'success')
  }

  saveVault(vault.value, currentPassword.value)
  closeForm()
}

const editEntry = (entry: PasswordEntry) => {
  editingEntry.value = entry
  formData.value = {
    website: entry.website,
    username: entry.username,
    password: entry.password,
    notes: entry.notes || '',
  }
  showAddForm.value = true
}

const deleteEntry = (id: string) => {
  showConfirm('确定要删除这条密码记录吗？此操作不可恢复', () => {
    vault.value = vault.value.filter((e) => e.id !== id)
    saveVault(vault.value, currentPassword.value)
    showMessage('密码已删除', 'success')
  })
}

const closeForm = () => {
  showAddForm.value = false
  editingEntry.value = null
  formData.value = { website: '', username: '', password: '', notes: '' }
}

const copyToClipboard = (text: string, field: string) => {
  navigator.clipboard.writeText(text)
  copiedField.value = field
  setTimeout(() => (copiedField.value = null), 2000)
}

const filteredEntries = computed(() => {
  return vault.value.filter(
    (e) =>
      e.website.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      e.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Password validation computed properties
const checkLength = computed(() => masterPassword.value.length >= 8)
const checkUppercase = computed(() => /[A-Z]/.test(masterPassword.value))
const checkLowercase = computed(() => /[a-z]/.test(masterPassword.value))
const checkNumber = computed(() => /\d/.test(masterPassword.value))
const checkSpecial = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(masterPassword.value))

// ============ Import/Export Functions ============

const exportPasswords = () => {
  if (vault.value.length === 0) {
    showMessage('没有可导出的密码', 'warning')
    return
  }

  if (exportFormat.value === 'json') {
    exportAsJSON()
  } else {
    exportAsCSV()
  }
  showExportModal.value = false
  showMessage('导出成功，请妥善保管文件', 'success')
}

const exportAsJSON = () => {
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    note: '此文件包含敏感信息，请妥善保管！',
    entries: vault.value.map(e => ({
      website: e.website,
      username: e.username,
      password: e.password,
      notes: e.notes || '',
    })),
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  downloadFile(blob, `passwords-export-${new Date().toISOString().split('T')[0]}.json`)
}

const exportAsCSV = () => {
  const headers = ['Website', 'Username', 'Password', 'Notes']
  const rows = vault.value.map(e => [
    e.website,
    e.username,
    e.password,
    (e.notes || '').replace(/"/g, '""'),
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  downloadFile(blob, `passwords-export-${new Date().toISOString().split('T')[0]}.csv`)
}

const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  selectedFile.value = file
  const reader = new FileReader()

  reader.onload = (event) => {
    const content = event.target?.result as string
    if (file.name.endsWith('.json')) {
      parseJSONImport(content)
    } else if (file.name.endsWith('.csv')) {
      parseCSVImport(content)
    } else {
      showMessage('不支持的文件格式', 'error')
    }
  }

  reader.onerror = () => {
    showMessage('读取文件失败', 'error')
  }

  reader.readAsText(file)
}

const parseJSONImport = (content: string) => {
  try {
    const data = JSON.parse(content)
    if (data.entries && Array.isArray(data.entries)) {
      importPreview.value = data.entries.map((e: any) => ({
        id: crypto.randomUUID(),
        website: e.website || '',
        username: e.username || '',
        password: e.password || '',
        notes: e.notes || '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }))
    } else {
      showMessage('无效的 JSON 格式', 'error')
    }
  } catch (error) {
    showMessage('解析 JSON 失败', 'error')
  }
}

const parseCSVImport = (content: string) => {
  try {
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length < 2) {
      showMessage('CSV 文件内容为空', 'warning')
      return
    }

    // Skip header row
    importPreview.value = lines.slice(1).map((line: string) => {
      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || []
      const cells = matches.map((cell: string) => cell.replace(/^"|"$/g, '').replace(/""/g, '"'))

      return {
        id: crypto.randomUUID(),
        website: cells[0] || '',
        username: cells[1] || '',
        password: cells[2] || '',
        notes: cells[3] || '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    })
  } catch (error) {
    showMessage('解析 CSV 失败', 'error')
  }
}

const importPasswords = () => {
  if (importPreview.value.length === 0) {
    showMessage('没有可导入的密码', 'warning')
    return
  }

  showConfirm(`确定要导入 ${importPreview.value.length} 条密码记录吗？\n\n注意：重复的网站条目将会被合并。`, () => {
    // Merge with existing vault
    const existingWebsites = new Set(vault.value.map(e => `${e.website}-${e.username}`))

    for (const entry of importPreview.value) {
      const key = `${entry.website}-${entry.username}`
      if (!existingWebsites.has(key)) {
        vault.value.push(entry)
        existingWebsites.add(key)
      }
    }

    saveVault(vault.value, currentPassword.value)

    // Reset import state
    importPreview.value = []
    selectedFile.value = null
    showImportModal.value = false

    showMessage(`成功导入 ${vault.value.length} 条密码记录`, 'success')
  })
}

onMounted(() => {
  setupStep.value = localStorage.getItem('pm_vault') ? 1 : 0
})
</script>
