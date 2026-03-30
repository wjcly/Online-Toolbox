<template>
  <div class="music-app min-h-screen bg-[#f5f5f5] dark:bg-[#121212]">
    <!-- 顶部导航栏 -->
    <header class="top-nav bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div class="max-w-[1200px] mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-6">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Music class="w-5 h-5 text-white" />
              </div>
              <h1 class="text-lg font-bold text-gray-900 dark:text-white">网易云音乐搜索</h1>
            </div>
          </div>
          
          <!-- 搜索框 -->
          <div class="flex-1 max-w-xl mx-8">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="searchQuery"
                @keyup.enter="performSearch"
                type="text"
                placeholder="搜索音乐..."
                class="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-red-500 dark:focus:border-red-600 rounded-full text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
              />
            </div>
          </div>
          
          <button
            @click="performSearch"
            class="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-colors"
          >
            搜索
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="max-w-[1200px] mx-auto py-8 px-4">
      <!-- 默认提示 -->
      <div v-if="!hasSearched && searchResults.length === 0" class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
          <Music class="w-12 h-12 text-white" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">搜索你喜欢的音乐</h2>
        <p class="text-gray-500 dark:text-gray-400">输入歌手、歌曲名或专辑名开始搜索</p>
      </div>

      <!-- 搜索结果 -->
      <div v-else class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            搜索结果
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">({{ searchResults.length }} 首)</span>
          </h2>
          <button
            v-if="hasSearched"
            @click="hasSearched = false; searchResults = []"
            class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            清空结果
          </button>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>

        <div v-else-if="searchResults.length === 0" class="text-center py-20">
          <Music class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">未找到相关音乐</p>
        </div>

        <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div
              v-for="(song, index) in searchResults"
              :key="song.id"
              @click="playSong(song)"
              :class="[
                'flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group',
                playingSong?.id === song.id ? 'bg-red-50 dark:bg-red-900/10' : ''
              ]"
            >
              <span class="w-8 text-center text-sm text-gray-400 group-hover:hidden">{{ index + 1 }}</span>
              <Play class="w-4 h-4 text-red-500 hidden group-hover:block flex-shrink-0" />
              
              <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                <img
                  v-if="song.cover"
                  :src="song.cover"
                  :alt="song.title"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <Music v-else class="w-6 h-6 text-gray-400 m-auto mt-3" />
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 :class="[
                  'font-medium truncate',
                  playingSong?.id === song.id ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                ]">
                  {{ song.title }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ song.artist }} <span v-if="song.album">- {{ song.album }}</span>
                </p>
              </div>
              
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  网易云
                </span>
                <button
                  @click.stop="downloadSong(song)"
                  class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="下载"
                >
                  <Download class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 播放弹窗 -->
    <div
      v-if="showPlayer"
      class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      @click.self="minimizePlayer"
    >
      <div class="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative">
        <!-- 顶部控制栏 -->
        <div class="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/50 to-transparent z-10 flex items-center justify-end px-6 gap-2">
          <button
            @click="minimizePlayer"
            class="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="最小化"
          >
            <Minus class="w-5 h-5 text-white" />
          </button>
          <button
            @click="closePlayer"
            class="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="关闭"
          >
            <X class="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div class="flex flex-col md:flex-row h-auto md:h-[600px]">
          <!-- 左侧：封面和控制 -->
          <div class="md:w-1/2 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <!-- 专辑封面 -->
            <div class="w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl mb-6 flex-shrink-0">
              <img
                v-if="playingSong?.cover"
                :src="playingSong.cover"
                :alt="playingSong.title"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <Music class="w-24 h-24 text-white/50" />
              </div>
            </div>

            <!-- 歌曲信息 -->
            <div class="text-center mb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ playingSong?.title || '未播放' }}</h2>
              <p class="text-gray-500 dark:text-gray-400">{{ playingSong?.artist || '' }}</p>
            </div>

            <!-- 进度条 -->
            <div class="w-full mb-4">
              <input
                v-model="currentTime"
                @input="seekAudio"
                type="range"
                min="0"
                :max="duration || 100"
                class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-red-500"
              />
              <div class="flex justify-between text-xs text-gray-400 mt-2">
                <span>{{ formatTime(currentTime) }}</span>
                <span>{{ formatTime(duration) }}</span>
              </div>
            </div>

            <!-- 播放控制 -->
            <div class="flex items-center gap-4">
              <button
                @click="toggleLoop"
                :class="[
                  'p-2 rounded-full transition-colors',
                  isLoop ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
              >
                <Repeat class="w-5 h-5" />
              </button>
              <button @click="playPrevious" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <SkipBack class="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                @click="togglePlay"
                class="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Pause v-if="isPlaying" class="w-8 h-8 text-white" />
                <Play v-else class="w-8 h-8 text-white ml-0.5" />
              </button>
              <button @click="playNext" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <SkipForward class="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                @click="toggleMute"
                :class="[
                  'p-2 rounded-full transition-colors',
                  isMuted ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
              >
                <VolumeX v-if="isMuted" class="w-5 h-5" />
                <Volume2 v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- 右侧：歌词 -->
          <div class="md:w-1/2 border-l border-gray-200 dark:border-gray-700">
            <div class="h-full flex flex-col">
              <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <FileText class="w-4 h-4 text-gray-400" />
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">歌词</span>
              </div>
              <div class="flex-1 overflow-y-auto p-4">
                <div v-if="parsedLyrics.length > 0" class="space-y-3">
                  <p
                    v-for="(line, index) in parsedLyrics"
                    :key="index"
                    :class="[
                      'text-sm transition-all py-2 px-3 rounded-lg',
                      index === activeLyricIndex
                        ? 'text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-900/20 text-base'
                        : 'text-gray-500 dark:text-gray-400'
                    ]"
                  >
                    {{ line.text }}
                  </p>
                </div>
                <div v-else class="text-center py-12">
                  <FileText class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p class="text-gray-400 dark:text-gray-500 text-sm">暂无歌词</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最小化播放栏 -->
    <div
      v-if="isMinimized && playingSong"
      class="fixed bottom-8 right-8 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div class="flex items-center gap-4 p-4 pr-6">
        <!-- 专辑封面 -->
        <div class="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 cursor-pointer" @click="restorePlayer">
          <img
            v-if="playingSong.cover"
            :src="playingSong.cover"
            :alt="playingSong.title"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
          <Music v-else class="w-8 h-8 text-gray-400 m-auto mt-3" />
        </div>
        
        <!-- 歌曲信息 -->
        <div class="min-w-0 flex-1 cursor-pointer" @click="restorePlayer">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ playingSong.title }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ playingSong.artist }}</p>
        </div>
        
        <!-- 控制按钮 -->
        <div class="flex items-center gap-2">
          <button @click="playPrevious" class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <SkipBack class="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            @click="togglePlay"
            class="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-full flex items-center justify-center transition-all"
          >
            <Pause v-if="isPlaying" class="w-5 h-5 text-white" />
            <Play v-else class="w-5 h-5 text-white ml-0.5" />
          </button>
          <button @click="playNext" class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <SkipForward class="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button @click="closePlayer" class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="关闭">
            <X class="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
      
      <!-- 进度条 -->
      <div class="h-1 bg-gray-200 dark:bg-gray-700 cursor-pointer" @click="seekAudioBar">
        <div
          class="h-full bg-gradient-to-r from-red-500 to-pink-600 relative transition-all"
          :style="{ width: `${(currentTime / (duration || 1)) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- 全局 Toast 提示 -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 text-sm font-medium',
          toast.type === 'error' ? 'bg-red-500 text-white' :
          toast.type === 'success' ? 'bg-green-500 text-white' :
          'bg-gray-800 text-white'
        ]"
      >
        {{ toast.message }}
      </div>
    </transition>

    <!-- 隐藏音频元素 -->
    <audio ref="audioRef" @timeupdate="onTimeUpdate" @ended="onEnded" @loadedmetadata="onLoadedMetadata" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  ArrowLeft,
  Search,
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  Repeat,
  FileText,
  X,
  Minus
} from 'lucide-vue-next'

