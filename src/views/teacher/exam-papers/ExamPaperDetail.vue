<template>
  <div>
    <!-- 页面标题和操作 -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <router-link to="/teacher/exam-papers" class="text-gray-400 hover:text-gray-500">
                试卷管理
              </router-link>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-gray-500">试卷详情</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 class="mt-2 text-2xl font-semibold text-gray-900">{{ paper.title }}</h1>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
        <button
          @click="copyPaper"
          class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          复制试卷
        </button>
        <button
          @click="$router.push(`/teacher/exam-papers/${paper.id}/preview`)"
          class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          预览试卷
        </button>
        <button
          @click="$router.push(`/teacher/exam-papers/${paper.id}/edit`)"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          编辑试卷
        </button>
      </div>
    </div>

    <!-- 试卷基本信息 -->
    <div class="bg-white shadow rounded-lg mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">基本信息</h3>
          <span :class="getStatusClass(paper.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
            {{ getStatusText(paper.status) }}
          </span>
        </div>
      </div>
      <div class="p-6">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt class="text-sm font-medium text-gray-500">试卷名称</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ paper.title }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">总分</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ paper.totalScore }} 分</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">题目数量</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ paper.questionCount }} 题</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">考试时长</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ paper.duration }} 分钟</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">创建时间</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDateTime(paper.createdAt) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">更新时间</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDateTime(paper.updatedAt) }}</dd>
          </div>
          <div v-if="paper.description" class="sm:col-span-3">
            <dt class="text-sm font-medium text-gray-500">试卷描述</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ paper.description }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- 题目统计 -->
    <div class="bg-white shadow rounded-lg mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">题目统计</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div v-for="stat in questionStats" :key="stat.type" class="text-center">
            <div class="text-2xl font-semibold text-gray-900">{{ stat.count }}</div>
            <div class="text-sm text-gray-500">{{ stat.label }}</div>
            <div class="text-xs text-gray-400">{{ stat.totalScore }} 分</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 题目列表 -->
    <div class="bg-white shadow rounded-lg mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">题目列表</h3>
          <button
            @click="$router.push(`/teacher/exam-papers/${paper.id}/questions`)"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            管理题目
          </button>
        </div>
      </div>
      <div class="divide-y divide-gray-200">
        <div v-for="(question, index) in paper.questions" :key="question.id" class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <span class="text-sm font-medium text-gray-900">第{{ index + 1 }}题</span>
                <span :class="getTypeClass(question.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getTypeText(question.type) }}
                </span>
                <span :class="getDifficultyClass(question.difficulty)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getDifficultyText(question.difficulty) }}
                </span>
                <span class="text-sm text-gray-500">{{ question.score }} 分</span>
              </div>
              <div class="text-sm text-gray-900 mb-3" v-html="formatQuestionContent(question.content)"></div>
              
              <!-- 选择题选项 -->
              <div v-if="question.type === 'single' || question.type === 'multiple'" class="space-y-1">
                <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="flex items-start space-x-2">
                  <span class="text-xs font-medium text-gray-500 mt-0.5">{{ getOptionLabel(optionIndex) }}.</span>
                  <span class="text-xs text-gray-700">{{ option }}</span>
                </div>
              </div>
            </div>
            <div class="ml-4 flex-shrink-0">
              <button
                @click="viewQuestionDetail(question.id)"
                class="text-blue-600 hover:text-blue-900 text-sm"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用记录 -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">使用记录</h3>
      </div>
      <div class="p-6">
        <div v-if="paper.usageHistory && paper.usageHistory.length > 0" class="space-y-4">
          <div v-for="usage in paper.usageHistory" :key="usage.id" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <div class="text-sm font-medium text-gray-900">{{ usage.examTitle }}</div>
              <div class="text-sm text-gray-500">{{ formatDateTime(usage.usedAt) }}</div>
            </div>
            <div class="text-sm text-gray-500">
              {{ usage.studentCount }} 人参加
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">暂无使用记录</h3>
          <p class="mt-1 text-sm text-gray-500">该试卷尚未被使用过</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const paperId = route.params.id as string

