<template>
  <div>
    <!-- 页面标题 -->
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
                <router-link :to="`/teacher/exam-papers/${paperId}`" class="ml-4 text-gray-400 hover:text-gray-500">
                  {{ paperTitle }}
                </router-link>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-gray-500">题目管理</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 class="mt-2 text-2xl font-semibold text-gray-900">题目管理</h1>
        <p class="mt-1 text-sm text-gray-600">管理试卷中的题目，支持添加、删除、排序等操作</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
        <button
          @click="showQuestionBank = true"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          从题库添加
        </button>
      </div>
    </div>

    <!-- 试卷统计信息 -->
    <div class="bg-white shadow rounded-lg mb-6">
      <div class="p-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <div class="text-center">
            <div class="text-2xl font-semibold text-gray-900">{{ questions.length }}</div>
            <div class="text-sm text-gray-500">总题数</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-semibold text-gray-900">{{ totalScore }}</div>
            <div class="text-sm text-gray-500">总分</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-semibold text-gray-900">{{ averageDifficulty }}</div>
            <div class="text-sm text-gray-500">平均难度</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-semibold text-gray-900">{{ estimatedTime }}</div>
            <div class="text-sm text-gray-500">预计用时(分钟)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 题目列表 -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">题目列表</h3>
          <div class="flex items-center space-x-3">
            <button
              @click="toggleSortMode"
              :class="[
                'inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md',
                sortMode ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              ]"
            >
              <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              {{ sortMode ? '完成排序' : '排序题目' }}
            </button>
            <button
              @click="batchDelete"
              :disabled="selectedQuestions.length === 0"
              class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              批量删除
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="questions.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">暂无题目</h3>
        <p class="mt-1 text-sm text-gray-500">点击"从题库添加"按钮开始添加题目</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <draggable
          v-model="questions"
          :disabled="!sortMode"
          item-key="id"
          class="divide-y divide-gray-200"
        >
          <template #item="{ element: question, index }">
            <div class="p-6 hover:bg-gray-50" :class="{ 'cursor-move': sortMode }">
              <div class="flex items-start space-x-4">
                <!-- 选择框 -->
                <div v-if="!sortMode" class="flex items-center h-5">
                  <input
                    v-model="selectedQuestions"
                    :value="question.id"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <!-- 拖拽手柄 -->
                <div v-if="sortMode" class="flex items-center h-5">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>

                <!-- 题目序号 -->
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                    {{ index + 1 }}
                  </span>
                </div>

                <!-- 题目内容 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3 mb-2">
                    <span :class="getTypeClass(question.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getTypeText(question.type) }}
                    </span>
                    <span :class="getDifficultyClass(question.difficulty)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getDifficultyText(question.difficulty) }}
                    </span>
                    <span class="text-sm text-gray-500">{{ question.score }} 分</span>
                    <span v-if="question.category" class="text-sm text-gray-500">{{ question.category }}</span>
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

                <!-- 操作按钮 -->
                <div v-if="!sortMode" class="flex-shrink-0 flex items-center space-x-2">
                  <button
                    @click="editQuestionScore(question)"
                    class="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    改分
                  </button>
                  <button
                    @click="viewQuestionDetail(question.id)"
                    class="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    详情
                  </button>
                  <button
                    @click="removeQuestion(question.id)"
                    class="text-red-600 hover:text-red-900 text-sm"
                  >
                    移除
                  </button>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- 题库选择模态框 -->
    <QuestionBankModal
      v-if="showQuestionBank"
      @close="showQuestionBank = false"
      @select="addQuestionsFromBank"
    />

    <!-- 改分模态框 -->
    <div v-if="showScoreModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showScoreModal = false"></div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">修改题目分值</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700">新分值</label>
              <input
                v-model.number="newScore"
                type="number"
                min="1"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="confirmScoreChange"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
            >
              确认
            </button>
            <button
              @click="showScoreModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import QuestionBankModal from './QuestionBankModal.vue'

