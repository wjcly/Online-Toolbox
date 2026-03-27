<template>
  <div class="tool-page min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-bold text-gray-900">技能标签生成器</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Input Section -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">选择技能类别</h2>
            
            <div class="space-y-4">
              <div v-for="(category, catIndex) in skillCategories" :key="catIndex">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-medium text-gray-700">{{ category.name }}</h3>
                  <button @click="toggleCategory(catIndex)" class="text-sm text-blue-600 hover:text-blue-700">
                    {{ category.expanded ? '收起' : '展开' }}
                  </button>
                </div>
                
                <div v-if="category.expanded" class="flex flex-wrap gap-2">
                  <button
                    v-for="(skill, skillIndex) in category.skills"
                    :key="skillIndex"
                    @click="toggleSkill(skill)"
                    :class="selectedSkills.has(skill) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    class="px-3 py-1.5 rounded-full text-sm transition-colors"
                  >
                    {{ skill }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">自定义技能</h2>
            <div class="flex gap-2 mb-4">
              <input
                v-model="customSkill"
                @keyup.enter="addCustomSkill"
                type="text"
                placeholder="输入技能名称，按回车添加"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button @click="addCustomSkill" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                添加
              </button>
            </div>
            
            <div v-if="customSkills.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="(skill, index) in customSkills"
                :key="index"
                class="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1"
              >
                {{ skill }}
                <button @click="removeCustomSkill(index)" class="hover:text-purple-900">
                  <X class="w-3 h-3" />
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- Output Section -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-semibold mb-4">已选技能</h2>
          
          <div v-if="selectedSkills.size > 0" class="mb-4">
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="skill in selectedSkills"
                :key="skill"
                class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
              >
                {{ skill }}
                <button @click="toggleSkill(skill)" class="hover:text-blue-900">
                  <X class="w-3 h-3" />
                </button>
              </span>
            </div>
            
            <div class="border-t pt-4">
              <h3 class="font-medium mb-2">输出格式</h3>
              
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">逗号分隔</label>
                  <div class="flex gap-2">
                    <input readonly :value="outputFormats.comma" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                    <button @click="copyToClipboard(outputFormats.comma)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                      <Copy class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm text-gray-600 mb-1">空格分隔</label>
                  <div class="flex gap-2">
                    <input readonly :value="outputFormats.space" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                    <button @click="copyToClipboard(outputFormats.space)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                      <Copy class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm text-gray-600 mb-1">JSON 数组</label>
                  <div class="flex gap-2">
                    <input readonly :value="outputFormats.json" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                    <button @click="copyToClipboard(outputFormats.json)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                      <Copy class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm text-gray-600 mb-1">标签格式 (HTML)</label>
                  <div class="flex gap-2">
                    <input readonly :value="outputFormats.html" class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm font-mono" />
                    <button @click="copyToClipboard(outputFormats.html)" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                      <Copy class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-16">
            <Tags class="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p class="text-gray-400">从左侧选择技能标签</p>
          </div>
          
          <div class="mt-4 flex gap-2">
            <button @click="selectedSkills.clear()" :disabled="selectedSkills.size === 0" class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50">
              清空
            </button>
            <button @click="copyToClipboard(outputFormats.comma)" :disabled="selectedSkills.size === 0" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              复制逗号分隔
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { ArrowLeft, Copy, X, Tags } from 'lucide-vue-next'

const customSkill = ref('')
const customSkills = ref<string[]>([])
const selectedSkills = ref(new Set<string>())

const skillCategories = reactive([
  {
    name: '编程语言',
    expanded: true,
    skills: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'Shell', 'HTML', 'CSS', 'Vue', 'React', 'Angular', 'Node.js']
  },
  {
    name: '前端开发',
    expanded: false,
    skills: ['Vue.js', 'React', 'Angular', 'Svelte', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'Sass', 'Less', 'Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Responsive Design', 'Cross-browser Compatibility']
  },
  {
    name: '后端开发',
    expanded: false,
    skills: ['Spring Boot', 'Spring Cloud', 'Django', 'Flask', 'FastAPI', 'Express', 'Nest.js', 'Node.js', 'ASP.NET Core', 'Laravel', 'Ruby on Rails', 'Gin', 'Echo', 'Microservices', 'RESTful API', 'GraphQL', 'gRPC']
  },
  {
    name: '数据库',
    expanded: false,
    skills: ['MySQL', 'PostgreSQL', 'Oracle', 'SQL Server', 'SQLite', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB', 'MariaDB', 'InfluxDB', 'Neo4j', 'RabbitMQ', 'Kafka']
  },
  {
    name: 'DevOps & 云',
    expanded: false,
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible', 'AWS', 'Azure', 'GCP', '阿里云', '腾讯云', '华为云', 'Nginx', 'Linux', 'Shell Scripting', 'Prometheus', 'Grafana', 'ELK Stack']
  },
  {
    name: '工具 & 平台',
    expanded: false,
    skills: ['Git', 'SVN', 'Maven', 'Gradle', 'npm', 'yarn', 'pnpm', 'JIRA', 'Confluence', 'Notion', 'Figma', 'Sketch', 'Postman', 'Charles', 'Wireshark', 'Visual Studio Code', 'IntelliJ IDEA', 'PyCharm', 'WebStorm']
  },
  {
    name: '数据科学',
    expanded: false,
    skills: ['Python', 'R', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Keras', 'Jupyter', 'SQL', 'Spark', 'Hadoop', 'Tableau', 'Power BI', 'Excel', 'Statistics', 'Machine Learning', 'Deep Learning']
  },
  {
    name: '移动开发',
    expanded: false,
    skills: ['iOS', 'Android', 'Flutter', 'React Native', 'Xamarin', 'Swift', 'Kotlin', 'Objective-C', 'Java', 'Dart', 'Uni-app', 'Taro', '小程序', 'Ionic', 'Cordova']
  },
  {
    name: '软技能',
    expanded: false,
    skills: ['团队协作', '沟通能力', '问题解决', '时间管理', '项目管理', '领导力', '创新思维', '学习能力', '抗压能力', '英语流利', '文档编写', '演讲表达', '敏捷开发', 'Scrum', 'Kanban']
  }
])

const outputFormats = computed(() => {
  const skillsArray = Array.from(selectedSkills.value)
  return {
    comma: skillsArray.join(', '),
    space: skillsArray.join(' '),
    json: JSON.stringify(skillsArray),
    html: skillsArray.map(s => `<span class="skill-tag">${s}</span>`).join(''),
  }
})

const toggleCategory = (index: number) => {
  skillCategories[index].expanded = !skillCategories[index].expanded
}

const toggleSkill = (skill: string) => {
  if (selectedSkills.value.has(skill)) {
    selectedSkills.value.delete(skill)
  } else {
    selectedSkills.value.add(skill)
  }
}

const addCustomSkill = () => {
  if (customSkill.value.trim() && !customSkills.value.includes(customSkill.value.trim())) {
    customSkills.value.push(customSkill.value.trim())
    selectedSkills.value.add(customSkill.value.trim())
    customSkill.value = ''
  }
}

const removeCustomSkill = (index: number) => {
  const skill = customSkills.value[index]
  customSkills.value.splice(index, 1)
  selectedSkills.value.delete(skill)
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}
</script>
