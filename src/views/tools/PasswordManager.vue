<template>
  <div class="min-h-screen bg-gray-50">
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
              {{ isFirstTime ? 'Set Up Password Manager' : 'Unlock Password Manager' }}
            </h1>
            <p class="text-gray-500">
              {{ isFirstTime ? 'Create a strong master password' : 'Enter your master password' }}
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

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Master Password</label>
            <div class="relative">
              <input
                v-model="masterPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your master password"
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
            @click="isFirstTime ? setup : unlock"
            class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Lock class="w-5 h-5" />
            {{ isFirstTime ? 'Create Vault' : 'Unlock Vault' }}
          </button>

          <div v-if="isFirstTime" class="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-700 mb-2">Password Requirements:</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li :class="masterPassword.length >= 8 ? 'text-green-600' : ''">• At least 8 characters</li>
              <li :class="/[A-Z]/.test(masterPassword) ? 'text-green-600' : ''">• At least one uppercase letter</li>
              <li :class="/[a-z]/.test(masterPassword) ? 'text-green-600' : ''">• At least one lowercase letter</li>
              <li :class="/\d/.test(masterPassword) ? 'text-green-600' : ''">• At least one number</li>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Shield, Lock, Eye, EyeOff, Search, Plus, Copy, Check, Edit, Trash2, Key } from 'lucide-vue-next'
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
const isFirstTime = ref(true)
const masterPassword = ref('')
const showPassword = ref(false)
const showFormPassword = ref(false)
const vault = ref<PasswordEntry[]>([])
const searchQuery = ref('')
const showAddForm = ref(false)
const editingEntry = ref<PasswordEntry | null>(null)
const copiedField = ref<string | null>(null)

const formData = ref({ website: '', username: '', password: '', notes: '' })

const deriveKey = (password: string, salt: string) => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 100000,
    hasher: CryptoJS.algo.SHA256,
  })
}

const encryptData = (data: string, password: string): EncryptedVault => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex)
  const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex)
  const key = deriveKey(password, salt)

  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  return {
    iv,
    data: encrypted.ciphertext.toString(CryptoJS.enc.Hex),
    salt,
  }
}

const decryptData = (vault: EncryptedVault, password: string): string => {
  const key = deriveKey(password, vault.salt)
  const encrypted = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Hex.parse(vault.data),
  })
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: CryptoJS.enc.Hex.parse(vault.iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
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
  } catch {
    return false
  }
}

const setup = () => {
  if (!masterPassword.value || masterPassword.value.length < 8) {
    alert('Master password must be at least 8 characters')
    return
  }
  localStorage.setItem('pm_salt', CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex))
  saveVault([], masterPassword.value)
  isUnlocked.value = true
  isFirstTime.value = false
  vault.value = []
}

const unlock = () => {
  if (!masterPassword.value) {
    alert('Please enter your master password')
    return
  }
  if (loadVault(masterPassword.value)) {
    isUnlocked.value = true
    masterPassword.value = ''
  } else {
    alert('Incorrect master password')
  }
}

const lock = () => {
  isUnlocked.value = false
  vault.value = []
  masterPassword.value = ''
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
    alert('Please fill in all required fields')
    return
  }

  if (editingEntry.value) {
    vault.value = vault.value.map((e) =>
      e.id === editingEntry.value!.id
        ? { ...e, ...formData.value, updatedAt: Date.now() }
        : e
    )
  } else {
    const newEntry: PasswordEntry = {
      id: crypto.randomUUID(),
      ...formData.value,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    vault.value.push(newEntry)
  }

  saveVault(vault.value, masterPassword.value)
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
  if (confirm('Are you sure you want to delete this entry?')) {
    vault.value = vault.value.filter((e) => e.id !== id)
    saveVault(vault.value, masterPassword.value)
  }
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

onMounted(() => {
  isFirstTime.value = !localStorage.getItem('pm_vault')
})
</script>
