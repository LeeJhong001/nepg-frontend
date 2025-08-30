<template>
  <div class="question-detail">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">题目详情</h1>
        <p class="text-gray-600">查看题目的详细信息和统计数据</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="handleBack"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeftIcon class="w-4 h-4 inline mr-2" />
          返回
        </button>
        <button
          @click="handleEdit"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PencilIcon class="w-4 h-4 inline mr-2" />
          编辑
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-500 mt-2">加载中...</p>
    </div>

    <div v-else-if="question" class="space-y-6">
      <!-- 题目基本信息 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div class="text-sm font-medium text-gray-500 mb-1">题目ID</div>
            <div class="text-gray-900">{{ question.id }}</div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500 mb-1">题目类型</div>
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getTypeBadgeClass(question.type)">
              {{ questionTypeLabels[question.type] }}
            </span>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500 mb-1">难度等级</div>
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getDifficultyBadgeClass(question.difficulty)">
              {{ difficultyLabels[question.difficulty] }}
            </span>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500 mb-1">题目分类</div>
            <div class="text-gray-900">{{ question.categoryName }}</div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500 mb-1">题目分值</div>
            <div class="text-gray-900">{{ question.score }}分</div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500 mb-1">状态</div>
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="question.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ question.status === 'ACTIVE' ? '启用' : '禁用' }}
            </span>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500 mb-1">创建者</div>
            <div class="text-gray-900">{{ question.createdBy || '-' }}</div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500 mb-1">创建时间</div>
            <div class="text-gray-900">{{ formatDate(question.createdAt) }}</div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500 mb-1">更新时间</div>
            <div class="text-gray-900">{{ formatDate(question.updatedAt) }}</div>
          </div>
        </div>
      </div>

      <!-- 题目内容 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">题目预览</h2>
        <QuestionPreview :question="question" />
      </div>

      <!-- 使用记录 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">使用记录</h2>
          <button
            @click="handleRefreshHistory"
            class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
          >
            <ArrowPathIcon class="w-4 h-4 inline mr-1" />
            刷新
          </button>
        </div>

        <div v-if="historyLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-500 mt-2">加载使用记录中...</p>
        </div>

        <div v-else-if="usageHistory.length === 0" class="text-center py-8">
          <ClockIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">暂无使用记录</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">使用类型</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">得分</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">正确性</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">使用时间</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="record in usageHistory" :key="record.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">{{ record.userName }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="getUsageTypeBadgeClass(record.usageType)">
                    {{ usageTypeLabels[record.usageType] }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ record.score !== undefined ? record.score + '分' : '-' }}
                </td>
                <td class="px-4 py-3">
                  <span v-if="record.isCorrect !== undefined" 
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="record.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ record.isCorrect ? '正确' : '错误' }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(record.usedAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 操作历史 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">操作记录</h2>
        <div class="space-y-3">
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <DocumentTextIcon class="w-4 h-4 text-blue-600" />
            </div>
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-900">题目创建</div>
              <div class="text-xs text-gray-500">
                {{ question.createdBy }} 创建了这个题目
              </div>
            </div>
            <div class="text-xs text-gray-500">{{ formatDate(question.createdAt) }}</div>
          </div>

          <div v-if="question.updatedAt && question.updatedAt !== question.createdAt" 
               class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <PencilIcon class="w-4 h-4 text-green-600" />
            </div>
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-900">题目更新</div>
              <div class="text-xs text-gray-500">题目信息已更新</div>
            </div>
            <div class="text-xs text-gray-500">{{ formatDate(question.updatedAt) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通知容器 -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeftIcon,
  PencilIcon,
  ArrowPathIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
import type {
  Question,
  QuestionType,
  DifficultyLevel,
  QuestionUsageHistory
} from '../../types/question'
import { QuestionService } from '../../services/questionService'
import { useNotification } from '../../composables/useNotification'
import NotificationContainer from '../../components/NotificationContainer.vue'
import QuestionPreview from './QuestionPreview.vue'

// 路由
const router = useRouter()
const route = useRoute()

// 通知系统
const { success, error } = useNotification()

// 获取题目ID
const questionId = computed(() => Number(route.params.id))

// 响应式数据
const question = ref<Question | null>(null)
const usageHistory = ref<QuestionUsageHistory[]>([])
const loading = ref(false)
const historyLoading = ref(false)

// 题型标签
const questionTypeLabels: Record<QuestionType, string> = {
  SINGLE_CHOICE: '单选题',
  MULTIPLE_CHOICE: '多选题',
  FILL_BLANK: '填空题',
  SHORT_ANSWER: '简答题',
  PROOF: '证明题'
}

// 难度标签
const difficultyLabels: Record<DifficultyLevel, string> = {
  1: '简单',
  2: '中等',
  3: '困难'
}

// 使用类型标签
const usageTypeLabels = {
  EXAM: '考试',
  PRACTICE: '练习',
  HOMEWORK: '作业'
}

// 方法
const loadQuestion = async () => {
  try {
    loading.value = true
    question.value = await QuestionService.getQuestionById(questionId.value)
  } catch (err: any) {
    error('加载题目失败: ' + err.message)
    router.back()
  } finally {
    loading.value = false
  }
}

const loadUsageHistory = async () => {
  try {
    historyLoading.value = true
    usageHistory.value = await QuestionService.getQuestionUsageHistory(questionId.value)
  } catch (err: any) {
    error('加载使用记录失败: ' + err.message)
    // 使用空数组，不影响页面正常显示
    usageHistory.value = []
  } finally {
    historyLoading.value = false
  }
}

const handleEdit = () => {
  router.push(`/admin/questions/${questionId.value}/edit`)
}

const handleBack = () => {
  router.back()
}

const handleRefreshHistory = () => {
  loadUsageHistory()
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTypeBadgeClass = (type: QuestionType) => {
  const classes = {
    SINGLE_CHOICE: 'bg-blue-100 text-blue-800',
    MULTIPLE_CHOICE: 'bg-purple-100 text-purple-800',
    FILL_BLANK: 'bg-green-100 text-green-800',
    SHORT_ANSWER: 'bg-yellow-100 text-yellow-800',
    PROOF: 'bg-red-100 text-red-800'
  }
  return classes[type]
}

const getDifficultyBadgeClass = (difficulty: DifficultyLevel) => {
  const classes = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-red-100 text-red-800'
  }
  return classes[difficulty]
}

const getUsageTypeBadgeClass = (type: string) => {
  const classes = {
    EXAM: 'bg-red-100 text-red-800',
    PRACTICE: 'bg-blue-100 text-blue-800',
    HOMEWORK: 'bg-yellow-100 text-yellow-800'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// 生命周期
onMounted(() => {
  loadQuestion()
  loadUsageHistory()
})
</script>

<style scoped>
.question-detail {
  @apply max-w-6xl mx-auto p-6;
}

/* 表格样式 */
table {
  @apply min-w-full divide-y divide-gray-200;
}

th {
  @apply text-xs font-medium text-gray-500 uppercase tracking-wider;
}

td {
  @apply whitespace-nowrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .question-detail {
    @apply p-4;
  }
  
  .grid {
    @apply grid-cols-1;
  }
}
</style>
