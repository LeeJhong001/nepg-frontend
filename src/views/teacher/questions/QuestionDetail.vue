<template>
  <div>
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>

    <!-- 题目详情内容 -->
    <div v-else-if="question">
      <!-- 页面标题和操作 -->
      <div class="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-4">
              <li>
                <router-link to="/teacher/questions" class="text-gray-400 hover:text-gray-500">
                  题库管理
                </router-link>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="ml-4 text-gray-500">题目详情</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 class="mt-2 text-2xl font-semibold text-gray-900">题目详情</h1>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
          <button
            @click="copyQuestion"
            class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            复制题目
          </button>
          <button
            @click="$router.push(`/teacher/questions/${question.id}/edit`)"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            编辑题目
          </button>
        </div>
      </div>

      <!-- 题目信息 -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">基本信息</h3>
            <div class="flex items-center space-x-2">
              <span :class="getTypeClass(question.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ getTypeText(question.type) }}
              </span>
              <span :class="getDifficultyClass(question.difficulty)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ getDifficultyText(question.difficulty) }}
              </span>
            </div>
          </div>
        </div>
        <div class="p-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt class="text-sm font-medium text-gray-500">题目类型</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ getTypeText(question.type) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">分类</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ question.categoryName || '未分类' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">难度等级</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ getDifficultyText(question.difficulty) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">分值</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ question.score }} 分</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">创建时间</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDateTime(question.createdAt) }}</dd>
            </div>
            <div v-if="question.updatedAt">
              <dt class="text-sm font-medium text-gray-500">更新时间</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDateTime(question.updatedAt) }}</dd>
            </div>
            <div v-if="question.tags && question.tags.length > 0" class="sm:col-span-3">
              <dt class="text-sm font-medium text-gray-500">标签</dt>
              <dd class="mt-1">
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in question.tags" :key="tag" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ tag }}
                  </span>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- 题目内容 -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">题目内容</h3>
        </div>
        <div class="p-6">
          <div class="prose max-w-none">
            <div class="text-base text-gray-900 mb-6" v-html="formatQuestionContent(question.content)"></div>

            <!-- 选择题选项 -->
            <div v-if="question.type === 'CHOICE' && question.options && question.options.length > 0" class="space-y-3">
              <div v-for="(option, index) in question.options" :key="index" class="flex items-start space-x-3">
                <span class="text-sm font-medium text-gray-700 mt-0.5">{{ getOptionLabel(index) }}.</span>
                <span class="text-sm text-gray-900">{{ option }}</span>
              </div>
            </div>

            <!-- 填空题提示 -->
            <div v-if="question.type === 'FILL_BLANK'" class="text-sm text-gray-500 mt-4">
              <p>请在空白处填入正确答案</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 答案和解析 -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">答案和解析</h3>
        </div>
        <div class="p-6 space-y-6">
          <!-- 正确答案 -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3">正确答案</h4>
            
            <!-- 选择题答案 -->
            <div v-if="question.type === 'CHOICE'" class="text-sm text-gray-900">
              {{ question.answer }}
            </div>

            <!-- 其他类型题目答案 -->
            <div v-else class="text-sm text-gray-900 whitespace-pre-wrap">
              {{ question.answer }}
            </div>
          </div>

          <!-- 答案解析 -->
          <div v-if="question.analysis">
            <h4 class="text-sm font-medium text-gray-700 mb-3">答案解析</h4>
            <div class="text-sm text-gray-900 whitespace-pre-wrap">{{ question.analysis }}</div>
          </div>
        </div>
      </div>

      <!-- 使用统计 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">使用统计</h3>
        </div>
        <div class="p-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">使用次数</dt>
              <dd class="mt-1 text-lg font-medium text-gray-900">{{ question.usageCount || 0 }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">平均正确率</dt>
              <dd class="mt-1 text-lg font-medium text-gray-900">{{ question.averageCorrectRate || '--' }}%</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">平均得分</dt>
              <dd class="mt-1 text-lg font-medium text-gray-900">{{ question.averageScore || '--' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">难度系数</dt>
              <dd class="mt-1 text-lg font-medium text-gray-900">{{ question.difficultyCoefficient || '--' }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else class="flex justify-center items-center h-64">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">题目不存在</h3>
        <p class="mt-1 text-sm text-gray-500">无法找到指定的题目信息</p>
        <div class="mt-6">
          <router-link to="/teacher/questions" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            返回题库管理
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { teacherQuestionService, type QuestionResponse } from '../../../services/teacher/questionService'
import { useNotification } from '../../../composables/useNotification'

const route = useRoute()
const router = useRouter()
const { success: showSuccess, error: showError } = useNotification()
const questionId = route.params.id as string

// 题目详情
const question = ref<QuestionResponse | null>(null)
const loading = ref(false)

// 题目类型样式和文本
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

// 难度样式和文本
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

// 复制题目
const copyQuestion = async () => {
  try {
    if (!question.value) return
    await teacherQuestionService.copyQuestion(question.value.id)
    showSuccess('题目复制成功')
  } catch (error) {
    console.error('Failed to copy question:', error)
    showError('题目复制失败')
  }
}

// 加载题目详情
const loadQuestion = async () => {
  try {
    loading.value = true
    const response = await teacherQuestionService.getQuestionById(Number(questionId))
    question.value = response
  } catch (error) {
    console.error('Failed to load question:', error)
    showError('加载题目详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadQuestion()
})
</script>