// 试卷详情
const paper = ref({
  id: 1,
  title: '高等数学期末考试',
  description: '本试卷涵盖高等数学上册全部内容，包括极限、导数、积分等重要知识点。',
  totalScore: 100,
  questionCount: 25,
  duration: 120,
  status: 'active',
  createdAt: '2024-01-15T10:00:00',
  updatedAt: '2024-01-16T14:30:00',
  questions: [
    {
      id: 1,
      type: 'single',
      difficulty: 'medium',
      score: 4,
      content: '下列函数中，哪个是偶函数？',
      options: ['f(x) = x²', 'f(x) = x³', 'f(x) = sin(x)', 'f(x) = ln(x)']
    },
    {
      id: 2,
      type: 'multiple',
      difficulty: 'hard',
      score: 6,
      content: '下列关于导数的说法正确的是：',
      options: ['导数表示函数的变化率', '可导必连续', '连续必可导', '导数的几何意义是切线斜率']
    },
    {
      id: 3,
      type: 'judge',
      difficulty: 'easy',
      score: 2,
      content: '函数在某点连续，则在该点一定可导。'
    },
    {
      id: 4,
      type: 'fill',
      difficulty: 'medium',
      score: 8,
      content: '设函数 f(x) = x³ - 3x² + 2x + 1，则 f\'(x) = ______，f\'\'(x) = ______。'
    },
    {
      id: 5,
      type: 'essay',
      difficulty: 'hard',
      score: 15,
      content: '请证明：若函数 f(x) 在区间 [a,b] 上连续，在 (a,b) 内可导，且 f(a) = f(b)，则存在 ξ ∈ (a,b)，使得 f\'(ξ) = 0。'
    }
  ],
  usageHistory: [
    {
      id: 1,
      examTitle: '2024年春季期末考试',
      usedAt: '2024-01-20T09:00:00',
      studentCount: 45
    }
  ]
})

// 题目统计
const questionStats = computed(() => {
  const stats = [
    { type: 'single', label: '单选题', count: 0, totalScore: 0 },
    { type: 'multiple', label: '多选题', count: 0, totalScore: 0 },
    { type: 'judge', label: '判断题', count: 0, totalScore: 0 },
    { type: 'fill', label: '填空题', count: 0, totalScore: 0 },
    { type: 'essay', label: '问答题', count: 0, totalScore: 0 }
  ]

  paper.value.questions.forEach(question => {
    const stat = stats.find(s => s.type === question.type)
    if (stat) {
      stat.count++
      stat.totalScore += question.score
    }
  })

  return stats
})

// 状态样式和文本
const getStatusClass = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'archived':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'draft':
      return '草稿'
    case 'active':
      return '启用'
    case 'archived':
      return '归档'
    default:
      return '未知'
  }
}

// 题目类型样式和文本
const getTypeClass = (type: string) => {
  switch (type) {
    case 'single':
      return 'bg-blue-100 text-blue-800'
    case 'multiple':
      return 'bg-green-100 text-green-800'
    case 'judge':
      return 'bg-yellow-100 text-yellow-800'
    case 'fill':
      return 'bg-purple-100 text-purple-800'
    case 'essay':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getTypeText = (type: string) => {
  switch (type) {
    case 'single':
      return '单选题'
    case 'multiple':
      return '多选题'
    case 'judge':
      return '判断题'
    case 'fill':
      return '填空题'
    case 'essay':
      return '问答题'
    default:
      return '未知'
  }
}

// 难度样式和文本
const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'hard':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return '简单'
    case 'medium':
      return '中等'
    case 'hard':
      return '困难'
    default:
      return '未知'
  }
}

// 获取选项标签
const getOptionLabel = (index: number) => {
  return String.fromCharCode(65 + index) // A, B, C, D...
}

// 格式化题目内容
const formatQuestionContent = (content: string) => {
  // 处理填空题的下划线
  return content.replace(/______/g, '<span class="inline-block border-b-2 border-gray-400 w-16 h-5"></span>')
}

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 复制试卷
const copyPaper = async () => {
  try {
    // TODO: 调用复制API
    console.log('Copy paper:', paperId)
  } catch (error) {
    console.error('Failed to copy paper:', error)
  }
}

// 查看题目详情
const viewQuestionDetail = (questionId: number) => {
  router.push(`/teacher/questions/${questionId}`)
}

// 加载试卷详情
const loadPaper = async () => {
  try {
    // TODO: 调用API获取试卷详情
    console.log('Load paper:', paperId)
  } catch (error) {
    console.error('Failed to load paper:', error)
  }
}

onMounted(() => {
  loadPaper()
})
</script>