interface Song {
  id: string
  title: string
  artist: string
  album?: string
  cover?: string
  url: string
  platform: string
  duration?: number
}

interface LyricLine {
  time: number
  text: string
}

const searchQuery = ref('')
const searchResults = ref<Song[]>([])
const loading = ref(false)
const playingSong = ref<Song | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(80)
const isMuted = ref(false)
const isLoop = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)
const parsedLyrics = ref<LyricLine[]>([])
const activeLyricIndex = ref(-1)
const showPlayer = ref(false)
const isMinimized = ref(false)
const hasSearched = ref(false)

// Toast
const toast = ref({ show: false, message: '', type: 'info' as 'info' | 'success' | 'error' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

const CORS_PROXY = 'https://cors.wjcly.com/?target='

const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  hasSearched.value = true
  loading.value = true
  try {
    const results = await searchNetease(searchQuery.value)
    searchResults.value = results
    if (results.length === 0) {
      showToast('未找到相关音乐', 'error')
    }
  } catch (error) {
    console.error('Search failed:', error)
    showToast('搜索失败', 'error')
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

const searchNetease = async (keyword: string): Promise<Song[]> => {
  try {
    const targetUrl = `https://music.163.com/api/search/get`
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(targetUrl)}?s=${encodeURIComponent(keyword)}&type=1&limit=30&offset=0`
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://music.163.com/',
      }
    })
    const data = await response.json()
    if (data.result && data.result.songs) {
      return data.result.songs.slice(0, 20).map((song: any, index: number) => ({
        id: `netease_${song.id}`,
        title: song.name,
        artist: song.artists?.map((a: any) => a.name).join('/') || '未知歌手',
        album: song.album?.name,
        cover: song.album?.picUrl || `https://picsum.photos/300/300?random=${index}`,
        url: `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`,
        platform: 'netease',
        duration: song.duration / 1000
      }))
    }
    return []
  } catch (e) {
    console.error('NetEase search error:', e)
    return []
  }
}

