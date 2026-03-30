<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">网名生成器</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-4">生成创意网名</h2>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">风格</label>
          <select
            v-model="style"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="random">随机风格</option>
            <option value="cute">可爱风</option>
            <option value="cool">酷炫风</option>
            <option value="literary">文艺风</option>
            <option value="funny">搞笑风</option>
            <option value="english">英文风</option>
            <option value="古风">古风</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">包含元素（可选）</label>
          <input
            v-model="keyword"
            type="text"
            placeholder="输入喜欢的字、词，如：星、梦、cat..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">生成数量</label>
          <select
            v-model.number="count"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="5">5 个</option>
            <option :value="10">10 个</option>
            <option :value="20">20 个</option>
            <option :value="30">30 个</option>
          </select>
        </div>

        <div class="flex gap-4">
          <button
            @click="generate"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Sparkles class="w-4 h-4" />
            生成网名
          </button>
          <button
            @click="copyAll"
            :disabled="!generatedNicknames.length"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Copy class="w-4 h-4" />
            复制全部
          </button>
          <button
            @click="generatedNicknames = []"
            :disabled="!generatedNicknames.length"
            class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 class="w-4 h-4" />
            清空
          </button>
        </div>
      </div>

      <div v-if="generatedNicknames.length > 0" class="bg-white rounded-xl shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h3 class="font-semibold">生成结果（{{ generatedNicknames.length }}个）</h3>
        </div>
        <div class="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div
            v-for="(nickname, index) in generatedNicknames"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span class="text-gray-800">{{ nickname }}</span>
            <button 
              @click="copySingle(nickname)" 
              class="text-blue-600 hover:text-blue-800 p-1"
              title="复制"
            >
              <Copy class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-6">
        <h3 class="font-semibold text-purple-900 mb-3">网名创作小贴士</h3>
        <ul class="text-sm text-purple-700 space-y-2">
          <li>• 选择与自己性格或喜好相符的风格</li>
          <li>• 可以输入喜欢的关键字让网名更个性化</li>
          <li>• 避免使用敏感词汇或不雅谐音</li>
          <li>• 简洁易记的网名更容易被记住</li>
          <li>• 可以组合多个元素创造独特网名</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Sparkles, Copy, Trash2 } from 'lucide-vue-next'
import { toast } from '@/utils/toast'

const style = ref('random')
const keyword = ref('')
const count = ref(10)
const generatedNicknames = ref<string[]>([])

// 词库
const prefixes = {
  cute: ['小', '萌', '软', '甜', '呆', '喵', '兔', '熊', '鹿', '樱', '奶', '糯'],
  cool: ['酷', '冷', '孤', '傲', '狂', '霸', '极', '夜', '暗', '零', '绝', '灭'],
  literary: ['清', '雅', '静', '淡', '远', '墨', '书', '琴', '画', '诗', '梦', '幽'],
  funny: ['二', '憨', '傻', '逗', '皮', '懒', '馋', '胖', '呆', '囧', '逗', '皮'],
  english: ['The', 'Mr', 'Ms', 'Dr', 'Sir', 'Lady', 'Miss', 'Captain', 'Professor', 'Ghost'],
  '古风': ['青', '墨', '清', '雅', '幽', '静', '淡', '远', '寒', '孤', '残', '醉'],
}

const middles = {
  cute: ['兔', '喵', '咪', '熊', '鹿', '酱', '仔', '粒', '球', '团', '豆', '花'],
  cool: ['影', '刃', '魂', '魄', '狱', '魔', '神', '鬼', '杀', '戮', '战', '斗'],
  literary: ['风', '花', '雪', '月', '云', '雨', '霜', '露', '烟', '雨', '梦', '痕'],
  funny: ['货', '蛋', '哥', '姐', '爷', '帝', '仙', '侠', '王', '主', '长', '官'],
  english: ['Shadow', 'Ghost', 'Dragon', 'Phoenix', 'Wolf', 'Eagle', 'Tiger', 'Cat', 'Star', 'Moon'],
  '古风': ['风', '花', '雪', '月', '云', '雨', '霜', '露', '烟', '雨', '梦', '痕'],
}

