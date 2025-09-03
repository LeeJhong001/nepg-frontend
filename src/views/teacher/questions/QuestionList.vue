<template>
  <div>
    <!-- 页面标题和操作 -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">题库管理</h1>
        <p class="mt-1 text-sm text-gray-600">管理您的所有题目</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
        <button
          @click="importQuestions"
          class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          批量导入
        </button>
        <button
          @click="exportQuestions"
          class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          导出题目
        </button>
        <button
          @click="$router.push('/teacher/questions/create')"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          创建题目
        </button>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="bg-white shadow rounded-lg mb-6">
      <div class="p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-5">
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
            <label class="block text-sm font-medium text-gray-700">分类</label>
            <select
              v-model="filters.category"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">全部分类</option>
              <option value="math">数学</option>
              <option value="chinese">语文</option>
              <option value="english">英语</option>
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
          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              重置
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 批量操作 -->
    <div v-if="selectedQuestions.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div class="flex items-center justify-between">
        <span class="text-sm text-blue-700">已选择 {{ selectedQuestions.length }} 个题目</span>
        <div class="space-x-2">
          <button
            @click="batchCopy"
            class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            批量复制
          </button>
          <button
            @click="batchDelete"
            class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
          >
            批量删除
          </button>
        </div>
      </div>
    </div>

    <!-- 题目列表 -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="min-w-full divide-y divide-gray-200">
        <!-- 表头 -->
        <div class="bg-gray-50 px-6 py-3 grid grid-cols-12 gap-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div class="col-span-1">
            <input
              type="checkbox"
              :checked="isAllSelected"
              @change="toggleSelectAll"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div class="col-span-4">题目内容</div>
          <div class="col-span-1">类型</div>
          <div class="col-span-1">分类</div>
          <div class="col-span-1">难度</div>
          <div class="col-span-1">分值</div>
          <div class="col-span-1">创建时间</div>
          <div class="col-span-2">操作</div>
        </div>

        <!-- 表体 -->
        <div class="bg-white divide-y divide-gray-200">
          <div
            v-for="question in paginatedQuestions"
            :key="question.id"
            class="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50"
          >
            <div class="col-span-1">
              <input
                type="checkbox"
                :value="question.id"
                v-model="selectedQuestions"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div class="col-span-4">
              <div class="text-sm font-medium text-gray-900 line-clamp-2">{{ question.content }}</div>
              <div v-if="question.options && question.options.length > 0" class="text-xs text-gray-500 mt-1">
                选项: {{ question.options.join(', ') }}
              </div>
            </div>
            <div class="col-span-1">
              <span :class="getTypeClass(question.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ getTypeText(question.type) }}
              </span>
            </div>
            <div class="col-span-1 text-sm text-gray-900">
              {{ question.category }}
            </div>
            <div class="col-span-1">
              <span :class="getDifficultyClass(question.difficulty)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ getDifficultyText(question.difficulty) }}
              </span>
            </div>
            <div class="col-span-1 text-sm text-gray-900">
              {{ question.score }}
            </div>
            <div class="col-span-1 text-sm text-gray-900">
              {{ formatDate(question.createdAt) }}
            </div>
            <div class="col-span-2">
              <div class="flex items-center space-x-2">
                <button
                  @click="viewQuestion(question.id)"
                  class="text-blue-600 hover:text-blue-900 text-sm"
                >
                  查看
                </button>
                <button
                  @click="editQuestion(question.id)"
                  class="text-green-600 hover:text-green-900 text-sm"
                >
                  编辑
                </button>
                <button
                  @click="copyQuestion(question.id)"
                  class="text-yellow-600 hover:text-yellow-900 text-sm"
                >
                  复制
                </button>
                <button
                  @click="deleteQuestion(question.id)"
                  class="text-red-600 hover:text-red-900 text-sm"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="pagination.current === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            上一页
          </button>
          <button
            @click="nextPage"
            :disabled="pagination.current === pagination.total"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              显示第 <span class="font-medium">{{ (pagination.current - 1) * pagination.size + 1 }}</span> 到
              <span class="font-medium">{{ Math.min(pagination.current * pagination.size, pagination.totalItems) }}</span> 条，
              共 <span class="font-medium">{{ pagination.totalItems }}</span> 条记录
            </p>
          </div>
          <div>
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
        </div>
      </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { teacherQuestionService, type Question, type QuestionListParams } from '../../../services/teacher/questionService'