const playSong = async (song: Song) => {
  if (!audioRef.value) return

  audioRef.value.src = song.url
  audioRef.value.load()

  try {
    await audioRef.value.play()
    // 播放成功才显示弹窗
    playingSong.value = song
    parsedLyrics.value = []
    activeLyricIndex.value = -1
    showPlayer.value = true
    isMinimized.value = false
    isPlaying.value = true
    fetchLyrics(song)
  } catch (err) {
    console.error('Playback failed:', err)
    showToast('《' + song.title + '》播放失败', 'error')
    isPlaying.value = false
  }
}

const closePlayer = () => {
  showPlayer.value = false
  isMinimized.value = false
  playingSong.value = null
}

const minimizePlayer = () => {
  showPlayer.value = false
  isMinimized.value = true
}

const restorePlayer = () => {
  showPlayer.value = true
  isMinimized.value = false
}

const togglePlay = () => {
  if (!audioRef.value || !playingSong.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const onTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
    if (parsedLyrics.value.length > 0) {
      let newIndex = -1
      for (let i = 0; i < parsedLyrics.value.length; i++) {
        if (parsedLyrics.value[i].time <= currentTime.value) {
          newIndex = i
        } else {
          break
        }
      }
      if (newIndex !== activeLyricIndex.value && newIndex !== -1) {
        activeLyricIndex.value = newIndex
      }
    }
  }
}

const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
  }
}

const onEnded = () => {
  if (isLoop.value && audioRef.value) {
    audioRef.value.currentTime = 0
    audioRef.value.play()
  } else {
    isPlaying.value = false
    playNext()
  }
}

const seekAudio = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (audioRef.value) {
    audioRef.value.currentTime = parseFloat(target.value)
  }
}

const seekAudioBar = (e: MouseEvent) => {
  if (!audioRef.value || !duration.value) return
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  audioRef.value.currentTime = percent * duration.value
}

const changeVolume = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (audioRef.value) {
    audioRef.value.volume = parseInt(target.value) / 100
    isMuted.value = parseInt(target.value) === 0
  }
}

