<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">评论生成器</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Input Section -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">选择评论类型</h2>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="type in commentTypes"
                :key="type.id"
                @click="selectedType = type.id"
                :class="selectedType === type.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                class="px-4 py-3 rounded-lg transition-colors text-sm font-medium"
              >
                {{ type.name }}
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">选择评论风格</h2>
            <div class="space-y-3">
              <label
                v-for="style in commentStyles"
                :key="style.id"
                class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                :class="selectedStyle === style.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
              >
                <input
                  type="radio"
                  :value="style.id"
                  v-model="selectedStyle"
                  class="w-4 h-4 text-blue-600"
                />
                <div>
                  <div class="font-medium text-gray-900">{{ style.name }}</div>
                  <div class="text-sm text-gray-500">{{ style.description }}</div>
                </div>
              </label>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">自定义关键词</h2>
            <div class="flex gap-2 mb-4">
              <input
                v-model="customKeyword"
                @keyup.enter="addKeyword"
                type="text"
                placeholder="输入关键词，按回车添加"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button @click="addKeyword" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                添加
              </button>
            </div>
            <div v-if="keywords.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="(keyword, index) in keywords"
                :key="index"
                class="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1"
              >
                {{ keyword }}
                <button @click="removeKeyword(index)" class="hover:text-purple-900">
                  <X class="w-3 h-3" />
                </button>
              </span>
            </div>
            <div v-else class="text-gray-400 text-sm">
              添加自定义关键词，让评论更贴合你的需求
            </div>
          </div>
        </div>

        <!-- Output Section -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-semibold mb-4">生成的评论</h2>

          <div v-if="generatedComments.length > 0" class="space-y-4">
            <div
              v-for="(comment, index) in generatedComments"
              :key="index"
              class="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <p class="text-gray-800 mb-3">{{ comment }}</p>
              <button
                @click="copyToClipboard(comment)"
                class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Copy class="w-4 h-4" />
                复制
              </button>
            </div>

            <div class="border-t pt-4">
              <h3 class="font-medium mb-3">合并输出</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">段落格式</label>
                  <div class="flex gap-2">
                    <textarea readonly :value="mergedOutput.paragraph" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm h-24 resize-none" />
                    <button @click="copyToClipboard(mergedOutput.paragraph)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 h-fit">
                      <Copy class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm text-gray-600 mb-1">列表格式</label>
                  <div class="flex gap-2">
                    <textarea readonly :value="mergedOutput.list" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm h-24 resize-none" />
                    <button @click="copyToClipboard(mergedOutput.list)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 h-fit">
                      <Copy class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm text-gray-600 mb-1">JSON 数组</label>
                  <div class="flex gap-2">
                    <input readonly :value="mergedOutput.json" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm font-mono" />
                    <button @click="copyToClipboard(mergedOutput.json)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                      <Copy class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-16">
            <MessageSquare class="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p class="text-gray-400">选择评论类型和风格后生成评论</p>
          </div>

          <div class="mt-6 flex gap-3">
            <button @click="generateComments" class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
              生成评论
            </button>
            <button @click="clearAll" class="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              清空
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, Copy, X, MessageSquare } from 'lucide-vue-next'

const selectedType = ref('project')
const selectedStyle = ref('professional')
const customKeyword = ref('')
const keywords = ref<string[]>([])
const generatedComments = ref<string[]>([])

const commentTypes = [
  { id: 'project', name: '📁 项目评论' },
  { id: 'code', name: '💻 代码评审' },
  { id: 'design', name: '🎨 设计评价' },
  { id: 'performance', name: '⚡ 性能评价' },
  { id: 'teamwork', name: '🤝 团队协作' },
  { id: 'learning', name: '📚 学习总结' },
]

const commentStyles = [
  { id: 'professional', name: '专业正式', description: '适合正式场合和工作报告' },
  { id: 'friendly', name: '友好轻松', description: '适合团队内部交流' },
  { id: 'encouraging', name: '鼓励积极', description: '适合给予建设性反馈' },
  { id: 'critical', name: '批判性分析', description: '适合深度技术评审' },
  { id: 'concise', name: '简洁明了', description: '适合快速反馈' },
]

