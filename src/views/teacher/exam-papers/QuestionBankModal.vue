<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-4 mx-auto p-5 border w-5/6 max-w-6xl shadow-lg rounded-md bg-white">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">从题库选择题目</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 筛选条件 -->
      <div class="bg-gray-50 rounded-lg p-4 mb-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">搜索</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="搜索题目内容..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">题目类型</label>
            <select
              v-model="filters.type"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">全部类型</option>
              <option value="single">单选题</option>
              <option value="multiple">多选题</option>
              <option value="judge">判断题</option>
              <option value="fill">填空题</option>
              <option value="essay">问答题</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">科目</label>
            <select
              v-model="filters.categoryId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">全部科目</option>
              <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                {{ subject.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">难度</label>
            <select
              v-model="filters.difficulty"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">全部难度</option>
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 已选题目提示 -->
      <div v-if="selectedQuestions.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-blue-700">已选择 {{ selectedQuestions.length }} 个题目</span>
          <button
            @click="selectedQuestions = []"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            清空选择
          </button>
        </div>
      </div>

      <!-- 题目列表 -->
      <div class="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
        <div class="divide-y divide-gray-200">
          <div
            v-for="question in filteredQuestions"
            :key="question.id"
            class="p-4 hover:bg-gray-50"
          >
            <div class="flex items-start space-x-3">
              <input
                type="checkbox"
                :value="question.id"
                v-model="selectedQuestions"
                class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <span :class="getTypeClass(question.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getTypeText(question.type) }}
                  </span>
                  <span class="text-sm text-gray-500">{{ question.category }}</span>
                  <span :class="getDifficultyClass(question.difficulty)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getDifficultyText(question.difficulty) }}
                  </span>
                  <span class="text-sm text-gray-500">{{ question.score }} 分</span>
                </div>
                <div class="text-sm text-gray-900 mb-2">{{ question.content }}</div>
                <div v-if="question.options && question.options.length > 0" class="text-xs text-gray-500">
                  选项: {{ question.options.join(', ') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="pagination.total > 1" class="mt-4 flex items-center justify-center">
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
            @click="previousPage"
            :disabled="pagination.current === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            上一页
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              page === pagination.current
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="nextPage"
            :disabled="pagination.current === pagination.total"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            下一页
          </button>
        </nav>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="button"
          @click="confirmSelection"
          :disabled="selectedQuestions.length === 0"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          添加选中题目 ({{ selectedQuestions.length }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { teacherQuestionService, type Question } from '@/services/teacher/questionService'
import { getEnabledSubjects, type Subject } from '@/services/common/subjectService'

const emit = defineEmits<{
  close: []
  select: [questions: any[]]
}>()

// 筛选条件
const filters = ref({
  search: '',
  type: '',
  categoryId: '',
  difficulty: ''
})

// 选中的题目ID
const selectedQuestions = ref<number[]>([])

// 题目列表
const questions = ref<Question[]>([])

// 科目列表
const subjects = ref<Subject[]>([])

// 分页
const pagination = ref({
  current: 1,
  size: 10,
  total: 0,
  totalItems: 0
})

// 筛选后的题目
const filteredQuestions = computed(() => {
  return questions.value
})

// 分页后的题目
const paginatedQuestions = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.size
  const end = start + pagination.value.size
  return filteredQuestions.value.slice(start, end)
})

// 可见页码
const visiblePages = computed(() => {
  const pages = []
  const total = pagination.value.total
  const current = pagination.value.current
  
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 更新分页信息
const updatePagination = () => {
  pagination.value.totalItems = filteredQuestions.value.length
  pagination.value.total = Math.ceil(filteredQuestions.value.length / pagination.value.size)
  
  if (pagination.value.current > pagination.value.total) {
    pagination.value.current = Math.max(1, pagination.value.total)
  }
}

// 监听筛选条件变化
watch(filteredQuestions, () => {
  updatePagination()
}, { immediate: true })

// 分页操作
const previousPage = () => {
  if (pagination.value.current > 1) {
    pagination.value.current--
  }
}

const nextPage = () => {
  if (pagination.value.current < pagination.value.total) {
    pagination.value.current++
  }
}

const goToPage = (page: number) => {
  pagination.value.current = page
}

// 样式和文本函数
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
      return '单选'
    case 'multiple':
      return '多选'
    case 'judge':
      return '判断'
    case 'fill':
      return '填空'
    case 'essay':
      return '问答'
    default:
      return '未知'
  }
}

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

// 确认选择
const confirmSelection = () => {
  const selectedQuestionObjects = questions.value.filter(q => 
    selectedQuestions.value.includes(q.id)
  )
  emit('select', selectedQuestionObjects)
}

// 加载题目列表
const loadQuestions = async () => {
  try {
    const params: any = {
      page: pagination.value.current,
      size: pagination.value.size
    }
    
    if (filters.value.type) params.type = filters.value.type
    if (filters.value.categoryId) params.categoryId = Number(filters.value.categoryId)
    if (filters.value.difficulty) params.difficulty = Number(filters.value.difficulty)
    if (filters.value.search) params.keyword = filters.value.search
    
    const response = await teacherQuestionService.getQuestions(params)
    questions.value = response.records
    pagination.value.total = response.pages
    pagination.value.totalItems = response.total
  } catch (error) {
    console.error('Failed to load questions:', error)
  }
}

// 加载科目列表
const loadSubjects = async () => {
  try {
    subjects.value = await getEnabledSubjects()
  } catch (error) {
    console.error('Failed to load subjects:', error)
  }
}

// 监听筛选条件变化
watch([() => filters.value.type, () => filters.value.categoryId, () => filters.value.difficulty, () => filters.value.search], () => {
  pagination.value.current = 1
  loadQuestions()
})

// 监听分页变化
watch(() => pagination.value.current, () => {
  loadQuestions()
})

onMounted(() => {
  loadSubjects()
  loadQuestions()
})
</script>