const toggleMute = () => {
  if (audioRef.value) {
    audioRef.value.muted = !isMuted.value
    isMuted.value = !isMuted.value
    if (!isMuted.value) {
      audioRef.value.volume = volume.value / 100
    }
  }
}

const toggleLoop = () => {
  isLoop.value = !isLoop.value
}

const playNext = () => {
  if (searchResults.value.length === 0 || !playingSong.value) return
  const idx = searchResults.value.findIndex(s => s.id === playingSong.value?.id)
  if (idx >= 0) {
    playSong(searchResults.value[(idx + 1) % searchResults.value.length])
  }
}

const playPrevious = () => {
  if (searchResults.value.length === 0 || !playingSong.value) return
  const idx = searchResults.value.findIndex(s => s.id === playingSong.value?.id)
  if (idx >= 0) {
    playSong(searchResults.value[(idx - 1 + searchResults.value.length) % searchResults.value.length])
  }
}

const downloadSong = async (song: Song) => {
  try {
    // 使用 CORS 代理下载
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(song.url)}`
    const response = await fetch(proxyUrl)
    
    if (!response.ok) throw new Error('Download failed')
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${song.title} - ${song.artist}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    showToast('下载已开始', 'success')
  } catch (e) {
    console.error('Download error:', e)
    // 如果代理也失败，提示用户
    showToast('下载失败，请检查网络连接', 'error')
  }
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/300x300?text=Music'
}

const fetchLyrics = async (song: Song) => {
  try {
    let lyrics = ''
    if (song.platform === 'netease') {
      lyrics = await fetchNeteaseLyrics(song.id)
    }
    if (!lyrics) {
      lyrics = await fetchGenericLyrics(song.title, song.artist)
    }
    if (lyrics && lyrics !== '暂无歌词') {
      parsedLyrics.value = parseTimedLyrics(lyrics)
    } else {
      parsedLyrics.value = []
    }
  } catch {
    parsedLyrics.value = []
  }
}

const fetchNeteaseLyrics = async (songId: string): Promise<string> => {
  try {
    const id = songId.replace('netease_', '')
    const targetUrl = `https://music.163.com/api/song/lyric`
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(targetUrl)}?id=${id}&lv=1`
    const response = await fetch(proxyUrl, { headers: { 'Referer': 'https://music.163.com/' } })
    const data = await response.json()
    if (data.lrc && data.lrc.lyric) {
      return data.lrc.lyric
    }
    return ''
  } catch {
    return ''
  }
}

const fetchGenericLyrics = async (title: string, artist: string): Promise<string> => {
  try {
    const targetUrl = `https://api.lrc.cx/lyrics`
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(targetUrl)}?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`
    const response = await fetch(proxyUrl)
    const data = await response.json()
    if (data.lyric) return data.lyric
    return ''
  } catch {
    return ''
  }
}

const parseTimedLyrics = (lyricsText: string): LyricLine[] => {
  if (!lyricsText) return []
  const lines = lyricsText.split('\n')
  const result: LyricLine[] = []
  for (const line of lines) {
    const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/)
    if (match) {
      const minutes = parseInt(match[1])
      const seconds = parseInt(match[2])
      const milliseconds = parseInt(match[3].padEnd(3, '0'))
      const time = minutes * 60 + seconds + milliseconds / 1000
      const text = match[4].trim()
      if (text && !text.startsWith('by:') && !text.startsWith('offset:')) {
        result.push({ time, text })
      }
    }
  }
  return result
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.target instanceof HTMLInputElement) return
  if (e.code === 'Space' && !showPlayer.value) {
    e.preventDefault()
    if (playingSong.value) {
      togglePlay()
    }
  }
  if (e.code === 'Escape') {
    if (showPlayer.value) {
      minimizePlayer()
    } else if (isMinimized.value) {
      closePlayer()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  if (audioRef.value) audioRef.value.volume = volume.value / 100
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.music-app {
  min-height: 100vh;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
  cursor: pointer;
  border: none;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}
</style>