const commentTemplates: Record<string, Record<string, string[]>> = {
  project: {
    professional: [
      '该项目展现了出色的架构设计能力，代码组织清晰，模块划分合理，体现了扎实的技术功底。',
      '项目整体完成度高，功能实现完整，文档详尽，展现了优秀的工程化思维和专业素养。',
      '技术方案选型合理，考虑了可扩展性和维护性，体现了丰富的项目经验和前瞻性思维。',
      '项目代码质量优秀，注释清晰，测试覆盖全面，符合企业级开发标准。',
    ],
    friendly: [
      '这个项目做得真棒！能看出来花了很多心思，功能很完善，用起来很顺手！',
      '很喜欢这个项目的设计思路，简洁实用，解决了不少实际问题，给你点赞！',
      '项目完成得很出色，功能齐全，界面友好，继续加油！',
      '这个项目很有创意，实现得也很到位，学到了不少东西，感谢分享！',
    ],
    encouraging: [
      '项目整体表现优秀，展现了良好的技术能力。建议可以进一步优化性能，期待更精彩的表现！',
      '基础功能实现得很扎实，这是一个很好的开始。可以尝试添加更多高级特性，相信你会做得更好！',
      '项目框架搭建得很好，代码规范也很到位。继续保持这种学习态度，未来可期！',
      '能看到明显的进步和成长，项目质量不错。建议在文档方面再完善一下，会更出色！',
    ],
    critical: [
      '项目架构基本合理，但在异常处理和边界条件方面还有优化空间。建议加强单元测试覆盖。',
      '功能实现完整，但代码复用性有待提高。部分模块耦合度较高，建议进一步解耦。',
      '技术方案可行，但性能优化考虑不足。建议在大数据量场景下进行更充分的测试。',
      '整体完成度较好，但错误处理机制不够完善。建议建立更系统的日志和监控体系。',
    ],
    concise: [
      '项目完成度高，代码规范，功能实用。',
      '架构合理，实现清晰，文档完善。',
      '技术选型恰当，代码质量良好。',
      '功能完整，性能稳定，值得参考。',
    ],
  },
  code: {
    professional: [
      '代码结构清晰，命名规范，遵循了良好的编码习惯，体现了专业的水准。',
      '算法实现高效，时间复杂度优化合理，展现了扎实的数据结构基础。',
      '代码可读性强，注释恰当，便于后续维护和团队协作。',
      '错误处理完善，边界条件考虑周全，代码健壮性良好。',
    ],
    friendly: [
      '代码写得很漂亮！逻辑清晰，看起来就很舒服，向你学习！',
      '这段代码实现得很巧妙，简洁高效，受教了！',
      '代码风格很棒，注释也很贴心，阅读起来很轻松！',
      '算法思路很赞，实现得也很优雅，代码质量很高！',
    ],
    encouraging: [
      '代码基础很好，逻辑清晰。建议可以进一步学习设计模式，让代码更优雅。',
      '实现方式正确，代码规范。可以尝试优化算法复杂度，提升性能表现。',
      '代码写得不错，功能实现完整。建议增加更多单元测试，提高代码可靠性。',
      '编码习惯良好，注释清晰。可以进一步学习最佳实践，持续提升代码质量。',
    ],
    critical: [
      '代码功能实现正确，但部分函数过长，建议拆分为更小的单元以提高可读性。',
      '变量命名基本规范，但存在魔法数字，建议提取为常量并添加注释说明。',
      '异常处理不够完善，部分边界条件未考虑。建议增加更全面的错误处理。',
      '代码存在重复逻辑，建议提取公共方法以提高复用性。',
    ],
    concise: [
      '代码规范，逻辑清晰，实现正确。',
      '结构合理，注释恰当，易于维护。',
      '算法高效，边界处理完善。',
      '质量良好，符合编码规范。',
    ],
  },
  design: {
    professional: [
      '设计方案合理，用户体验考虑周全，界面简洁美观，体现了良好的设计素养。',
      '交互流程设计流畅，操作逻辑清晰，降低了用户学习成本。',
      '视觉设计统一，色彩搭配协调，符合品牌调性和目标用户审美。',
      '响应式设计实现良好，多端适配效果出色，用户体验一致性好。',
    ],
    friendly: [
      '设计很好看！界面简洁大方，用起来也很顺手，用户体验很棒！',
      '很喜欢这个设计风格，清新自然，细节处理得很到位！',
      '交互设计很贴心，操作流畅，能感受到用心！',
      '视觉效果出色，配色舒适，整体设计很有质感！',
    ],
    encouraging: [
      '设计整体表现良好，视觉效果不错。建议可以进一步优化细节，提升精致度。',
      '界面设计简洁，功能布局合理。可以尝试更多创新元素，让设计更有特色。',
      '用户体验考虑周全，交互流畅。建议加强无障碍设计，提升包容性。',
      '设计风格统一，美观大方。可以进一步研究用户反馈，持续优化体验。',
    ],
    critical: [
      '设计基本满足需求，但部分交互反馈不够明显，建议增强用户操作反馈。',
      '视觉层次基本清晰，但信息密度分布不均，建议优化重点内容突出。',
      '配色基本协调，但对比度有待优化，建议提升可读性和无障碍性。',
      '布局整体合理，但移动端适配有待完善，建议加强响应式设计。',
    ],
    concise: [
      '设计美观，用户体验良好。',
      '交互流畅，视觉统一。',
      '布局合理，细节到位。',
      '风格简洁，符合预期。',
    ],
  },
  performance: {
    professional: [
      '性能表现优秀，响应速度快，资源占用合理，展现了良好的性能优化能力。',
      '系统稳定性良好，压力测试下表现稳定，体现了扎实的性能调优功底。',
      '加载速度优化到位，首屏时间短，用户体验流畅，符合性能最佳实践。',
      '内存管理合理，无明显内存泄漏，长时间运行稳定可靠。',
    ],
    friendly: [
      '运行速度很快！操作流畅不卡顿，性能表现很棒！',
      '加载速度给力，打开页面几乎是秒开，用户体验很好！',
      '性能优化做得很到位，资源占用合理，必须点赞！',
      '系统运行稳定，没发现卡顿或崩溃，性能很可靠！',
    ],
    encouraging: [
      '性能表现良好，响应速度快。建议可以进一步优化大数据场景下的表现。',
      '基础性能扎实，日常使用流畅。可以尝试引入懒加载等优化手段。',
      '整体性能不错，加载速度合理。建议持续监控性能指标，保持优化。',
      '稳定性良好，运行流畅。建议建立性能监控体系，及时发现瓶颈。',
    ],
    critical: [
      '基本性能满足需求，但大数据量下渲染性能有待优化，建议采用虚拟滚动。',
      '首屏加载速度尚可，但资源体积偏大，建议进一步优化打包和压缩。',
      '响应速度基本合理，但部分操作存在延迟，建议优化关键路径。',
      '内存占用基本正常，但长时间运行后有增长趋势，建议排查内存泄漏。',
    ],
    concise: [
      '性能优秀，响应迅速。',
      '运行稳定，资源合理。',
      '加载快速，体验流畅。',
      '优化到位，表现良好。',
    ],
  },
  teamwork: {
    professional: [
      '团队协作表现优秀，沟通及时有效，能够积极配合团队完成工作任务。',
      '具有良好的团队合作精神，主动承担责任，乐于分享知识和经验。',
      '跨部门协作能力强，能够有效协调资源，推动项目顺利进行。',
      '团队意识强，能够站在团队角度思考问题，为团队目标贡献力量。',
    ],
    friendly: [
      '和你一起工作很愉快！沟通顺畅，配合默契，是位好队友！',
      '团队合作表现很棒！总是能及时响应，积极协助他人！',
      '很有团队精神！乐于分享，热心帮助，和大家相处得很好！',
      '协作能力很强！能够有效沟通，快速解决问题，合作体验很好！',
    ],
    encouraging: [
      '团队合作表现良好，沟通积极。建议可以更加主动地分享经验，帮助团队共同成长。',
      '协作态度端正，配合度高。可以尝试承担更多协调工作，提升领导力。',
      '团队精神值得肯定，乐于助人。建议加强跨团队沟通，扩大影响力。',
      '合作表现不错，能够完成任务。建议更主动地参与讨论，贡献更多想法。',
    ],
    critical: [
      '团队协作基本良好，但沟通主动性有待提高，建议更积极地参与讨论。',
      '能够完成分配的任务，但跨团队协作经验不足，建议加强协调能力。',
      '合作态度端正，但知识分享不够，建议更多参与团队技术分享。',
      '团队意识较强，但时间管理有待优化，建议更好地平衡个人和团队工作。',
    ],
    concise: [
      '团队协作良好，沟通有效。',
      '配合积极，乐于分享。',
      '合作顺畅，责任心强。',
      '团队精神好，协作能力强。',
    ],
  },
  learning: {
    professional: [
      '学习态度端正，主动学习新技术，能够快速掌握并应用到实际工作中。',
      '学习能力强，善于总结归纳，形成了系统的知识体系和方法论。',
      '持续学习意识强，关注行业前沿，保持技术敏感度和竞争力。',
      '学习方法科学，理论联系实际，学习效果显著，成长速度快。',
    ],
    friendly: [
      '学习劲头很足！对新事物充满好奇，进步很快，继续加油！',
      '很爱学习！经常分享新知识，和大家一起成长，很棒！',
      '学习能力很强！新技术上手快，应用得也很好！',
      '学习态度积极，不断进步，能看到明显的成长！',
    ],
    encouraging: [
      '学习态度积极，进步明显。建议制定更系统的学习计划，持续提升。',
      '学习能力强，接受新知识快。可以尝试深入学习底层原理，夯实基础。',
      '学习热情高，涉猎广泛。建议聚焦核心领域，形成专业深度。',
      '成长速度快，学习效果 good。建议加强实践应用，学以致用。',
    ],
    critical: [
      '学习态度端正，但知识体系不够系统，建议加强结构化学习。',
      '学习范围广，但深度有待加强，建议在核心领域投入更多精力。',
      '理论学习较好，但实践应用不足，建议多做项目巩固知识。',
      '学习能力不错，但总结复盘不够，建议建立知识沉淀机制。',
    ],
    concise: [
      '学习积极，进步明显。',
      '主动学习，成长快速。',
      '态度端正，效果良好。',
      '善于学习，应用得当。',
    ],
  },
}

