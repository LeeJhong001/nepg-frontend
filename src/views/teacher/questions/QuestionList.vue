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
              <option value="CHOICE">选择题</option>
              <option value="FILL_BLANK">填空题</option>
              <option value="SHORT_ANSWER">简答题</option>
              <option value="PROOF">证明题</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">分类</label>
            <select
              v-model="filters.category"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">全部分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
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
              <option value="1">简单</option>
              <option value="2">中等</option>
              <option value="3">困难</option>
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
              {{ getCategoryName(question.categoryId) }}
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { teacherQuestionService, type Question, type QuestionListParams, type QuestionRequest } from '../../../services/teacher/questionService'
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

// 直接使用服务器返回的题目数据（已经过滤和分页）
const paginatedQuestions = computed(() => {
  return questions.value
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

// 更新分页信息（服务器端分页）
const updatePagination = () => {
  // 分页信息已在 loadQuestions 中设置，无需额外处理
}

// 监听筛选条件变化，重新加载数据
watch([() => filters.value.search, () => filters.value.type, () => filters.value.category, () => filters.value.difficulty], () => {
  currentPage.value = 1 // 重置到第一页
  loadQuestions()
  selectedQuestions.value = []
}, { deep: true })

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
  if (currentPage.value > 1) {
    currentPage.value--
    loadQuestions()
  }
}

const nextPage = () => {
  if (currentPage.value < pagination.value.total) {
    currentPage.value++
    loadQuestions()
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
  loadQuestions()
}

// 样式和文本函数
const getTypeClass = (type: string) => {
  switch (type) {
    case 'CHOICE':
      return 'bg-blue-100 text-blue-800'
    case 'FILL_BLANK':
      return 'bg-green-100 text-green-800'
    case 'SHORT_ANSWER':
      return 'bg-purple-100 text-purple-800'
    case 'PROOF':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getTypeText = (type: string) => {
  switch (type) {
    case 'CHOICE':
      return '选择题'
    case 'FILL_BLANK':
      return '填空题'
    case 'SHORT_ANSWER':
      return '简答题'
    case 'PROOF':
      return '证明题'
    default:
      return '未知'
  }
}

const getDifficultyClass = (difficulty: number) => {
  switch (difficulty) {
    case 1:
      return 'bg-green-100 text-green-800'
    case 2:
      return 'bg-yellow-100 text-yellow-800'
    case 3:
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getDifficultyText = (difficulty: number) => {
  switch (difficulty) {
    case 1:
      return '简单'
    case 2:
      return '中等'
    case 3:
      return '困难'
    default:
      return '未知'
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 获取分类名称
const getCategoryName = (categoryId: number) => {
  if (!categoryId) return '未分类'
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : `分类${categoryId}`
}

// 导入题目
const importQuestions = () => {
  // TODO: 实现导入功能
  console.log('Import questions')
}

// 导出题目
const exportQuestions = async () => {
  try {
    const questions = await teacherQuestionService.exportQuestions(
      filters.value.category ? Number(filters.value.category) : undefined,
      filters.value.type || undefined,
      filters.value.difficulty ? Number(filters.value.difficulty) : undefined
    )
    
    // 创建下载链接
    const dataStr = JSON.stringify(questions, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `questions_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    showSuccess('题目导出成功')
  } catch (error) {
    console.error('Failed to export questions:', error)
    showError('题目导出失败')
  }
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
    await teacherQuestionService.copyQuestion(id)
    showSuccess('题目复制成功')
    await loadQuestions()
  } catch (error) {
    console.error('Failed to copy question:', error)
    showError('题目复制失败')
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
    for (const id of selectedQuestions.value) {
      await teacherQuestionService.copyQuestion(id)
    }
    showSuccess(`成功复制 ${selectedQuestions.value.length} 道题目`)
    selectedQuestions.value = []
    await loadQuestions()
  } catch (error) {
    console.error('Failed to batch copy:', error)
    showError('批量复制失败')
  }
}

const batchDelete = async () => {
  if (confirm(`确定要删除选中的 ${selectedQuestions.value.length} 个题目吗？`)) {
    try {
      await teacherQuestionService.batchDeleteQuestions(selectedQuestions.value)
      showSuccess(`成功删除 ${selectedQuestions.value.length} 道题目`)
      selectedQuestions.value = []
      await loadQuestions()
    } catch (error) {
      console.error('Failed to batch delete:', error)
      showError('批量删除失败')
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
      categoryId: filters.value.category ? Number(filters.value.category) : undefined,
      type: filters.value.type || undefined,
      difficulty: filters.value.difficulty ? Number(filters.value.difficulty) : undefined
    }
    
    const response = await teacherQuestionService.getQuestions(params)
    questions.value = response.records
    totalElements.value = response.total
    pagination.value = {
      current: response.current,
      size: response.size,
      total: response.pages,
      totalItems: response.total
    }
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
    const categoryTree = await categoryService.getCategoryTree()
    // 展平分类树，获取所有分类（包括子分类）
    const flattenCategories = (cats: Category[]): Category[] => {
      let result: Category[] = []
      for (const cat of cats) {
        result.push(cat)
        if (cat.children && cat.children.length > 0) {
          result = result.concat(flattenCategories(cat.children))
        }
      }
      return result
    }
    categories.value = flattenCategories(categoryTree)
    console.log('Loaded categories:', categories.value)
  } catch (error) {
    console.error('Failed to load categories:', error)
    // 如果分类加载失败，尝试使用备用方法
    try {
      categories.value = await categoryService.getEnabledCategoryTree()
      console.log('Loaded enabled categories as fallback:', categories.value)
    } catch (fallbackError) {
      console.error('Fallback category loading also failed:', fallbackError)
      showError('加载分类列表失败')
    }
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
