<template>
  <div>
    <!-- 页面标题和操作 -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">试卷管理</h1>
        <p class="mt-1 text-sm text-gray-600">管理您的所有试卷</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
        <button
          @click="$router.push('/teacher/exam-papers/generate')"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          智能组卷
        </button>
        <button
          @click="$router.push('/teacher/exam-papers/create')"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          创建试卷
        </button>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="bg-white shadow rounded-lg mb-6">
      <div class="p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">搜索</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="搜索试卷名称..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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

    <!-- 试卷列表 -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="paper in paginatedPapers"
        :key="paper.id"
        class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 truncate">{{ paper.title }}</h3>
            <div class="flex items-center space-x-2">
              <button
                @click="previewPaper(paper.id)"
                class="text-blue-600 hover:text-blue-900"
                title="预览"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <div class="relative" ref="dropdownRef">
                <button
                  @click="toggleDropdown(paper.id)"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                <div
                  v-if="activeDropdown === paper.id"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                >
                  <div class="py-1">
                    <button
                      @click="editPaper(paper.id)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      编辑试卷
                    </button>
                    <button
                      @click="managePaperQuestions(paper.id)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      管理题目
                    </button>
                    <button
                      @click="copyPaper(paper.id)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      复制试卷
                    </button>
                    <button
                      @click="deletePaper(paper.id)"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      删除试卷
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <p class="text-sm text-gray-600">{{ paper.description }}</p>
            
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">题目数量</span>
              <span class="font-medium">{{ paper.questionCount }} 题</span>
            </div>
            
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">总分</span>
              <span class="font-medium">{{ paper.totalScore }} 分</span>
            </div>
            
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">难度</span>
              <span :class="getDifficultyClass(paper.difficulty)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getDifficultyText(paper.difficulty) }}
              </span>
            </div>
            
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">创建时间</span>
              <span class="text-gray-900">{{ formatDate(paper.createdAt) }}</span>
            </div>
          </div>

          <div class="mt-6 flex space-x-3">
            <button
              @click="previewPaper(paper.id)"
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              预览试卷
            </button>
            <button
              @click="editPaper(paper.id)"
              class="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              编辑
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="pagination.total > 1" class="mt-8 flex items-center justify-center">
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { teacherExamPaperService, type ExamPaper, type ExamPaperListParams } from '../../../services/teacher/examPaperService'
import { useNotification } from '../../../composables/useNotification'

const router = useRouter()
const { success, error } = useNotification()

// 筛选条件
const filters = ref({
  search: '',
  category: '',
  difficulty: ''
})

// 下拉菜单状态
const activeDropdown = ref<number | null>(null)
const dropdownRef = ref<HTMLElement>()

// 试卷列表
const papers = ref<ExamPaper[]>([])
const loading = ref(false)

// 分页
const pagination = ref({
  current: 1,
  size: 9,
  total: 0,
  totalItems: 0
})

// 加载试卷列表
const loadPapers = async () => {
  try {
    loading.value = true
    const params: ExamPaperListParams = {
      page: pagination.value.current,
      size: pagination.value.size,
      search: filters.value.search || undefined,
      category: filters.value.category || undefined,
      difficulty: filters.value.difficulty || undefined
    }
    
    const response = await teacherExamPaperService.getExamPaperList(params)
    papers.value = response.data.items
    pagination.value.total = response.data.totalPages
    pagination.value.totalItems = response.data.totalItems
  } catch (err) {
    error('加载试卷列表失败')
    console.error('Load papers error:', err)
  } finally {
    loading.value = false
  }
}

// 筛选后的试卷
const filteredPapers = computed(() => {
  return papers.value
})

// 分页后的试卷
const paginatedPapers = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.size
  const end = start + pagination.value.size
  return filteredPapers.value.slice(start, end)
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
  pagination.value.totalItems = filteredPapers.value.length
  pagination.value.total = Math.ceil(filteredPapers.value.length / pagination.value.size)
  
  if (pagination.value.current > pagination.value.total) {
    pagination.value.current = Math.max(1, pagination.value.total)
  }
}

// 搜索防抖
let searchTimeout: NodeJS.Timeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current = 1
    loadPapers()
  }, 500)
}

// 重置筛选
const resetFilters = () => {
  filters.value = {
    search: '',
    category: '',
    difficulty: ''
  }
  pagination.value.current = 1
  loadPapers()
}

// 下拉菜单控制
const toggleDropdown = (id: number) => {
  activeDropdown.value = activeDropdown.value === id ? null : id
}

const closeDropdown = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    activeDropdown.value = null
  }
}

// 分页操作
const previousPage = () => {
  if (pagination.value.current > 1) {
    pagination.value.current--
    loadPapers()
  }
}

const nextPage = () => {
  if (pagination.value.current < pagination.value.total) {
    pagination.value.current++
    loadPapers()
  }
}

const goToPage = (page: number) => {
  pagination.value.current = page
  loadPapers()
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

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 试卷操作
const previewPaper = (id: number) => {
  router.push(`/teacher/exam-papers/${id}/preview`)
}

const editPaper = (id: number) => {
  router.push(`/teacher/exam-papers/${id}/edit`)
}

const managePaperQuestions = (id: number) => {
  router.push(`/teacher/exam-papers/${id}/questions`)
}

const copyPaper = async (id: number) => {
  try {
    // TODO: 调用复制API
    console.log('Copy paper:', id)
    activeDropdown.value = null
  } catch (error) {
    console.error('Failed to copy paper:', error)
  }
}

const deletePaper = async (id: number) => {
  if (!confirm('确定要删除这个试卷吗？此操作不可撤销。')) {
    return
  }
  
  try {
    await teacherExamPaperService.deleteExamPaper(id)
    success('试卷删除成功')
    await loadPapers()
  } catch (err) {
    error('删除试卷失败')
    console.error('Delete paper error:', err)
  }
  closeDropdown()
}

onMounted(() => {
  loadPapers()
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>
