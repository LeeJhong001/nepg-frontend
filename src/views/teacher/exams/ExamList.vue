<template>
  <div>
    <!-- 页面标题和操作 -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">考试管理</h1>
        <p class="mt-1 text-sm text-gray-600">管理您的所有考试</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="$router.push('/teacher/exams/create')"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          创建考试
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
              placeholder="搜索考试名称..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">状态</label>
            <select
              v-model="filters.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">全部状态</option>
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
              <option value="archived">已归档</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">开始日期</label>
            <input
              v-model="filters.startDate"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
    <div v-if="selectedExams.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div class="flex items-center justify-between">
        <span class="text-sm text-blue-700">已选择 {{ selectedExams.length }} 个考试</span>
        <div class="space-x-2">
          <button
            @click="batchPublish"
            class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            批量发布
          </button>
          <button
            @click="batchArchive"
            class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
          >
            批量归档
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

    <!-- 考试列表 -->
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
          <div class="col-span-3">考试名称</div>
          <div class="col-span-2">状态</div>
          <div class="col-span-2">开始时间</div>
          <div class="col-span-2">结束时间</div>
          <div class="col-span-2">操作</div>
        </div>

        <!-- 表体 -->
        <div class="bg-white divide-y divide-gray-200">
          <div
            v-for="exam in paginatedExams"
            :key="exam.id"
            class="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50"
          >
            <div class="col-span-1">
              <input
                type="checkbox"
                :value="exam.id"
                v-model="selectedExams"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div class="col-span-3">
              <div class="text-sm font-medium text-gray-900">{{ exam.title }}</div>
              <div class="text-sm text-gray-500">{{ exam.description }}</div>
            </div>
            <div class="col-span-2">
              <span :class="getStatusClass(exam.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ getStatusText(exam.status) }}
              </span>
            </div>
            <div class="col-span-2 text-sm text-gray-900">
              {{ formatDate(exam.startTime) }}
            </div>
            <div class="col-span-2 text-sm text-gray-900">
              {{ formatDate(exam.endTime) }}
            </div>
            <div class="col-span-2">
              <div class="flex items-center space-x-2">
                <button
                  @click="viewExam(exam.id)"
                  class="text-blue-600 hover:text-blue-900 text-sm"
                >
                  查看
                </button>
                <button
                  @click="editExam(exam.id)"
                  class="text-green-600 hover:text-green-900 text-sm"
                >
                  编辑
                </button>
                <button
                  @click="copyExam(exam.id)"
                  class="text-yellow-600 hover:text-yellow-900 text-sm"
                >
                  复制
                </button>
                <button
                  v-if="exam.status === 'draft'"
                  @click="publishExam(exam.id)"
                  class="text-blue-600 hover:text-blue-900 text-sm"
                >
                  发布
                </button>
                <button
                  v-if="exam.status === 'published'"
                  @click="archiveExam(exam.id)"
                  class="text-yellow-600 hover:text-yellow-900 text-sm"
                >
                  归档
                </button>
                <button
                  @click="deleteExam(exam.id)"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { teacherExamService, type Exam, type ExamListParams } from '../../../services/teacher/examService'
import { useNotification } from '../../../composables/useNotification'

const router = useRouter()
const { success, error } = useNotification()

// 筛选条件
const filters = ref({
  search: '',
  status: '',
  startDate: ''
})

// 选中的考试
const selectedExams = ref<number[]>([])

// 考试列表
const exams = ref<Exam[]>([])
const loading = ref(false)

// 分页
const pagination = ref({
  current: 1,
  size: 10,
  total: 0,
  totalItems: 0
})

// 加载考试列表
const loadExams = async () => {
  try {
    loading.value = true
    const params: ExamListParams = {
      page: pagination.value.current,
      size: pagination.value.size,
      search: filters.value.search || undefined,
      status: filters.value.status || undefined,
      startDate: filters.value.startDate || undefined
    }
    
    const response = await teacherExamService.getExamList(params)
    exams.value = response.data.items
    pagination.value.total = response.data.totalPages
    pagination.value.totalItems = response.data.totalItems
  } catch (err) {
    error('加载考试列表失败')
    console.error('Load exams error:', err)
  } finally {
    loading.value = false
  }
}