const mergedOutput = computed(() => {
  const comments = generatedComments.value
  return {
    paragraph: comments.join('\n\n'),
    list: comments.map((c, i) => `${i + 1}. ${c}`).join('\n'),
    json: JSON.stringify(comments, null, 2),
  }
})

const addKeyword = () => {
  if (customKeyword.value.trim() && !keywords.value.includes(customKeyword.value.trim())) {
    keywords.value.push(customKeyword.value.trim())
    customKeyword.value = ''
  }
}

const removeKeyword = (index: number) => {
  keywords.value.splice(index, 1)
}

const generateComments = () => {
  const templates = commentTemplates[selectedType.value]?.[selectedStyle.value] || []
  const baseComments = templates.length > 0 
    ? [...templates] 
    : ['请添加自定义关键词以生成个性化评论。']
  
  // 如果有自定义关键词，生成额外的个性化评论
  if (keywords.value.length > 0) {
    const keywordComments = keywords.value.map(keyword => {
      const style = selectedStyle.value
      const templates = commentTemplates[selectedType.value]?.[style] || commentTemplates.project[style]
      const baseTemplate = templates[Math.floor(Math.random() * templates.length)]
      return `【${keyword}】${baseTemplate}`
    })
    generatedComments.value = [...baseComments.slice(0, 2), ...keywordComments]
  } else {
    // 随机选择 2-3 条评论
    const count = Math.min(3, templates.length)
    const shuffled = [...baseComments].sort(() => Math.random() - 0.5)
    generatedComments.value = shuffled.slice(0, count)
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

const clearAll = () => {
  generatedComments.value = []
  keywords.value = []
}
</script>