const suffixes = {
  cute: ['酱', '仔', '粒', '球', '团', '豆', '花', '宝', '贝', '儿', '子', '仔'],
  cool: ['者', '主', '帝', '皇', '神', '魔', '王', '尊', '皇', '帝', '神', '者'],
  literary: ['生', '客', '居', '士', '轩', '阁', '斋', '苑', '轩', '居', '阁', '苑'],
  funny: ['侠', '客', '师', '祖', '宗', '爷', '帝', '仙', '王', '主', '长', '官'],
  english: ['Master', 'Lord', 'King', 'Hunter', 'Slayer', 'Walker', 'Rider', 'Bearer'],
  '古风': ['生', '客', '居', '士', '轩', '阁', '斋', '苑', '主', '人', '客', '仙'],
}

const cuteKeywords = ['草莓', '樱桃', '葡萄', '苹果', '香蕉', '柠檬', '蜜桃', '荔枝', '芒果', '榴莲', 
  '猫咪', '小狗', '兔子', '小鹿', '松鼠', '熊猫', '考拉', '刺猬', '狐狸', '企鹅',
  '星星', '月亮', '太阳', '云朵', '彩虹', '雪花', '露珠', '樱花', '茉莉', '玫瑰']

const coolKeywords = ['黑暗', '光明', '混沌', '秩序', '虚空', '时空', '宇宙', '星河', '烈焰', '寒冰',
  '闪电', '风暴', '雷霆', '战神', '刺客', '骑士', '法师', '射手', '战士', '巫师',
  '无敌', '寂寞', '孤独', '高傲', '冷漠', '无情', '霸道', '狂野', '极端', '极限']

const literaryKeywords = ['青春', '梦想', '远方', '诗意', '画意', '琴声', '书香', '墨迹', '流年', '时光',
  '岁月', '回忆', '思念', '眷恋', '情怀', '初心', '向往', '追寻', '探索', '感悟',
  '清风', '明月', '流水', '落花', '烟雨', '斜阳', '晨曦', '暮色', '星空', '海岸']

const funnyKeywords = ['吃货', '睡神', '懒人', '逗比', '二货', '憨憨', '皮皮', '乐乐', '嘻嘻', '哈哈',
  '喵喵', '汪汪', '嘎嘎', '咕咕', '叽叽', '喳喳', '蹦蹦', '跳跳', '滚滚', '溜溜']

const englishKeywords = ['Dream', 'Hope', 'Love', 'Peace', 'Freedom', 'Courage', 'Wisdom', 'Strength', 
  'Beauty', 'Wonder', 'Magic', 'Mystery', 'Adventure', 'Journey', 'Destiny', 'Fortune',
  'Shadow', 'Light', 'Fire', 'Water', 'Earth', 'Wind', 'Storm', 'Thunder', 'Star', 'Moon']

const gufengKeywords = ['江湖', '天下', '红尘', '人间', '仙境', '凡尘', '俗世', '乱世', '盛世', '乱世',
  '剑客', '侠客', '刀客', '刺客', '杀手', '镖师', '捕快', '县令', '将军', '宰相',
  '桃花', '梅花', '兰花', '竹子', '松树', '柳树', '荷花', '菊花', '牡丹', '桂花']