import { categoryService, type Category } from '../../../services/teacher/categoryService'
import { useNotification } from '../../../composables/useNotification'

const router = useRouter()
const { success: showSuccess, error: showError } = useNotification()

// 响应式数据
const questions = ref<Question[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const totalElements = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选条件
const filters = ref({
  search: '',
  type: '',
  category: '',
  difficulty: ''
})

// 选中的题目
const selectedQuestions = ref<number[]>([])

// 分页
const pagination = ref({
  current: 1,
  size: 10,
  total: 0,
  totalItems: 0
})

// 筛选后的题目
const filteredQuestions = computed(() => {
  return questions.value.filter(question => {
    const matchSearch = !filters.value.search || 
      question.content.toLowerCase().includes(filters.value.search.toLowerCase())
    
    const matchType = !filters.value.type || question.type === filters.value.type
    const matchCategory = !filters.value.category || question.category.includes(filters.value.category)
    const matchDifficulty = !filters.value.difficulty || question.difficulty === filters.value.difficulty
    
    return matchSearch && matchType && matchCategory && matchDifficulty
  })
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

// 是否全选
const isAllSelected = computed(() => {
  return paginatedQuestions.value.length > 0 && 
    selectedQuestions.value.length === paginatedQuestions.value.length &&
    paginatedQuestions.value.every(question => selectedQuestions.value.includes(question.id))
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
  selectedQuestions.value = []
}, { immediate: true })

// 重置筛选
const resetFilters = () => {
  filters.value = {
    search: '',
    type: '',
    category: '',
    difficulty: ''
  }
}

// 全选/取消全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedQuestions.value = []
  } else {
    selectedQuestions.value = paginatedQuestions.value.map(question => question.id)
  }
}

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

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 题目操作
const viewQuestion = (id: number) => {
  router.push(`/teacher/questions/${id}`)
}

const editQuestion = (id: number) => {
  router.push(`/teacher/questions/${id}/edit`)
}

const copyQuestion = async (id: number) => {
  try {
    // TODO: 调用复制API
    console.log('Copy question:', id)
  } catch (error) {
    console.error('Failed to copy question:', error)
  }
}

const deleteQuestion = async (id: number) => {
  if (confirm('确定要删除这道题目吗？')) {
    try {
      await teacherQuestionService.deleteQuestion(id)
      showSuccess('题目删除成功')
      await loadQuestions()
    } catch (error) {
      console.error('Failed to delete question:', error)
      showError('题目删除失败')
    }
  }
}

// 批量操作
const batchCopy = async () => {
  try {
    // TODO: 调用批量复制API
    console.log('Batch copy:', selectedQuestions.value)
  } catch (error) {
    console.error('Failed to batch copy:', error)
  }
}

const batchDelete = async () => {
  if (confirm(`确定要删除选中的 ${selectedQuestions.value.length} 个题目吗？`)) {
    try {
      // TODO: 调用批量删除API
      console.log('Batch delete:', selectedQuestions.value)
    } catch (error) {
      console.error('Failed to batch delete:', error)
    }
  }
}

// 加载题目列表
const loadQuestions = async () => {
  try {
    loading.value = true
    const params: QuestionListParams = {
      page: currentPage.value,
      size: pageSize.value,
      keyword: filters.value.search || undefined,
      categoryId: filters.value.category,
      type: filters.value.type || undefined,
      difficulty: filters.value.difficulty
    }
    
    const response = await teacherQuestionService.getQuestions(params)
    questions.value = response.content
    totalElements.value = response.totalElements
  } catch (error) {
    console.error('Failed to load questions:', error)
    showError('加载题目列表失败')
  } finally {
    loading.value = false
  }
}

// 加载分类列表
const loadCategories = async () => {
  try {
    categories.value = await categoryService.getCategories()
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadQuestions()
}

onMounted(() => {
  loadQuestions()
  loadCategories()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