// 筛选后的考试
const filteredExams = computed(() => {
  return exams.value
})

// 分页后的考试
const paginatedExams = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.size
  const end = start + pagination.value.size
  return filteredExams.value.slice(start, end)
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
  return paginatedExams.value.length > 0 && 
    selectedExams.value.length === paginatedExams.value.length &&
    paginatedExams.value.every(exam => selectedExams.value.includes(exam.id))
})

// 更新分页信息
const updatePagination = () => {
  pagination.value.totalItems = filteredExams.value.length
  pagination.value.total = Math.ceil(filteredExams.value.length / pagination.value.size)
  
  if (pagination.value.current > pagination.value.total) {
    pagination.value.current = Math.max(1, pagination.value.total)
  }
}

// 监听筛选条件变化
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current = 1
    loadExams()
  }, 500)
}

// 重置筛选
const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    startDate: ''
  }
  pagination.value.current = 1
  loadExams()
}

// 全选/取消全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedExams.value = []
  } else {
    selectedExams.value = paginatedExams.value.map(exam => exam.id)
  }
}

// 分页操作
const goToPage = (page: number) => {
  pagination.value.current = page
  loadExams()
}

const nextPage = () => {
  if (pagination.value.current < pagination.value.total) {
    pagination.value.current++
    loadExams()
  }
}

const previousPage = () => {
  if (pagination.value.current > 1) {
    pagination.value.current--
    loadExams()
  }
}

// 状态样式
const getStatusClass = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800'
    case 'archived':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// 状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'published':
      return '已发布'
    case 'draft':
      return '草稿'
    case 'archived':
      return '已归档'
    default:
      return '未知'
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 考试操作
const viewExam = (id: number) => {
  router.push(`/teacher/exams/${id}`)
}

const editExam = (id: number) => {
  router.push(`/teacher/exams/${id}/edit`)
}

const copyExam = async (id: number) => {
  try {
    // TODO: 调用复制API
    console.log('Copy exam:', id)
  } catch (error) {
    console.error('Failed to copy exam:', error)
  }
}

const publishExam = async (id: number) => {
  try {
    await teacherExamService.publishExam(id)
    success('考试发布成功')
    await loadExams()
  } catch (err) {
    error('发布考试失败')
    console.error('Publish exam error:', err)
  }
}

const archiveExam = async (id: number) => {
  try {
    await teacherExamService.archiveExam(id)
    success('考试归档成功')
    await loadExams()
  } catch (err) {
    error('归档考试失败')
    console.error('Archive exam error:', err)
  }
}

const deleteExam = async (id: number) => {
  if (!confirm('确定要删除这个考试吗？此操作不可撤销。')) {
    return
  }
  
  try {
    await teacherExamService.deleteExam(id)
    success('考试删除成功')
    await loadExams()
  } catch (err) {
    error('删除考试失败')
    console.error('Delete exam error:', err)
  }
}

// 批量操作
const batchPublish = async () => {
  try {
    // TODO: 调用批量发布API
    console.log('Batch publish:', selectedExams.value)
  } catch (error) {
    console.error('Failed to batch publish:', error)
  }
}

const batchArchive = async () => {
  try {
    // TODO: 调用批量归档API
    console.log('Batch archive:', selectedExams.value)
  } catch (error) {
    console.error('Failed to batch archive:', error)
  }
}

const batchDelete = async () => {
  if (!confirm(`确定要删除选中的 ${selectedExams.value.length} 个考试吗？此操作不可撤销。`)) {
    return
  }
  
  try {
    await teacherExamService.batchDeleteExams(selectedExams.value)
    success('批量删除成功')
    selectedExams.value = []
    await loadExams()
  } catch (err) {
    error('批量删除失败')
    console.error('Batch delete error:', err)
  }
}

onMounted(() => {
  loadExams()
})
</script>
