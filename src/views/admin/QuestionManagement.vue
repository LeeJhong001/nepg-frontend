<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">题目管理</h2>
      <p class="text-gray-600">管理系统中的所有题目</p>
    </div>

    <!-- 操作按钮和搜索 -->
    <div class="mb-6 flex justify-between items-center">
      <button
        @click="showCreateModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        新建题目
      </button>

      <div class="flex space-x-4">
        <input
          v-model="searchParams.keyword"
          type="text"
          placeholder="搜索题目..."
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="debounceSearch"
        />
        <select
          v-model="searchParams.categoryId"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="loadQuestions"
        >
          <option value="">所有分类</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <select
          v-model="searchParams.type"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="loadQuestions"
        >
          <option value="">所有类型</option>
          <option value="SINGLE_CHOICE">单选题</option>
          <option value="MULTIPLE_CHOICE">多选题</option>
          <option value="TRUE_FALSE">判断题</option>
          <option value="SHORT_ANSWER">简答题</option>
          <option value="ESSAY">论述题</option>
          <option value="FILL_BLANK">填空题</option>
        </select>
        <select
          v-model="searchParams.difficulty"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="loadQuestions"
        >
          <option value="">所有难度</option>
          <option :value="1">简单</option>
          <option :value="2">中等</option>
          <option :value="3">困难</option>
          <option :value="4">极难</option>
        </select>
      </div>
    </div>

    <!-- 批量操作 -->
    <div
      v-if="selectedQuestions.length > 0"
      class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <div class="flex items-center justify-between">
        <span class="text-sm text-blue-700">已选择 {{ selectedQuestions.length }} 个题目</span>
        <button
          @click="batchDelete"
          class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          批量删除
        </button>
      </div>
    </div>

    <!-- 题目列表 -->
    <div class="bg-white shadow rounded-lg">
      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-500">加载中...</p>
        </div>
        <div v-else-if="questions.length === 0" class="text-center py-8">
          <p class="text-gray-500">暂无题目</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="question in questions"
            :key="question.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <input
                    v-model="selectedQuestions"
                    :value="question.id"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <h3 class="text-lg font-medium text-gray-900">{{ question.title }}</h3>
                  <span :class="getTypeColor(question.type)" class="px-2 py-1 text-xs rounded-full">
                    {{ getTypeLabel(question.type) }}
                  </span>
                  <span
                    :class="getDifficultyColor(question.difficulty)"
                    class="px-2 py-1 text-xs rounded-full"
                  >
                    {{ getDifficultyLabel(question.difficulty) }}
                  </span>
                  <span class="text-sm text-gray-500">分值: {{ question.score }}</span>
                </div>
                <p class="text-gray-700 mb-2">{{ question.content }}</p>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span>分类: {{ question.category?.name || '未分类' }}</span>
                  <span>创建时间: {{ formatDate(question.createdAt) }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="viewQuestion(question)"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  查看
                </button>
                <button
                  @click="editQuestion(question)"
                  class="text-green-600 hover:text-green-800 text-sm"
                >
                  编辑
                </button>
                <button
                  @click="deleteQuestion(question.id)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="mt-6 flex justify-center">
          <nav class="flex space-x-2">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md',
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- 创建/编辑题目模态框 -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? '编辑题目' : '新建题目' }}
          </h3>
          <form @submit.prevent="submitForm">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">题目标题</label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入题目标题"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">题目类型</label>
                <select
                  v-model="form.type"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SINGLE_CHOICE">单选题</option>
                  <option value="MULTIPLE_CHOICE">多选题</option>
                  <option value="TRUE_FALSE">判断题</option>
                  <option value="SHORT_ANSWER">简答题</option>
                  <option value="ESSAY">论述题</option>
                  <option value="FILL_BLANK">填空题</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">难度等级</label>
                <select
                  v-model="form.difficulty"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="1">简单</option>
                  <option :value="2">中等</option>
                  <option :value="3">困难</option>
                  <option :value="4">极难</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <select
                  v-model="form.categoryId"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择分类</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">分值</label>
                <input
                  v-model.number="form.score"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10"
                />
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">题目内容</label>
              <textarea
                v-model="form.content"
                rows="4"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入题目内容"
              ></textarea>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">标准答案</label>
              <textarea
                v-model="form.answer"
                rows="3"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入标准答案"
              ></textarea>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">题目解析</label>
              <textarea
                v-model="form.analysis"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入题目解析（可选）"
              ></textarea>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                {{ showEditModal ? '更新' : '创建' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { QuestionService } from '../../services/questionService'
import { QuestionCategoryService } from '../../services/questionCategoryService'
import type {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionQueryParams,
} from '../../types/question'
import { QuestionType } from '../../types/question'
import type { QuestionCategory } from '../../types/question'

const loading = ref(false)
const questions = ref<Question[]>([])
const categories = ref<QuestionCategory[]>([])
const selectedQuestions = ref<number[]>([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingQuestion = ref<Question | null>(null)

const currentPage = ref(1)
const totalPages = ref(1)
const totalElements = ref(0)

const searchParams = reactive<QuestionQueryParams>({
  page: 1,
  size: 10,
  categoryId: undefined,
  type: undefined,
  difficulty: undefined,
  keyword: '',
})

const form = reactive<CreateQuestionRequest>({
  title: '',
  content: '',
  type: QuestionType.SINGLE_CHOICE,
  difficulty: 1,
  categoryId: 0,
  answer: '',
  analysis: '',
  options: [],
  score: 10,
})

onMounted(() => {
  loadQuestions()
  loadCategories()
})

const loadQuestions = async () => {
  try {
    loading.value = true
    const response = await QuestionService.getQuestions(searchParams)
    questions.value = response.content
    totalPages.value = response.totalPages
    totalElements.value = response.totalElements
    currentPage.value = response.number + 1
  } catch (error: any) {
    console.error('加载题目失败:', error)
    alert(error.message)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    categories.value = await QuestionCategoryService.getCategoryTree()
  } catch (error: any) {
    console.error('加载分类失败:', error)
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    searchParams.page = 1
    loadQuestions()
  }, 500)
}

const searchTimeout = ref<number>()

const goToPage = (page: number) => {
  searchParams.page = page
  loadQuestions()
}

const editQuestion = (question: Question) => {
  editingQuestion.value = question
  form.title = question.title
  form.content = question.content
  form.type = question.type
  form.difficulty = question.difficulty
  form.categoryId = question.categoryId
  form.answer = question.answer
  form.analysis = question.analysis || ''
  form.options = question.options || []
  form.score = question.score
  showEditModal.value = true
}

const viewQuestion = (question: Question) => {
  // 实现查看题目详情的逻辑
  alert(`查看题目: ${question.title}`)
}

const deleteQuestion = async (id: number) => {
  if (!confirm('确定要删除这个题目吗？')) return

  try {
    await QuestionService.deleteQuestion(id)
    alert('删除成功')
    loadQuestions()
  } catch (error: any) {
    alert(error.message)
  }
}

const batchDelete = async () => {
  if (!confirm(`确定要删除选中的 ${selectedQuestions.value.length} 个题目吗？`)) return

  try {
    await QuestionService.batchDeleteQuestions(selectedQuestions.value)
    alert('批量删除成功')
    selectedQuestions.value = []
    loadQuestions()
  } catch (error: any) {
    alert(error.message)
  }
}

const submitForm = async () => {
  try {
    if (showEditModal.value && editingQuestion.value) {
      await QuestionService.updateQuestion(editingQuestion.value.id, form)
      alert('更新成功')
    } else {
      await QuestionService.createQuestion(form)
      alert('创建成功')
    }

    closeModal()
    loadQuestions()
  } catch (error: any) {
    alert(error.message)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingQuestion.value = null
  resetForm()
}

const resetForm = () => {
  form.title = ''
  form.content = ''
  form.type = QuestionType.SINGLE_CHOICE
  form.difficulty = 1
  form.categoryId = 0
  form.answer = ''
  form.analysis = ''
  form.options = []
  form.score = 10
}

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    SINGLE_CHOICE: '单选题',
    MULTIPLE_CHOICE: '多选题',
    TRUE_FALSE: '判断题',
    SHORT_ANSWER: '简答题',
    ESSAY: '论述题',
    FILL_BLANK: '填空题',
  }
  return typeMap[type] || type
}

const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    SINGLE_CHOICE: 'bg-blue-100 text-blue-800',
    MULTIPLE_CHOICE: 'bg-purple-100 text-purple-800',
    TRUE_FALSE: 'bg-green-100 text-green-800',
    SHORT_ANSWER: 'bg-yellow-100 text-yellow-800',
    ESSAY: 'bg-red-100 text-red-800',
    FILL_BLANK: 'bg-indigo-100 text-indigo-800',
  }
  return colorMap[type] || 'bg-gray-100 text-gray-800'
}

const getDifficultyLabel = (difficulty: number) => {
  const difficultyMap: Record<number, string> = {
    1: '简单',
    2: '中等',
    3: '困难',
    4: '极难',
  }
  return difficultyMap[difficulty] || '未知'
}

const getDifficultyColor = (difficulty: number) => {
  const colorMap: Record<number, string> = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-orange-100 text-orange-800',
    4: 'bg-red-100 text-red-800',
  }
  return colorMap[difficulty] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>