const route = useRoute()
const router = useRouter()
const paperId = route.params.id as string

// 响应式数据
const paperTitle = ref('高等数学期末考试')
const questions = ref([
  {
    id: 1,
    type: 'single',
    difficulty: 'medium',
    score: 4,
    category: '数学',
    content: '下列函数中，哪个是偶函数？',
    options: ['f(x) = x²', 'f(x) = x³', 'f(x) = sin(x)', 'f(x) = ln(x)']
  },
  {
    id: 2,
    type: 'multiple',
    difficulty: 'hard',
    score: 6,
    category: '数学',
    content: '下列关于导数的说法正确的是：',
    options: ['导数表示函数的变化率', '可导必连续', '连续必可导', '导数的几何意义是切线斜率']
  }
])

const selectedQuestions = ref<number[]>([])
const sortMode = ref(false)
const showQuestionBank = ref(false)
const showScoreModal = ref(false)
const currentEditQuestion = ref<any>(null)
const newScore = ref(0)

// 计算属性
const totalScore = computed(() => {
  return questions.value.reduce((total, question) => total + question.score, 0)
})

const averageDifficulty = computed(() => {
  if (questions.value.length === 0) return '0.0'
  const difficultyMap = { easy: 1, medium: 2, hard: 3 }
  const total = questions.value.reduce((sum, q) => sum + (difficultyMap[q.difficulty as keyof typeof difficultyMap] || 2), 0)
  return (total / questions.value.length).toFixed(1)
})

const estimatedTime = computed(() => {
  // 根据题目类型和数量估算时间
  const timeMap = { single: 2, multiple: 3, judge: 1, fill: 4, essay: 10 }
  return questions.value.reduce((total, q) => total + (timeMap[q.type as keyof typeof timeMap] || 3), 0)
})

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
  return content.replace(/______/g, '<span class="inline-block border-b-2 border-gray-400 w-16 h-5"></span>')
}

// 切换排序模式
const toggleSortMode = () => {
  sortMode.value = !sortMode.value
  if (!sortMode.value) {
    // 退出排序模式时保存顺序
    saveQuestionOrder()
  }
}

// 从题库添加题目
const addQuestionsFromBank = (selectedQuestions: any[]) => {
  questions.value.push(...selectedQuestions)
  showQuestionBank.value = false
}

// 移除题目
const removeQuestion = (questionId: number) => {
  const index = questions.value.findIndex(q => q.id === questionId)
  if (index > -1) {
    questions.value.splice(index, 1)
  }
}

// 批量删除
const batchDelete = () => {
  if (selectedQuestions.value.length === 0) return
  
  if (confirm(`确定要删除选中的 ${selectedQuestions.value.length} 道题目吗？`)) {
    questions.value = questions.value.filter(q => !selectedQuestions.value.includes(q.id))
    selectedQuestions.value = []
  }
}

// 编辑题目分值
const editQuestionScore = (question: any) => {
  currentEditQuestion.value = question
  newScore.value = question.score
  showScoreModal.value = true
}

// 确认分值修改
const confirmScoreChange = () => {
  if (currentEditQuestion.value && newScore.value > 0) {
    currentEditQuestion.value.score = newScore.value
    showScoreModal.value = false
    currentEditQuestion.value = null
  }
}

// 查看题目详情
const viewQuestionDetail = (questionId: number) => {
  router.push(`/teacher/questions/${questionId}`)
}

// 保存题目顺序
const saveQuestionOrder = async () => {
  try {
    // TODO: 调用API保存题目顺序
    console.log('Save question order:', questions.value.map(q => q.id))
  } catch (error) {
    console.error('Failed to save question order:', error)
  }
}

// 加载试卷题目
const loadPaperQuestions = async () => {
  try {
    // TODO: 调用API获取试卷题目
    console.log('Load paper questions:', paperId)
  } catch (error) {
    console.error('Failed to load paper questions:', error)
  }
}

onMounted(() => {
  loadPaperQuestions()
})
</script>