const generateNickname = (): string => {
  let currentStyle = style.value
  if (currentStyle === 'random') {
    const styles = ['cute', 'cool', 'literary', 'funny', 'english', '古风']
    currentStyle = styles[Math.floor(Math.random() * styles.length)]
  }

  const hasKeyword = keyword.value.trim()
  
  if (hasKeyword) {
    const k = hasKeyword.trim()
    const patterns = [
      () => `${getRandomItem(prefixes[currentStyle as keyof typeof prefixes] || prefixes.cute)}${k}`,
      () => `${k}${getRandomItem(middles[currentStyle as keyof typeof middles] || middles.cute)}`,
      () => `${k}${getRandomItem(suffixes[currentStyle as keyof typeof suffixes] || suffixes.cute)}`,
      () => `${getRandomItem(prefixes[currentStyle as keyof typeof prefixes] || prefixes.cute)}${k}${getRandomItem(suffixes[currentStyle as keyof typeof suffixes] || suffixes.cute)}`,
      () => `${k}${Math.floor(Math.random() * 99) + 1}`,
      () => `${k}_${Math.floor(Math.random() * 999) + 1}`,
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]()
  }

  // 根据风格生成
  if (currentStyle === 'english') {
    const patterns = [
      () => `${getRandomItem(prefixes.english)}${getRandomItem(englishKeywords)}`,
      () => `${getRandomItem(englishKeywords)}${getRandomItem(suffixes.english)}`,
      () => `${getRandomItem(prefixes.english)}${getRandomItem(englishKeywords)}${getRandomItem(suffixes.english)}`,
      () => `${getRandomItem(englishKeywords)}_${Math.floor(Math.random() * 999) + 1}`,
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]()
  }

  if (currentStyle === 'cute') {
    const k = getRandomItem(cuteKeywords)
    const patterns = [
      () => `${getRandomItem(prefixes.cute)}${k}`,
      () => `${k}${getRandomItem(suffixes.cute)}`,
      () => `${getRandomItem(prefixes.cute)}${k}${getRandomItem(suffixes.cute)}`,
      () => `${k}${Math.floor(Math.random() * 99) + 1}`,
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]()
  }

  if (currentStyle === 'cool') {
    const k = getRandomItem(coolKeywords)
    const patterns = [
      () => `${getRandomItem(prefixes.cool)}${k}`,
      () => `${k}${getRandomItem(suffixes.cool)}`,
      () => `${getRandomItem(prefixes.cool)}${k}${getRandomItem(suffixes.cool)}`,
      () => `${k}${Math.floor(Math.random() * 99) + 1}`,
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]()
  }

  if (currentStyle === 'literary') {
    const k = getRandomItem(literaryKeywords)
    const patterns = [
      () => `${getRandomItem(prefixes.literary)}${k}`,
      () => `${k}${getRandomItem(suffixes.literary)}`,
      () => `${getRandomItem(prefixes.literary)}${k}${getRandomItem(suffixes.literary)}`,
      () => `${k}${getRandomItem(middles.literary)}`,
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]()
  }

  if (currentStyle === 'funny') {
    const k = getRandomItem(funnyKeywords)
    const patterns = [
      () => `${getRandomItem(prefixes.funny)}${k}`,
      () => `${k}${getRandomItem(suffixes.funny)}`,
      () => `${getRandomItem(prefixes.funny)}${k}${getRandomItem(suffixes.funny)}`,
      () => `${k}${Math.floor(Math.random() * 99) + 1}`,
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]()
  }

  if (currentStyle === '古风') {
    const k = getRandomItem(gufengKeywords)
    const patterns = [
      () => `${getRandomItem(prefixes['古风'])}${k}`,
      () => `${k}${getRandomItem(suffixes['古风'])}`,
      () => `${getRandomItem(prefixes['古风'])}${k}${getRandomItem(suffixes['古风'])}`,
      () => `${k}${getRandomItem(middles['古风'])}`,
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]()
  }

  return '网友' + Math.floor(Math.random() * 9999) + 1
}

const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)]
}

const generate = () => {
  generatedNicknames.value = []
  const generated = new Set<string>()
  
  while (generated.size < count.value) {
    const nickname = generateNickname()
    if (!generated.has(nickname)) {
      generated.add(nickname)
      generatedNicknames.value.push(nickname)
    }
  }
}

const copySingle = (text: string) => {
  navigator.clipboard.writeText(text)
  toast.success('已复制')
}

const copyAll = () => {
  if (!generatedNicknames.value.length) return
  navigator.clipboard.writeText(generatedNicknames.value.join('\n'))
  toast.success(`已复制 ${generatedNicknames.value.length} 个网名`)
}

// 初始生成一些
generate()
</script>
